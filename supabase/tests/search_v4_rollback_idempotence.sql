-- Prove 20261091 rollback is idempotent on the disposable CI database.
-- Runs the rollback twice, then asserts the function is gone.

\i supabase/rollback/20261091_search_v4_exact_rollback.sql
\i supabase/rollback/20261091_search_v4_exact_rollback.sql

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'search_listings_v4_exact'
  ) THEN
    RAISE EXCEPTION 'ROLLBACK FAIL: search_listings_v4_exact still exists after second rollback';
  END IF;
  RAISE NOTICE 'PASS ROLLBACK: executed twice; search_listings_v4_exact is absent';
END $$;
