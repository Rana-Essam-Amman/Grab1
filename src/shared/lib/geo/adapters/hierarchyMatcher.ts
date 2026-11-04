import { cleanGeoToken } from './adapterUtils';
import type { CountryGeo } from '@/data/locations/types';
import type { CanonicalLocation, LatLng } from '../geo.types';

type MatchResult = Omit<CanonicalLocation, 'countryCode'>;

interface RecognizedGov {
  slug: string;
  nameAr: string;
  nameEn: string;
}

interface RecognizedDist {
  slug: string;
  govSlug: string;
  nameAr: string;
  nameEn: string;
}

interface VillageCandidate {
  govSlug: string;
  distSlug: string;
  slug: string;
  nameAr: string;
  nameEn: string;
}

function makeExact(
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

function makeDistrict(gov: RecognizedGov, dist: RecognizedDist, coords?: LatLng): MatchResult {
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

function makeGov(gov: RecognizedGov, coords?: LatLng): MatchResult {
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

function tokenMatches(cleaned: readonly string[], ...candidates: string[]): boolean {
  return cleaned.some((t) => candidates.includes(t));
}

function distKey(govSlug: string, distSlug: string): string {
  return `${govSlug}|${distSlug}`;
}

export function matchHierarchyPasses(
  geo: CountryGeo,
  cleaned: readonly string[],
  coords?: LatLng
): MatchResult | null {
  if (!cleaned.length) return null;

  // Recognized parent entities. District identity is (governorateSlug + districtSlug).
  const recognizedGovs = new Map<string, RecognizedGov>();
  const recognizedDists = new Map<string, RecognizedDist>();

  // All village candidates that matched any locality token (retain multiples for later filtering)
  const villageCandidates: VillageCandidate[] = [];

  for (const g of geo.governorates) {
    const ga = cleanGeoToken(g.nameAr);
    const ge = cleanGeoToken(g.nameEn);
    if (tokenMatches(cleaned, ga, ge, g.slug)) {
      recognizedGovs.set(g.slug, { slug: g.slug, nameAr: g.nameAr, nameEn: g.nameEn });
    }
    for (const d of g.districts) {
      const da = cleanGeoToken(d.nameAr);
      const de = cleanGeoToken(d.nameEn);
      if (tokenMatches(cleaned, da, de, d.slug)) {
        recognizedDists.set(distKey(g.slug, d.slug), {
          slug: d.slug,
          govSlug: g.slug,
          nameAr: d.nameAr,
          nameEn: d.nameEn,
        });
      }
      for (const v of d.villages) {
        const va = cleanGeoToken(v.nameAr);
        const ve = cleanGeoToken(v.nameEn);
        if (tokenMatches(cleaned, va, ve, v.slug)) {
          villageCandidates.push({
            govSlug: g.slug,
            distSlug: d.slug,
            slug: v.slug,
            nameAr: v.nameAr,
            nameEn: v.nameEn,
          });
        }
      }
    }
  }

  // Conflicting recognized governorates are fatal
  if (recognizedGovs.size > 1) return unresolved(coords);

  // Apply recognized governorate constraint to districts before evaluating district ambiguity.
  // A single governorate may disambiguate repeated district slugs across governorates.
  let effectiveDists = recognizedDists;
  if (recognizedGovs.size === 1) {
    const govSlug = [...recognizedGovs.keys()][0];
    effectiveDists = new Map(
      [...recognizedDists.entries()].filter(([, d]) => d.govSlug === govSlug)
    );
    // A recognized district whose governorate conflicts with the recognized governorate
    if (recognizedDists.size > 0 && effectiveDists.size === 0) return unresolved(coords);
  }

  // Multiple distinct districts remain after governorate restriction → unresolved
  if (effectiveDists.size > 1) return unresolved(coords);

  const hasRecognizedGov = recognizedGovs.size > 0;
  const hasRecognizedDist = effectiveDists.size > 0;
  const hasRecognizedVillage = villageCandidates.length > 0;

  // Filter village candidates by all recognized parent constraints.
  // A recognized district constrains both governorate and district slug.
  const filteredVillages = villageCandidates.filter((c) => {
    if (hasRecognizedGov && !recognizedGovs.has(c.govSlug)) return false;
    if (hasRecognizedDist && !effectiveDists.has(distKey(c.govSlug, c.distSlug))) return false;
    return true;
  });

  // Deduplicate by full hierarchy path
  const uniqueVillages = new Map<string, VillageCandidate>();
  for (const c of filteredVillages) {
    uniqueVillages.set(`${c.govSlug}|${c.distSlug}|${c.slug}`, c);
  }

  // Multiple distinct locality candidates after parent filtering → unresolved
  if (uniqueVillages.size > 1) return unresolved(coords);

  // Exactly one locality remains → success
  if (uniqueVillages.size === 1) {
    const c = [...uniqueVillages.values()][0];
    const gov = geo.governorates.find((g) => g.slug === c.govSlug);
    const dist = gov?.districts.find((d) => d.slug === c.distSlug);
    if (gov && dist) {
      return makeExact(
        { slug: gov.slug, nameAr: gov.nameAr, nameEn: gov.nameEn },
        { slug: dist.slug, govSlug: gov.slug, nameAr: dist.nameAr, nameEn: dist.nameEn },
        c,
        coords
      );
    }
  }

  // Locality tokens were present but none survived parent filtering → unresolved
  if (hasRecognizedVillage && uniqueVillages.size === 0) return unresolved(coords);

  // District-level (only when no locality token was recognized).
  // Complete district identity must be unique.
  if (hasRecognizedDist && !hasRecognizedVillage) {
    if (effectiveDists.size !== 1) return unresolved(coords);
    const rd = [...effectiveDists.values()][0];
    if (hasRecognizedGov && !recognizedGovs.has(rd.govSlug)) return unresolved(coords);
    const gov = geo.governorates.find((g) => g.slug === rd.govSlug);
    if (gov) {
      return makeDistrict(
        { slug: gov.slug, nameAr: gov.nameAr, nameEn: gov.nameEn },
        rd,
        coords
      );
    }
  }

  // Governorate-level (only when no more-specific recognized token exists)
  if (hasRecognizedGov && !hasRecognizedVillage && !hasRecognizedDist) {
    if (recognizedGovs.size !== 1) return unresolved(coords);
    const rg = [...recognizedGovs.values()][0];
    return makeGov(rg, coords);
  }

  return null;
}
