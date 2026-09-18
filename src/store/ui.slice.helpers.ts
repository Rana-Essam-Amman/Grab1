import { globalStorage } from '@/shared/lib/marketStorage';
import { MarketCode } from '@/shared/lib/marketGate';
import { DEFAULT_REGIONAL_CAPITALS } from '../data/locations/capitals';

// Derive initial browse country from storage
const getStoredCountry = (): MarketCode => {
  try {
    return (globalStorage().get<MarketCode>('catch_browse_country') as MarketCode) || 'JO';
  } catch {
    return 'JO';
  }
};

const initialBrowseCountryCode = getStoredCountry();
const initialCapital = DEFAULT_REGIONAL_CAPITALS[initialBrowseCountryCode] || DEFAULT_REGIONAL_CAPITALS.JO;

interface AuthStored {
  state?: {
    authStatus?: string;
  };
  user?: {
    countryCode?: string;
  };
  session?: unknown;
}

export const getInitialState = () => {
  const locale = (globalStorage().get<string>('locale') as 'en' | 'ar') || 'ar';
  const hasStoredCountry = !!globalStorage().get<MarketCode>('catch_browse_country');
  let hasAuth = false;
  try {
    const authData = globalStorage().get<AuthStored>('catch_auth') || {};
    if (authData?.state?.authStatus === 'authenticated') {
      hasAuth = true;
    }
  } catch (e) {}

  const shouldGoToMain = hasStoredCountry || hasAuth;
  
  return {
    locale,
    isArabic: locale === 'ar',
    activeTab: 'explore' as const,
    screenHistory: shouldGoToMain ? ['main'] : ['login'] as any[],
    currentScreen: (shouldGoToMain ? 'main' : 'login') as any,
    browseCountryCode: initialBrowseCountryCode,
    browseCityEn: initialCapital.cityEn,
    browseCityAr: initialCapital.cityAr,
    activeCurrency: getSanitizedCurrencyByCountry(initialBrowseCountryCode),
    searchQuery: '',
    categoryFilter: null,
    selectedParentCategory: null,
    maxPriceFilter: null,
    neighborhoodFilter: null,
    selectedListingId: null,
    selectedThreadId: null,
    selectedSellerPhone: null,
    isAiFocused: false,
    isCountrySheetOpen: false,
  };
};

export function getSanitizedCurrencyByCountry(countryCode: string): string {
  const map: Record<string, string> = {
    JO: 'JOD',
    SA: 'SAR',
    PS: 'ILS',
    LB: 'LBP',
    SY: 'SYP',
  };
  return map[countryCode] || 'JOD';
}
