-- 20261082_set_initial_phone_rpc.sql
-- Set the authenticated user's initial phone exactly once.
-- Target user derived from auth.uid(); clients cannot choose another user.

CREATE OR REPLACE FUNCTION public.set_initial_phone(p_phone text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_phone text := btrim(coalesce(p_phone, ''));
  v_digits text;
  v_rows integer;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required'
      USING ERRCODE = '42501';
  END IF;

  v_digits := regexp_replace(v_phone, '[^0-9]', '', 'g');

  IF length(v_digits) < 7 OR length(v_digits) > 15 THEN
    RAISE EXCEPTION 'Invalid phone number'
      USING ERRCODE = '22023';
  END IF;

  v_phone := CASE
    WHEN left(btrim(p_phone), 1) = '+'
      THEN '+' || v_digits
    ELSE v_digits
  END;

  INSERT INTO public.profiles (id, phone, phone_locked)
  VALUES (v_user_id, v_phone, true)
  ON CONFLICT (id) DO UPDATE
    SET phone = EXCLUDED.phone,
        phone_locked = true
    WHERE public.profiles.phone IS NULL
      AND public.profiles.phone_locked = false;

  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RETURN v_rows = 1;
END;
$$;

REVOKE ALL ON FUNCTION public.set_initial_phone(text)
  FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.set_initial_phone(text)
  TO authenticated;
