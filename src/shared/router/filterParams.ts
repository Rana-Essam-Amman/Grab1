import { categories } from '@/data/categories';
import { findSubcategoryBySlug } from '@/data/subcategories';

export type SortBy = 'newest' | 'price-asc' | 'price-desc';

export interface FilterParams {
  readonly subcategory: string | null;
  readonly minPrice: number | null;
  readonly maxPrice: number | null;
  readonly city: string | null;
  readonly neighborhood: string | null;
  readonly sortBy: SortBy;
  readonly attrs: Record<string, string>;
}

const ATTR_PREFIX = 'f_';

const CATEGORY_SLUGS = new Set<string>(categories.map((c) => c.slug));

/** Parse filter params from a URLSearchParams-like object. */
export function parseFilterParams(search: URLSearchParams): FilterParams {
  const subRaw = search.get('sub');
  const minRaw = search.get('min');
  const maxRaw = search.get('max');
  const cityRaw = search.get('city');
  const neighRaw = search.get('neigh');
  const sortRaw = search.get('sort');

  const subcategory = subRaw && findSubcategoryBySlug(subRaw) ? subRaw : null;

  const minPrice = minRaw !== null && /^\d+$/.test(minRaw) ? Number(minRaw) : null;
  const maxPrice = maxRaw !== null && /^\d+$/.test(maxRaw) ? Number(maxRaw) : null;

  const sortBy: SortBy =
    sortRaw === 'price-asc' || sortRaw === 'price-desc' ? sortRaw : 'newest';

  const attrs: Record<string, string> = {};
  search.forEach((value, key) => {
    if (key.startsWith(ATTR_PREFIX) && value.trim()) {
      attrs[key.slice(ATTR_PREFIX.length)] = value;
    }
  });

  return {
    subcategory,
    minPrice,
    maxPrice,
    city: cityRaw && cityRaw.trim() ? cityRaw.trim() : null,
    neighborhood: neighRaw && neighRaw.trim() ? neighRaw.trim() : null,
    sortBy,
    attrs,
  };
}

/** Build a query string from filter params (omits defaults). */
export function buildFilterQuery(f: FilterParams): string {
  const parts: string[] = [];
  if (f.subcategory) parts.push(`sub=${encodeURIComponent(f.subcategory)}`);
  if (f.minPrice !== null) parts.push(`min=${f.minPrice}`);
  if (f.maxPrice !== null) parts.push(`max=${f.maxPrice}`);
  if (f.city) parts.push(`city=${encodeURIComponent(f.city)}`);
  if (f.neighborhood) parts.push(`neigh=${encodeURIComponent(f.neighborhood)}`);
  if (f.sortBy && f.sortBy !== 'newest') parts.push(`sort=${f.sortBy}`);
  for (const [key, value] of Object.entries(f.attrs)) {
    if (value) parts.push(`${ATTR_PREFIX}${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }
  return parts.length > 0 ? '?' + parts.join('&') : '';
}

/** True if any filter is active (beyond defaults). */
export function hasActiveFilters(f: FilterParams): boolean {
  return Boolean(
    f.subcategory || f.minPrice !== null || f.maxPrice !== null ||
    f.city || f.neighborhood || (f.sortBy && f.sortBy !== 'newest') ||
    Object.keys(f.attrs).length > 0
  );
}

export function isKnownCategory(slug: string): boolean {
  return CATEGORY_SLUGS.has(slug);
}
