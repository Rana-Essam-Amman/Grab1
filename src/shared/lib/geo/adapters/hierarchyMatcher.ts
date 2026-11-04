import type { CountryGeo } from '@/data/locations/types';
import type { CanonicalLocation, LatLng } from '../geo.types';
import { collectRecognized } from './hierarchyMatcher.collect';
import { resolveEffectiveDistricts } from './hierarchyMatcher.constraints';
import {
  makeExact,
  makeDistrict,
  makeGov,
  unresolved,
  distKey,
} from './hierarchyMatcher.results';
import type { VillageCandidate } from './hierarchyMatcher.results';

type MatchResult = Omit<CanonicalLocation, 'countryCode'>;

export function matchHierarchyPasses(
  geo: CountryGeo,
  cleaned: readonly string[],
  coords?: LatLng
): MatchResult | null {
  if (!cleaned.length) return null;

  const { recognizedGovs, recognizedDists, villageCandidates } = collectRecognized(geo, cleaned);

  if (recognizedGovs.size > 1) return unresolved(coords);

  const { effectiveDists, conflict } = resolveEffectiveDistricts(recognizedGovs, recognizedDists, coords);
  if (conflict) return conflict;

  const hasRecognizedGov = recognizedGovs.size > 0;
  const hasRecognizedDist = effectiveDists.size > 0;
  const hasRecognizedVillage = villageCandidates.length > 0;

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
    return makeGov([...recognizedGovs.values()][0], coords);
  }

  return null;
}
