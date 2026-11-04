import { getCountryGeo } from '@/data/locations/registry';
import { getMarketProfile } from '@/data/locations/marketProfiles';
import { cleanGeoToken } from './adapters/adapterUtils';
import { matchHierarchyPasses } from './adapters/hierarchyMatcher';
import { collectCandidates } from './locationSearch.candidates';
import { candidateFromMatch } from './locationSearch.map';
import type { ParentContext, LocationSearchResult } from './locationSearch.types';

import '@/data/locations/JO.geo';
import '@/data/locations/SA.geo';
import '@/data/locations/PS.geo';
import '@/data/locations/LB.geo';
import '@/data/locations/SY.geo';
import '@/data/locations/KW.geo';

export type {
  CanonicalLocationCandidate,
  LocationSearchResult,
  ParentContext,
  ResolutionStatus,
  LocationParentPath,
} from './locationSearch.types';

const EMPTY = (marketCode: string): LocationSearchResult => ({
  marketCode,
  status: 'none',
  confidence: 'none',
  candidates: [],
  resolved: null,
});

function resolveTokens(query: string, parent?: ParentContext): string[] {
  const tokens: string[] = [];
  if (parent?.citySlug) tokens.push(cleanGeoToken(parent.citySlug));
  if (parent?.districtSlug) tokens.push(cleanGeoToken(parent.districtSlug));
  const cleaned = cleanGeoToken(query);
  if (cleaned) tokens.push(cleaned);
  return tokens;
}

export function searchLocationsCanonical(
  marketCode: string,
  query: string,
  parent?: ParentContext
): LocationSearchResult {
  if (!getMarketProfile(marketCode)) return EMPTY(marketCode);
  const candidates = collectCandidates(marketCode, query, parent);
  if (candidates.length === 0) return EMPTY(marketCode);
  if (candidates.length === 1) {
    return { marketCode, status: 'unique', confidence: 'exact', candidates, resolved: candidates[0] };
  }
  return { marketCode, status: 'ambiguous', confidence: 'unresolved', candidates, resolved: null };
}

export function resolveLocationCanonical(
  marketCode: string,
  query: string,
  parent?: ParentContext
): LocationSearchResult {
  const profile = getMarketProfile(marketCode);
  const geo = getCountryGeo(marketCode);
  if (!profile || !geo) return EMPTY(marketCode);

  const tokens = resolveTokens(query, parent);
  if (tokens.length === 0) return EMPTY(marketCode);
  if (collectCandidates(marketCode, query).length === 0) return EMPTY(marketCode);

  const match = matchHierarchyPasses(geo, tokens);
  const candidates = collectCandidates(marketCode, query, parent);
  if (!match) return EMPTY(marketCode);

  if (match.confidence === 'unresolved') {
    const visible = candidates.length > 0 ? candidates : collectCandidates(marketCode, query);
    return { marketCode, status: 'ambiguous', confidence: 'unresolved', candidates: visible, resolved: null };
  }

  const resolved = candidateFromMatch(profile.marketCode, match);
  if (!resolved) return EMPTY(marketCode);

  const confidence = match.confidence === 'exact' || match.confidence === 'high' || match.confidence === 'approximate'
    ? match.confidence
    : 'exact';

  return {
    marketCode,
    status: 'unique',
    confidence,
    candidates: candidates.length > 0 ? candidates : [resolved],
    resolved,
  };
}
