import { Listing } from '@/types';
import { getListingsFromStorage, saveListingsToStorage, getWishlistForMarket, saveWishlistForMarket } from '@/services/listing.service';
import { deleteListing as deleteListingService, LISTINGS_PAGE_SIZE } from '@/features/listings/services/listingsService';
import { validateAdQuotaAvailability as validateAdQuotaAvailabilityHelper } from '@/data/monetization';
import { globalStorage } from '@/shared/lib/marketStorage';
import { ListingsState } from './listings.slice.types';
import { sanitizeListingData, logListingError } from './listings.slice.helpers';
import { seedListings } from '@/data/seedListings';
import type { PublishResult } from './listings.slice.types';
import { performSupabasePublish, performSupabaseSync } from './listings.slice.supabase';
import { createWishlistActions } from './listings.slice.wishlist';

export const createListingsActions = (
  set: (fn: (state: ListingsState) => void) => void,
  get: () => ListingsState
) => ({
  initialize: () => {
    if (get().isInitialized) return;
    const initialCc = globalStorage().get<string>('catch_browse_country') || 'JO';
    set((state) => {
      state.listings = getListingsFromStorage();
      state.wishlist = getWishlistForMarket(initialCc);
      state.activeWishlistCountry = initialCc;
      state.isInitialized = true;
    });
  },

  addListing: (listing: Listing, activeCountry: string, isArabic = true) => {
    try {
      const sanitizedListing = sanitizeListingData(listing, activeCountry, isArabic);
      set((state) => {
        state.listings = [sanitizedListing, ...state.listings];
        saveListingsToStorage(state.listings);
      });
    } catch (err: unknown) {
      logListingError(err);
      throw err;
    }
  },

  updateListing: (id: string, updates: Partial<Listing>) => {
    set((state) => {
      state.listings = state.listings.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      saveListingsToStorage(state.listings);
    });
  },

  deleteListing: async (id: string): Promise<{ success: boolean; error: string | null }> => {
    const { error } = await deleteListingService(id);
    if (error) {
      return { success: false, error };
    }
    set((state) => {
      state.listings = state.listings.filter((item) => item.id !== id);
      saveListingsToStorage(state.listings);
      if (state.wishlist.includes(id)) {
        state.wishlist = state.wishlist.filter((x) => x !== id);
        saveWishlistForMarket(state.activeWishlistCountry, state.wishlist);
      }
    });
    return { success: true, error: null };
  },

  ...createWishlistActions(set, get),

  refreshListings: () => set((state) => { state.listings = getListingsFromStorage(); }),

  syncFromSupabase: async (market?: string) => {
    const targetMarket = market ?? get().activeMarket ?? undefined;
    set((s) => { s.isSyncing = true; });
    try {
      const result = await performSupabaseSync({ market: targetMarket, offset: 0, limit: LISTINGS_PAGE_SIZE });
      set((s) => {
        if (result.listings) {
          s.listings = [...result.listings, ...seedListings];
          s.activeMarket = targetMarket ?? null;
          s.page = 0;
          s.hasMore = result.listings.length === LISTINGS_PAGE_SIZE;
          saveListingsToStorage(s.listings);
        }
      });
    } finally {
      set((s) => { s.isSyncing = false; });
    }
  },

  loadMore: async () => {
    const state = get();
    if (state.isLoadingMore || !state.hasMore || !state.activeMarket) return;
    const nextOffset = (state.page + 1) * LISTINGS_PAGE_SIZE;
    set((s) => { s.isLoadingMore = true; });
    try {
      const result = await performSupabaseSync({
        market: state.activeMarket,
        offset: nextOffset,
        limit: LISTINGS_PAGE_SIZE,
      });
      set((s) => {
        if (result.listings && result.listings.length > 0) {
          // de-dup by id (defensive — page boundary)
          const existingIds = new Set(s.listings.map((l) => l.id));
          const fresh = result.listings.filter((l) => !existingIds.has(l.id));
          s.listings = [...s.listings, ...fresh];
          s.page = s.page + 1;
          s.hasMore = result.listings.length === LISTINGS_PAGE_SIZE;
          saveListingsToStorage(s.listings);
        } else {
          s.hasMore = false;
        }
      });
    } finally {
      set((s) => { s.isLoadingMore = false; });
    }
  },

  publishListing: async (listing: Listing, activeCountry: string, isArabic = true): Promise<PublishResult> => {
    const { remoteListing, error, fallbackToLocal } = await performSupabasePublish(
      listing,
      activeCountry,
      isArabic
    );
    // No Supabase session (demo/E2E/offline) → save locally, don't block user.
    if (fallbackToLocal) {
      const sanitized = sanitizeListingData(listing, activeCountry, isArabic);
      set((state) => {
        state.listings = [sanitized, ...state.listings];
        saveListingsToStorage(state.listings);
      });
      return { success: true, remoteId: sanitized.id, error: null };
    }

    if (error || !remoteListing) {
      return { success: false, remoteId: null, error: error || 'فشل النشر' };
    }

    set((state) => {
      state.listings = [remoteListing, ...state.listings];
      saveListingsToStorage(state.listings);
    });
    return { success: true, remoteId: remoteListing.id, error: null };
  },

  setIsQuotaExhausted: (exhausted: boolean) => set((state) => { state.isQuotaExhausted = exhausted; }),

  validateAdQuotaAvailability: (categorySlug: string, userId = 'guest', countryCode = 'JO', isVip = false) => {
    const result = validateAdQuotaAvailabilityHelper(get().listings, userId, countryCode, categorySlug, isVip);
    set((state) => { state.isQuotaExhausted = !result.allowed; });
    return result.allowed;
  },
});
