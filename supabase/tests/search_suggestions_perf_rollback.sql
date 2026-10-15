-- Prove 20261095 rollback is idempotent and does not delete pre-existing keywords.

-- Ensure the keywords exist (migration may already have inserted them).
INSERT INTO public.search_keywords (group_key, keyword)
VALUES ('brand_toyota', 'toyota')
ON CONFLICT DO NOTHING;

INSERT INTO public.search_keywords (group_key, keyword)
VALUES ('brand_toyota', 'تويوتا')
ON CONFLICT DO NOTHING;

-- Simulate that these keywords pre-existed and the migration skipped them:
-- remove any log entries so the rollback will not delete them.
-- (تيوتا is left in the log — the migration inserted it, so it should be deleted.)
DELETE FROM public.search_keywords_migration_log
WHERE migration_name = '20261095_search_suggestions_perf'
  AND group_key = 'brand_toyota'
  AND keyword IN ('toyota', 'تويوتا');

-- Apply rollback once
\i supabase/rollback/20261095_search_suggestions_perf_rollback.sql

-- Assert the specific pre-existing keywords survived
DO $$
DECLARE
  v_toyota  int;
  v_arabic  int;
BEGIN
  SELECT count(*) INTO v_toyota
  FROM public.search_keywords
  WHERE group_key = 'brand_toyota' AND keyword = 'toyota';

  SELECT count(*) INTO v_arabic
  FROM public.search_keywords
  WHERE group_key = 'brand_toyota' AND keyword = 'تويوتا';

  IF v_toyota < 1 OR v_arabic < 1 THEN
    RAISE EXCEPTION
      'ROLLBACK FAIL: pre-existing Toyota keywords deleted (toyota=%, تويوتا=%)',
      v_toyota, v_arabic;
  END IF;

  RAISE NOTICE 'PASS ROLLBACK: pre-existing Toyota keywords survived (toyota=%, تويوتا=%)',
    v_toyota, v_arabic;
END $$;

-- Apply rollback a second time (idempotence)
\i supabase/rollback/20261095_search_suggestions_perf_rollback.sql

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'search_suggestion_tokens'
  ) THEN
    RAISE EXCEPTION 'ROLLBACK FAIL: search_suggestion_tokens still exists';
  END IF;
  RAISE NOTICE 'PASS ROLLBACK: 20261095 executed twice; token pool is gone';
END $$;
