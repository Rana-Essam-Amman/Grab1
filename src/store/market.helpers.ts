import { MarketCode } from '@/shared/lib/marketGate';
import { globalStorage } from '@/shared/lib/marketStorage';
import { DEFAULT_REGIONAL_CAPITALS } from '../data/locations/capitals';
import { getSanitizedCurrencyByCountry } from './ui.slice.helpers';

export interface MarketSnapshot {
  browseCountryCode: MarketCode;
  browseCityEn: string;
  browseCityAr: string;
  activeCurrency: string;
  neighborhoodFilter: null;
}

export function buildMarketSnapshot(market: MarketCode): MarketSnapshot {
  const capital = DEFAULT_REGIONAL_CAPITALS[market] || DEFAULT_REGIONAL_CAPITALS.JO;
  return {
    browseCountryCode: market,
    browseCityEn: capital.cityEn,
    browseCityAr: capital.cityAr,
    activeCurrency: getSanitizedCurrencyByCountry(market),
    neighborhoodFilter: null,
  };
}

export function getCapital(market: MarketCode): { cityEn: string; cityAr: string } {
  return DEFAULT_REGIONAL_CAPITALS[market] || DEFAULT_REGIONAL_CAPITALS.JO;
}

export function persistBrowseCountry(market: MarketCode): void {
  globalStorage().set('catch_browse_country', market);
}

export function normalizeCurrency(currency: string, countryCode: MarketCode): string {
  if (!currency || currency === 'INVALID') {
    return getSanitizedCurrencyByCountry(countryCode);
  }
  return currency;
}
