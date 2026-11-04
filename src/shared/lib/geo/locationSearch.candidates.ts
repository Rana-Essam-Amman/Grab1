import { getCountryGeo } from '@/data/locations/registry';
import { getMarketProfile } from '@/data/locations/marketProfiles';
import { cleanGeoToken } from './adapters/adapterUtils';
import type { Governorate, District, Village } from '@/data/locations/types';
import type { MarketCode } from './geo.types';
import type {
  CanonicalLocationCandidate,
  LocationParentPath,
  ParentContext,
} from './locationSearch.types';

function matches(query: string, ...fields: readonly string[]): boolean {
  const q = cleanGeoToken(query);
  if (!q) return false;
  return fields.some((field) => cleanGeoToken(field) === q);
}

function parentOf(gov: Governorate, dist?: District): LocationParentPath {
  return {
    citySlug: gov.slug,
    cityEn: gov.nameEn,
    cityAr: gov.nameAr,
    districtSlug: dist?.slug ?? null,
    districtEn: dist?.nameEn ?? null,
    districtAr: dist?.nameAr ?? null,
  };
}

function passesParent(
  candidate: CanonicalLocationCandidate,
  parent?: ParentContext
): boolean {
  if (!parent) return true;
  if (parent.citySlug && candidate.citySlug !== parent.citySlug) return false;
  if (parent.districtSlug && candidate.districtSlug !== parent.districtSlug) return false;
  return true;
}

function govCandidate(market: MarketCode, gov: Governorate, slot: CanonicalLocationCandidate['canonicalSlot']): CanonicalLocationCandidate {
  return {
    marketCode: market,
    nameEn: gov.nameEn,
    nameAr: gov.nameAr,
    slug: gov.slug,
    levelIndex: 1,
    canonicalSlot: slot,
    citySlug: gov.slug,
    districtSlug: null,
    neighborhoodSlug: null,
    parentPath: parentOf(gov),
  };
}

function distCandidate(
  market: MarketCode,
  gov: Governorate,
  dist: District,
  slot: CanonicalLocationCandidate['canonicalSlot']
): CanonicalLocationCandidate {
  return {
    marketCode: market,
    nameEn: dist.nameEn,
    nameAr: dist.nameAr,
    slug: dist.slug,
    levelIndex: 2,
    canonicalSlot: slot,
    citySlug: gov.slug,
    districtSlug: dist.slug,
    neighborhoodSlug: null,
    parentPath: parentOf(gov, dist),
  };
}

function villageCandidate(
  market: MarketCode,
  gov: Governorate,
  dist: District,
  village: Village,
  slot: CanonicalLocationCandidate['canonicalSlot']
): CanonicalLocationCandidate {
  return {
    marketCode: market,
    nameEn: village.nameEn,
    nameAr: village.nameAr,
    slug: village.slug,
    levelIndex: 3,
    canonicalSlot: slot,
    citySlug: gov.slug,
    districtSlug: dist.slug,
    neighborhoodSlug: village.slug,
    parentPath: parentOf(gov, dist),
  };
}

export function collectCandidates(
  marketCode: string,
  query: string,
  parent?: ParentContext
): readonly CanonicalLocationCandidate[] {
  const profile = getMarketProfile(marketCode);
  const geo = getCountryGeo(marketCode);
  if (!profile || !geo || !cleanGeoToken(query)) return [];

  const level1 = profile.visibleLevels.find((l) => l.levelIndex === 1);
  const level2 = profile.visibleLevels.find((l) => l.levelIndex === 2);
  const level3 = profile.visibleLevels.find((l) => l.levelIndex === 3);
  const out: CanonicalLocationCandidate[] = [];

  for (const gov of geo.governorates) {
    if (level1 && matches(query, gov.nameEn, gov.nameAr, gov.slug)) {
      out.push(govCandidate(profile.marketCode, gov, level1.canonicalSlot));
    }
    for (const dist of gov.districts) {
      if (level2 && matches(query, dist.nameEn, dist.nameAr, dist.slug)) {
        out.push(distCandidate(profile.marketCode, gov, dist, level2.canonicalSlot));
      }
      if (!level3) continue;
      for (const village of dist.villages) {
        if (matches(query, village.nameEn, village.nameAr, village.slug)) {
          out.push(villageCandidate(profile.marketCode, gov, dist, village, level3.canonicalSlot));
        }
      }
    }
  }

  return out.filter((candidate) => passesParent(candidate, parent));
}
