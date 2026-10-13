import { useEffect, useMemo } from 'react';
import { useListingsStore } from '../store/listings.slice';
import { useUIStore } from '@/store/ui.slice';
import type { SearchListingsParams } from '../services/searchListings.types';

/**
 * Keeps listings in sync with the UI state:
 *   - browseCountryCode change → market sync (list RPC).
 *   - searchQuery change (non-empty) → hybrid search (FTS + semantic).
 *   - filter changes (category/price/attrs) → re-run hybrid search.
 *   - searchQuery cleared → fall back to market sync.
 *
 * Filters forwarded to the RPC: category, subcategory, price range, attrs.
 *
 * Deliberately NOT forwarded: city and neighborhood.
 * Reason: listing.city and listing.neighborhood are stored in Arabic for
 * many rows (e.g. "عمّان"), while the UI store exposes English names
 * ("Amman"). The RPC matches them with an exact (city) or LIKE
 * (neighborhood) comparison, which fails on script mismatch. Both are
 * applied client-side by useExploreListings via normalizeArabic, which
 * handles bilingual matching correctly.
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
  const attrsFilter = useUIStore((s) => s.attrsFilter);

  const searchParams: SearchListingsParams = useMemo(
    () => ({
      query: searchQuery ?? '',
      market: browseCountryCode,
      categorySlug: categoryFilter ?? subcategoryFilter ?? null,
      subcategorySlug: subcategoryFilter ?? null,
      minPrice: minPriceFilter,
      maxPrice: maxPriceFilter,
      city: null,
      neighborhood: null,
      attrs: attrsFilter,
    }),
    [
      searchQuery,
      browseCountryCode,
      categoryFilter,
      subcategoryFilter,
      minPriceFilter,
      maxPriceFilter,
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
