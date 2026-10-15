-- Prove 20261093 rollback is idempotent on the disposable CI database.

\i supabase/rollback/20261093_search_v4_typo_threshold_rollback.sql
\i supabase/rollback/20261093_search_v4_typo_threshold_rollback.sql

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'search_listings_v4_exact'
      AND p.prosrc ILIKE '%v_trigram_count%'
  ) THEN
    RAISE EXCEPTION 'ROLLBACK FAIL: trigram stage still present after second rollback';
  END IF;
  RAISE NOTICE 'PASS ROLLBACK: 20261093 executed twice; trigram stage is gone';
END $$;
