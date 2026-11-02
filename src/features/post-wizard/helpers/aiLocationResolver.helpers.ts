import { getAllDistricts, getAllCamps } from '@/data/locations/registry';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';
import type { GeneratedListing } from '@/types';
import type { CategoryMatch } from '@/ai/categoryMatch';

export interface AIResultParams {
  readonly generated: GeneratedListing;
  readonly match: CategoryMatch;
  readonly raw: string;
  readonly photos: string[];
  readonly isArabic: boolean;
  readonly browseCityAr: string;
  readonly categoryForAI: string;
  readonly subForAI: string;
  readonly browseCountryCode?: string;
}

export const COMMON_AR_GOV_ALIASES: Record<string, string> = {
  'عمان': 'amman',
  'عمّان': 'amman',
  'الرياض': 'riyadh-region',
  'مكة': 'makkah-region',
  'المدينة': 'madinah-region',
  'القدس': 'jerusalem',
  'بيروت': 'beirut',
  'دمشق': 'damascus',
  'الكويت': 'al-asimah',
  'مدينة الكويت': 'al-asimah',
};

export function matchLocalityInDistricts(
  countryCode: string,
  citySlug: string,
  cleanNeigh: string
): { districtSlug?: string; neighborhoodSlug?: string } {
  const districts = getAllDistricts(countryCode, citySlug);

  const distMatch = districts.find(
    (d) =>
      d.slug === cleanNeigh ||
      normalizeArabic(d.nameEn.toLowerCase()) === cleanNeigh ||
      normalizeArabic(d.nameAr) === cleanNeigh
  );
  if (distMatch) return { districtSlug: distMatch.slug };

  for (const d of districts) {
    const villMatch = (d.villages || []).find(
      (v) =>
        v.slug === cleanNeigh ||
        normalizeArabic(v.nameEn.toLowerCase()) === cleanNeigh ||
        normalizeArabic(v.nameAr) === cleanNeigh
    );
    if (villMatch) {
      return { districtSlug: d.slug, neighborhoodSlug: villMatch.slug };
    }
  }

  return {};
}

export function resolveAiNeighborhoodSlug(
  countryCode: string,
  citySlug: string,
  neighborhoodName: string
): { districtSlug?: string; neighborhoodSlug?: string } {
  const cleanNeigh = normalizeArabic(neighborhoodName.trim().toLowerCase());
  const camps = getAllCamps(countryCode).filter((c) => c.governorateSlug === citySlug);

  const campMatch = camps.find(
    (c) =>
      c.slug === cleanNeigh ||
      normalizeArabic(c.nameEn.toLowerCase()) === cleanNeigh ||
      normalizeArabic(c.nameAr) === cleanNeigh
  );
  if (campMatch) return { neighborhoodSlug: campMatch.slug };

  return matchLocalityInDistricts(countryCode, citySlug, cleanNeigh);
}
