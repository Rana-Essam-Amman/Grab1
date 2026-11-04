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

  // Unified 2-level model: show neighborhood if present regardless of level count.
  const district = pickName(isArabic, location.districtAr, location.districtEn);
  const neighborhood = pickName(isArabic, location.neighborhoodAr, location.neighborhoodEn);

  if (neighborhood && district) return `${neighborhood}${LABEL_SEPARATOR}${district}`;
  if (district) return district;
  if (neighborhood) return neighborhood;
  return '';
}
