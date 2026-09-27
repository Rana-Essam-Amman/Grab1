import type { Listing } from '@/types';
import { normalizeArabic } from '@/data/arabicNormalize';
import { searchCategories } from '@/data/searchIndex';
import { filterListingsByMarket, MarketCode } from '@/shared/lib/marketGate';
import { matchPrice, matchNeighborhood, scoreListing, sortListingsByPriority } from '@/features/explore/hooks/useExploreListings.helpers';

export interface FilterListingsOptions {
  readonly market: string;
  readonly searchQuery?: string;
  readonly categorySlug?: string | null;
  readonly minPrice?: number | null;
  readonly maxPrice?: number | null;
  readonly neighborhood?: string | null;
  readonly cityAr?: string;
  readonly cityEn?: string;
  readonly filterMode?: 'city' | 'all';
  readonly includeSold?: boolean;
}

export function filterListings(listings: Listing[], options: FilterListingsOptions): Listing[] {
  const {
    market, searchQuery = '', categorySlug = null, minPrice = null, maxPrice = null,
    neighborhood = null, cityAr = '', cityEn = '', filterMode = 'all', includeSold = false,
  } = options;

  const scoped = market ? filterListingsByMarket(listings, market as MarketCode) : listings;
  const q = searchQuery.trim();
  const matchedSlugs = q ? new Set(searchCategories(q).map((c) => c.slug)) : null;

  const normCityAr = cityAr ? normalizeArabic(cityAr) : '';
  const normCityEn = cityEn ? normalizeArabic(cityEn) : '';

  const scored = scoped
    .filter((item) => {
      if (!includeSold && (item.status === 'sold' || item.status === 'archived')) return false;
      if (categorySlug && item.categorySlug !== categorySlug && item.subcategorySlug !== categorySlug) return false;
      if (!matchPrice(item, minPrice, maxPrice)) return false;
      if (neighborhood && !matchNeighborhood(item, neighborhood)) return false;
      return true;
    })
    .map((item) => {
      if (!q) return { item, score: 1, categoryHit: false };
      const categoryHit = Boolean(matchedSlugs?.has(item.categorySlug));
      const score = categoryHit ? Math.max(scoreListing(item, q), 15) : scoreListing(item, q);
      return { item, score, categoryHit };
    })
    .filter(({ item, score, categoryHit }) => {
      if (q && !categoryHit && score <= 0) return false;
      if (!q && filterMode === 'city') {
        const c = normalizeArabic(item.city || '');
        const match = !c || (normCityAr && (c === normCityAr || c.includes(normCityAr))) || (normCityEn && (c === normCityEn || c.includes(normCityEn)));
        if (!match) return false;
      }
      return true;
    });

  if (q) {
    return [...scored]
      .sort((a, b) => b.score !== a.score ? b.score - a.score : sortListingsByPriority(a.item, b.item))
      .map((s) => s.item);
  }
  return [...scored.map((s) => s.item)].sort(sortListingsByPriority);
}
