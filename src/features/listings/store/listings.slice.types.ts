import { Listing } from '@/types';

export interface ListingsState {
  listings: Listing[];
  wishlist: string[];
  activeWishlistCountry: string;
  isInitialized: boolean;
  isQuotaExhausted: boolean;

  // Actions
  initialize: () => void;
  addListing: (listing: Listing, activeCountry: string, isArabic?: boolean) => void;
  deleteListing: (id: string) => void;
  toggleWishlist: (id: string, countryCode?: string) => void;
  clearWishlist: () => void;
  setWishlistForCountry: (country: string) => void;
  refreshListings: () => void;
  setIsQuotaExhausted: (exhausted: boolean) => void;
  validateAdQuotaAvailability: (categorySlug: string, userId?: string, countryCode?: string, isVip?: boolean) => boolean;
}
