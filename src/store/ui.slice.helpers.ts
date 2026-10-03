import { globalStorage } from '@/shared/lib/marketStorage';
import { MarketCode } from '@/shared/lib/marketGate';
import { DEFAULT_REGIONAL_CAPITALS } from '../data/locations/capitals';
import { ScreenType } from './ui.slice.types';

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
  } catch {
    // ignore storage read errors
  }

  const shouldGoToMain = hasStoredCountry || hasAuth;
  
  return {
    locale,
    isArabic: locale === 'ar',
    activeTab: 'explore' as const,
    screenHistory: (shouldGoToMain ? ['main'] : ['login']) as ScreenType[],
    currentScreen: 'main' as ScreenType,
    browseCountryCode: initialBrowseCountryCode,
    browseCityEn: initialCapital.cityEn,
    browseCityAr: initialCapital.cityAr,
    activeCurrency: getSanitizedCurrencyByCountry(initialBrowseCountryCode),
    searchQuery: '',
    categoryFilter: null,
    selectedParentCategory: null,
    minPriceFilter: null,
    maxPriceFilter: null,
    neighborhoodFilter: null,
    selectedListingId: null,
    selectedThreadId: null,
    selectedSellerPhone: null,
    isAiFocused: false,
    isCountrySheetOpen: false,
    isSearchFocused: false,
    aiFlowPending: false,
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

export async function hydrateCountryFromGeo(): Promise<void> {
  try {
    if (globalStorage().get<string>('catch_browse_country')) return;
    const { detectCountry } = await import('@/shared/lib/geoDetect');
    const detected = await detectCountry();
    if (globalStorage().get<string>('catch_browse_country')) return;
    if (detected.source !== 'ip' && detected.source !== 'timezone' && detected.source !== 'language') return;
    globalStorage().set('catch_browse_country', detected.country);
    const capital = DEFAULT_REGIONAL_CAPITALS[detected.country] || DEFAULT_REGIONAL_CAPITALS.JO;
    const { useUIStore } = await import('./ui.slice');
    useUIStore.setState({
      browseCountryCode: detected.country,
      browseCityEn: capital.cityEn,
      browseCityAr: capital.cityAr,
      activeCurrency: getSanitizedCurrencyByCountry(detected.country),
    });
  } catch {
    // detection is best-effort
  }
}
