import type { Listing } from '@/types';
import { normalizeArabic } from '@/data/arabicNormalize';
import { filterListingsByMarket, MarketCode } from '@/shared/lib/marketGate';
import { matchPrice, matchNeighborhood, scoreListing, sortListingsByPriority } from '@/shared/lib/listingSearch';

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
  const isSearching = q.length > 0;

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
    .map((item) => ({
      item,
      score: isSearching ? scoreListing(item, q) : 1,
    }))
    .filter(({ score }) => (isSearching ? score > 0 : true))
    .filter(({ item }) => {
      if (isSearching) return true;
      if (filterMode !== 'city') return true;
      const c = normalizeArabic(item.city || '');
      if (!c) return true;
      const match =
        (normCityAr && (c === normCityAr || c.includes(normCityAr))) ||
        (normCityEn && (c === normCityEn || c.includes(normCityEn)));
      return Boolean(match);
    });

  if (isSearching) {
    return [...scored]
      .sort((a, b) => (b.score !== a.score ? b.score - a.score : sortListingsByPriority(a.item, b.item)))
      .map((s) => s.item);
  }
  return [...scored.map((s) => s.item)].sort(sortListingsByPriority);
}
