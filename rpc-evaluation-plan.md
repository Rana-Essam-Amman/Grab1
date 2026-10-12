# FOX Search RPC Evaluation Plan

## Purpose

Create a repeatable, database-level evaluation for `public.search_listings(p_query, p_market, p_limit, p_offset)`. Client-side Vitest tests are useful but do not execute the PostgreSQL function and must not be treated as evidence of database behavior.

## Verified starting point

- Repository: `Rana-Essam-Amman/Grab1`.
- PR #275 is included in the current `main` history.
- PR #276 (`fix(search): prevent empty neighborhood/city matches`) is merged. Merge commit: `3d4d16bf66100d9d619ae4cdb92051686bb39be5`.
- The checked-in search migrations include `20261015_listings_fts.sql`, `20261016_search_v2_category_aware.sql`, `20261018_search_v3_schema.sql`, `20261019_search_v3_trigger.sql`, `20261020_search_trigram_tighten.sql`, and `20261021_search_test_hf_endpoint.sql`.
- The live Supabase migration ledger additionally reports `fox_search_short_query_synonym_hardening_20261011` and `fox_search_add_missing_samsung_arabic_synonym_20261011`. Those migration files are not present in the checked-in `supabase/migrations/` directory. Treat this as migration-source drift that must be reconciled before declaring the repository reproducible.
- The live `search_listings` definition has an early return for normalized queries shorter than 3 characters, retries with a query-synonym expansion, and only runs trigram fallback for length >= 4 with `word_similarity > 0.5`. The checked-in `20261020_search_trigram_tighten.sql` does not contain the same short-query early return or synonym retry. The live database and repository migration source are therefore not equivalent.

## Safe execution model

1. Run integration tests only against a local Supabase/PostgreSQL database created from the repository migrations.
2. The supplied shell runner accepts only `localhost`, `127.0.0.1`, or `::1` as the database host. It refuses hosted Supabase and other remote hosts.
3. The SQL test opens a transaction, inserts temporary fixture rows (including a synthetic auth user needed for the listing foreign key), asserts expected behavior, and ends with `ROLLBACK`.
4. Never run the fixture SQL against production. Do not disable RLS or alter production security policies. Do not deploy migrations as part of evaluation.
5. Because migration-source drift is known, an initial failure of the short-query cases is useful evidence; do not weaken the test expectations just to make the current migration files pass. First reconcile the missing migration history in a separate reviewed change.

## Labeled test scenarios

- English and Arabic make/model: Toyota/Camry and تويوتا/كامري; Kia/Cerato and كيا/سيراتو.
- Prefix, middle, and suffix fragments: `toy`, `yot`, `ota`.
- Short query behavior: `s` and `sa` should return no results; `sam` should match the intended Sam/Samsung fixtures without unrelated noise.
- Multi-token semantics: `Toyota Camry` should match relevant listings; `Toyota Samsung` should not.
- Empty and whitespace-only queries should return no rows.
- Year and structured attribute text: `2018` and `12000` where included in indexed attributes.
- Market isolation: Jordan queries must not return Saudi listings; Saudi Kia listings must not appear in Jordan results.
- Eligibility: non-active listings must never appear.
- False positives: `sam`/`Camry` must not return the unrelated gibberish fixture.
- Pagination and stable ordering: repeated page-one calls must return the same first ID, and adjacent pages must not repeat the same ID.

## Metrics

Use a labeled query set where every fixture/query pair is marked relevant or irrelevant.

- `Precision@5 = relevant results among first 5 / number of results returned among first 5`.
- `Precision@10 = relevant results among first 10 / number of results returned among first 10`.
- Report recall only when the full set of relevant fixture IDs is known for each query.
- Measure latency with repeated calls on a local database, report sample count and median/p95; separate cold-start from warmed runs if relevant.
- Report client-side Vitest results separately from SQL integration results.
- Never use the current four-row production dataset as evidence of general search quality or competitor superiority.

## Commands

From the repository root, with local Supabase/PostgreSQL running and `DATABASE_URL` pointing to its local database:

```sh
DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:54322/postgres' ./test-search-rpc-local.sh
```

The test runner uses `psql -v ON_ERROR_STOP=1`. A failed run exits non-zero; the connection's open transaction is rolled back when the process disconnects. Successful runs print assertions from the SQL script and finish with an explicit rollback.

## Out of scope

- No production writes or migrations.
- No embeddings or AI ranking.
- No broad search rewrite.
- No claims of benchmark success until tests have actually run against a labeled fixture set.

## Path corrections (2026-10-11)

- Local runner is `./test-search-rpc-local.sh` (repository root). The previous reference to `scripts/test-search-rpc-local.sh` was incorrect.
- SQL test suite is `supabase/tests/search_listings_rpc.sql`.
- Short-query policy in tests now matches the live verified behavior: normalized length < 3 (including "sam"/"Sam"/"toy"/"kia") returns no rows. This prevents the previously observed false-positive regression.
- A forward reconciliation migration `supabase/migrations/20261022_search_short_query_hardening.sql` has been added so that local application of repository migrations produces the same short-query guard observed live. ChatGPT must still inspect the live function and migration ledger before applying any change.

## Local test safety

The runner refuses any non-loopback host. Fixtures are transaction-scoped and rolled back. Do not point DATABASE_URL at hosted Supabase.


## Corrective revision (PR #278 review)

Live `search_listings` (verified by ChatGPT, read-only) already includes:

- Early return for empty or normalized length < 3.
- Prefix full-text search.
- Synonym retry via `expand_search_query_synonyms(v_norm)` then `expand_search_keywords(...)`.
- Trigram fallback only for length >= 4 and `word_similarity > 0.5`.
- Active-status and optional market filters.
- Stable tie-breakers.

The first draft of `20261022_search_short_query_hardening.sql` omitted the synonym retry path and proposed a `search_keywords` group named `samsung`. Both are corrected:

- The migration now preserves the synonym retry path and defines `expand_search_query_synonyms`.
- Samsung coverage uses the existing `search_synonyms` table (`سامسونج` → `samsung`). No `search_keywords` group named `samsung` is inserted. Live group_key convention is values such as `brand_toyota`.
- Tests assert the length < 3 guard, the "Sam" false-positive (no unrelated gibberish), and synonym retry for `سامسونج` against the Samsung fixture.
- Local PostgreSQL was unavailable in the authoring environment. SQL execution is unverified.

- Invalid `COMMENT ON FUNCTION public.search_listings` (missing argument signature) was removed. No function-comment metadata change is introduced by this reconciliation migration.

## Disposable SQL CI (free GitHub Actions)

`.github/workflows/search-rpc-sql.yml` starts a temporary `postgres:16` service container, bootstraps the Supabase platform schemas (`auth`, `storage`) that repository migrations reference but do not create, applies every file in `supabase/migrations/` in filename order, then runs `./test-search-rpc-local.sh`.

The container is destroyed with the job. No hosted Supabase connection and no paid database service are used. Local password in the workflow is a disposable container credential.

If the historical chain fails, the workflow fails closed. A success means the full checked-in chain applied after the documented platform bootstrap, not a hand-assembled search schema.
