
-- Durable account deletion lock.
-- This migration must be applied to the branch first.
-- Do not execute against production yet.

CREATE TABLE public.account_deletion_locks (
  user_id uuid PRIMARY KEY
    REFERENCES auth.users(id)
    ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.account_deletion_locks
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.account_deletion_locks
  FROM PUBLIC, anon, authenticated, service_role;


-- Shared transaction-level lock for account writes and deletion.
-- The advisory lock serializes writes against deletion initiation.

CREATE OR REPLACE FUNCTION public.account_user_can_write()
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
    FROM public.account_deletion_locks
    WHERE user_id = v_user_id
  );
END;
$$;


-- Only the service-role Edge Function can initiate the lock.
-- Repeated calls are intentionally idempotent.

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

  INSERT INTO public.account_deletion_locks (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN true;
END;
$$;


-- The write guard is needed by RLS policies, including policies
-- whose target role is PUBLIC (which includes anon).

REVOKE ALL ON FUNCTION public.account_user_can_write()
  FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.account_user_can_write()
  TO anon, authenticated;


-- Deletion initiation is restricted to the Edge Function's service role.

REVOKE ALL ON FUNCTION public.begin_account_deletion(uuid)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.begin_account_deletion(uuid)
  TO service_role;
