import { Listing } from '@/types';
import { normalizeArabic } from '@/data/arabicNormalize';

export const parsePrice = (p: unknown): number => Number(String(p).replace(/,/g, '').trim());

export const matchPrice = (item: Listing, min: number | null, max: number | null): boolean => {
  if (min === null && max === null) return true;
  const p = parsePrice(item.price);
  if (isNaN(p)) return true;
  return !((min !== null && min > 0 && p < min) || (max !== null && max > 0 && p > max));
};

export const matchNeighborhood = (item: Listing, target: string): boolean => {
  const t = target.trim().toLowerCase();
  const n = (item.neighborhood || '').trim().toLowerCase();
  const c = (item.city || '').trim().toLowerCase();
  return n === t || c === t || n.includes(t) || t.includes(n) || c.includes(t) || t.includes(c);
};

const SEARCH_STOP_WORDS = new Set([
  'في', 'من', 'على', 'الى', 'إلى', 'او', 'أو', 'و', 'مع', 'عن', 'هذا', 'هذه', 'ذلك',
  'a', 'an', 'the', 'of', 'in', 'on', 'at', 'with', 'for', 'and', 'or',
]);

const collectSearchStrings = (value: unknown, out: string[]): void => {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    const s = String(value);
    if (s) out.push(s);
    return;
  }
  if (Array.isArray(value)) {
    for (const v of value) collectSearchStrings(v, out);
    return;
  }
  if (value && typeof value === 'object') {
    for (const v of Object.values(value as Record<string, unknown>)) collectSearchStrings(v, out);
  }
};

export const scoreListing = (item: Listing, q: string): number => {
  const query = (q || '').trim();
  if (!query) return 1;

  const rawTokens = query.split(/\s+/).map((t) => normalizeArabic(t)).filter(Boolean);
  const tokens = rawTokens.filter((t) => t.length >= 2 && !SEARCH_STOP_WORDS.has(t));
  const effectiveTokens = tokens.length > 0 ? tokens : rawTokens.filter((t) => t.length >= 1);
  if (effectiveTokens.length === 0) return 1;

  const title = normalizeArabic(item.title || '');
  const desc = normalizeArabic(item.description || '');
  const catSlug = normalizeArabic(item.categorySlug || '');
  const subSlug = normalizeArabic(item.subcategorySlug || '');

  const itemObj = item as unknown as Record<string, unknown>;
  const otherStrings: string[] = [];
  collectSearchStrings(
    {
      city: item.city,
      neighborhood: item.neighborhood,
      price: item.price,
      currency: item.currency,
      make: itemObj.make,
      year: itemObj.year,
      attributes: itemObj.attributes,
      generated: itemObj.generated,
    },
    otherStrings
  );
  const other = normalizeArabic(otherStrings.join(' '));

  let score = 0;
  for (const t of effectiveTokens) {
    let tokenScore = 0;
    if (title.includes(t)) tokenScore += 10;
    if (catSlug.includes(t) || subSlug.includes(t)) tokenScore += 8;
    if (desc.includes(t)) tokenScore += 5;
    if (other.includes(t)) tokenScore += 3;
    if (tokenScore === 0) return 0;
    score += tokenScore;
  }
  return score;
};

export const matchSearch = (item: Listing, q: string): boolean => scoreListing(item, q) > 0;

export const countCityListings = (listings: Listing[], cityAr: string, cityEn: string): number =>
  listings.filter((l) => l.city === cityAr || l.city === cityEn || !l.city).length;

export const computeAdaptiveFilterMode = (userMode: 'city' | 'all' | null, cityCount: number, minDensity: number): 'city' | 'all' =>
  userMode !== null ? userMode : cityCount >= minDensity ? 'city' : 'all';

export const sortListingsByPriority = (a: Listing, b: Listing): number => {
  const aPrem = Boolean(a.isPremium);
  const bPrem = Boolean(b.isPremium);
  if (aPrem !== bPrem) return (bPrem ? 1 : 0) - (aPrem ? 1 : 0);
  const aTime = new Date(a.lastBumpedAt || a.createdAt || 0).getTime();
  const bTime = new Date(b.lastBumpedAt || b.createdAt || 0).getTime();
  return bTime - aTime;
};
