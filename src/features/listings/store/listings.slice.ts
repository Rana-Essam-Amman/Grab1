import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ListingsState } from './listings.slice.types';
import { createListingsActions } from './listings.slice.actions';
import type { ListingsRepository } from '../data/repositories/ListingsRepository';
import { LocalStorageListingsAdapter } from '../data/adapters/LocalStorageListingsAdapter';

export type { ListingsState };

const listingsRepository: ListingsRepository = new LocalStorageListingsAdapter();

export const useListingsStore = create<ListingsState>()(
  immer((set, get) => {
    const baseActions = createListingsActions(set, get);

    return {
      listings: [],
      wishlist: [],
      activeWishlistCountry: 'JO',
      isInitialized: false,
      isQuotaExhausted: false,
      ...baseActions,
      addListing: (listing, activeCountry, isArabic) => {
        baseActions.addListing(listing, activeCountry, isArabic);
        listingsRepository.create(listing as any).catch(console.error);
      },
      deleteListing: (id) => {
        baseActions.deleteListing(id);
        listingsRepository.delete(id).catch(console.error);
      },
      toggleWishlist: (id, countryCode) => {
        baseActions.toggleWishlist(id, countryCode);
        listingsRepository.saveBookmarkedIds(get().wishlist).catch(console.error);
      },
      clearWishlist: () => {
        baseActions.clearWishlist();
        listingsRepository.saveBookmarkedIds([]).catch(console.error);
      },
      refreshListings: () => {
        baseActions.refreshListings();
        listingsRepository.getAll().catch(console.error);
      },
    };
  })
);

listingsRepository.getAll().catch(console.error);
