-- 20261083_phone_change_workflow.sql
-- Submit a phone-change request without granting direct table writes.

CREATE OR REPLACE FUNCTION public.request_phone_change(
  p_requested_phone text,
  p_reason text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_input text := btrim(coalesce(p_requested_phone, ''));
  v_phone text;
  v_digits text;
  v_reason text := btrim(coalesce(p_reason, ''));
  v_current_phone text;
  v_request_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required'
      USING ERRCODE = '42501';
  END IF;

  v_digits := regexp_replace(v_input, '[^0-9]', '', 'g');

  IF length(v_digits) < 7 OR length(v_digits) > 15 THEN
    RAISE EXCEPTION 'Invalid phone number'
      USING ERRCODE = '22023';
  END IF;

  IF length(v_reason) < 3 OR length(v_reason) > 500 THEN
    RAISE EXCEPTION 'Reason must be between 3 and 500 characters'
      USING ERRCODE = '22023';
  END IF;

  v_phone := CASE
    WHEN left(v_input, 1) = '+' THEN '+' || v_digits
    ELSE v_digits
  END;

  SELECT p.phone
    INTO v_current_phone
    FROM public.profiles AS p
   WHERE p.id = v_user_id;

  IF v_current_phone IS NOT NULL AND v_current_phone = v_phone THEN
    RAISE EXCEPTION 'Requested phone matches the current phone'
      USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.phone_change_requests (
    user_id, current_phone, requested_phone, reason, status
  )
  VALUES (
    v_user_id, v_current_phone, v_phone, v_reason, 'pending'
  )
  RETURNING id INTO v_request_id;

  RETURN v_request_id;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'A pending phone-change request already exists'
      USING ERRCODE = '23505';
END;
$$;

REVOKE ALL ON FUNCTION public.request_phone_change(text, text)
  FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.request_phone_change(text, text)
  TO authenticated;
