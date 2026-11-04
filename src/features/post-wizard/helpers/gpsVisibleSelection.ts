import { getMarketProfile } from '@/data/locations/marketProfiles';
import type { CanonicalLocation } from '@/shared/lib/geo/geo.types';

const LABEL_SEPARATOR = ' — ';
const HIDDEN_PLACEHOLDERS = new Set(['لا يظهر', 'Should Not Render', 'N/A']);

function pickName(isArabic: boolean, arabic: string | null, english: string | null): string {
  const picked = (isArabic ? arabic : english) || english || arabic || '';
  return HIDDEN_PLACEHOLDERS.has(picked) ? '' : picked;
}

export function gpsVisibleChild(
  marketCode: string,
  location: Pick<CanonicalLocation, 'districtAr' | 'districtEn' | 'neighborhoodAr' | 'neighborhoodEn'>,
  isArabic: boolean
): string {
  const profile = getMarketProfile(marketCode);
  if (!profile) return '';

  // Unified 2-level model: show neighborhood when present, filtering placeholders.
  const district = pickName(isArabic, location.districtAr, location.districtEn);
  const neighborhood = pickName(isArabic, location.neighborhoodAr, location.neighborhoodEn);

  if (neighborhood && district) return `${neighborhood}${LABEL_SEPARATOR}${district}`;
  if (district) return district;
  if (neighborhood) return neighborhood;
  return '';
}
