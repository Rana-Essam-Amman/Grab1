# FOX Marketplace — Search Relevance Evaluation

**Phase 1 baseline, updated for Phase 2A client fixes.**

**Repository:** Rana-Essam-Amman/Grab1  
**Branch:** main  
**Related baseline:** `docs/search/architecture-and-baseline.md`

## Scope and separation

| Layer | What is tested | Evidence status |
|-------|----------------|-----------------|
| Client helpers | `scoreListing` / `matchSearch` in `src/shared/lib/listingSearch.ts` against in-memory fixtures | Runnable Vitest suite. |
| Server RPC | `public.search_listings(...)` as defined in migrations | Contract specification only. **Not executed against a live database.** |

## Phase 2A — client short-query policy

Root cause of the Phase 1 client defects:

- `scoreListing` treated an empty or whitespace query as score `1` for every listing.
- Tokens shorter than 3 characters fell through to `includes()`, so `s` and `sa` matched many unrelated titles.
- Callers already separate browsing from search: `filterListings` only calls `scoreListing` when `searchQuery.trim().length > 0`.

Chosen policy:

- Minimum token length after normalization is 3.
- Tokens shorter than 3 are ignored. A query with no token of length >= 3 scores 0 and is not a match.
- Empty string, whitespace-only, and stop-word-only queries score 0.
- Tokens of length >= 3 keep prefix, middle, and suffix substring matching. `Sam` still matches `Samsung` (prefix) and an exact `Sam` token. `toy` / `yot` / `ota` still match `Toyota`.
- Browsing stays on the existing non-search path in `filterListings`.
- `scoreListing` does not enforce listing status. `filterListings` already excludes sold/archived unless `includeSold`. Authoritative eligibility remains with the server.

## Evaluation dataset

Fixtures: `src/shared/lib/__tests__/listingSearch.evaluation.fixtures.ts` (10 listings, 19 cases).

## Client behavior after Phase 2A

- `s` and `sa` match nothing.
- `Sam` matches the Samsung listing and the exact-token Sam listing, not unrelated listings.
- `samsung` matches Samsung and not the Sam table.
- Empty, whitespace, and stop-word-only queries score 0.
- Prefix / middle / suffix of Toyota, Arabic/English same-script matches, numeric year, multi-term, and phonetic Toyota/تويوتا remain supported.
- Pending listings are still scored by the helper. That is intentional. Eligibility is not this helper's job.

## Server RPC — still unverified

Documented in `src/shared/lib/searchListings.rpc.contract.ts` (not a Vitest file). Hypotheses only:

1. Prefix FTS can match "toy" → "toyota" on the 20261020 function.
2. Middle and suffix fragments miss the prefix-FTS path and may fall through to `LIKE`.
3. The `LIKE` fallback still produces short-substring matches such as "sam" → "Samsung".
4. Cross-script pairs exist in synonym/keyword tables but may be absent from existing `search_text` without a backfill.
5. Single-character path via `search_chars` may return a large unranked set.
6. Empty query returns no rows on the server.

No SQL was changed in Phase 2A. No live RPC was executed.

### Verification SQL for the Supabase engineer (not executed)

```sql
select id, title from public.search_listings('toyota', 'JO', 20, 0);
select id, title from public.search_listings('تويوتا', 'JO', 20, 0);
select id, title from public.search_listings('yot', 'JO', 20, 0);
select id, title from public.search_listings('ota', 'JO', 20, 0);
select id, title from public.search_listings('sam', 'JO', 20, 0);
select id, title from public.search_listings('2018', 'JO', 20, 0);
select id, title from public.search_listings('kia', 'SA', 20, 0);
select id, title from public.search_listings(' ', 'JO', 20, 0);
select count(*) from public.search_listings('toyota', 'JO', 100, 0) where status <> 'active';
```
