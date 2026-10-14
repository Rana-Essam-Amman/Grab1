import type { Listing } from '@/types';
import { supabase } from '@/shared/lib/supabase';
import { rowToListing } from './listingsMapper';
import {
  LISTINGS_PAGE_SIZE,
  type SearchListingsParams,
} from './listingsService';
import {
  fetchQueryVector,
  detectCategory,
  attrsToJsonbArray,
} from './searchListingsHybrid.helpers';

const MAX_COSINE_DISTANCE = 0.85;
const FTS_DOMINANT_MIN_RESULTS = 1;
const SHORT_QUERY_MAX_LENGTH = 4;

/**
 * FTS-dominant hybrid search with query-intent category + full filters.
 *
 * Flow:
 *   1. detect_query_category(query) — maps Arabic/English keywords to a
 *      category_slug (e.g. "سيارات" → "motors"). NULL when no match.
 *   2. Short queries (≤ 4 chars, typing prefixes): FTS-dominant via
 *      search_listings_v2_intent_typo. If ≥ 1 result → return immediately.
 *   3. All other queries (≥ 5 chars): hybrid path — FTS + semantic fused
 *      by RRF. Required for descriptive queries (Group F) where FTS-only
 *      returns weak literal matches. Short prefixes (< 5 chars) skip
 *      embed-query to avoid cache pollution.
 *
 * Safety: PostgREST rejects JS null for extensions.vector. When the vector
 * is unavailable, p_query_vector is omitted so SQL DEFAULT NULL applies
 * and the RPC degrades to FTS-only.
 */
export async function searchListingsHybrid(
  params: SearchListingsParams,
): Promise<{ data: Listing[] | null; error: string | null }> {
  try {
    const {
      query, market, offset = 0, limit = LISTINGS_PAGE_SIZE,
      categorySlug = null, subcategorySlug = null,
      minPrice = null, maxPrice = null,
      city = null, neighborhood = null, attrs,
    } = params;
    const trimmed = query.trim();
    if (trimmed.length === 0) return { data: [], error: null };

    const categoryHint = await detectCategory(trimmed);
    const effectiveCategory = categorySlug ?? categoryHint;
    const attrsJson = attrsToJsonbArray(attrs);

    const filterArgs = {
      p_category_slug: effectiveCategory,
      p_subcategory_slug: subcategorySlug,
      p_min_price: minPrice,
      p_max_price: maxPrice,
      p_city: city,
      p_neighborhood: neighborhood,
      p_attrs: attrsJson,
    };

    // Step 1: FTS-dominant check ONLY for short typing prefixes.
    // Longer queries skip this so hybrid (semantic) runs — required for
    // descriptive queries where FTS-only returns weak literal matches.
    if (trimmed.length <= SHORT_QUERY_MAX_LENGTH) {
      const { data: ftsData, error: ftsError } = await supabase.rpc('search_listings_v2_intent_typo', {
        p_query: trimmed,
        p_market: market ?? null,
        p_limit: limit,
        p_offset: offset,
        ...filterArgs,
      });
      if (!ftsError) {
        const ftsListings: Listing[] = (ftsData || []).map(rowToListing);
        if (ftsListings.length >= FTS_DOMINANT_MIN_RESULTS) {
          return { data: ftsListings, error: null };
        }
      }
    }

    // Step 2: Hybrid path (FTS + semantic fused by RRF, filtered).
    // Short prefixes (< 5 chars) skip embed-query to avoid cache pollution;
    // they run hybrid without a vector and degrade to FTS-only inside SQL.
    if (trimmed.length < 5) {
      const { data, error } = await supabase.rpc('search_listings_hybrid', {
        p_query: trimmed,
        p_market: market ?? null,
        p_limit: limit,
        p_offset: offset,
        p_max_distance: MAX_COSINE_DISTANCE,
        p_category_hint: effectiveCategory,
        ...filterArgs,
      });
      if (error) return { data: null, error: error.message };
      return { data: (data || []).map(rowToListing), error: null };
    }

    const vector = await fetchQueryVector(trimmed);

    const rpcArgs: Record<string, unknown> = {
      p_query: trimmed,
      p_market: market ?? null,
      p_limit: limit,
      p_offset: offset,
      p_max_distance: MAX_COSINE_DISTANCE,
      p_category_hint: effectiveCategory,
      ...filterArgs,
    };
    if (vector) {
      rpcArgs.p_query_vector = `[${vector.join(',')}]`;
    }

    const { data, error } = await supabase.rpc('search_listings_hybrid', rpcArgs);
    if (error) return { data: null, error: error.message };
    return { data: (data || []).map(rowToListing), error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
