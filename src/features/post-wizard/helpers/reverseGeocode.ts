/**
 * Reverse geocoding via Nominatim (OpenStreetMap).
 *
 * Free, no API key. Usage policy: 1 request/second.
 * Returns MULTIPLE neighborhood candidates (suburb, neighbourhood, ...).
 */

export interface ReverseGeocodeResult {
  readonly candidates: readonly string[];
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
    if (!res.ok) return { candidates: [] };

    const data = (await res.json()) as { address?: Record<string, string> };
    const addr = data.address || {};
    const candidates = [
      addr.suburb,
      addr.neighbourhood,
      addr.quarter,
      addr.village,
      addr.hamlet,
    ].filter((s): s is string => typeof s === 'string' && s.length > 0);

    return { candidates };
  } catch {
    return { candidates: [] };
  }
}

/** Normalize Arabic/Latin text for fuzzy comparison. */
export function normalizeText(s: string): string {
  return s
    .replace(/^منطقة\s+/u, '')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[\u0623\u0625\u0622\u0671]/g, '\u0627')
    .replace(/\u0629/g, '\u0647')
    .replace(/\u0649/g, '\u064A')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Match first candidate that exists in curated list (fuzzy). */
export function matchNeighborhood(
  candidates: readonly string[],
  list: readonly string[]
): string | null {
  for (const raw of candidates) {
    const target = normalizeText(raw);
    const found = list.find((n) => normalizeText(n) === target);
    if (found) return found;
  }
  return null;
}
