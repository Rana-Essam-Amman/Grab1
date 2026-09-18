export interface UIStoreContract {
  locale: 'ar' | 'en';
  isArabic: boolean;
  currentScreen: string;
  activeTab: string;
  browseCountryCode: string;
  activeCurrency: string;
  setLocale: (l: 'ar' | 'en') => void;
  navigateTo: (screen: string) => void;
  goBack: () => void;
  setActiveTab: (tab: any) => void;
  setBrowseLocation: (countryCode: any, cityEn: string, cityAr: string) => void;
  setActiveCurrency: (c: string) => void;
}
