import { getAllGovernorates, getAllDistricts } from '@/data/locations/registry';
import { CITY_TO_GOVERNORATE_SLUG } from '@/shared/lib/geo/adapters/cityToGovMap';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';
import type { MarketCode } from '@/shared/lib/geo/geo.types';
import { resolveAiNeighborhoodSlug, COMMON_AR_GOV_ALIASES } from './aiLocationResolver.helpers';

export interface ResolvedAiLocationSlugs {
  readonly citySlug?: string;
  readonly districtSlug?: string;
  readonly neighborhoodSlug?: string;
}

export function resolveAiGovernorate(countryCode: string, cityName: string) {
  const cleanCity = normalizeArabic(cityName.trim().toLowerCase());
  const govs = getAllGovernorates(countryCode);

  if (COMMON_AR_GOV_ALIASES[cleanCity]) {
    const gov = govs.find((g) => g.slug === COMMON_AR_GOV_ALIASES[cleanCity]);
    if (gov) return gov;
  }

  let matchedGov = govs.find(
    (g) => g.slug === cleanCity || normalizeArabic(g.nameEn.toLowerCase()) === cleanCity || normalizeArabic(g.nameAr) === cleanCity
  );

  if (!matchedGov) {
    const marketMap = CITY_TO_GOVERNORATE_SLUG[countryCode as MarketCode];
    if (marketMap) {
      for (const [key, govSlug] of Object.entries(marketMap)) {
        if (normalizeArabic(key.toLowerCase()) === cleanCity) {
          matchedGov = govs.find((g) => g.slug === govSlug);
          break;
        }
      }
    }
  }

  if (!matchedGov) {
    for (const g of govs) {
      const dists = getAllDistricts(countryCode, g.slug);
      const matchedDist = dists.find(
        (d) => d.slug === cleanCity || normalizeArabic(d.nameEn.toLowerCase()) === cleanCity || normalizeArabic(d.nameAr) === cleanCity
      );
      if (matchedDist) return g;
    }
  }

  return matchedGov;
}

export function resolveAiLocationSlugs(
  market: string,
  cityName: string,
  neighborhoodName?: string
): ResolvedAiLocationSlugs {
  const countryCode = market.toUpperCase();
  if (!cityName) return {};

  const matchedGov = resolveAiGovernorate(countryCode, cityName);
  if (!matchedGov) return {};

  const citySlug = matchedGov.slug;
  if (!neighborhoodName || !neighborhoodName.trim()) return { citySlug };

  const { districtSlug, neighborhoodSlug } = resolveAiNeighborhoodSlug(countryCode, citySlug, neighborhoodName);
  return { citySlug, districtSlug, neighborhoodSlug };
}
