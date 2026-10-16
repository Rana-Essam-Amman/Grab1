import { Listing } from '@/types';
import type { SearchListingsParams } from '../services/searchListings.types';

export interface PublishResult {
  readonly success: boolean;
  readonly remoteId: string | null;
  readonly error: string | null;
}

export interface ListingsState {
  listings: Listing[];
  wishlist: string[];
  activeWishlistCountry: string;
  isInitialized: boolean;
  isSyncing: boolean;
  isQuotaExhausted: boolean;
  activeMarket: string | null;
  activeSearchQuery: string | null;
  searchBanner: string | null;
  searchRelatedHeader: string | null;
  activeFilterArgs: SearchListingsParams | null;
  page: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  tier2Listings: Listing[];

  // Actions
  initialize: () => void;
  syncFromSupabase: (market?: string) => Promise<void>;
  loadMore: () => Promise<void>;
  searchFromSupabase: (params: SearchListingsParams) => Promise<void>;
  publishListing: (listing: Listing, activeCountry: string, isArabic?: boolean) => Promise<PublishResult>;
  addListing: (listing: Listing, activeCountry: string, isArabic?: boolean) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => Promise<{ success: boolean; error: string | null }>;
  toggleWishlist: (id: string, countryCode?: string) => void;
  clearWishlist: () => void;
  setWishlistForCountry: (country: string) => void;
  loadWishlistFromSupabase: (userId: string, marketCode: string) => Promise<void>;
  migrateLegacyWishlistIfNeeded: (userId: string) => Promise<void>;
  refreshListings: () => void;
  setIsQuotaExhausted: (exhausted: boolean) => void;
  validateAdQuotaAvailability: (categorySlug: string, userId?: string, countryCode?: string, isVip?: boolean) => boolean;
}
