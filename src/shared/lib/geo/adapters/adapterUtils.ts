import { normalizeArabic } from '@/shared/lib/arabicNormalize';
import type { LatLng } from '../geo.types';

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function cleanGeoToken(token: string): string {
  const stripped = token
    .trim()
    .replace(/^(محافظة|محافظه|منطقة|منطقه|مدينة|مدينه|قضاء|حي|بلدة|بلده|قرية|قريه|مخيم|لواء)\s+/u, '')
    .trim();
  return normalizeArabic(stripped).toLowerCase();
}

export function matchLandmarkOrCamp(
  cleanedTokens: readonly string[],
  camps: readonly { slug: string; nameAr: string; nameEn: string; governorateSlug: string }[],
  landmarks: readonly { slug: string; nameAr: string; nameEn: string; citySlug: string }[]
) {
  for (const c of camps) {
    const cAr = cleanGeoToken(c.nameAr);
    const cEn = cleanGeoToken(c.nameEn);
    const cSlug = c.slug.toLowerCase();
    if (cleanedTokens.some((t) => t === cAr || t === cEn || t === cSlug)) {
      return { type: 'camp' as const, entity: c };
    }
  }
  for (const lm of landmarks) {
    const lmAr = cleanGeoToken(lm.nameAr);
    const lmEn = cleanGeoToken(lm.nameEn);
    const lmSlug = lm.slug.toLowerCase();
    if (cleanedTokens.some((t) => t === lmAr || t === lmEn || t === lmSlug)) {
      return { type: 'landmark' as const, entity: lm };
    }
  }
  return null;
}
