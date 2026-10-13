import type { Listing } from '@/types';
import { DEFAULT_REGIONAL_CAPITALS } from '@/data/locations/capitals';
import type { MarketCode } from '@/shared/lib/marketGate';

export const countCityListings = (listings: Listing[], cityAr: string, cityEn: string): number =>
  listings.filter((l) => l.city === cityAr || l.city === cityEn || !l.city).length;

export const computeAdaptiveFilterMode = (userMode: 'city' | 'all' | null, cityCount: number, minDensity: number): 'city' | 'all' =>
  userMode !== null ? userMode : cityCount >= minDensity ? 'city' : 'all';

/**
 * Resolve filterMode with capital-city awareness.
 * If the user picked a non-capital city, force 'city' mode so only that
 * city shows. Otherwise defer to computeAdaptiveFilterMode (D6 default 'all').
 */
export const computeFilterModeWithCapital = (
  browseCountryCode: MarketCode,
  browseCityEn: string,
  userFilterMode: 'city' | 'all' | null,
  cityCount: number,
  minDensity: number,
): 'city' | 'all' => {
  const capital = DEFAULT_REGIONAL_CAPITALS[browseCountryCode];
  if (capital && browseCityEn && browseCityEn !== capital.cityEn) {
    return 'city';
  }
  return computeAdaptiveFilterMode(userFilterMode, cityCount, minDensity);
};
