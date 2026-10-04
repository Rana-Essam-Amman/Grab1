/**
 * Reverse geocoding via Nominatim (OpenStreetMap).
 *
 * Free, no API key. Usage policy: 1 request/second.
 * Browsers send Referer automatically; that is sufficient for low volume.
 */

export interface ReverseGeocodeResult {
  readonly neighborhood: string | null;
}

export async function reverseGeocode(
  lat: number,
  lng: number,
  isArabic: boolean
): Promise<ReverseGeocodeResult> {
  try {
    const lang = isArabic ? 'ar' : 'en';
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?format=json&lat=${lat}&lon=${lng}` +
      `&zoom=16&addressdetails=1&accept-language=${lang}`;

    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return { neighborhood: null };

    const data = (await res.json()) as { address?: Record<string, string> };
    const addr = data.address || {};
    const raw =
      addr.suburb ||
      addr.neighbourhood ||
      addr.quarter ||
      addr.village ||
      addr.hamlet ||
      null;

    return { neighborhood: typeof raw === 'string' ? raw : null };
  } catch {
    return { neighborhood: null };
  }
}

/** Normalize Arabic/Latin text for fuzzy comparison. */
export function normalizeText(s: string): string {
  return s
    .replace(/[\u064B-\u065F\u0670]/g, '') // tashkeel
    .replace(/[\u0623\u0625\u0622\u0671]/g, '\u0627') // alef variants
    .replace(/\u0629/g, '\u0647') // taa marbuta
    .replace(/\u0649/g, '\u064A') // alef maqsura
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Match raw Nominatim value against a curated list (fuzzy). */
export function matchNeighborhood(
  raw: string | null,
  list: readonly string[]
): string | null {
  if (!raw) return null;
  const target = normalizeText(raw);
  return list.find((n) => normalizeText(n) === target) ?? null;
}
