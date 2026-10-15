-- Prove 20261095 rollback is idempotent.

\i supabase/rollback/20261095_search_suggestions_perf_rollback.sql
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
