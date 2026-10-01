import { globalStorage } from '@/shared/lib/marketStorage';
import { MarketCode } from '@/shared/lib/marketGate';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { DEFAULT_REGIONAL_CAPITALS } from '../data/locations/capitals';
import { validateRegionalSanity } from '../data/locations';
import { getSanitizedCurrencyByCountry } from './ui.slice.helpers';
import { UIState, ScreenType, TabType } from './ui.slice.types';

export const createUIActions = (
  set: (
    partial:
      | Partial<UIState>
      | ((state: UIState) => Partial<UIState> | void)
  ) => void,
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

  goBack: () =>
    set((state: UIState) => {
      if (state.screenHistory.length <= 1) return state;
      const newHistory = [...state.screenHistory];
      newHistory.pop();
      return {
        screenHistory: newHistory,
        currentScreen: newHistory[newHistory.length - 1],
      };
    }),

  setActiveTab: (tab: TabType) => set({ activeTab: tab, currentScreen: 'main' }),

  setBrowseLocation: (countryCode: MarketCode, cityEn: string, cityAr: string) => {
    const { authStatus, user } = useAuthStore.getState();
    let finalCountry = countryCode;
    let finalCityEn = cityEn;
    let finalCityAr = cityAr;

    // Market Lock: Authenticated users are restricted to their home market
    if (authStatus === 'authenticated' && user?.countryCode) {
      if (countryCode !== user.countryCode) {
        finalCountry = user.countryCode as MarketCode;
        const capital = DEFAULT_REGIONAL_CAPITALS[finalCountry];
        finalCityEn = capital.cityEn;
        finalCityAr = capital.cityAr;
      }
    }

    // Default to regional capital if city is missing or invalid
    if (!finalCityEn || !finalCityAr || !validateRegionalSanity(finalCountry, finalCityEn)) {
      const capital = DEFAULT_REGIONAL_CAPITALS[finalCountry as keyof typeof DEFAULT_REGIONAL_CAPITALS] || DEFAULT_REGIONAL_CAPITALS.JO;
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
    const { browseCountryCode } = get();
    const { authStatus, user } = useAuthStore.getState();
    const effectiveCountry = (authStatus === 'authenticated' && user?.countryCode) ? user.countryCode : browseCountryCode;
    
    // Simple validation: if currency is empty or invalid, fallback to country default
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

  setSelectedListingId: (selectedListingId: string | null) => set({ selectedListingId }),
  setSelectedThreadId: (selectedThreadId: string | null) => set({ selectedThreadId }),
  setSelectedSellerPhone: (selectedSellerPhone: string | null) => set({ selectedSellerPhone }),

  setIsAiFocused: (isAiFocused: boolean) => set({ isAiFocused }),
  setIsCountrySheetOpen: (isCountrySheetOpen: boolean) => set({ isCountrySheetOpen }),
  setIsSearchFocused: (isSearchFocused: boolean) => set({ isSearchFocused }),
  setAiFlowPending: (aiFlowPending: boolean) => set({ aiFlowPending }),
});
