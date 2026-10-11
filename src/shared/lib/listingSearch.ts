import type { Listing } from '@/types';

export { scoreListing, matchSearch } from './listingSearch.scoring';

export const parsePrice = (p: unknown): number =>
  Number(String(p).replace(/,/g, '').trim());

export const matchPrice = (
  item: Listing,
  min: number | null,
  max: number | null,
): boolean => {
  if (min === null && max === null) return true;

  const p = parsePrice(item.price);
  if (isNaN(p)) return true;

  return !(
    (min !== null && min > 0 && p < min) ||
    (max !== null && max > 0 && p > max)
  );
};

export const matchNeighborhood = (
  item: Listing,
  target: string,
): boolean => {
  const t = target.trim().toLowerCase();
  // Empty target matches nothing — avoid false positives from ''.includes / includes('')
  if (t.length === 0) return false;

  const n = (item.neighborhood || '').trim().toLowerCase();
  const c = (item.city || '').trim().toLowerCase();

  const matchesField = (field: string): boolean =>
    field.length > 0 && (field === t || field.includes(t) || t.includes(field));

  return matchesField(n) || matchesField(c);
};

const PREMIUM_BOOST_MS = 3 * 60 * 60 * 1000;

export const sortListingsByPriority = (
  a: Listing,
  b: Listing,
): number => {
  const aBase = new Date(a.lastBumpedAt || a.createdAt || 0).getTime();
  const bBase = new Date(b.lastBumpedAt || b.createdAt || 0).getTime();

  const aEffective = aBase + (a.isPremium ? PREMIUM_BOOST_MS : 0);
  const bEffective = bBase + (b.isPremium ? PREMIUM_BOOST_MS : 0);

  return bEffective - aEffective;
};
