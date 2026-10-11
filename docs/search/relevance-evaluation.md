# FOX Marketplace — Search Relevance Evaluation

**Phase 1 deliverable** — Evaluation suite and baseline. No search implementation changes.

**Repository:** Rana-Essam-Amman/Grab1  
**Branch:** main  
**Related baseline:** `docs/search/architecture-and-baseline.md`

## Scope and separation

Two layers are evaluated separately. They must not be conflated.

| Layer | What is tested | Evidence status |
|-------|----------------|-----------------|
| Client helpers | `scoreListing` / `matchSearch` in `src/shared/lib/listingSearch.ts` against in-memory fixtures | Runnable Vitest suite. Actual results recorded below. |
| Server RPC | `public.search_listings(...)` as defined in migrations | Contract specification only. **Not executed against a live database.** A client mock is not treated as proof. |

## Evaluation dataset

Fixtures live in `src/shared/lib/__tests__/listingSearch.evaluation.fixtures.ts`.

### Listings (10)

| id | market | status | title (abridged) | purpose |
|----|--------|--------|------------------|---------|
| jo-toyota-camry-2018 | JO | active | Toyota Camry 2018 | English brand + model + year |
| jo-toyota-camry-ar | JO | active | تويوتا كامري 2018 | Arabic brand + model |
| sa-kia-cerato | SA | active | Kia Cerato 2020 | English Kia, other market |
| sa-kia-ar | SA | active | كيا سيراتو 2020 | Arabic Kia |
| jo-samsung-tv | JO | active | Samsung 55 inch TV | False-positive bait for "Sam" |
| jo-sam-the-seller | JO | active | Handmade wooden table by Sam | Incidental "Sam" |
| jo-draft-toyota | JO | pending | Toyota draft listing | Eligibility exclusion |
| ps-numeric-fragment | PS | active | iPhone 14 Pro Max | Numeric / model fragment |
| jo-punctuation | JO | active | Toyota, Camry — 2.5L | Punctuation / whitespace |
| lb-unrelated | LB | active | Apartment for rent in Beirut | Unrelated market |

### Cases (18)

Covered scenarios: exact English/Arabic brand, cross-script, prefix / middle / suffix, 1/2/3-character queries including the "Sam" pattern, numeric year, punctuation and whitespace, empty query, multi-term, market isolation, active-listing eligibility.

Each case records: query, market, expected relevant ids, expected exclusions, scenario, rationale, and `knownClientGap` where the current client helper is known not to meet the product requirement.

## Confirmed client-side defects (reproducible)

These are confirmed by the Vitest suite against the fixtures. They are properties of `listingSearch.ts`, not of the deployed RPC.

1. **Short-query overmatching ("Sam" pattern).**  
   Query `Sam` matches both `jo-samsung-tv` and `jo-sam-the-seller` because `scoreListing` uses `includes()` on normalized title/description. Same for `s` and `sa`.  
   Product requirement: controlled false positives for 1–3 character queries.

2. **Empty / whitespace query is non-selective.**  
   `scoreListing(item, '   ')` returns `1` for every listing, so `matchSearch` is true for all.  
   Product requirement: empty query should not present every listing as a search hit.

3. **No cross-script brand equivalence in the client synonym table.**  
   `arabicSynonyms.ts` has groups for generic terms (car, apartment, …) but not for Toyota/تويوتا, Kia/كيا, or Camry/كامري.  
   Result: `تويوتا` matches the Arabic listing only; `Toyota` matches the Latin listing only.

4. **Client helper does not enforce listing eligibility.**  
   A `status: 'pending'` Toyota listing still matches `Toyota`. Eligibility is a server concern; the client gap is recorded so callers do not assume the helper is a substitute for the RPC.

## Client-side behavior that currently meets the fixture requirement

- Exact English `Toyota` / `Camry` and Arabic `تويوتا` / `كامري` / `كيا` match the same-script listing.
- Prefix (`toy`), middle (`yot`), and suffix (`ota`) of "Toyota" match via `includes()`.
- Numeric year `2018` matches both JO Camry listings.
- Leading/trailing whitespace is trimmed.
- Multi-term `Toyota Camry` scores the full match and scores an unrelated listing as 0.
- When the caller applies a market filter, the SA Kia listing is excluded from a JO query.

## Baseline metrics (fixture set only)

Computed by the evaluation test over cases that declare `expectedRelevantIds`.  
This is a **fixture-level** number, not a production Recall@K, Precision@K, MRR, or nDCG.

| Metric | Value | Notes |
|--------|-------|-------|
| Fixture listings | 10 | Hand-authored |
| Evaluation cases | 18 | Hand-authored |
| Cases with known client gap | 6 | Flagged in fixtures |
| Client recall@all (relevant hits / relevant total) | Recorded by the test run | See test output. Not a production metric. |
| Precision@K / MRR / nDCG / zero-result rate / latency | Not computed | Fixture set is too small and is not a production sample. |

## Server RPC — unverified hypotheses

Documented in `src/shared/lib/__tests__/searchListings.rpc.contract.spec.ts`.  
These are **hypotheses derived from migration source**, not confirmed live behavior.

1. Prefix FTS (`word:*`) can match "toy" → "toyota" when the deployed function is the 20261020 (or compatible) version.
2. Middle and suffix fragments do not match the prefix-FTS path. They may fall through to the final `LIKE '%' || v_norm || '%'` because the trigram path is gated to `length >= 4` and `word_similarity > 0.5`.
3. The LIKE fallback still produces the "Sam" → "Samsung" / "Sam" false-positive pattern even after the trigram tighten. This is a logical gap in the migration source.
4. Cross-script pairs exist in `search_synonyms` (V2) and can exist in `search_keywords` (V3), but existing rows may not contain the expansions unless a backfill has been applied. Unverified.
5. Single-character path via `search_chars @>` may return a large, unranked (by relevance) set.
6. Empty query returns no rows (early `RETURN` in the function). This differs from the client helper.

### Missing infrastructure

- No live Supabase connection is available to this phase.
- No automated integration test harness that applies migrations to a disposable Postgres and calls `search_listings`.
- No production query log or latency sample.
- No embedding / semantic evaluation data (out of scope for Phase 1).

### Verification SQL for the Supabase engineer (not executed here)

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

## What must be preserved

- Market isolation and active-only filtering on the server path.
- Pagination limit/offset contract.
- Response shape consumed by `rowToListing`.
- Automatic indexing via the existing trigger (not modified in this phase).

## Recommended next step

Phase 2 should fix the confirmed client-side defects and the migration-level LIKE short-query gap, with regression tests that invert the currently-recorded failing expectations. Database changes remain coordinated with the Supabase engineer and must not be applied from this phase.

---

*Client results come from the Vitest suite. RPC claims above are hypotheses until the Supabase engineer verifies them.*
