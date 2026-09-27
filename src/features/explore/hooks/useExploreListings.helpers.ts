import { Listing } from '@/types';
import { normalizeArabic } from '@/data/arabicNormalize';

export const parsePrice = (p: unknown): number => Number(String(p).replace(/,/g, '').trim());

export const matchPrice = (item: Listing, min: number | null, max: number | null): boolean => {
  if (min === null && max === null) return true;
  const p = parsePrice(item.price);
  if (isNaN(p)) return true;
  if (min !== null && min > 0 && p < min) return false;
  if (max !== null && max > 0 && p > max) return false;
  return true;
};

export const matchNeighborhood = (item: Listing, target: string): boolean => {
  const t = target.trim().toLowerCase();
  const n = (item.neighborhood || '').trim().toLowerCase();
  const c = (item.city || '').trim().toLowerCase();
  return n === t || c === t || n.includes(t) || t.includes(n) || c.includes(t) || t.includes(c);
};

const collectStrings = (value: unknown, out: string[]): void => {
  if (typeof value === 'string') {
    if (value) out.push(value);
    return;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    out.push(String(value));
    return;
  }
  if (Array.isArray(value)) {
    for (const v of value) collectStrings(v, out);
    return;
  }
  if (value && typeof value === 'object') {
    for (const v of Object.values(value as Record<string, unknown>)) {
      collectStrings(v, out);
    }
  }
};

export const scoreListing = (item: Listing, q: string): number => {
  const query = (q || '').trim();
  if (!query) return 1;
  const tokens = query
    .split(/\s+/)
    .map((t) => normalizeArabic(t))
    .filter((t) => t.length >= 1);
  if (tokens.length === 0) return 1;

  const title = normalizeArabic(item.title || '');
  const desc = normalizeArabic(item.description || '');
  const catSlug = normalizeArabic(item.categorySlug || '');
  const subSlug = normalizeArabic(item.subcategorySlug || '');
  const city = normalizeArabic(item.city || '');
  const nbhd = normalizeArabic(item.neighborhood || '');

  const itemObj = item as unknown as Record<string, unknown>;
  const otherStrings: string[] = [];
  collectStrings(
    {
      make: itemObj.make,
      year: itemObj.year,
      attributes: itemObj.attributes,
      generated: itemObj.generated,
    },
    otherStrings
  );
  const other = normalizeArabic(otherStrings.join(' '));

  let score = 0;
  for (const t of tokens) {
    if (!t) continue;
    if (title.includes(t)) score += 10;
    if (catSlug.includes(t) || subSlug.includes(t)) score += 8;
    if (city.includes(t) || nbhd.includes(t)) score += 6;
    if (desc.includes(t)) score += 5;
    if (other.includes(t)) score += 3;
  }
  return score;
};

export const matchSearch = (item: Listing, q: string): boolean =>
  scoreListing(item, q) > 0;

export const countCityListings = (
  listings: Listing[],
  cityAr: string,
  cityEn: string
): number =>
  listings.filter((l) => l.city === cityAr || l.city === cityEn || !l.city).length;

export const computeAdaptiveFilterMode = (
  userMode: 'city' | 'all' | null,
  cityCount: number,
  minDensity: number
): 'city' | 'all' =>
  userMode !== null ? userMode : cityCount >= minDensity ? 'city' : 'all';

export const sortListingsByPriority = (a: Listing, b: Listing): number => {
  const aPrem = Boolean(a.isPremium);
  const bPrem = Boolean(b.isPremium);
  if (aPrem !== bPrem) return (bPrem ? 1 : 0) - (aPrem ? 1 : 0);
  const aTime = new Date(a.lastBumpedAt || a.createdAt || 0).getTime();
  const bTime = new Date(b.lastBumpedAt || b.createdAt || 0).getTime();
  return bTime - aTime;
};
