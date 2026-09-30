import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ListingsState } from './listings.slice.types';
import { createListingsActions } from './listings.slice.actions';

export type { ListingsState };

export const useListingsStore = create<ListingsState>()(
  immer((set, get) => {
    const baseActions = createListingsActions(set, get);

    return {
      listings: [],
      wishlist: [],
      activeWishlistCountry: 'JO',
      isInitialized: false,
      isSyncing: false,
      isQuotaExhausted: false,
      ...baseActions,
      addListing: (listing, activeCountry, isArabic) => {
        baseActions.addListing(listing, activeCountry, isArabic);
      },
      updateListing: (id, updates) => {
        baseActions.updateListing(id, updates);
      },
      deleteListing: (id) => {
        baseActions.deleteListing(id);
      },
      toggleWishlist: (id, countryCode) => {
        baseActions.toggleWishlist(id, countryCode);
      },
      clearWishlist: () => {
        baseActions.clearWishlist();
      },
      refreshListings: () => {
        baseActions.refreshListings();
      },
    };
  })
);
