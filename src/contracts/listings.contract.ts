import type { Listing } from '@/types';

export interface ListingsStoreContract {
  listings: Listing[];
  wishlist: string[];
  initialize: () => void;
  addListing: (listing: Listing, market: string, isArabic?: boolean) => void;
  deleteListing: (id: string) => void;
  toggleWishlist: (id: string) => void;
  clearWishlist: () => void;
  setWishlistForCountry: (country: string) => void;
  refreshListings: () => void;
  validateAdQuotaAvailability: (categorySlug: string) => boolean;
}
