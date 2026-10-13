import type { Listing } from '@/types';
import { supabase } from '@/shared/lib/supabase';
import { rowToListing } from './listingsMapper';
import {
  LISTINGS_PAGE_SIZE,
  type SearchListingsParams,
} from './listingsService';

const MAX_COSINE_DISTANCE = 0.85;
const HYBRID_TIMEOUT_MS = 4000;
const FTS_DOMINANT_MIN_RESULTS = 1;

async function fetchQueryVector(query: string): Promise<number[] | null> {
  const supaUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  if (!supaUrl || !anonKey) return null;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), HYBRID_TIMEOUT_MS);
    const res = await fetch(`${supaUrl}/functions/v1/embed-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const payload = (await res.json()) as { embedding?: unknown };
    const embedding = payload.embedding;
    if (!Array.isArray(embedding) || embedding.length !== 384) return null;
    return embedding as number[];
  } catch {
    return null;
  }
}

async function detectCategory(query: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('detect_query_category', {
      p_query: query,
    });
    if (error) return null;
    return typeof data === 'string' && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

function attrsToJsonbArray(
  attrs: Record<string, string> | undefined,
): Array<{ key: string; value: string }> | null {
  if (!attrs) return null;
  const entries = Object.entries(attrs).filter(([k, v]) => k && v);
  if (entries.length === 0) return null;
  return entries.map(([key, value]) => ({ key, value }));
}

/**
 * FTS-dominant hybrid search with query-intent category + full filters.
 *
 * Flow:
 *   1. detect_query_category(query) — maps Arabic/English keywords to a
 *      category_slug (e.g. "سيارات" → "motors"). NULL when no match.
 *   2. FTS (search_listings, 11-arg) with filters. If it returns at least
 *      one result → return those directly.
 *   3. Otherwise → search_listings_hybrid with the query vector + category
 *      hint + all filters. Both FTS and semantic branches are filtered
 *      before RRF fusion.
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

    // Step 1: FTS-dominant check (with filters).
    const { data: ftsData, error: ftsError } = await supabase.rpc('search_listings', {
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

    // Step 2: Hybrid path (FTS + semantic fused by RRF, filtered).
    if (trimmed.length < 3) {
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
