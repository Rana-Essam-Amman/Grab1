import type { Listing } from '@/types';
import { DEFAULT_REGIONAL_CAPITALS } from '@/data/locations/capitals';
import type { MarketCode } from '@/shared/lib/marketGate';

export const countCityListings = (listings: Listing[], cityAr: string, cityEn: string): number =>
  listings.filter((l) => l.city === cityAr || l.city === cityEn || !l.city).length;

export const computeAdaptiveFilterMode = (userMode: 'city' | 'all' | null, cityCount: number, minDensity: number): 'city' | 'all' =>
  userMode !== null ? userMode : cityCount >= minDensity ? 'city' : 'all';

/**
 * Resolve filterMode with capital-city awareness.
 * Priority 1: User's explicit choice ('all' or 'city').
 * Priority 2: If user hasn't chosen, check if current city differs from capital.
 * Priority 3: Otherwise, fall back to adaptive density check.
 */
export const computeFilterModeWithCapital = (
  browseCountryCode: MarketCode,
  browseCityEn: string,
  userFilterMode: 'city' | 'all' | null,
  cityCount: number,
  minDensity: number,
): 'city' | 'all' => {
  // 1. If user explicitly set 'all', respect it (don't override with city filter)
  if (userFilterMode === 'all') {
    return 'all';
  }

  // 2. If user explicitly set 'city', respect it
  if (userFilterMode === 'city') {
    return 'city';
  }

  // 3. Fallback: if browseCityEn differs from capital, force city mode
  const capital = DEFAULT_REGIONAL_CAPITALS[browseCountryCode];
  if (capital && browseCityEn && browseCityEn !== capital.cityEn) {
    return 'city';
  }

  // 4. Final fallback: adaptive density check
  return cityCount >= minDensity ? 'city' : 'all';
};
