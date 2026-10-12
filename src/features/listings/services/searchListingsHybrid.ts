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

/**
 * FTS-dominant hybrid search.
 *
 * Strategy:
 *   1. Try FTS (search_listings) first.
 *   2. If FTS returns at least FTS_DOMINANT_MIN_RESULTS → return FTS only.
 *      Prevents semantic fallback from polluting exact queries with
 *      weakly-related listings (e.g. "شقة" no longer returns a Samsung TV).
 *   3. Otherwise → full RRF hybrid: fetch the query vector and call
 *      search_listings_hybrid. Preserves semantic power for descriptive
 *      queries ("سيارة عائلية") and non-literal matches ("روليكس" → "Rolex").
 *
 * PostgREST cannot cast a JS null to extensions.vector; the request fails
 * with 400. When the vector is unavailable we omit the argument entirely
 * so the SQL DEFAULT NULL applies.
 */
export async function searchListingsHybrid(
  params: SearchListingsParams,
): Promise<{ data: Listing[] | null; error: string | null }> {
  try {
    const { query, market, offset = 0, limit = LISTINGS_PAGE_SIZE } = params;
    const trimmed = query.trim();
    if (trimmed.length === 0) return { data: [], error: null };

    // Step 1: FTS-dominant check.
    const { data: ftsData, error: ftsError } = await supabase.rpc('search_listings', {
      p_query: trimmed,
      p_market: market ?? null,
      p_limit: limit,
      p_offset: offset,
    });
    if (!ftsError) {
      const ftsListings = (ftsData || []).map(rowToListing);
      if (ftsListings.length >= FTS_DOMINANT_MIN_RESULTS) {
        return { data: ftsListings, error: null };
      }
    }

    // Step 2: Hybrid path (FTS + semantic fused by RRF).
    if (trimmed.length < 3) {
      const { data, error } = await supabase.rpc('search_listings_hybrid', {
        p_query: trimmed,
        p_market: market ?? null,
        p_limit: limit,
        p_offset: offset,
        p_max_distance: MAX_COSINE_DISTANCE,
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
