import type { Listing } from '@/types';
import { supabase } from '@/shared/lib/supabase';
import { rowToListing } from './listingsMapper';
import {
  LISTINGS_PAGE_SIZE,
  type SearchListingsParams,
} from './listingsService';

/**
 * Semantic search helper.
 *
 * Flow: text query → embed-query edge function (Jina AI) → 384-dim vector
 * → search_listings_semantic RPC (pure-SQL cosine).
 *
 * Gated on query length >= 3, matching search_listings. Used as a fallback
 * when FTS returns zero results (see listings.slice.pagination.ts).
 */
export async function searchListingsSemantic(
  params: SearchListingsParams,
): Promise<{ data: Listing[] | null; error: string | null }> {
  try {
    const { query, market, offset = 0, limit = LISTINGS_PAGE_SIZE } = params;
    const trimmed = query.trim();
    if (trimmed.length < 3) return { data: [], error: null };

    const supaUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
    if (!supaUrl || !anonKey) return { data: null, error: 'missing env' };

    const res = await fetch(`${supaUrl}/functions/v1/embed-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      },
      body: JSON.stringify({ query: trimmed }),
    });
    if (!res.ok) return { data: null, error: `embed-query HTTP ${res.status}` };

    const payload = (await res.json()) as { embedding?: unknown };
    const embedding = payload.embedding;
    if (!Array.isArray(embedding) || embedding.length !== 384) {
      return { data: null, error: 'invalid embedding shape' };
    }

    const vectorLiteral = `[${embedding.join(',')}]`;
    const { data, error } = await supabase.rpc('search_listings_semantic', {
      p_query_vector: vectorLiteral,
      p_market: market ?? null,
      p_limit: limit,
      p_offset: offset,
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
