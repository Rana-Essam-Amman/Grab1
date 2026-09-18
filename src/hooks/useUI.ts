import { useUIStore } from '@/store/ui.slice';
import { countryByCode } from '../data/countries';


export const useUI = () => {
  const store = useUIStore();

  return {
    locale: store.locale,
    isArabic: store.isArabic,
    setLocale: store.setLocale,
    currentScreen: store.currentScreen,
    activeTab: store.activeTab,
    screenHistory: store.screenHistory,
    navigateTo: store.navigateTo,
    goBack: store.goBack,
    setActiveTab: store.setActiveTab,
    selectedListingId: store.selectedListingId,
    setSelectedListingId: store.setSelectedListingId,
    selectedThreadId: store.selectedThreadId,
    setSelectedThreadId: store.setSelectedThreadId,
    selectedSellerPhone: store.selectedSellerPhone,
    setSelectedSellerPhone: store.setSelectedSellerPhone,
    searchQuery: store.searchQuery,
    setSearchQuery: store.setSearchQuery,
    categoryFilter: store.categoryFilter,
    setCategoryFilter: store.setCategoryFilter,
    selectedParentCategory: store.selectedParentCategory,
    setSelectedParentCategory: store.setSelectedParentCategory,
    maxPriceFilter: store.maxPriceFilter,
    setMaxPriceFilter: store.setMaxPriceFilter,
    neighborhoodFilter: store.neighborhoodFilter,
    setNeighborhoodFilter: store.setNeighborhoodFilter,
    browseCountryCode: store.browseCountryCode,
    browseCountry: countryByCode(store.browseCountryCode),
    browseCityEn: store.browseCityEn,
    browseCityAr: store.browseCityAr,
    activeCurrency: store.activeCurrency,
    setBrowseLocation: store.setBrowseLocation,
    setActiveCurrency: store.setActiveCurrency,
    isAiFocused: store.isAiFocused,
    setIsAiFocused: store.setIsAiFocused,
    isCountrySheetOpen: store.isCountrySheetOpen,
    setIsCountrySheetOpen: store.setIsCountrySheetOpen,
  };
};

export const useLocale = () => {
  const locale = useUIStore((s) => s.locale);
  const isArabic = useUIStore((s) => s.isArabic);
  const setLocale = useUIStore((s) => s.setLocale);

  return { locale, isArabic, setLocale };
};

export const useNavigation = () => {
  const currentScreen = useUIStore((s) => s.currentScreen);
  const activeTab = useUIStore((s) => s.activeTab);
  const navigateTo = useUIStore((s) => s.navigateTo);
  const goBack = useUIStore((s) => s.goBack);

  return { currentScreen, activeTab, navigateTo, goBack };
};

