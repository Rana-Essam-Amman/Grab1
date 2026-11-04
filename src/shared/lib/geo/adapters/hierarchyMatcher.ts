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

interface RecognizedVillage {
  slug: string;
  distSlug: string;
  govSlug: string;
  nameAr: string;
  nameEn: string;
}

function makeExact(
  gov: RecognizedGov,
  dist: RecognizedDist,
  v: RecognizedVillage,
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

export function matchHierarchyPasses(
  geo: CountryGeo,
  cleaned: readonly string[],
  coords?: LatLng
): MatchResult | null {
  if (!cleaned.length) return null;

  // Collect the actual recognized entities (not just booleans)
  const recognizedGovs = new Map<string, RecognizedGov>();
  const recognizedDists = new Map<string, RecognizedDist>();
  const recognizedVillages = new Map<string, RecognizedVillage>();

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
        recognizedDists.set(d.slug, {
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
          recognizedVillages.set(v.slug, {
            slug: v.slug,
            distSlug: d.slug,
            govSlug: g.slug,
            nameAr: v.nameAr,
            nameEn: v.nameEn,
          });
        }
      }
    }
  }

  const hasRecognizedGov = recognizedGovs.size > 0;
  const hasRecognizedDist = recognizedDists.size > 0;
  const hasRecognizedVillage = recognizedVillages.size > 0;

  // Conflicting entities at the same level → unresolved
  if (recognizedGovs.size > 1) return unresolved(coords);
  if (recognizedDists.size > 1) return unresolved(coords);
  if (recognizedVillages.size > 1) return unresolved(coords);

  const villageMatches: MatchResult[] = [];
  const districtMatches: MatchResult[] = [];
  const govMatches: MatchResult[] = [];

  for (const gov of geo.governorates) {
    const govOk = !hasRecognizedGov || recognizedGovs.has(gov.slug);

    for (const dist of gov.districts) {
      const distOk = !hasRecognizedDist || recognizedDists.has(dist.slug);

      for (const v of dist.villages) {
        const villageOk = !hasRecognizedVillage || recognizedVillages.has(v.slug);
        if (villageOk && distOk && govOk) {
          // Extra parent consistency: if a district was recognized, it must belong to this gov
          const recognizedDist = recognizedDists.get(dist.slug);
          if (recognizedDist && recognizedDist.govSlug !== gov.slug) continue;
          const recognizedVillage = recognizedVillages.get(v.slug);
          if (
            recognizedVillage &&
            (recognizedVillage.distSlug !== dist.slug || recognizedVillage.govSlug !== gov.slug)
          ) {
            continue;
          }
          villageMatches.push(
            makeExact(
              { slug: gov.slug, nameAr: gov.nameAr, nameEn: gov.nameEn },
              { slug: dist.slug, govSlug: gov.slug, nameAr: dist.nameAr, nameEn: dist.nameEn },
              { slug: v.slug, distSlug: dist.slug, govSlug: gov.slug, nameAr: v.nameAr, nameEn: v.nameEn },
              coords
            )
          );
        }
      }

      // District-level only when no village token was recognized
      if (distOk && govOk && !hasRecognizedVillage) {
        const recognizedDist = recognizedDists.get(dist.slug);
        if (recognizedDist && recognizedDist.govSlug !== gov.slug) continue;
        districtMatches.push(
          makeDistrict(
            { slug: gov.slug, nameAr: gov.nameAr, nameEn: gov.nameEn },
            { slug: dist.slug, govSlug: gov.slug, nameAr: dist.nameAr, nameEn: dist.nameEn },
            coords
          )
        );
      }
    }

    // Governorate-level only when no more-specific recognized token exists
    if (govOk && !hasRecognizedVillage && !hasRecognizedDist) {
      govMatches.push(makeGov({ slug: gov.slug, nameAr: gov.nameAr, nameEn: gov.nameEn }, coords));
    }
  }

  // More-specific recognized token that produced no consistent match → unresolved
  if (hasRecognizedVillage && villageMatches.length === 0) return unresolved(coords);
  if (hasRecognizedDist && !hasRecognizedVillage && districtMatches.length === 0) return unresolved(coords);

  if (villageMatches.length === 1) return villageMatches[0];
  if (villageMatches.length > 1) return unresolved(coords);

  if (districtMatches.length === 1) return districtMatches[0];
  if (districtMatches.length > 1) return unresolved(coords);

  if (govMatches.length === 1) return govMatches[0];
  if (govMatches.length > 1) return unresolved(coords);

  return null;
}
