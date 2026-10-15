-- Prove 20261095 rollback is idempotent and does not delete pre-existing keywords.

-- Seed pre-existing brand keywords that the migration would skip
-- due to WHERE NOT EXISTS. These must survive the rollback.
INSERT INTO public.search_keywords (group_key, keyword)
VALUES ('brand_toyota', 'toyota')
ON CONFLICT DO NOTHING;

INSERT INTO public.search_keywords (group_key, keyword)
VALUES ('brand_toyota', 'تويوتا')
ON CONFLICT DO NOTHING;

-- Capture count before rollback (persist across \i via temp table)
CREATE TEMP TABLE IF NOT EXISTS _rollback_toyota_check (before_count int);
TRUNCATE _rollback_toyota_check;
INSERT INTO _rollback_toyota_check
SELECT count(*) FROM public.search_keywords WHERE group_key = 'brand_toyota';

-- Apply rollback once
\i supabase/rollback/20261095_search_suggestions_perf_rollback.sql

-- Assert pre-existing rows survived
DO $$
DECLARE
  v_before int;
  v_after  int;
BEGIN
  SELECT before_count INTO v_before FROM _rollback_toyota_check;
  SELECT count(*) INTO v_after
  FROM public.search_keywords
  WHERE group_key = 'brand_toyota';

  IF v_after < v_before THEN
    RAISE EXCEPTION
      'ROLLBACK FAIL: pre-existing Toyota keywords deleted (% -> %)',
      v_before, v_after;
  END IF;

  RAISE NOTICE 'PASS ROLLBACK: pre-existing Toyota keywords survived (% -> %)',
    v_before, v_after;
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

DROP TABLE IF EXISTS _rollback_toyota_check;
