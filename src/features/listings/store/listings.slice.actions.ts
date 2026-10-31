import { Listing } from '@/types';
import { getListingsFromStorage, saveListingsToStorage, getWishlistForMarket, saveWishlistForMarket } from '@/services/listing.service';
import { deleteListing as deleteListingService, updateListingRemote } from '@/features/listings/services/listingsService';
import { validateAdQuotaAvailability as validateAdQuotaAvailabilityHelper } from '@/data/monetization';
import { globalStorage } from '@/shared/lib/marketStorage';
import { ListingsState } from './listings.slice.types';
import { sanitizeListingData, logListingError } from './listings.slice.helpers';
import type { PublishResult } from './listings.slice.types';
import { performSupabasePublish } from './listings.slice.supabase';
import { createWishlistActions } from './listings.slice.wishlist';
import { createPaginationActions } from './listings.slice.pagination';
import { getCurrentUser } from '@/shared/store-getters/auth.getter';

/**
 * Generates a temporary optimistic-listing ID.
 * Uses crypto.randomUUID when available, falls back to time+random.
 * Prefix `temp-` is the sole contract for detecting pending listings.
 */
function generateTempListingId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `temp-${crypto.randomUUID()}`;
    }
  } catch {
    /* fall through */
  }
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const createListingsActions = (
  set: (fn: (state: ListingsState) => void) => void,
  get: () => ListingsState
) => ({
  initialize: () => {
    if (get().isInitialized) return;
    const initialCc = globalStorage().get<string>('catch_browse_country') || 'JO';
    set((state) => {
      // Clean up any stale optimistic listings from previous sessions.
      // If publish actually succeeded server-side, the real listing will
      // arrive via the next sync. If it failed, discarding is correct.
      const cleaned = getListingsFromStorage().filter(
        (l) => !l.id.startsWith('temp-')
      );
      state.listings = cleaned;
      state.wishlist = getWishlistForMarket(initialCc);
      state.activeWishlistCountry = initialCc;
      state.isInitialized = true;
      saveListingsToStorage(cleaned);
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

  saveListingEdits: async (id: string, updates: Partial<Listing>): Promise<{ success: boolean; error: string | null }> => {
    const { data, error } = await updateListingRemote(id, updates);
    if (error || !data) {
      return { success: false, error: error || 'Save failed' };
    }
    set((state) => {
      state.listings = state.listings.map((item) => (item.id === id ? data : item));
      saveListingsToStorage(state.listings);
    });
    return { success: true, error: null };
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
  ...createPaginationActions(set, get),

  refreshListings: () => set((state) => { state.listings = getListingsFromStorage(); }),

  publishListing: async (listing: Listing, activeCountry: string, isArabic = true): Promise<PublishResult> => {
    const tempId = generateTempListingId();
    const now = new Date().toISOString();
    const optimisticListing: Listing = {
      ...listing,
      id: tempId,
      createdAt: listing.createdAt || now,
      views: listing.views ?? 0,
    };

    // 1. Optimistic prepend — user sees their listing instantly.
    //    The `set()` here is synchronous relative to the caller, so by the
    //    time publishListing returns its promise, the temp listing is
    //    already in state.listings.
    set((state) => {
      state.listings = [optimisticListing, ...state.listings];
      saveListingsToStorage(state.listings);
    });

    try {
      const { remoteListing, error, fallbackToLocal } = await performSupabasePublish(
        listing,
        activeCountry,
        isArabic
      );

      // 2a. Fallback (no auth) → replace temp with sanitized local listing.
      if (fallbackToLocal) {
        const sanitized = sanitizeListingData(listing, activeCountry, isArabic);
        set((state) => {
          state.listings = state.listings.map((item) =>
            item.id === tempId ? sanitized : item
          );
          saveListingsToStorage(state.listings);
        });
        return { success: true, remoteId: sanitized.id, error: null };
      }

      // 2b. Failure → remove temp listing.
      if (error || !remoteListing) {
        set((state) => {
          state.listings = state.listings.filter((item) => item.id !== tempId);
          saveListingsToStorage(state.listings);
        });
        return { success: false, remoteId: null, error: error || 'فشل النشر' };
      }

      // 2c. Success → replace temp with remote listing in same position.
      set((state) => {
        state.listings = state.listings.map((item) =>
          item.id === tempId ? remoteListing : item
        );
        saveListingsToStorage(state.listings);
      });
      return { success: true, remoteId: remoteListing.id, error: null };
    } catch (err) {
      // 2d. Unexpected error → remove temp listing.
      set((state) => {
        state.listings = state.listings.filter((item) => item.id !== tempId);
        saveListingsToStorage(state.listings);
      });
      return {
        success: false,
        remoteId: null,
        error: err instanceof Error ? err.message : 'خطأ غير معروف',
      };
    }
  },

  setIsQuotaExhausted: (exhausted: boolean) => set((state) => { state.isQuotaExhausted = exhausted; }),

  validateAdQuotaAvailability: (categorySlug: string, userId = 'guest', countryCode = 'JO') => {
    const user = getCurrentUser();
    const isAdmin = user?.email?.toLowerCase() === 'sufyanyounis83@gmail.com';
    const result = validateAdQuotaAvailabilityHelper(get().listings, userId, countryCode, categorySlug, isAdmin);
    set((state) => { state.isQuotaExhausted = !result.allowed; });
    return result.allowed;
  },
});
