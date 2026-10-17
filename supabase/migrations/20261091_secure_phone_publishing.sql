-- (1) Block publishing without a phone
DROP POLICY IF EXISTS "listings_insert_own"
  ON public.listings;

CREATE POLICY "listings_insert_own"
ON public.listings
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND COALESCE(
    (auth.jwt() ->> 'is_anonymous')::boolean,
    false
  ) = false
  AND country_code = (
    SELECT p.country_code
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
  )
  AND NULLIF(TRIM(public.get_own_phone()), '') IS NOT NULL
);

-- (2) Admin approval RPC
CREATE OR REPLACE FUNCTION public.admin_approve_phone_change(
  p_request_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_email text;
  v_target_user_id uuid;
  v_new_phone text;
  v_rows integer;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Unauthorized'
      USING ERRCODE = '42501';
  END IF;

  SELECT email
  INTO v_email
  FROM auth.users
  WHERE id = v_uid;

  IF v_email IS NULL
     OR lower(v_email) <> lower('Sufyanyounis83@gmail.com') THEN
    RAISE EXCEPTION 'Unauthorized'
      USING ERRCODE = '42501';
  END IF;

  SELECT user_id, requested_phone
  INTO v_target_user_id, v_new_phone
  FROM public.phone_change_requests
  WHERE id = p_request_id
    AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found or already processed.';
  END IF;

  UPDATE public.profiles
  SET phone = NULLIF(TRIM(v_new_phone), ''),
      phone_locked = true
  WHERE id = v_target_user_id;

  GET DIAGNOSTICS v_rows = ROW_COUNT;

  IF v_rows <> 1 THEN
    RAISE EXCEPTION 'Target profile not found.';
  END IF;

  UPDATE public.phone_change_requests
  SET status = 'approved',
      reviewed_at = now(),
      review_note = 'Approved via Admin RPC'
  WHERE id = p_request_id
    AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request was already processed.';
  END IF;
END;
$$;

-- (3) Explicit function signature and grants
REVOKE ALL ON FUNCTION public.admin_approve_phone_change(uuid)
  FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.admin_approve_phone_change(uuid)
  TO authenticated;
