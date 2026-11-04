import { resolveLocationCanonical } from '@/shared/lib/geo/locationSearch';
import type { JordanLocationSearchResult } from './jordanLocationIndex';
import type { EditLocationState } from './editListingLocation';

export function selectJordanLocation(isArabic: boolean, result: JordanLocationSearchResult): EditLocationState {
  const city = result.type === 'governorate'
    ? (isArabic ? result.nameAr : result.nameEn)
    : (isArabic ? result.cityAr : result.cityEn);
  const neighborhood = result.type === 'governorate' ? '' : (isArabic ? result.nameAr : result.nameEn);
  return {
    city,
    neighborhood,
    citySlug: result.citySlug,
    districtSlug: result.districtSlug,
    neighborhoodSlug: result.neighborhoodSlug,
  };
}

export function resolveUniqueChildSlug(market: string, citySlug: string, name: string): string | undefined {
  const resolved = resolveLocationCanonical(market, name, { citySlug });
  if (resolved.status !== 'unique' || !resolved.resolved) return undefined;
  return resolved.resolved.neighborhoodSlug ?? resolved.resolved.districtSlug ?? undefined;
}
