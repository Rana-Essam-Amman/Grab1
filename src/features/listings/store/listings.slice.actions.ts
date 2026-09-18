import { Listing } from '@/types';
import { getListingsFromStorage, saveListingsToStorage, getWishlistForMarket, saveWishlistForMarket } from '@/services/listing.service';
import { validateAdQuotaAvailability as validateAdQuotaAvailabilityHelper } from '@/data/monetization';
import { globalStorage } from '@/shared/lib/marketStorage';
import { ListingsState } from './listings.slice.types';
import { sanitizeListingData, logListingError } from './listings.slice.helpers';

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
    } catch (err: any) {
      logListingError(err);
      throw err;
    }
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

  setIsQuotaExhausted: (exhausted: boolean) => set((state) => { state.isQuotaExhausted = exhausted; }),

  validateAdQuotaAvailability: (categorySlug: string, userId = 'guest', countryCode = 'JO', isVip = false) => {
    const result = validateAdQuotaAvailabilityHelper(get().listings, userId, countryCode, categorySlug, isVip);
    set((state) => { state.isQuotaExhausted = !result.allowed; });
    return result.allowed;
  },
});
