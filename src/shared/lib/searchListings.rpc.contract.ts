/**
 * Server-side RPC contract specification.
 *
 * This is not a Vitest file. It documents the expected behavior of
 * public.search_listings() from the migration source. It does not execute SQL
 * and must not be treated as evidence that PostgreSQL behaves correctly.
 *
 * Live verification is the responsibility of the separate Supabase engineer.
 *
 * Contract under inspection:
 * - Function: public.search_listings(p_query text, p_market text, p_limit integer, p_offset integer)
 * - Returns: SETOF public.listings
 * - Filters: status = 'active' AND (p_market IS NULL OR country_code = upper(p_market))
 * - Empty / whitespace query: returns no rows (early RETURN)
 * - Single-character path: search_chars containment when cardinality(v_chars) = 1
 * - Preferred path: build_prefix_tsquery + fts @@
 * - Trigram fallback (20261020): only when length(v_norm) >= 4 AND word_similarity > 0.5
 * - Final fallback: normalize_search_text(search_text) LIKE '%' || v_norm || '%'
 *
 * Unverified hypotheses:
 * 1. Prefix FTS can match "toy" to "toyota".
 * 2. Middle/suffix fragments miss prefix FTS and may fall through to LIKE.
 * 3. LIKE still matches "sam" inside "Samsung".
 * 4. Cross-script aliases may be absent from existing search_text without a backfill.
 * 5. Single-character search_chars path may return a large unranked set.
 * 6. Empty query returns no rows.
 */

export const RPC_CONTRACT_SPEC_VERSION = 'phase-2a-2026-10-11';

export const RPC_UNVERIFIED_HYPOTHESES = [
  'Prefix FTS matches Toyota for query "toy" when the deployed function is 20261020 or compatible.',
  'Middle/suffix fragments fall through to LIKE because trigram is length-gated at 4.',
  'LIKE fallback still produces the Sam/Samsung substring match.',
  'Cross-script aliases exist in search_synonyms but may not be present in search_text of existing rows without a backfill.',
  'Single-character path via search_chars may return a large unranked set.',
] as const;
