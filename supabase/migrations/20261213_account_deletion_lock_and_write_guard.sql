
-- Durable account deletion lock.
-- Internal table and helper function stay outside the exposed API schema.
-- Do not apply to production until the full deletion workflow is verified.

BEGIN;

-- Create a non-exposed schema for internal security objects.
CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC;
REVOKE ALL ON SCHEMA private FROM anon, authenticated, service_role;

-- RLS policies need schema USAGE to call the helper.
-- This does not expose the schema through PostgREST.
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;


-- Durable deletion lock.
CREATE TABLE private.account_deletion_locks (
  user_id uuid PRIMARY KEY
    REFERENCES auth.users(id)
    ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE private.account_deletion_locks
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE private.account_deletion_locks
  FROM PUBLIC, anon, authenticated, service_role;


-- Shared transaction-level lock.
-- RLS policies will call this function before permitting writes.

CREATE OR REPLACE FUNCTION private.account_user_can_write()
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RETURN false;
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user_id::text, 0)
  );

  RETURN NOT EXISTS (
    SELECT 1
    FROM private.account_deletion_locks
    WHERE user_id = v_user_id
  );
END;
$$;

REVOKE ALL ON FUNCTION private.account_user_can_write()
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION private.account_user_can_write()
  TO anon, authenticated;


-- Public RPC entry point for the trusted Edge Function only.
-- The function writes to the private lock table as its owner.

CREATE OR REPLACE FUNCTION public.begin_account_deletion(
  p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'user_id_required'
      USING ERRCODE = '22004';
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_user_id::text, 0)
  );

  INSERT INTO private.account_deletion_locks (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.begin_account_deletion(uuid)
  FROM PUBLIC, anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.begin_account_deletion(uuid)
  TO service_role;

COMMIT;
