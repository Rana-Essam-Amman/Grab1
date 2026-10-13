-- 20261046_drop_c3_artifacts.sql
-- Session 10 — C3 cleanup.
--
-- C3 (search_listings_v3 + intent detection) failed A/B: same Precision
-- as v2 (17.69%) with 5 new Must-NOT-include violations from over-broad
-- FTS-OR retrieval. C3 is abandoned. v2 remains the parallel improvement.
--
-- Drops:
--   - public.search_listings_v3         (20261043, 20261044)
--   - public.detect_query_intent        (20261043, 20261045)
--   - public.search_intent_markers      (20261043)
--   - public.search_listings_v2_test()  (manual test function from SQL editor)
--
-- Preserves:
--   - public.search_listings       (v1, production)
--   - public.search_listings_v2    (parallel improvement)
--   - public.search_stopwords
--   - public.search_text_has_all_tokens_v2
--   - public.query_has_stopword

begin;

drop function if exists public.search_listings_v3(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb
);

drop function if exists public.detect_query_intent(text);

drop table if exists public.search_intent_markers;

drop function if exists public.search_listings_v2_test();

commit;
