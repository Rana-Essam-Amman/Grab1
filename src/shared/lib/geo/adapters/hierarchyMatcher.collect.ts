import { cleanGeoToken } from './adapterUtils';
import type { CountryGeo } from '@/data/locations/types';
import type { RecognizedGov, RecognizedDist, VillageCandidate } from './hierarchyMatcher.results';
import { distKey } from './hierarchyMatcher.results';

export interface Collected {
  recognizedGovs: Map<string, RecognizedGov>;
  recognizedDists: Map<string, RecognizedDist>;
  villageCandidates: VillageCandidate[];
}

function tokenMatches(cleaned: readonly string[], ...candidates: string[]): boolean {
  return cleaned.some((t) => candidates.includes(t));
}

export function collectRecognized(geo: CountryGeo, cleaned: readonly string[]): Collected {
  const govTokens = new Set<string>();
  const distTokens = new Set<string>();
  const recognizedGovs = new Map<string, RecognizedGov>();
  const recognizedDists = new Map<string, RecognizedDist>();
  const villageCandidates: VillageCandidate[] = [];

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
        }
      }
    }
  }

  return { recognizedGovs, recognizedDists, villageCandidates };
}
