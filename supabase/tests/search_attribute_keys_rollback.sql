-- Prove 20261092 rollback is idempotent on the disposable CI database.

\i supabase/rollback/20261092_search_attribute_keys_rollback.sql
\i supabase/rollback/20261092_search_attribute_keys_rollback.sql

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'search_json_keys'
  ) THEN
    RAISE EXCEPTION 'ROLLBACK FAIL: search_json_keys still exists after second rollback';
  END IF;
  RAISE NOTICE 'PASS ROLLBACK: 20261092 executed twice; search_json_keys is absent';
END $$;
