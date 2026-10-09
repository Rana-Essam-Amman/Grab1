import { globalStorage } from '@/shared/lib/marketStorage';
import { MarketCode } from '@/shared/lib/marketGate';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { DEFAULT_REGIONAL_CAPITALS } from '../data/locations/capitals';
import { validateRegionalSanity } from '../data/locations';
import { getSanitizedCurrencyByCountry } from './ui.slice.helpers';
import { UIState, ScreenType, TabType } from './ui.slice.types';

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
    const finalCountry = countryCode;
    let finalCityEn = cityEn;
    let finalCityAr = cityAr;

    if (!finalCityEn || !finalCityAr || !validateRegionalSanity(finalCountry, finalCityEn)) {
      const capital = DEFAULT_REGIONAL_CAPITALS[finalCountry] || DEFAULT_REGIONAL_CAPITALS.JO;
      finalCityEn = capital.cityEn;
      finalCityAr = capital.cityAr;
    }

    const activeCurrency = getSanitizedCurrencyByCountry(finalCountry);

    set({
      browseCountryCode: finalCountry,
      browseCityEn: finalCityEn,
      browseCityAr: finalCityAr,
      activeCurrency,
      neighborhoodFilter: null,
    });

    globalStorage().set('catch_browse_country', finalCountry);
  },

  setActiveCurrency: (currency: string) => {
    const effectiveCountry = get().browseCountryCode;
    if (!currency || currency === 'INVALID') {
      set({ activeCurrency: getSanitizedCurrencyByCountry(effectiveCountry) });
    } else {
      set({ activeCurrency: currency });
    }
  },

  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  setCategoryFilter: (categoryFilter: string | null) => set({ categoryFilter }),
  setSelectedParentCategory: (selectedParentCategory: string | null) => set({ selectedParentCategory }),
  setMinPriceFilter: (minPriceFilter: number | null) => set({ minPriceFilter }),
  setMaxPriceFilter: (maxPriceFilter: number | null) => set({ maxPriceFilter }),
  setNeighborhoodFilter: (neighborhoodFilter: string | null) => set({ neighborhoodFilter }),
  setSubcategoryFilter: (subcategoryFilter: string | null) => set({ subcategoryFilter }),
  setSortBy: (sortBy: 'newest' | 'price-asc' | 'price-desc') => set({ sortBy }),
  setAttrsFilter: (attrsFilter: Record<string, string>) => set({ attrsFilter }),
  subcategoryFilter: null,
  sortBy: 'newest' as const,
  attrsFilter: {},
  setSelectedListingId: (selectedListingId: string | null) => set({ selectedListingId }),
  setSelectedThreadId: (selectedThreadId: string | null) => set({ selectedThreadId }),
  setSelectedSellerPhone: (selectedSellerPhone: string | null) => set({ selectedSellerPhone }),
  setIsAiFocused: (isAiFocused: boolean) => set({ isAiFocused }),
  setIsCountrySheetOpen: (isCountrySheetOpen: boolean) => set({ isCountrySheetOpen }),
  setIsSearchFocused: (isSearchFocused: boolean) => set({ isSearchFocused }),
  setAiFlowPending: (aiFlowPending: boolean) => set({ aiFlowPending }),
  setGeoCountryCode: (countryCode: MarketCode) => set({ geoCountryCode: countryCode }),

  setBrowseMarketOverride: async (market: MarketCode) => {
    const { authStatus, user } = useAuthStore.getState();
    if (authStatus !== 'authenticated' || !user?.id) return;

    const capital = DEFAULT_REGIONAL_CAPITALS[market] || DEFAULT_REGIONAL_CAPITALS.JO;

    set({
      browseCountryCode: market,
      browseCityEn: capital.cityEn,
      browseCityAr: capital.cityAr,
      activeCurrency: getSanitizedCurrencyByCountry(market),
      neighborhoodFilter: null,
    });

    globalStorage().set('catch_browse_country', market);

    try {
      const { saveBrowseMarket } = await import('@/shared/lib/profilesService');
      await saveBrowseMarket(user.id, market);
    } catch {
      // non-fatal
    }
  },

  setBrowseMarketOverrideLocal: (market: MarketCode) => {
    const capital = DEFAULT_REGIONAL_CAPITALS[market] || DEFAULT_REGIONAL_CAPITALS.JO;
    globalStorage().set('catch_browse_market_override', market);
    set({
      browseMarketOverride: market,
      browseCountryCode: market,
      browseCityEn: capital.cityEn,
      browseCityAr: capital.cityAr,
      activeCurrency: getSanitizedCurrencyByCountry(market),
      neighborhoodFilter: null,
    });
  },

  clearBrowseMarketOverride: () => {
    globalStorage().remove('catch_browse_market_override');
    set({ browseMarketOverride: null });
  },

  setGeoUnsupported: (v: boolean) => set({ geoUnsupported: v }),

  setPendingWishlistId: (id: string | null) => {
    if (id) {
      globalStorage().set('catch_pending_wishlist', id);
    } else {
      globalStorage().remove('catch_pending_wishlist');
    }
    set({ pendingWishlistId: id });
  },
});
