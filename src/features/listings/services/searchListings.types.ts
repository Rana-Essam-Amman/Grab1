/**
 * Shared types for the search pipeline.
 *
 * Extracted from listingsService.ts to keep that file under Rule 14 (150
 * lines). Consumers continue to import SearchListingsParams from
 * '@/features/listings/services/listingsService' via re-export.
 */
export interface SearchListingsParams {
  readonly query: string;
  readonly market?: string;
  readonly offset?: number;
  readonly limit?: number;
  readonly categorySlug?: string | null;
  readonly subcategorySlug?: string | null;
  readonly minPrice?: number | null;
  readonly maxPrice?: number | null;
  readonly city?: string | null;
  readonly neighborhood?: string | null;
  readonly attrs?: Record<string, string>;
}
