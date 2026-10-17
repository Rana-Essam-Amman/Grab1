-- Create an admin-only RPC to list pending phone change requests.

CREATE OR REPLACE FUNCTION public.admin_list_phone_change_requests()
RETURNS TABLE (
  id uuid, user_id uuid, current_phone text, requested_phone text, reason text, created_at timestamptz, user_name text
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_email text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501'; END IF;
  SELECT email INTO v_email FROM auth.users WHERE id = v_uid;
  IF v_email IS NULL OR lower(v_email) <> lower('Sufyanyounis83@gmail.com') THEN RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501'; END IF;

  RETURN QUERY
  SELECT r.id, r.user_id, r.current_phone, r.requested_phone, r.reason, r.created_at, COALESCE(NULLIF(TRIM(p.first_name || ' ' || p.last_name), ''), 'مستخدم غير معروف') AS user_name
  FROM public.phone_change_requests r
  LEFT JOIN public.profiles p ON p.id = r.user_id
  WHERE r.status = 'pending'
  ORDER BY r.created_at ASC;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_phone_change_requests() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_phone_change_requests() TO authenticated;
