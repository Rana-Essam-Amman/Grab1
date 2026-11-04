import { getMarketProfile } from '@/data/locations/marketProfiles';
import type { CanonicalLocation } from '@/shared/lib/geo/geo.types';

const LABEL_SEPARATOR = ' — ';

function pickName(isArabic: boolean, arabic: string | null, english: string | null): string {
  return (isArabic ? arabic : english) || english || arabic || '';
}

export function gpsVisibleChild(
  marketCode: string,
  location: Pick<CanonicalLocation, 'districtAr' | 'districtEn' | 'neighborhoodAr' | 'neighborhoodEn'>,
  isArabic: boolean
): string {
  const profile = getMarketProfile(marketCode);
  if (!profile) return '';

  const hasLevel2 = profile.visibleLevels.some((level) => level.levelIndex === 2);
  const hasLevel3 = profile.visibleLevels.some((level) => level.levelIndex === 3);
  const district = hasLevel2 ? pickName(isArabic, location.districtAr, location.districtEn) : '';
  const neighborhood = hasLevel3 ? pickName(isArabic, location.neighborhoodAr, location.neighborhoodEn) : '';

  if (neighborhood && district) return `${neighborhood}${LABEL_SEPARATOR}${district}`;
  if (district) return district;
  if (neighborhood) return neighborhood;
  return '';
}
