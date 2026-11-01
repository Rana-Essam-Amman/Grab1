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
  readonly cityEn?: string | null;
  readonly governorateSlug?: string | null;
  readonly districtSlug?: string | null;
  readonly neighborhoodSlug?: string | null;
}

/**
 * Slug rules:
 * - A populated listing slug that conflicts with the filter never matches.
 * - Parent and child must both agree when both are populated.
 * - A NULL listing slug falls back to text for that level only.
 * - Text is never required when the listing slug at that level matches.
 * - Slugs are never invented.
 */
export function matchLocation(
  item: Listing,
  filter: MatchInput,
  textMatch: (item: Listing, target: string) => boolean,
): boolean {
  const { neighborhood, cityEn, governorateSlug, districtSlug, neighborhoodSlug } = filter;

  if (governorateSlug && item.citySlug && item.citySlug !== governorateSlug) return false;
  if (districtSlug && item.districtSlug && item.districtSlug !== districtSlug) return false;
  if (neighborhoodSlug && item.neighborhoodSlug && item.neighborhoodSlug !== neighborhoodSlug) return false;

  if (neighborhoodSlug && !item.neighborhoodSlug) {
    return neighborhood ? textMatch(item, neighborhood) : true;
  }
  if (districtSlug && !item.districtSlug) {
    return neighborhood ? textMatch(item, neighborhood) : true;
  }
  if (governorateSlug && !item.citySlug) {
    return cityEn ? textMatch(item, cityEn) : true;
  }
  if (!governorateSlug && !districtSlug && !neighborhoodSlug) {
    return neighborhood ? textMatch(item, neighborhood) : true;
  }
  return true;
}
