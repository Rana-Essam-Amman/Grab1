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
    if (!neighborhood || !textMatch(item, neighborhood)) return false;
    if (governorateSlug && item.citySlug && item.citySlug !== governorateSlug) return false;
    if (governorateSlug && !item.citySlug && !cityEn) return false;
    if (cityEn && item.city && !textMatch(item, cityEn)) return false;
    return true;
  }
  if (districtSlug && !item.districtSlug) {
    if (!neighborhood || !textMatch(item, neighborhood)) return false;
    const hasCitySlugProof = Boolean(governorateSlug && item.citySlug && item.citySlug === governorateSlug);
    const hasCityTextProof = !item.citySlug && Boolean(cityEn && item.city && textMatch(item, cityEn));
    return hasCitySlugProof || hasCityTextProof;
  }
  if (governorateSlug && !item.citySlug) {
    return cityEn ? textMatch(item, cityEn) : false;
  }
  if (!governorateSlug && !districtSlug && !neighborhoodSlug) {
    return neighborhood ? textMatch(item, neighborhood) : true;
  }
  return true;
}
