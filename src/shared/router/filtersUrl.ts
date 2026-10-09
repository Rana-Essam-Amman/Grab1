import { useUIStore } from '@/store/ui.slice';
import { parseFilterParams, buildFilterQuery } from './filterParams';
import type { SortBy } from './filterParams';

/**
 * Sync store ↔ URL for filter query params.
 * Path carries {market}/{category-or-subcategory}; query carries the rest.
 * Only runs when the current screen is 'main' (explore) — other screens
 * (filters page, messages, etc.) must not have their URLs polluted.
 */

export function syncStoreFromFilterUrl(search: string): void {
  const parsed = parseFilterParams(new URLSearchParams(search));
  const store = useUIStore.getState();

  const nextMin: number | null = parsed.minPrice;
  const nextMax: number | null = parsed.maxPrice;
  const nextNeigh: string | null = parsed.neighborhood;
  const nextSort: SortBy = parsed.sortBy;

  if (
    nextMin === store.minPriceFilter &&
    nextMax === store.maxPriceFilter &&
    nextNeigh === store.neighborhoodFilter &&
    nextSort === store.sortBy
  ) {
    return;
  }

  useUIStore.setState({
    minPriceFilter: nextMin,
    maxPriceFilter: nextMax,
    neighborhoodFilter: nextNeigh,
    sortBy: nextSort,
  });
}

export function buildFilterQueryFromStore(): string {
  const store = useUIStore.getState();
  return buildFilterQuery({
    subcategory: null,
    minPrice: store.minPriceFilter,
    maxPrice: store.maxPriceFilter,
    city: null,
    neighborhood: store.neighborhoodFilter,
    sortBy: store.sortBy,
  });
}
