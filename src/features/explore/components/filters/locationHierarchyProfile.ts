import { getMarketProfile } from '@/data/locations/marketProfiles';

export interface HierarchyLabels {
  readonly level1: string | null;
  readonly level2: string | null;
  readonly level3: string | null;
  readonly hasLevel3: boolean;
}

export function hierarchyLabels(countryCode: string, isArabic: boolean): HierarchyLabels {
  const profile = getMarketProfile(countryCode);
  if (!profile) return { level1: null, level2: null, level3: null, hasLevel3: false };
  const label = (index: number): string | null => {
    const level = profile.visibleLevels.find((item) => item.levelIndex === index);
    return level ? (isArabic ? level.labelAr : level.labelEn) : null;
  };
  return {
    level1: label(1),
    level2: label(2),
    level3: label(3),
    hasLevel3: profile.visibleLevels.length >= 3,
  };
}

export function campsForGovernorate<T extends { governorateSlug: string }>(
  camps: readonly T[],
  selectedGov: string | null
): readonly T[] {
  if (!selectedGov) return [];
  return camps.filter((camp) => camp.governorateSlug === selectedGov);
}
