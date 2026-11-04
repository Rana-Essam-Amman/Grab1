import { searchLocationsCanonical, resolveLocationCanonical } from '@/shared/lib/geo/locationSearch';
import { getAllCamps } from '@/data/locations/registry';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';
import { COMMON_AR_GOV_ALIASES } from './aiLocationResolver.helpers';

export interface ResolvedAiLocationSlugs {
  readonly citySlug?: string;
  readonly districtSlug?: string;
  readonly neighborhoodSlug?: string;
}

function uniqueCitySlug(market: string, query: string): string | undefined {
  const searched = searchLocationsCanonical(market, query);
  const cities = searched.candidates.filter((c) => c.canonicalSlot === 'city_slug');
  return cities.length === 1 ? cities[0].slug : undefined;
}

function resolveCitySlug(market: string, cityName: string): string | undefined {
  const clean = normalizeArabic(cityName.trim().toLowerCase());
  const alias = Object.entries(COMMON_AR_GOV_ALIASES).find(([key]) => normalizeArabic(key) === clean)?.[1];
  if (alias) return uniqueCitySlug(market, alias);
  return uniqueCitySlug(market, cityName);
}

function exactCampSlug(market: string, citySlug: string, name: string): string | undefined {
  const clean = normalizeArabic(name.trim().toLowerCase());
  const camps = getAllCamps(market).filter((c) => c.governorateSlug === citySlug);
  const match = camps.find(
    (c) => c.slug === clean || normalizeArabic(c.nameEn.toLowerCase()) === clean || normalizeArabic(c.nameAr) === clean
  );
  return match?.slug;
}

function resolveChild(
  market: string,
  citySlug: string,
  neighborhoodName: string
): Pick<ResolvedAiLocationSlugs, 'districtSlug' | 'neighborhoodSlug'> {
  const resolved = resolveLocationCanonical(market, neighborhoodName, { citySlug });
  if (resolved.status === 'unique' && resolved.resolved) {
    const slot = resolved.resolved.canonicalSlot;
    if (slot === 'neighborhood_slug') {
      return {
        districtSlug: resolved.resolved.districtSlug ?? undefined,
        neighborhoodSlug: resolved.resolved.neighborhoodSlug ?? undefined,
      };
    }
    if (slot === 'district_slug') {
      return { districtSlug: resolved.resolved.districtSlug ?? undefined };
    }
    return {};
  }
  const campSlug = exactCampSlug(market, citySlug, neighborhoodName);
  return campSlug ? { neighborhoodSlug: campSlug } : {};
}

export function resolveAiLocationSlugs(
  market: string,
  cityName: string,
  neighborhoodName?: string
): ResolvedAiLocationSlugs {
  const countryCode = market.toUpperCase();
  if (!cityName?.trim()) return {};

  const citySlug = resolveCitySlug(countryCode, cityName);
  if (!citySlug) return {};
  if (!neighborhoodName?.trim()) return { citySlug };

  return { citySlug, ...resolveChild(countryCode, citySlug, neighborhoodName) };
}
