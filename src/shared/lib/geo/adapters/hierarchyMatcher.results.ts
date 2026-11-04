import type { CanonicalLocation, LatLng } from '../geo.types';

export type MatchResult = Omit<CanonicalLocation, 'countryCode'>;

export interface RecognizedGov {
  slug: string;
  nameAr: string;
  nameEn: string;
}

export interface RecognizedDist {
  slug: string;
  govSlug: string;
  nameAr: string;
  nameEn: string;
}

export interface VillageCandidate {
  govSlug: string;
  distSlug: string;
  slug: string;
  nameAr: string;
  nameEn: string;
}

export function makeExact(
  gov: RecognizedGov,
  dist: RecognizedDist,
  v: VillageCandidate,
  coords?: LatLng
): MatchResult {
  return {
    governorateSlug: gov.slug,
    governorateEn: gov.nameEn,
    governorateAr: gov.nameAr,
    districtSlug: dist.slug,
    districtEn: dist.nameEn,
    districtAr: dist.nameAr,
    neighborhoodSlug: v.slug,
    neighborhoodEn: v.nameEn,
    neighborhoodAr: v.nameAr,
    coordinates: coords ?? null,
    confidence: 'exact',
    resolutionSource: 'canonical_match',
    needsManualSelection: false,
  };
}

export function makeDistrict(gov: RecognizedGov, dist: RecognizedDist, coords?: LatLng): MatchResult {
  return {
    governorateSlug: gov.slug,
    governorateEn: gov.nameEn,
    governorateAr: gov.nameAr,
    districtSlug: dist.slug,
    districtEn: dist.nameEn,
    districtAr: dist.nameAr,
    neighborhoodSlug: null,
    neighborhoodEn: null,
    neighborhoodAr: null,
    coordinates: coords ?? null,
    confidence: 'high',
    resolutionSource: 'canonical_match',
    needsManualSelection: false,
  };
}

export function makeGov(gov: RecognizedGov, coords?: LatLng): MatchResult {
  return {
    governorateSlug: gov.slug,
    governorateEn: gov.nameEn,
    governorateAr: gov.nameAr,
    districtSlug: null,
    districtEn: null,
    districtAr: null,
    neighborhoodSlug: null,
    neighborhoodEn: null,
    neighborhoodAr: null,
    coordinates: coords ?? null,
    confidence: 'approximate',
    resolutionSource: 'canonical_match',
    needsManualSelection: false,
  };
}

export function unresolved(coords?: LatLng): MatchResult {
  return {
    governorateSlug: null,
    governorateEn: null,
    governorateAr: null,
    districtSlug: null,
    districtEn: null,
    districtAr: null,
    neighborhoodSlug: null,
    neighborhoodEn: null,
    neighborhoodAr: null,
    coordinates: coords ?? null,
    confidence: 'unresolved',
    resolutionSource: 'canonical_match',
    needsManualSelection: true,
  };
}

export function distKey(govSlug: string, distSlug: string): string {
  return `${govSlug}|${distSlug}`;
}
