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

  // A token is assigned to the highest hierarchy level it matches.
  // This prevents a governorate token (e.g. "amman", "aqaba") from also
  // creating a spurious village or district candidate.
  const govTokens = new Set<string>();
  const distTokens = new Set<string>();
  const villageTokens = new Set<string>();

  const recognizedGovs = new Map<string, RecognizedGov>();
  const recognizedDists = new Map<string, RecognizedDist>();
  const villageCandidates: VillageCandidate[] = [];

  // Pass 1: collect governorate matches and claim those tokens
  for (const g of geo.governorates) {
    const ga = cleanGeoToken(g.nameAr);
    const ge = cleanGeoToken(g.nameEn);
    if (tokenMatches(cleaned, ga, ge, g.slug)) {
      recognizedGovs.set(g.slug, { slug: g.slug, nameAr: g.nameAr, nameEn: g.nameEn });
      for (const t of cleaned) {
        if (t === ga || t === ge || t === g.slug) govTokens.add(t);
      }
    }
  }

  // Pass 2: collect district matches for tokens not already claimed by a governorate
  for (const g of geo.governorates) {
    for (const d of g.districts) {
      const da = cleanGeoToken(d.nameAr);
      const de = cleanGeoToken(d.nameEn);
      const matching = cleaned.filter((t) => !govTokens.has(t) && (t === da || t === de || t === d.slug));
      if (matching.length > 0) {
        recognizedDists.set(distKey(g.slug, d.slug), {
          slug: d.slug,
          govSlug: g.slug,
          nameAr: d.nameAr,
          nameEn: d.nameEn,
        });
        for (const t of matching) distTokens.add(t);
      }
    }
  }

  // Pass 3: collect village matches for tokens not claimed by a higher level
  for (const g of geo.governorates) {
    for (const d of g.districts) {
      for (const v of d.villages) {
        const va = cleanGeoToken(v.nameAr);
        const ve = cleanGeoToken(v.nameEn);
        const matching = cleaned.filter(
          (t) => !govTokens.has(t) && !distTokens.has(t) && (t === va || t === ve || t === v.slug)
        );
        if (matching.length > 0) {
          villageCandidates.push({
            govSlug: g.slug,
            distSlug: d.slug,
            slug: v.slug,
            nameAr: v.nameAr,
            nameEn: v.nameEn,
          });
          for (const t of matching) villageTokens.add(t);
        }
      }
    }
  }

  // Conflicting recognized governorates are fatal
  if (recognizedGovs.size > 1) return unresolved(coords);

  // Group recognized districts by district slug so we can distinguish
  // repeated copies of the same slug across governorates from genuinely
  // conflicting distinct district slugs.
  const distsBySlug = new Map<string, RecognizedDist[]>();
  for (const d of recognizedDists.values()) {
    const list = distsBySlug.get(d.slug) ?? [];
    list.push(d);
    distsBySlug.set(d.slug, list);
  }

  let effectiveDists = recognizedDists;
  if (recognizedGovs.size === 1) {
    const govSlug = [...recognizedGovs.keys()][0];
    const filtered = new Map<string, RecognizedDist>();
    for (const [slug, candidates] of distsBySlug) {
      const underGov = candidates.filter((d) => d.govSlug === govSlug);
      if (underGov.length === 0) {
        // This recognized district slug has no instance under the recognized governorate.
        return unresolved(coords);
      }
      if (underGov.length > 1) return unresolved(coords);
      filtered.set(distKey(govSlug, slug), underGov[0]);
    }
    effectiveDists = filtered;
  } else {
    if (distsBySlug.size > 1) return unresolved(coords);
    for (const candidates of distsBySlug.values()) {
      if (candidates.length > 1) return unresolved(coords);
    }
  }

  if (effectiveDists.size > 1) return unresolved(coords);

  const hasRecognizedGov = recognizedGovs.size > 0;
  const hasRecognizedDist = effectiveDists.size > 0;
  const hasRecognizedVillage = villageCandidates.length > 0;

  // Filter village candidates by all recognized parent constraints.
  const filteredVillages = villageCandidates.filter((c) => {
    if (hasRecognizedGov && !recognizedGovs.has(c.govSlug)) return false;
    if (hasRecognizedDist && !effectiveDists.has(distKey(c.govSlug, c.distSlug))) return false;
    return true;
  });

  const uniqueVillages = new Map<string, VillageCandidate>();
  for (const c of filteredVillages) {
    uniqueVillages.set(`${c.govSlug}|${c.distSlug}|${c.slug}`, c);
  }

  if (uniqueVillages.size > 1) return unresolved(coords);

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

  if (hasRecognizedVillage && uniqueVillages.size === 0) return unresolved(coords);

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

  if (hasRecognizedGov && !hasRecognizedVillage && !hasRecognizedDist) {
    if (recognizedGovs.size !== 1) return unresolved(coords);
    const rg = [...recognizedGovs.values()][0];
    return makeGov(rg, coords);
  }

  return null;
}
