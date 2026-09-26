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

export const matchSearch = (item: Listing, q: string): boolean => {
  const query = normalizeArabic(q);
  if (!query) return true;

  const itemExt = item as unknown as { make?: string; year?: string };

  // Primary text fields
  const primary = [
    item.title || '',
    item.description || '',
    item.categorySlug || '',
    item.subcategorySlug || '',
    itemExt.make || '',
    itemExt.year || '',
    item.city || '',
    item.neighborhood || '',
  ];

  // Spec fields from generated.fields (make, model, color, etc.)
  const specValues: string[] = [];
  const generated = (item as unknown as { generated?: { fields?: readonly { value?: string }[] } }).generated;
  if (generated?.fields) {
    for (const f of generated.fields) {
      if (f.value) specValues.push(f.value);
    }
  }

  const haystack = normalizeArabic([...primary, ...specValues].join(' '));
  return haystack.includes(query);
};

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
