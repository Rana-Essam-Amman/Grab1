import { useEffect, useMemo } from 'react';
import { useListingsStore } from '../store/listings.slice';
import { useUIStore } from '@/store/ui.slice';
import type { SearchListingsParams } from '../services/searchListings.types';

/**
 * Keeps listings in sync with the UI state:
 *   - browseCountryCode change → market sync (list RPC).
 *   - searchQuery change (non-empty) → hybrid search (FTS + semantic).
 *   - filter changes (category/price/city/attrs) → re-run hybrid search.
 *   - searchQuery cleared → fall back to market sync.
 *
 * Search query is debounced at the screen level (ExploreScreen, 300ms).
 * Filters are read directly from the UI store and passed to the RPC so
 * pagination stays correct on the server.
 */
export function useSupabaseListingsSync(): void {
  const isInitialized = useListingsStore((s) => s.isInitialized);
  const syncFromSupabase = useListingsStore((s) => s.syncFromSupabase);
  const searchFromSupabase = useListingsStore((s) => s.searchFromSupabase);
  const browseCountryCode = useUIStore((s) => s.browseCountryCode);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const categoryFilter = useUIStore((s) => s.categoryFilter);
  const subcategoryFilter = useUIStore((s) => s.subcategoryFilter);
  const minPriceFilter = useUIStore((s) => s.minPriceFilter);
  const maxPriceFilter = useUIStore((s) => s.maxPriceFilter);
  const neighborhoodFilter = useUIStore((s) => s.neighborhoodFilter);
  const browseCityEn = useUIStore((s) => s.browseCityEn);
  const attrsFilter = useUIStore((s) => s.attrsFilter);

  const searchParams: SearchListingsParams = useMemo(
    () => ({
      query: searchQuery ?? '',
      market: browseCountryCode,
      categorySlug: categoryFilter ?? subcategoryFilter ?? null,
      subcategorySlug: subcategoryFilter ?? null,
      minPrice: minPriceFilter,
      maxPrice: maxPriceFilter,
      city: browseCityEn || null,
      neighborhood: neighborhoodFilter,
      attrs: attrsFilter,
    }),
    [
      searchQuery,
      browseCountryCode,
      categoryFilter,
      subcategoryFilter,
      minPriceFilter,
      maxPriceFilter,
      browseCityEn,
      neighborhoodFilter,
      attrsFilter,
    ],
  );

  useEffect(() => {
    if (!isInitialized) return;
    const trimmed = (searchQuery ?? '').trim();
    if (trimmed.length > 0) {
      void searchFromSupabase(searchParams);
    } else {
      void syncFromSupabase(browseCountryCode);
    }
  }, [
    isInitialized,
    browseCountryCode,
    searchQuery,
    searchParams,
    syncFromSupabase,
    searchFromSupabase,
  ]);
}
