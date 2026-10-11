Search Live Migration Drift — 2026-10-11

1. Purpose

Document the differences discovered between the live Supabase migration ledger and the migration files committed to the "Rana-Essam-Amman/Grab1" repository.

This is a documentation-only change. It does not modify the database, execute migrations, or change search behavior.

2. Repository and Branch

- Repository: "Rana-Essam-Amman/Grab1"
- Reconciliation branch: "chore/reconcile-search-live-drift-20261011"
- Baseline branch: "main"
- Audit date: 2026-10-11

3. Live Migration Entries Missing From the Repository

The live Supabase migration ledger contains the following entries, but matching migration files were not found in "supabase/migrations/" during the audit:

1. "fox_search_short_query_synonym_hardening_20261011"
2. "fox_search_add_missing_samsung_arabic_synonym_20261011"

These entries indicate potential source-control drift. Their exact SQL definitions and execution history must be recovered or independently verified before any replacement migration is created.

Important: Migration names alone are not proof of the exact SQL that was executed. Do not recreate either migration by guessing its original contents.

4. Relevant Checked-in Search Migrations

The repository currently contains these relevant migration files:

- "supabase/migrations/20261018_search_v3_schema.sql"
- "supabase/migrations/20261019_search_v3_trigger.sql"
- "supabase/migrations/20261020_search_trigram_tighten.sql"

4.1 Search V3 schema

The checked-in schema migration defines the search-related structures and functions, including:

- "public.search_keywords"
- "public.normalize_search_text"
- "public.search_json_values"
- "public.expand_search_keywords"
- "public.search_character_array"
- "public.search_listings"

The initial search implementation includes full-text search, trigram matching, and normalized substring fallback.

4.2 Search trigger and indexing

The trigger migration builds searchable text from listing fields, normalizes the text, expands keywords, and maintains search metadata.

4.3 Trigram tightening

The checked-in tightening migration uses these conditions for trigram fallback:

- Normalized query length must be at least four characters.
- "word_similarity" must exceed "0.5".
- Normalized substring fallback remains available.

The live function must be compared against this checked-in definition before concluding that the implementations are identical.

5. Observed Live Search Data

A read-only query against "public.search_keywords" returned these rows during the audit:

group_key| keyword
"brand_toyota"| "toyota"
"brand_toyota"| "تويوتا"

No Samsung keyword pair appeared in that query result.

This observation does not establish that Samsung synonyms are absent from every other search-related table or function. Verify all relevant data sources before making changes.

6. Known Search Regression

A previously reported reproduction was:

SELECT id, title
FROM public.search_listings('Sam', 'JO', 20, 0);

The reported result included unrelated Arabic listings, such as a Toyota Camry listing, alongside a gibberish listing.

The suspected cause was permissive trigram matching for short queries, previously using a threshold of "0.3".

The intended behavior is to prevent short, ambiguous queries from returning unrelated listings while preserving useful exact, prefix, and approved synonym matches.

7. Reconciliation Requirements

Before implementing a corrective migration:

1. Read every checked-in search migration in chronological order.
2. Inspect the live migration ledger and identify the two missing migration entries.
3. Determine the actual live behavior of "public.search_listings" using read-only queries.
4. Verify the current contents of every relevant synonym and keyword table.
5. Establish whether Samsung English-to-Arabic and Arabic-to-English search expansion is required and currently missing.
6. Define explicit expected behavior for one-character, two-character, three-character, and longer queries.
7. Preserve country isolation, active-listing filtering, deterministic ordering, and pagination.
8. Add regression tests for the original "Sam" reproduction and cross-language brand searches.
9. Create a forward-only, idempotent migration that brings the repository's intended state into alignment with the verified live state.
10. Test the migration and search regressions in a disposable local or staging database before any production deployment.

8. Safety Rules

- Do not execute schema changes against production during this reconciliation.
- Do not delete migration-ledger entries to hide drift.
- Do not edit previously applied migration files to pretend that their historical contents are known.
- Do not lower similarity thresholds to solve missing synonym coverage.
- Do not allow one country's listings to appear in another country's search results.
- Do not commit credentials, access tokens, database URLs, or other secrets.
- Do not claim that a migration has been verified until its SQL and behavior have actually been checked.

9. Acceptance Criteria

Reconciliation is complete only when:

- The missing live migration entries have documented explanations.
- The intended SQL state is represented by checked-in migration files.
- Short-query false positives are covered by regression tests.
- English and Arabic brand searches behave as specified.
- Existing search behavior is preserved where it is correct.
- Local or staging tests pass.
- Production changes, if subsequently approved, are handled as a separate deployment step.

10. Current Status

Status: Investigation documented; reconciliation not yet implemented.

This file records the observed drift and the required verification steps. It does not claim that the live database has been repaired or that any production migration has been applied.
