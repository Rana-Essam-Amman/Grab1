import { MarketCode } from '@/shared/lib/marketGate';
import { AppTheme } from '@/features/ui/domain';

export type ScreenType =
  | 'main'
  | 'listing-detail'
  | 'profile'
  | 'notifications'
  | 'thread'
  | 'messages'
  | 'seller-profile'
  | 'settings'
  | 'search-results'
  | 'sub-categories'
  | 'post-category'
  | 'post-subcategory'
  | 'post-photos'
  | 'post-location'
  | 'post-details'
  | 'edit-post'
  | 'post-ai-draft'
  | 'post-ai-review'
  | 'post-ad-entry'
  | 'post-ai-capture'
  | 'post-category-pick'
  | 'edit-profile'
  | 'my-listings'
  | 'about'
  | 'safety'
  | 'support'
  | 'privacy'
  | 'terms'
  | 'wishlist'
  | 'login'
  | 'register'
  | 'confirm'
  | 'post-publish-success';

export type TabType = 'explore' | 'search' | 'post' | 'activity' | 'profile' | 'messages' | 'my-ads' | 'categories';

export interface UIState {
  // Locale
  locale: 'en' | 'ar';
  isArabic: boolean;
  setLocale: (locale: 'en' | 'ar') => void;

  // Theme
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;

  // Navigation
  activeTab: TabType;
  currentScreen: ScreenType;
  screenHistory: ScreenType[];
  navigateTo: (screen: ScreenType) => void;
  goBack: () => void;
  setActiveTab: (tab: TabType) => void;

  // Browse context
  browseCountryCode: MarketCode;
  browseMarketOverride: MarketCode | null;
  setBrowseMarketOverrideLocal: (market: MarketCode) => void;
  clearBrowseMarketOverride: () => void;

  // Geo-detected country (raw signal, not user choice). Not persisted.
  geoCountryCode: MarketCode;
  setGeoCountryCode: (countryCode: MarketCode) => void;

  browseCityEn: string;
  browseCityAr: string;
  activeCurrency: string;
  setBrowseLocation: (countryCode: MarketCode, cityEn: string, cityAr: string) => void;
  // Explicit user override; persists to Supabase (signed-in users only).
  setBrowseMarketOverride: (market: MarketCode) => Promise<void>;
  setActiveCurrency: (currency: string) => void;

  // Search & Filters
  searchQuery: string;
  categoryFilter: string | null;
  selectedParentCategory: string | null;
  minPriceFilter: number | null;
  maxPriceFilter: number | null;
  neighborhoodFilter: string | null;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string | null) => void;
  setSelectedParentCategory: (category: string | null) => void;
  setMinPriceFilter: (price: number | null) => void;
  setMaxPriceFilter: (price: number | null) => void;
  setNeighborhoodFilter: (neighborhood: string | null) => void;

  // Selected entities
  selectedListingId: string | null;
  selectedThreadId: string | null;
  selectedSellerPhone: string | null;
  setSelectedListingId: (id: string | null) => void;
  setSelectedThreadId: (id: string | null) => void;
  setSelectedSellerPhone: (phone: string | null) => void;

  // UI Toggles
  isAiFocused: boolean;
  isCountrySheetOpen: boolean;
  isSearchFocused: boolean;
  setIsAiFocused: (focused: boolean) => void;
  setIsCountrySheetOpen: (open: boolean) => void;
  setIsSearchFocused: (focused: boolean) => void;
  aiFlowPending: boolean;
  setAiFlowPending: (v: boolean) => void;

  /** True when geo detection landed outside the 5 supported markets. */
  geoUnsupported: boolean;
  setGeoUnsupported: (v: boolean) => void;
}
