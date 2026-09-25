import { locations, locationsAr } from '../data';
import { DEFAULT_REGIONAL_CAPITALS } from '../capitals';
import { validateRegionalSanity } from './sanity';

export function validateLocations(
  countryCode: string,
  city?: string,
  neighborhood?: string
): boolean {
  return validateRegionalSanity(countryCode, city, neighborhood);
}

export function getSanitizedRegionalLocation(
  countryCode: string,
  city?: string,
  neighborhood?: string,
  lang: 'en' | 'ar' = 'en'
) {
  const isValid = validateRegionalSanity(countryCode, city, neighborhood);
  const capital = DEFAULT_REGIONAL_CAPITALS[countryCode] || DEFAULT_REGIONAL_CAPITALS.JO;

  if (isValid && city) {
    return {
      city,
      neighborhood: neighborhood || (lang === 'ar' ? capital.neighborhoodAr : capital.neighborhoodEn),
    };
  }

  return {
    city: lang === 'ar' ? capital.cityAr : capital.cityEn,
    neighborhood: lang === 'ar' ? capital.neighborhoodAr : capital.neighborhoodEn,
  };
}
