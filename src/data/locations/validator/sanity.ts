import { locations, locationsAr } from '../data';

export function validateRegionalSanity(
  countryCode: string,
  city?: string,
  neighborhood?: string
): boolean {
  if (!countryCode || !city) return false;

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
