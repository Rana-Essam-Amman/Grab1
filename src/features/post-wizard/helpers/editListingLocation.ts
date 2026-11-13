import { getAllGovernorates, getAllDistricts } from '@/data/locations/registry';
import { resolveTraditionalLocationSlugs } from './traditionalLocationResolver';
import type { JordanLocationSearchResult } from './jordanLocationIndex';
import type { Governorate, District, Village } from '@/data/locations/types';

export interface EditLocationState {
  readonly city: string;
  readonly neighborhood: string;
  readonly citySlug?: string;
  readonly districtSlug?: string;
  readonly neighborhoodSlug?: string;
}

export type LocationListingSeed = {
  readonly city?: string;
  readonly neighborhood?: string;
  readonly citySlug?: string;
  readonly districtSlug?: string;
  readonly neighborhoodSlug?: string;
  readonly countryCode?: string;
};

export function loadEditLocation(listing: LocationListingSeed | null): EditLocationState {
  if (!listing) {
    return { city: '', neighborhood: '' };
  }
  const base: EditLocationState = {
    city: listing.city || '',
    neighborhood: listing.neighborhood || '',
    citySlug: listing.citySlug,
    districtSlug: listing.districtSlug,
    neighborhoodSlug: listing.neighborhoodSlug,
  };
  if (base.citySlug || !listing.countryCode || !base.city) return base;
  const resolved = resolveTraditionalLocationSlugs(
    listing.countryCode,
    base.city,
    base.neighborhood,
  );
  if (!resolved.citySlug) return base;
  return {
    ...base,
    citySlug: resolved.citySlug,
    districtSlug: resolved.districtSlug,
    neighborhoodSlug: resolved.neighborhoodSlug,
  };
}

export function sameEditLocation(a: EditLocationState, b: EditLocationState): boolean {
  return a.city === b.city
    && a.neighborhood === b.neighborhood
    && (a.citySlug || '') === (b.citySlug || '')
    && (a.districtSlug || '') === (b.districtSlug || '')
    && (a.neighborhoodSlug || '') === (b.neighborhoodSlug || '');
}

export function clearEditLocation(): EditLocationState {
  return { city: '', neighborhood: '', citySlug: '', districtSlug: '', neighborhoodSlug: '' };
}

export function selectGovernorate(isArabic: boolean, gov: Governorate): EditLocationState {
  return {
    city: isArabic ? gov.nameAr : gov.nameEn,
    neighborhood: '',
    citySlug: gov.slug,
    districtSlug: '',
    neighborhoodSlug: '',
  };
}

export function selectDistrict(
  prev: EditLocationState,
  isArabic: boolean,
  district: District,
): EditLocationState {
  return {
    ...prev,
    neighborhood: isArabic ? district.nameAr : district.nameEn,
    districtSlug: district.slug,
    neighborhoodSlug: '',
  };
}

export function selectLocality(
  prev: EditLocationState,
  isArabic: boolean,
  village: Village,
): EditLocationState {
  return {
    ...prev,
    neighborhood: isArabic ? village.nameAr : village.nameEn,
    neighborhoodSlug: village.slug,
  };
}

export function selectJordanLocation(
  isArabic: boolean,
  result: JordanLocationSearchResult,
): EditLocationState {
  const city = result.type === 'governorate'
    ? (isArabic ? result.nameAr : result.nameEn)
    : (isArabic ? result.cityAr : result.cityEn);
  const neighborhood = result.type === 'governorate'
    ? ''
    : (isArabic ? result.nameAr : result.nameEn);
  return {
    city,
    neighborhood,
    citySlug: result.citySlug,
    districtSlug: result.districtSlug || '',
    neighborhoodSlug: result.neighborhoodSlug || '',
  };
}

export function locationPayload(
  initial: EditLocationState,
  current: EditLocationState,
): Partial<EditLocationState> {
  if (sameEditLocation(initial, current)) return {};
  return {
    city: current.city,
    neighborhood: current.neighborhood,
    citySlug: current.citySlug || undefined,
    districtSlug: current.districtSlug || undefined,
    neighborhoodSlug: current.neighborhoodSlug || undefined,
  };
}

export function listGovernorates(market: string): readonly Governorate[] {
  return getAllGovernorates(market);
}

export function listDistricts(market: string, citySlug: string): readonly District[] {
  return getAllDistricts(market, citySlug);
}

export function listVillages(
  market: string,
  citySlug: string,
  districtSlug: string,
): readonly Village[] {
  const districts = getAllDistricts(market, citySlug);
  return districts.find((d) => d.slug === districtSlug)?.villages ?? [];
}
