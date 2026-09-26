import { useListingsStore } from '@/features/listings/store/listings.slice';
import { Listing } from '../types';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useUIStore } from '@/store/ui.slice';

export const useListings = () => {
  const store = useListingsStore();
  const authStore = useAuthStore();
  const uiStore = useUIStore();

  const wishlistListings = store.listings.filter((l) => store.wishlist.includes(l.id));
  const isWishlisted = (id: string) => store.wishlist.includes(id);

  const getListing = (id: string) => {
    return store.listings.find((l) => l.id === id);
  };

  const getUserListings = (userPhone?: string, userCountryCode?: string) => {
    if (!userPhone) return [];
    return store.listings.filter((l) => {
      const matchPhone = l.sellerPhone === userPhone;
      const matchCountry = userCountryCode ? l.countryCode === userCountryCode : true;
      return matchPhone && matchCountry;
    });
  };

  const userListings = getUserListings(authStore.user?.phone, authStore.user?.countryCode || uiStore.browseCountryCode);

  return {
    listings: store.listings,
    wishlist: store.wishlist,
    favorites: store.wishlist,
    wishlistListings,
    isQuotaExhausted: store.isQuotaExhausted,
    isWishlisted,
    clearWishlist: store.clearWishlist,
    setWishlistForCountry: store.setWishlistForCountry,
    toggleWishlist: store.toggleWishlist,
    toggleFavorite: store.toggleWishlist,
    addListing: store.addListing,
    updateListing: store.updateListing,
    deleteListing: store.deleteListing,
    getListing,
    getUserListings,
    userListings,
    setIsQuotaExhausted: store.setIsQuotaExhausted,
    validateAdQuotaAvailability: store.validateAdQuotaAvailability,
  };
};

export const useListingsData = () => {
  return useListingsStore((state) => state.listings);
};

export const useWishlistData = () => {
  return useListingsStore((state) => state.wishlist);
};

export const useListingsActions = () => {
  const addListing = useListingsStore((s) => s.addListing);
  const deleteListing = useListingsStore((s) => s.deleteListing);
  const toggleWishlist = useListingsStore((s) => s.toggleWishlist);
  const clearWishlist = useListingsStore((s) => s.clearWishlist);
  const setWishlistForCountry = useListingsStore((s) => s.setWishlistForCountry);
  const refreshListings = useListingsStore((s) => s.refreshListings);
  const setIsQuotaExhausted = useListingsStore((s) => s.setIsQuotaExhausted);
  const validateAdQuotaAvailability = useListingsStore((s) => s.validateAdQuotaAvailability);

  return {
    addListing,
    deleteListing,
    toggleWishlist,
    clearWishlist,
    setWishlistForCountry,
    refreshListings,
    setIsQuotaExhausted,
    validateAdQuotaAvailability,
  };
};

export const useListingActions = useListingsActions;

