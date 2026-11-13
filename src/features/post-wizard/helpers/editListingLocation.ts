import type { Listing } from '@/types';
import { resolveLocationCanonical } from '@/shared/lib/geo/locationSearch';
import type { JordanLocationSearchResult } from './jordanLocationIndex';

export interface EditLocationState {
  readonly city: string;
  readonly neighborhood: string;
  readonly citySlug?: string;
  readonly districtSlug?: string;
  readonly neighborhoodSlug?: string;
}

const EMPTY: EditLocationState = { city: '', neighborhood: '' };

export function loadEditLocation(listing: Pick<Listing, 'city' | 'neighborhood' | 'citySlug' | 'districtSlug' | 'neighborhoodSlug'> | null): EditLocationState {
  if (!listing) return EMPTY;
  return {
    city: listing.city || '',
    neighborhood: listing.neighborhood || '',
    citySlug: listing.citySlug,
    districtSlug: listing.districtSlug,
    neighborhoodSlug: listing.neighborhoodSlug,
  };
}

export function sameEditLocation(a: EditLocationState, b: EditLocationState): boolean {
  return a.city === b.city && a.neighborhood === b.neighborhood
    && a.citySlug === b.citySlug && a.districtSlug === b.districtSlug
    && a.neighborhoodSlug === b.neighborhoodSlug;
}

export function clearEditLocation(): EditLocationState {
  return { city: '', neighborhood: '', citySlug: '', districtSlug: '', neighborhoodSlug: '' };
}

export function selectGovernorate(isArabic: boolean, gov: { slug: string; nameAr: string; nameEn: string }): EditLocationState {
  return { city: isArabic ? gov.nameAr : gov.nameEn, neighborhood: '', citySlug: gov.slug, districtSlug: '', neighborhoodSlug: '' };
}

export function selectDistrict(prev: EditLocationState, isArabic: boolean, d: { slug: string; nameAr: string; nameEn: string }): EditLocationState {
  return { ...prev, neighborhood: isArabic ? d.nameAr : d.nameEn, districtSlug: d.slug, neighborhoodSlug: '' };
}

export function selectLocality(prev: EditLocationState, isArabic: boolean, l: { slug: string; nameAr: string; nameEn: string }): EditLocationState {
  return { ...prev, neighborhood: isArabic ? l.nameAr : l.nameEn, neighborhoodSlug: l.slug };
}

export function selectJordanLocation(isArabic: boolean, r: JordanLocationSearchResult): EditLocationState {
  const city = r.type === 'governorate' ? (isArabic ? r.nameAr : r.nameEn) : (isArabic ? r.cityAr : r.cityEn);
  const neighborhood = r.type === 'governorate' ? '' : (isArabic ? r.nameAr : r.nameEn);
  return { city, neighborhood, citySlug: r.citySlug, districtSlug: r.districtSlug || '', neighborhoodSlug: r.neighborhoodSlug || '' };
}

export function resolveUniqueChildSlug(market: string, citySlug: string, name: string): string | undefined {
  const res = resolveLocationCanonical(market, name, { citySlug });
  return res.status === 'unique' && res.resolved?.slug ? res.resolved.slug : undefined;
}

export function resolveLegacySafely(market: string, city: string, neighborhood: string): EditLocationState {
  const base: EditLocationState = { city, neighborhood };
  if (!city) return base;
  const cityRes = resolveLocationCanonical(market, city);
  if (cityRes.status !== 'unique' || !cityRes.resolved?.citySlug) return base;
  const withCity = { ...base, citySlug: cityRes.resolved.citySlug };
  if (!neighborhood) return withCity;
  const child = resolveLocationCanonical(market, neighborhood, { citySlug: withCity.citySlug });
  if (child.status !== 'unique' || !child.resolved) return withCity;
  return { ...withCity, districtSlug: child.resolved.districtSlug ?? undefined, neighborhoodSlug: child.resolved.neighborhoodSlug ?? undefined };
}
