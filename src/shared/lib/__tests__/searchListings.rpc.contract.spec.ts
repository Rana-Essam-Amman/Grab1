/**
 * Server-side RPC contract specification.
 *
 * This file is an integration-test specification, not a live test.
 * It documents the expected behavior of public.search_listings() based on
 * the migration files in supabase/migrations/. It does NOT execute SQL and
 * must not be treated as evidence that PostgreSQL behaves correctly.
 *
 * Live verification is the responsibility of the separate Supabase engineer.
 *
 * Contract under inspection (as of Phase 1):
 * - Function: public.search_listings(p_query text, p_market text, p_limit integer, p_offset integer)
 * - Returns: SETOF public.listings
 * - Filters: status = 'active' AND (p_market IS NULL OR country_code = upper(p_market))
 * - Empty / whitespace query: returns no rows (early RETURN)
 * - Single-character path: search_chars containment when cardinality(v_chars) = 1
 * - Preferred path: build_prefix_tsquery + fts @@
 * - Trigram fallback (20261020): only when length(v_norm) >= 4 AND word_similarity > 0.5
 * - Final fallback: normalize_search_text(search_text) LIKE '%' || v_norm || '%'
 *
 * Product requirements that this specification tracks (unverified against live DB):
 *
 * 1. Prefix matching
 *    - "toy" should retrieve a listing whose searchable text contains "Toyota"
 *      if the prefix FTS path or the LIKE fallback fires.
 *    - Risk: prefix tsquery uses word:* so "toy" matches "toyota" only if the
 *      tokenized form starts with toy. Confirmed in migration logic for the
 *      FTS path; LIKE path also matches. Unverified live.
 *
 * 2. Middle-of-token and suffix matching
 *    - "yot", "yota", "ota" against "Toyota".
 *    - Prefix FTS (word:*) will not match a middle or suffix fragment.
 *    - Trigram path is gated to length >= 4 and similarity > 0.5 in the
 *      20261020 function. Short fragments may miss the trigram path and fall
 *      through to LIKE, which does support middle/suffix.
 *    - Hypothesis (unverified): short middle fragments rely entirely on the
 *      LIKE fallback and may be slow or incomplete if the function version
 *      deployed differs from 20261020.
 *
 * 3. Cross-script
 *    - "تويوتا" ↔ "Toyota", "كيا" ↔ "Kia", "كامري" ↔ "Camry".
 *    - V2 migration seeds search_synonyms with these pairs.
 *    - V3 migration introduces search_keywords with group_key expansion.
 *    - Whether the deployed trigger actually expands these into search_text
 *      for existing rows is unverified (depends on backfill).
 *
 * 4. Short-query false positives ("Sam" pattern)
 *    - Product rule: a 3-character query must not return unrelated listings
 *      solely because a permissive similarity threshold is exceeded.
 *    - 20261020 raises the trigram gate to length >= 4 and similarity > 0.5.
 *    - Remaining risk: the final LIKE fallback still matches any occurrence
 *      of the normalized substring, so "sam" will still match "Samsung" and
 *      "Sam" via LIKE even after the trigram tighten.
 *    - This is a confirmed logical gap in the migration source, not yet
 *      reproduced against a live database.
 *
 * 5. Market isolation and eligibility
 *    - p_market filters country_code.
 *    - Only status = 'active' is returned.
 *    - Pagination is limit/offset ordered by rank then created_at.
 *    - Duplicate elimination is not explicit; the function returns setof
 *      listings from a single SELECT, so duplicates are not expected from
 *      one call, but are unverified.
 *
 * 6. Numeric fragments
 *    - "2018" and model numbers should match if present in search_text.
 *    - normalize_search_text maps Arabic-Indic and Persian digits to Latin.
 *    - Unverified live.
 *
 * Required live verification SQL (for the Supabase engineer, not executed here):
 *
 *   -- Baseline recall probes
 *   select id, title from public.search_listings('toyota', 'JO', 20, 0);
 *   select id, title from public.search_listings('تويوتا', 'JO', 20, 0);
 *   select id, title from public.search_listings('yot', 'JO', 20, 0);
 *   select id, title from public.search_listings('ota', 'JO', 20, 0);
 *   select id, title from public.search_listings('sam', 'JO', 20, 0);
 *   select id, title from public.search_listings('2018', 'JO', 20, 0);
 *   select id, title from public.search_listings('kia', 'SA', 20, 0);
 *   select id, title from public.search_listings(' ', 'JO', 20, 0);
 *
 *   -- Eligibility
 *   select count(*) from public.search_listings('toyota', 'JO', 100, 0)
 *     where status <> 'active';  -- expect 0
 *
 * This specification is intentionally not a runnable Vitest case that mocks
 * the RPC. A mock would not prove PostgreSQL behavior.
 */

export const RPC_CONTRACT_SPEC_VERSION = 'phase-1-2026-10-11';

export const RPC_UNVERIFIED_HYPOTHESES = [
  'Prefix FTS matches Toyota for query "toy" when the deployed function is 20261020 or compatible.',
  'Middle/suffix fragments fall through to LIKE because trigram is length-gated at 4.',
  'LIKE fallback still produces the Sam/Samsung false-positive pattern.',
  'Cross-script aliases exist in search_synonyms but may not be present in search_text of existing rows without a backfill.',
  'Single-character path via search_chars may return a large unranked set.',
] as const;
