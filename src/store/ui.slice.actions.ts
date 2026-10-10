import { MarketCode } from '@/shared/lib/marketGate';
import { globalStorage } from '@/shared/lib/marketStorage';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { validateRegionalSanity } from '../data/locations';
import { UIState, ScreenType, TabType } from './ui.slice.types';
import {
  buildMarketSnapshot,
  getCapital,
  normalizeCurrency,
  persistBrowseCountry,
} from './market.helpers';

export const createUIActions = (
  set: (partial: Partial<UIState> | ((state: UIState) => Partial<UIState> | void)) => void,
  get: () => UIState,
) => ({
  setLocale: (locale: 'en' | 'ar') => {
    globalStorage().set('locale', locale);
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    set({ locale, isArabic: locale === 'ar' });
  },

  navigateTo: (screen: ScreenType) =>
    set((state: UIState) => ({
      currentScreen: screen,
      screenHistory: [...state.screenHistory, screen],
    })),

  goBack: () => {
    if (get().screenHistory.length <= 1) {
      window.history.back();
      return;
    }
    set((state: UIState) => {
      const newHistory = [...state.screenHistory];
      newHistory.pop();
      return {
        screenHistory: newHistory,
        currentScreen: newHistory[newHistory.length - 1],
      };
    });
  },

  setActiveTab: (tab: TabType) => set({ activeTab: tab, currentScreen: 'main' }),

  setBrowseLocation: (countryCode: MarketCode, cityEn: string, cityAr: string) => {
    let finalCityEn = cityEn;
    let finalCityAr = cityAr;
    if (!finalCityEn || !finalCityAr || !validateRegionalSanity(countryCode, finalCityEn)) {
      const capital = getCapital(countryCode);
      finalCityEn = capital.cityEn;
      finalCityAr = capital.cityAr;
    }
    set({
      ...buildMarketSnapshot(countryCode),
      browseCityEn: finalCityEn,
      browseCityAr: finalCityAr,
    });
    persistBrowseCountry(countryCode);
  },

  setActiveCurrency: (currency: string) =>
    set({ activeCurrency: normalizeCurrency(currency, get().browseCountryCode) }),

  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  setCategoryFilter: (categoryFilter: string | null) => set({ categoryFilter }),
  setSelectedParentCategory: (selectedParentCategory: string | null) => set({ selectedParentCategory }),
  setMinPriceFilter: (minPriceFilter: number | null) => set({ minPriceFilter }),
  setMaxPriceFilter: (maxPriceFilter: number | null) => set({ maxPriceFilter }),
  setNeighborhoodFilter: (neighborhoodFilter: string | null) => set({ neighborhoodFilter }),
  setSubcategoryFilter: (subcategoryFilter: string | null) => set({ subcategoryFilter }),
  setSortBy: (sortBy: 'newest' | 'price-asc' | 'price-desc') => set({ sortBy }),
  setAttrsFilter: (attrsFilter: Record<string, string>) => set({ attrsFilter }),
  setSelectedListingId: (selectedListingId: string | null) => set({ selectedListingId }),
  setSelectedThreadId: (selectedThreadId: string | null) => set({ selectedThreadId }),
  setSelectedSellerPhone: (selectedSellerPhone: string | null) => set({ selectedSellerPhone }),
  setIsAiFocused: (isAiFocused: boolean) => set({ isAiFocused }),
  setIsCountrySheetOpen: (isCountrySheetOpen: boolean) => set({ isCountrySheetOpen }),
  setIsSearchFocused: (isSearchFocused: boolean) => set({ isSearchFocused }),
  setAiFlowPending: (aiFlowPending: boolean) => set({ aiFlowPending }),
  setGeoCountryCode: (countryCode: MarketCode) => set({ geoCountryCode: countryCode }),
  setGeoUnsupported: (v: boolean) => set({ geoUnsupported: v }),

  setBrowseMarketOverride: async (market: MarketCode) => {
    const { authStatus, user } = useAuthStore.getState();
    if (authStatus !== 'authenticated' || !user?.id) return;
    set(buildMarketSnapshot(market));
    persistBrowseCountry(market);
    try {
      const { saveBrowseMarket } = await import('@/shared/lib/profilesService');
      await saveBrowseMarket(user.id, market);
    } catch {
      // non-fatal
    }
  },

  setBrowseMarketOverrideLocal: (market: MarketCode) => {
    globalStorage().set('catch_browse_market_override', market);
    set({ browseMarketOverride: market, ...buildMarketSnapshot(market) });
  },

  clearBrowseMarketOverride: () => {
    globalStorage().remove('catch_browse_market_override');
    set({ browseMarketOverride: null });
  },

  setPendingWishlistId: (id: string | null) => {
    if (id) {
      globalStorage().set('catch_pending_wishlist', id);
    } else {
      globalStorage().remove('catch_pending_wishlist');
    }
    set({ pendingWishlistId: id });
  },
});
