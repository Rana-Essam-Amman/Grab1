import { Listing } from '@/types';
import { getListingsFromStorage, saveListingsToStorage, getWishlistForMarket, saveWishlistForMarket } from '@/services/listing.service';
import { validateAdQuotaAvailability as validateAdQuotaAvailabilityHelper } from '@/data/monetization';
import { globalStorage } from '@/shared/lib/marketStorage';
import { ListingsState } from './listings.slice.types';
import { sanitizeListingData, logListingError } from './listings.slice.helpers';
import { seedListings } from '@/data/seedListings';
import type { PublishResult } from './listings.slice.types';
import { performSupabasePublish, performSupabaseSync } from './listings.slice.supabase';

export const createListingsActions = (
  set: (fn: (state: ListingsState) => void) => void,
  get: () => ListingsState
) => ({
  initialize: () => {
    if (get().isInitialized) return;
    const initialCc = globalStorage().get<string>('browse_country') || 'JO';
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

  deleteListing: (id: string) => {
    set((state) => {
      state.listings = state.listings.filter((item) => item.id !== id);
      saveListingsToStorage(state.listings);
      if (state.wishlist.includes(id)) {
        state.wishlist = state.wishlist.filter((x) => x !== id);
        saveWishlistForMarket(state.activeWishlistCountry, state.wishlist);
      }
    });
  },

  toggleWishlist: (id: string, countryCode?: string) => {
    const activeCountry = countryCode || get().activeWishlistCountry || globalStorage().get<string>('browse_country') || 'JO';
    set((state) => {
      if (activeCountry !== state.activeWishlistCountry) {
        state.activeWishlistCountry = activeCountry;
        state.wishlist = getWishlistForMarket(activeCountry);
      }
      const next = state.wishlist.includes(id) ? state.wishlist.filter((x) => x !== id) : [...state.wishlist, id];
      state.wishlist = next;
      saveWishlistForMarket(activeCountry, next);
    });
  },

  clearWishlist: () => {
    set((state) => {
      state.wishlist = [];
      saveWishlistForMarket(get().activeWishlistCountry, []);
    });
  },

  setWishlistForCountry: (country: string) => {
    set((state) => {
      state.activeWishlistCountry = country;
      state.wishlist = getWishlistForMarket(country);
    });
  },

  refreshListings: () => set((state) => { state.listings = getListingsFromStorage(); }),

  syncFromSupabase: async () => {
    set((state) => { state.isSyncing = true; });
    const { listings: remoteListings, error } = await performSupabaseSync();

    set((state) => {
      state.isSyncing = false;
      if (error || !remoteListings) return;
      // Supabase is source of truth for user-created listings.
      // Seed listings stay as local-only demo content.
      state.listings = [...remoteListings, ...seedListings];
      saveListingsToStorage(state.listings);
    });
  },

  publishListing: async (listing: Listing, activeCountry: string, isArabic = true): Promise<PublishResult> => {
    const { remoteListing, error } = await performSupabasePublish(listing, activeCountry, isArabic);
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
