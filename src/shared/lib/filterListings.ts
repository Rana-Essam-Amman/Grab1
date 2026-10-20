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
  readonly sortBy?: 'newest' | 'price-asc' | 'price-desc';
  readonly attrs?: Record<string, string>;
  readonly preserveOrder?: boolean;
}

export function filterListings(listings: Listing[], options: FilterListingsOptions): Listing[] {
  const {
    market, searchQuery = '', categorySlug = null, minPrice = null, maxPrice = null,
    neighborhood = null, cityAr = '', cityEn = '', filterMode = 'all', includeSold = false, sortBy = 'newest',
    attrs = {}, preserveOrder = false,
  } = options;

  const effectiveSearchQuery = preserveOrder ? '' : searchQuery.trim();
  const isSearching = effectiveSearchQuery.length > 0;
  const scoped = market ? filterListingsByMarket(listings, market as MarketCode) : listings;
  const normCityAr = cityAr ? normalizeArabic(cityAr) : '';
  const normCityEn = cityEn ? normalizeArabic(cityEn) : '';
  const kmRange = attrs.km_range;

  const scored = scoped
    .filter((item) => {
      if (!includeSold && (item.status === 'sold' || item.status === 'archived')) return false;
      if (categorySlug && item.categorySlug !== categorySlug && item.subcategorySlug !== categorySlug) return false;
      if (!matchPrice(item, minPrice, maxPrice)) return false;
      if (neighborhood && !matchNeighborhood(item, neighborhood)) return false;

      const list = Array.isArray(item.attributes) ? item.attributes : [];
      for (const [k, v] of Object.entries(attrs)) {
        if (!v || k === 'km_range') continue;
        const hasMatch = list.some((a) => a.key === k && String(a.value) === v);
        if (!hasMatch) return false;
      }

      if (kmRange) {
        const kmAttribute = list.find((a) => a.key === 'km');
        if (kmAttribute) {
          const km = Number(String(kmAttribute.value).replace(/,/g, '').trim());
          if (!Number.isFinite(km)) return false;
          if (kmRange === '0-50000' && !(km >= 0 && km <= 50000)) return false;
          if (kmRange === '50000-100000' && !(km > 50000 && km <= 100000)) return false;
          if (kmRange === '100000-150000' && !(km > 100000 && km <= 150000)) return false;
          if (kmRange === '150000-plus' && !(km > 150000)) return false;
        }
      }
      return true;
    })
    .map((item) => ({
      item,
      score: isSearching ? scoreListing(item, effectiveSearchQuery) : 1,
    }))
    .filter(({ score }) => (isSearching ? score > 0 : true))
    .filter(({ item }) => {
      if (isSearching) return true;
      if (filterMode !== 'city') return true;
      const c = normalizeArabic(item.city || '');
      if (!c) return false;
      const match =
        (normCityAr && (c === normCityAr || c.includes(normCityAr))) ||
        (normCityEn && (c === normCityEn || c.includes(normCityEn)));
      return Boolean(match);
    });

  if (preserveOrder) {
    return scored.map((s) => s.item);
  }

  if (isSearching) {
    return [...scored]
      .sort((a, b) => (b.score !== a.score ? b.score - a.score : sortListingsByPriority(a.item, b.item)))
      .map((s) => s.item);
  }
  const items = scored.map((s) => s.item);
  if (sortBy === 'price-asc') return [...items].sort((a, b) => Number(a.price) - Number(b.price));
  if (sortBy === 'price-desc') return [...items].sort((a, b) => Number(b.price) - Number(a.price));
  return [...items].sort(sortListingsByPriority);
}
