-- Prove 20261094 rollback is idempotent.

\i supabase/rollback/20261094_search_suggestions_rollback.sql
\i supabase/rollback/20261094_search_suggestions_rollback.sql

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'search_suggestions'
  ) THEN
    RAISE EXCEPTION 'ROLLBACK FAIL: search_suggestions still exists after second rollback';
  END IF;
  RAISE NOTICE 'PASS ROLLBACK: 20261094 executed twice; function is gone';
END $$;
