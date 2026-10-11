# FOX Search RPC Baseline — 2026-10-11

## Scope and limitations

This is a preliminary, read-only observation of the connected live RPC. It is not a representative quality benchmark. The live database currently contains only **4 listings, all active in market `JO`**. There is no labeled production relevance set, so Precision@5, Precision@10, recall, and meaningful latency percentiles are **not measured** in this report.

## Verified implementation findings

- Live function signature: `public.search_listings(text, text, integer, integer)`.
- Return type: `SETOF public.listings`.
- Live filters include `status = 'active'` and, when `p_market` is non-null, `country_code = upper(p_market)`.
- Live code returns no rows for normalized empty input or input shorter than 3 characters.
- Live code attempts prefix full-text search, then a query-synonym retry, then trigram fallback only for queries with at least 4 characters and `word_similarity > 0.5`, and finally normalized substring matching.
- Ranking differs by path: full-text uses `ts_rank_cd` then creation time and ID; trigram uses similarity then creation time and ID; final substring fallback uses creation time and ID. The single-distinct-character path orders by creation time and ID, but the live function's `< 3` guard makes one-character queries exit before that path.
- Live database migration ledger includes two hardening migrations not present as files in the repository migration directory. This source drift blocks a reproducible local baseline until reconciled.

## Read-only live query observations

These queries were executed against the live RPC with market `JO`; no data was inserted or modified.

| Query | Result count | Observation |
|---|---:|---|
| `Toyota` | 1 | Returned `تويوتا كامري 2018 بحالة ممتازة` |
| `تويوتا` | 1 | Returned the same Camry listing |
| `كامري` | 1 | Returned the same Camry listing |
| `yot` | 1 | Returned the same Camry listing |
| `ota` | 1 | Returned the same Camry listing |
| `2018` | 1 | Returned the same Camry listing |
| `Sam` | 0 | No live fixture currently tests a Samsung/Sam positive match |
| `Samsung` | 0 | No matching active live listing in the four-row dataset |
| `s` | 0 | Consistent with live short-query guard |
| `sa` | 0 | Consistent with live short-query guard |
| whitespace-only | 0 | Empty normalized query returns no rows |
| `zzzxqv` | 0 | No result for this nonsense query |
| `Toyota` with market `PS` | 0 | Country filter excluded all current Jordan listings |
| `Toyota` with market `JO` | 1 | Correct market returned the Camry listing |

A single read-only `EXPLAIN (ANALYZE, BUFFERS)` sample for `SELECT id,title FROM public.search_listings('Toyota','JO',20,0)` reported **17.264 ms execution time**, 1 returned row, 1,394 shared buffer hits, and 0 shared buffer reads. This is one observation only—not a latency benchmark or p95 estimate. The observed result set is too small to infer ranking quality, false-positive rate across categories, or competitive performance.

## Search index state

Read-only aggregate query reported:

- `search_version = 3`: 4 listings
- stale search versions: 0
- rows missing `search_text` or `fts`: 0

## Not yet measured

- PostgreSQL integration tests with isolated labeled fixtures.
- Precision@5 / Precision@10 and recall.
- Query latency median/p95 on representative data; only one sample (17.264 ms) has been captured so far.
- Pagination behavior across multiple matching rows.
- Cross-market behavior across multiple populated markets.
- Behavior for inactive/expired rows using fixture data.
- Repeatable local test results from the checked-in migration sequence.

## Required next action

Reconcile the two live-only hardening migrations with repository source in a separate reviewed PR, then run `supabase/tests/search_listings_rpc.sql` using the local-only runner. Do not deploy anything to production as part of this phase.
