import type { Listing } from '@/types';
import { normalizeArabic } from '@/data/arabicNormalize';
import { filterListingsByMarket, MarketCode } from '@/shared/lib/marketGate';
import { matchPrice, matchNeighborhood, scoreListing, sortListingsByPriority } from '@/shared/lib/listingSearch';
import { getListingFields } from '@/data/listingFields';
import type { ListingFieldOption } from '@/data/listingFields/types';
import { getRangeFiltersFor } from '@/data/filterRanges';

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

function extractNumber(value: string): number | null {
  const s = String(value).trim();
  const m = s.match(/^(\d+(?:\.\d+)?)\s*[x×]\s*\d+(?:\.\d+)?$/i);
  const raw = m?.[1] ?? s.replace(/[^\d.-]/g, '').trim();
  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
}

function normalizeAttrValue(
  value: string,
  options?: readonly ListingFieldOption[],
  fieldType?: string,
): string {
  const trimmed = String(value).trim();
  if (fieldType === 'number') {
    const num = extractNumber(trimmed);
    if (num !== null) return String(num);
  }
  if (!options || options.length === 0) return trimmed.toLowerCase();
  const lower = trimmed.toLowerCase();
  const match = options.find(
    (o) =>
      o.value.toLowerCase() === lower ||
      o.labelEn.toLowerCase() === lower ||
      o.labelAr === trimmed,
  );
  return match ? match.value.toLowerCase() : lower;
}

export function filterListings(listings: Listing[], options: FilterListingsOptions): Listing[] {
  const {
    market, searchQuery = '', categorySlug = null, minPrice = null, maxPrice = null,
    neighborhood = null, cityAr = '', cityEn = '', filterMode = 'all', includeSold = false,
    sortBy = 'newest', attrs = {}, preserveOrder = false,
  } = options;

  // FIX: Always trim the search query, even if preserveOrder is true.
  const effectiveSearchQuery = searchQuery.trim();
  const isSearching = effectiveSearchQuery.length > 0;
  
  const scoped = market ? filterListingsByMarket(listings, market as MarketCode) : listings;
  const normCityAr = cityAr ? normalizeArabic(cityAr) : '';
  const normCityEn = cityEn ? normalizeArabic(cityEn) : '';

  const scored = scoped
    .filter((item) => {
      if (!includeSold && (item.status === 'sold' || item.status === 'archived')) return false;
      if (categorySlug && item.categorySlug !== categorySlug && item.subcategorySlug !== categorySlug) return false;
      if (!matchPrice(item, minPrice, maxPrice)) return false;
      if (neighborhood && !matchNeighborhood(item, neighborhood)) return false;

      const list = Array.isArray(item.attributes) ? item.attributes : [];
      const fields = getListingFields(item.categorySlug, item.subcategorySlug);
      const rangeFilters = getRangeFiltersFor(item.categorySlug, item.subcategorySlug);
      const rangeKeys = new Set(rangeFilters.map((rf) => rf.filterKey));

      for (const [k, v] of Object.entries(attrs)) {
        if (!v || rangeKeys.has(k)) continue;
        const field = fields.find((f) => f.key === k);

        if (field?.type === 'text') {
          const filterLower = v.toLowerCase().trim();
          const hasMatch = list.some(
            (a) => a.key === k && String(a.value).toLowerCase().includes(filterLower),
          );
          if (!hasMatch) return false;
          continue;
        }

        if (field?.multiSelect) { const fv = v.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean); if (!list.some((a) => a.key === k && fv.includes(String(a.value).toLowerCase()))) return false; continue; }

        const filterNorm = normalizeAttrValue(v, field?.options, field?.type);
        const hasMatch = list.some((a) => {
          if (a.key !== k) return false;
          return normalizeAttrValue(String(a.value), field?.options, field?.type) === filterNorm;
        });
        if (!hasMatch) return false;
      }

      for (const rf of rangeFilters) {
        const selected = attrs[rf.filterKey];
        if (!selected) continue;
        const step = rf.steps.find((s) => s.value === selected);
        if (!step) continue;
        const attrValue = list.find((a) => a.key === rf.attrKey);
        if (!attrValue) return false;
        const numValue = extractNumber(String(attrValue.value));
        if (numValue === null) return false;
        const minOk = step.isFirst ? numValue >= step.min : numValue > step.min;
        if (!minOk) return false;
        if (step.max !== null && numValue > step.max) return false;
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
      return Boolean(
        (normCityAr && (c === normCityAr || c.includes(normCityAr))) ||
        (normCityEn && (c === normCityEn || c.includes(normCityEn))),
      );
    });

  if (preserveOrder) return scored.map((s) => s.item);

  if (isSearching) {
    return [...scored]
      .sort((a, b) =>
        b.score !== a.score ? b.score - a.score : sortListingsByPriority(a.item, b.item),
      )
      .map((s) => s.item);
  }
  const items = scored.map((s) => s.item);
  if (sortBy === 'price-asc') return [...items].sort((a, b) => Number(a.price) - Number(b.price));
  if (sortBy === 'price-desc') return [...items].sort((a, b) => Number(b.price) - Number(a.price));
  return [...items].sort(sortListingsByPriority);
}
