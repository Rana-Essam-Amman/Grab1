import { locations, locationsAr } from '../data';

export function validateRegionalSanity(
  countryCode: string,
  city?: string,
  neighborhood?: string
): boolean {
  if (!countryCode || !city) return false;

  // Accept "Other" as an explicit opt-out for both city and neighborhood.
  if (city === 'Other' || city === 'أخرى') return true;
  if (neighborhood === 'Other' || neighborhood === 'أخرى') return true;

  const countryDataEn = locations[countryCode];
  const countryDataAr = locationsAr[countryCode];

  if (!countryDataEn && !countryDataAr) return false;

  const neighborhoodsEn = countryDataEn?.[city];
  const neighborhoodsAr = countryDataAr?.[city];

  if (!neighborhoodsEn && !neighborhoodsAr) return false;

  if (neighborhood) {
    const hasEn = neighborhoodsEn?.includes(neighborhood);
    const hasAr = neighborhoodsAr?.includes(neighborhood);
    return Boolean(hasEn || hasAr);
  }

  return true;
}
