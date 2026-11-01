import type { Listing } from '@/types';

export interface LocationFilter {
  readonly countryCode: string;
  readonly governorateSlug: string | null;
  readonly districtSlug: string | null;
  readonly neighborhoodSlug: string | null;
  readonly cityLabelEn?: string | null;
  readonly cityLabelAr?: string | null;
  readonly neighborhoodLabel?: string | null;
}

interface MatchInput {
  readonly neighborhood?: string | null;
  readonly governorateSlug?: string | null;
  readonly districtSlug?: string | null;
  readonly neighborhoodSlug?: string | null;
}

/**
 * Slug match is authoritative when both sides have the slug.
 * NULL listing slugs fall back to the textual matcher. Never invent slugs.
 */
export function matchLocation(
  item: Listing,
  filter: MatchInput,
  textMatch: (item: Listing, target: string) => boolean,
): boolean {
  const { neighborhood, governorateSlug, districtSlug, neighborhoodSlug } = filter;

  if (neighborhoodSlug) {
    if (item.neighborhoodSlug) return item.neighborhoodSlug === neighborhoodSlug;
    return neighborhood ? textMatch(item, neighborhood) : true;
  }
  if (districtSlug) {
    if (item.districtSlug) return item.districtSlug === districtSlug;
    return neighborhood ? textMatch(item, neighborhood) : true;
  }
  if (governorateSlug) {
    if (item.citySlug) return item.citySlug === governorateSlug;
    return true;
  }
  if (neighborhood) return textMatch(item, neighborhood);
  return true;
}
