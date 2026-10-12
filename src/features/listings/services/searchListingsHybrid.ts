import type { Listing } from '@/types';
import { supabase } from '@/shared/lib/supabase';
import { rowToListing } from './listingsMapper';
import {
  LISTINGS_PAGE_SIZE,
  type SearchListingsParams,
} from './listingsService';

const MAX_COSINE_DISTANCE = 0.85;
const HYBRID_TIMEOUT_MS = 4000;

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
 * Hybrid FTS + semantic search using Reciprocal Rank Fusion.
 *
 * Flow:
 *   1. embed-query edge function → 384-dim vector (or null on failure).
 *   2. search_listings_hybrid RPC → fused results.
 *   3. If embed-query fails, the RPC falls back to FTS-only.
 *
 * The edge function caches query vectors in search_query_embeddings, so
 * repeated queries skip the Jina round-trip.
 */
export async function searchListingsHybrid(
  params: SearchListingsParams,
): Promise<{ data: Listing[] | null; error: string | null }> {
  try {
    const { query, market, offset = 0, limit = LISTINGS_PAGE_SIZE } = params;
    const trimmed = query.trim();
    if (trimmed.length === 0) return { data: [], error: null };

    if (trimmed.length < 3) {
      const { data, error } = await supabase.rpc('search_listings_hybrid', {
        p_query: trimmed,
        p_query_vector: null,
        p_market: market ?? null,
        p_limit: limit,
        p_offset: offset,
        p_max_distance: MAX_COSINE_DISTANCE,
      });
      if (error) return { data: null, error: error.message };
      return { data: (data || []).map(rowToListing), error: null };
    }

    const vector = await fetchQueryVector(trimmed);
    const vectorLiteral = vector ? `[${vector.join(',')}]` : null;

    const { data, error } = await supabase.rpc('search_listings_hybrid', {
      p_query: trimmed,
      p_query_vector: vectorLiteral,
      p_market: market ?? null,
      p_limit: limit,
      p_offset: offset,
      p_max_distance: MAX_COSINE_DISTANCE,
    });
    if (error) return { data: null, error: error.message };
    return { data: (data || []).map(rowToListing), error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
