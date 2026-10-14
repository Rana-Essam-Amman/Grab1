-- Realtime publication metadata check.
-- Read-only: asserts required tables are members of supabase_realtime.

DO $$
DECLARE
  v_table text;
BEGIN
  FOREACH v_table IN ARRAY ARRAY[
    'conversations',
    'messages',
    'notifications'
  ]
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = v_table
    ) THEN
      RAISE EXCEPTION
        'SEC-2 FAIL: public.% missing from supabase_realtime',
        v_table;
    END IF;
  END LOOP;

  RAISE NOTICE
    'SEC-2 PASS: conversations, messages, notifications are published';
END $$;
