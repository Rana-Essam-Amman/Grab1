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
  checkRateLimit,
} from './searchListingsHybrid.helpers';
import { searchListingsV4 } from './searchListingsV4';

const MAX_COSINE_DISTANCE = 0.85;
const FTS_DOMINANT_MIN_RESULTS = 1;

/**
 * FTS-dominant hybrid search with query-intent category + full filters.
 *
 * Flow:
 *   0. Rate limit (frontend, 30/min). Rejects with a user-facing error.
 *   1. detect_query_category(query) — maps Arabic/English keywords to a
 *      category_slug (e.g. "سيارات" → "motors"). NULL when no match.
 *   2. search_listings_v4_exact. Exact matches are returned as results.
 *      Related matches are returned only when exact is empty.
 *   3. On v4 error only: fall back to v2_intent_typo, then hybrid.
 *
 * Safety: PostgREST rejects JS null for extensions.vector. When the vector
 * is unavailable, p_query_vector is omitted so SQL DEFAULT NULL applies
 * and the RPC degrades to FTS-only.
 */
export async function searchListingsHybrid(
  params: SearchListingsParams,
): Promise<{
  data: Listing[] | null;
  error: string | null;
  matchKind?: string;
  banner?: string | null;
  relatedHeader?: string | null;
  tier1Data?: Listing[];
  tier2Data?: Listing[];
}> {
  try {
    if (!checkRateLimit()) {
      return { data: null, error: 'Too many searches. Please wait a moment.' };
    }

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
    const attrsJson = attrsToJsonbArray(attrs, effectiveCategory, subcategorySlug);

    const filterArgs = {
      p_category_slug: effectiveCategory,
      p_subcategory_slug: subcategorySlug,
      p_min_price: minPrice,
      p_max_price: maxPrice,
      p_city: city,
      p_neighborhood: neighborhood,
      p_attrs: attrsJson,
    };

    const v4 = await searchListingsV4(trimmed, market, limit, offset, filterArgs);
    if (v4) {
      const hasTier1 = v4.tier1Data.length > 0;
      // Match the UI threshold: Tier 2 is only "shippable" when >= 2.
      // A single Tier 2 row would be hidden by the UI and would
      // otherwise suppress the v2_typo fallback.
      const hasTier2ForDisplay = v4.tier2Data.length >= 2;
      if (hasTier1 || hasTier2ForDisplay) return v4;
      if (offset > 0) return v4;
      // fall through to v2 typo fallback only when:
      //   - tier1 empty AND tier2 < 2 AND offset == 0
    }

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
