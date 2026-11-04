import type { RecognizedDist } from './hierarchyMatcher.results';
import { distKey, unresolved } from './hierarchyMatcher.results';
import type { MatchResult } from './hierarchyMatcher.results';
import type { LatLng } from '../geo.types';

export function resolveEffectiveDistricts(
  recognizedGovs: Map<string, { slug: string }>,
  recognizedDists: Map<string, RecognizedDist>,
  coords?: LatLng
): { effectiveDists: Map<string, RecognizedDist>; conflict: MatchResult | null } {
  const distsBySlug = new Map<string, RecognizedDist[]>();
  for (const d of recognizedDists.values()) {
    const list = distsBySlug.get(d.slug) ?? [];
    list.push(d);
    distsBySlug.set(d.slug, list);
  }

  if (recognizedGovs.size === 1) {
    const govSlug = [...recognizedGovs.keys()][0];
    const filtered = new Map<string, RecognizedDist>();
    for (const [slug, candidates] of distsBySlug) {
      const underGov = candidates.filter((d) => d.govSlug === govSlug);
      if (underGov.length === 0) return { effectiveDists: filtered, conflict: unresolved(coords) };
      if (underGov.length > 1) return { effectiveDists: filtered, conflict: unresolved(coords) };
      filtered.set(distKey(govSlug, slug), underGov[0]);
    }
    if (filtered.size > 1) return { effectiveDists: filtered, conflict: unresolved(coords) };
    return { effectiveDists: filtered, conflict: null };
  }

  if (distsBySlug.size > 1) return { effectiveDists: recognizedDists, conflict: unresolved(coords) };
  for (const candidates of distsBySlug.values()) {
    if (candidates.length > 1) return { effectiveDists: recognizedDists, conflict: unresolved(coords) };
  }
  return { effectiveDists: recognizedDists, conflict: null };
}
