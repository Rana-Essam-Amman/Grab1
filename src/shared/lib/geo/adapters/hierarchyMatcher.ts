import { cleanGeoToken } from './adapterUtils';
import type { CountryGeo } from '@/data/locations/types';
import type { CanonicalLocation, LatLng } from '../geo.types';

type MatchResult = Omit<CanonicalLocation, 'countryCode'>;

function makeExact(
  gov: { slug: string; nameEn: string; nameAr: string },
  dist: { slug: string; nameEn: string; nameAr: string },
  v: { slug: string; nameEn: string; nameAr: string },
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

function makeDistrict(
  gov: { slug: string; nameEn: string; nameAr: string },
  dist: { slug: string; nameEn: string; nameAr: string },
  coords?: LatLng
): MatchResult {
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

function makeGov(
  gov: { slug: string; nameEn: string; nameAr: string },
  coords?: LatLng
): MatchResult {
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

function unresolved(coords?: LatLng): MatchResult {
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

export function matchHierarchyPasses(
  geo: CountryGeo,
  cleaned: readonly string[],
  coords?: LatLng
): MatchResult | null {
  if (!cleaned.length) return null;

  const villageMatches: MatchResult[] = [];
  const districtMatches: MatchResult[] = [];
  const govMatches: MatchResult[] = [];

  // Detect recognized hierarchy tokens in the input
  let inputHasGovToken = false;
  let inputHasDistToken = false;
  let inputHasVillageToken = false;
  for (const g of geo.governorates) {
    const ga = cleanGeoToken(g.nameAr);
    const ge = cleanGeoToken(g.nameEn);
    if (cleaned.some((t) => t === ga || t === ge || t === g.slug)) inputHasGovToken = true;
    for (const d of g.districts) {
      const da = cleanGeoToken(d.nameAr);
      const de = cleanGeoToken(d.nameEn);
      if (cleaned.some((t) => t === da || t === de || t === d.slug)) inputHasDistToken = true;
      for (const v of d.villages) {
        const va = cleanGeoToken(v.nameAr);
        const ve = cleanGeoToken(v.nameEn);
        if (cleaned.some((t) => t === va || t === ve || t === v.slug)) inputHasVillageToken = true;
      }
    }
  }

  for (const gov of geo.governorates) {
    const gAr = cleanGeoToken(gov.nameAr);
    const gEn = cleanGeoToken(gov.nameEn);
    const hasGov = cleaned.some((t) => t === gAr || t === gEn || t === gov.slug);

    for (const dist of gov.districts) {
      const dAr = cleanGeoToken(dist.nameAr);
      const dEn = cleanGeoToken(dist.nameEn);
      const hasDist = cleaned.some((t) => t === dAr || t === dEn || t === dist.slug);

      let villageHitUnderThisDist = false;
      for (const v of dist.villages) {
        const vAr = cleanGeoToken(v.nameAr);
        const vEn = cleanGeoToken(v.nameEn);
        const hasVillage = cleaned.some((t) => t === vAr || t === vEn || t === v.slug);
        if (hasVillage) {
          villageHitUnderThisDist = true;
          // Only accept if every supplied recognized parent constraint is satisfied
          if ((!inputHasGovToken || hasGov) && (!inputHasDistToken || hasDist)) {
            villageMatches.push(makeExact(gov, dist, v, coords));
          }
        }
      }

      // District-level candidate only when no village token was present in the input
      // (a recognized locality token that failed to match must not be discarded)
      if (hasDist && !inputHasVillageToken) {
        if (!inputHasGovToken || hasGov) {
          districtMatches.push(makeDistrict(gov, dist, coords));
        }
      }
    }

    // Governorate-level candidate only when no more-specific recognized token was supplied
    if (hasGov && !inputHasVillageToken && !inputHasDistToken) {
      govMatches.push(makeGov(gov, coords));
    }
  }

  // If a more-specific recognized token was supplied but produced no consistent match,
  // do not fall back to a less-specific success.
  if (inputHasVillageToken && villageMatches.length === 0) return unresolved(coords);
  if (inputHasDistToken && !inputHasVillageToken && districtMatches.length === 0) return unresolved(coords);

  if (villageMatches.length === 1) return villageMatches[0];
  if (villageMatches.length > 1) return unresolved(coords);

  if (districtMatches.length === 1) return districtMatches[0];
  if (districtMatches.length > 1) return unresolved(coords);

  if (govMatches.length === 1) return govMatches[0];
  if (govMatches.length > 1) return unresolved(coords);

  return null;
}
