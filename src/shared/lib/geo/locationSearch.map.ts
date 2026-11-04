import { getMarketProfile } from '@/data/locations/marketProfiles';
import type { CanonicalLocation, MarketCode } from './geo.types';
import type { CanonicalIdentitySlot } from '@/data/locations/types';
import type { CanonicalLocationCandidate } from './locationSearch.types';

export function candidateFromMatch(
  marketCode: MarketCode,
  match: Omit<CanonicalLocation, 'countryCode'>
): CanonicalLocationCandidate | null {
  const profile = getMarketProfile(marketCode);
  if (!profile || match.confidence === 'unresolved') return null;

  const citySlug = match.governorateSlug;
  const districtSlug = match.districtSlug;
  const neighborhoodSlug = match.neighborhoodSlug;
  // Unified 2-level model: neighborhood and district both map to level 2.
  const levelIndex = (neighborhoodSlug || districtSlug) ? 2 : citySlug ? 1 : 0;
  const level = profile.visibleLevels.find((item) => item.levelIndex === levelIndex);
  if (!level || !citySlug) return null;

  const nameEn = neighborhoodSlug
    ? match.neighborhoodEn
    : districtSlug
      ? match.districtEn
      : match.governorateEn;
  const nameAr = neighborhoodSlug
    ? match.neighborhoodAr
    : districtSlug
      ? match.districtAr
      : match.governorateAr;

  return {
    marketCode,
    nameEn: nameEn ?? '',
    nameAr: nameAr ?? '',
    slug: neighborhoodSlug ?? districtSlug ?? citySlug,
    levelIndex,
    canonicalSlot: level.canonicalSlot as CanonicalIdentitySlot,
    citySlug,
    districtSlug,
    neighborhoodSlug,
    parentPath: {
      citySlug,
      cityEn: match.governorateEn,
      cityAr: match.governorateAr,
      districtSlug,
      districtEn: match.districtEn,
      districtAr: match.districtAr,
    },
  };
}
