-- 20261084_phone_write_lockdown.sql
-- Phone changes must go through the SECURITY DEFINER RPCs.

REVOKE INSERT (phone, phone_locked)
  ON TABLE public.profiles FROM authenticated;

REVOKE UPDATE (phone, phone_locked)
  ON TABLE public.profiles FROM authenticated;

REVOKE ALL ON TABLE public.phone_change_requests
  FROM anon;

REVOKE INSERT, UPDATE, DELETE
  ON TABLE public.phone_change_requests FROM authenticated;

GRANT SELECT ON TABLE public.phone_change_requests
  TO authenticated;
