import type { MarketCode } from '@/shared/lib/marketGate';
import type { BottomTab } from '@/features/ui/domain';

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
  setActiveTab: (tab: BottomTab) => void;
  setBrowseLocation: (countryCode: MarketCode, cityEn: string, cityAr: string) => void;
  setActiveCurrency: (c: string) => void;
}
