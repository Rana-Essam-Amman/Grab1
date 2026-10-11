# FOX Marketplace — Search Architecture and Baseline

**Phase 0 deliverable** — Repository discovery only. No search logic changes.

**Repository:** Rana-Essam-Amman/Grab1  
**Branch:** main  
**Commit SHA (at inspection):** ac593445036e1db001e2e9801fb80b37f73c3e55  
**Date of inspection:** 2026-10-11

## 1. Verified Current Architecture

- Frontend: React 18 + TypeScript + Vite + Tailwind CSS v4 + Zustand.
- Backend: Supabase (PostgreSQL) with Row Level Security. Search is primarily server-side.
- Search is implemented as a PostgreSQL RPC function `search_listings(p_query, p_market, p_limit, p_offset)`.
- Client calls the RPC via `src/features/listings/services/listingsService.ts` → `searchListings()`.
- There is also a client-side scoring function in `src/shared/lib/listingSearch.ts` (`scoreListing` / `matchSearch`) used in some local/filter paths (e.g. explore listings with client filters).
- Multilingual support: Arabic normalization (`normalize_arabic`), synonym expansion (`search_synonyms` table), prefix stripping for Arabic articles, trigram similarity (`pg_trgm`), full-text search (`fts` column + `ts_rank_cd`).
- Markets: JO, SA, PS, LB, SY (country_code isolation).
- Listing visibility: only `status = 'active'` listings are returned by the RPC.

## 2. Actual Search Execution Flow

1. User types in SearchBar (e.g. `src/shared/components/SearchBar.tsx` or explore variants).
2. Query is passed to `searchListings({ query, market, offset, limit })`.
3. Supabase client calls `rpc('search_listings', { p_query, p_market, p_limit, p_offset })`.
4. Inside the current `search_listings` (as of migration `20261020_search_trigram_tighten.sql`):
   - Normalize query (`normalize_search_text` / `normalize_arabic`).
   - Expand keywords via `expand_search_keywords` (synonyms / search_keywords table).
   - Special case for single-character queries using `search_chars` array containment.
   - Prefer prefix FTS (`build_prefix_tsquery` + `fts @@`).
   - Fallback to trigram `word_similarity > 0.5` only for queries of length >= 4.
   - Final fallback: `LIKE '%' || v_norm || '%'` on normalized `search_text`.
5. Results are ordered by rank (FTS or similarity) then `created_at DESC`.
6. Pagination via `limit`/`offset`.
7. Results mapped client-side via `rowToListing`.

**Indexing:** Trigger `set_listings_search_text_trigger` (BEFORE INSERT OR UPDATE) populates `search_text` (and in V3 schema also `search_chars`, `search_version`) from title, description, city, neighborhood, category/subcategory labels, attributes, plus Arabic variants and synonyms.

## 3. Confirmed Defects

None fully confirmed by live reproduction in this phase (no live DB access). Hypotheses based on code:

- Short queries (1–3 chars) may over-match or under-match depending on the active function version.
- Trigram threshold and length gate may miss valid substring matches for short brand fragments (e.g. "yot" for Toyota).
- Cross-script matching relies on explicit synonym/keyword tables rather than automatic transliteration.
- Client-side `scoreListing` in `listingSearch.ts` uses different logic than the server RPC; divergence possible.

## 4. Potential Defects Requiring Further Reproduction

- Middle-of-token and suffix substring matching (product requirement) may not be fully satisfied by prefix FTS + restricted trigram.
- Arabic letter normalization completeness (tatweel, diacritics, Farsi variants) needs fixture testing.
- Pagination stability under concurrent updates or high result counts.
- Whether newly published listings are immediately searchable (depends on trigger firing and indexes being used).
- False positives on short queries despite the 20261020 tighten.

## 5. Performance Risks

- Unbounded `LIKE '%query%'` fallback can be expensive on large tables without proper indexes.
- Trigram GIN index helps but similarity thresholds affect candidate sets.
- Single-character path using `search_chars @>` may scan many rows if not selective.
- No explicit query length or complexity limits beyond the RPC's limit cap (100).

## 6. Security Concerns

- RPC is `SECURITY DEFINER`. Must ensure it does not bypass RLS incorrectly (current code filters `status = 'active'` and market).
- User-supplied query is normalized but still interpolated into `LIKE` and tsquery; sanitization exists but needs verification against injection edge cases.
- No private seller data appears to be in searchable fields from the trigger logic.

## 7. Current Test Results

- Vitest suite exists (reported 337 tests in README). No dedicated search unit tests found via code search.
- Playwright E2E: `e2e/golden-paths/search.spec.ts` and `ai-search.spec.ts` mock the RPC.
- No automated relevance evaluation fixtures or metrics (Recall@K, etc.) currently present.
- CI: `.github/workflows/ci.yml` runs typecheck, lint, tests.

## 8. Database Dependencies

- Tables: `listings` (columns: `search_text`, `fts`, `search_chars`, `search_version`, `status`, `country_code`, …), `search_category_labels`, `search_subcategory_labels`, `search_synonyms`, `search_keywords` (V3).
- Functions: `normalize_arabic`, `normalize_search_text`, `expand_search_keywords`, `search_character_array`, `build_prefix_tsquery`, `set_listings_search_text`, `search_listings`, `arabic_word_variants`, `expand_arabic_variants`, `search_json_values`.
- Indexes: GIN on `fts`, GIN trigram on `search_text`, GIN on `search_chars`.
- Trigger: `set_listings_search_text_trigger`.
- Migrations of note: `20261015_listings_fts.sql`, `20261016_search_v2_category_aware.sql`, `20261018_search_v3_schema.sql`, `20261019_search_v3_trigger.sql`, `20261020_search_trigram_tighten.sql`.
- Live database state is **not** verified in this phase (separate Supabase engineer responsibility).

## 9. Existing Behavior That Must Be Preserved

- Market isolation via `country_code`.
- Only active listings returned.
- Pagination contract (`limit`/`offset`).
- Response shape consumed by `rowToListing`.
- Authorization / RLS on listings table.
- Automatic indexing of new/updated listings via trigger.
- Existing synonym and category label expansions.

## 10. Recommended Implementation Sequence

Follow the mandated phases:

1. **Phase 1** — Build reproducible evaluation fixtures and regression tests covering partial matching, Arabic/English, short queries, market isolation.
2. **Phase 2** — Fix confirmed correctness bugs (short-query overmatching, missing substrings, normalization gaps) with tests.
3. **Phase 3** — Ensure data-driven automatic indexing and robust multilingual expansion without hardcoding brands.
4. Subsequent phases for ranking, semantic evaluation, performance/security, UI integration, and final readiness.

All database changes must be coordinated with the Supabase engineer via idempotent migrations and verification SQL.

---

*This document records only verified facts from repository inspection. Live database behavior is not asserted.*
