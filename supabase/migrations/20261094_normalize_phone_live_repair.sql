-- 1. إنشاء دالة التوحيد
CREATE OR REPLACE FUNCTION public.normalize_phone(p_phone text, p_country text DEFAULT 'JO')
RETURNS text LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  v_digits text;
  v_code text;
BEGIN
  IF p_phone IS NULL OR btrim(p_phone) = '' THEN RETURN NULL; END IF;
  v_digits := regexp_replace(p_phone, '[^0-9]', '', 'g');
  IF v_digits = '' THEN RETURN NULL; END IF;
  v_code := CASE p_country
    WHEN 'JO' THEN '962' WHEN 'SA' THEN '966' WHEN 'LB' THEN '961' 
    WHEN 'PS' THEN '970' WHEN 'SY' THEN '963' ELSE '962' END;
  IF left(v_digits, 2) = '00' THEN
    v_digits := substring(v_digits from 3);
  ELSIF left(v_digits, 1) = '0' THEN
    v_digits := substring(v_digits from 2);
  END IF;
  IF left(v_digits, 3) IN ('962', '966', '961', '970', '972', '963') THEN
    RETURN '+' || v_digits;
  END IF;
  RETURN '+' || v_code || v_digits;
END;
$$;

-- 2. Backfill
UPDATE public.profiles SET phone = public.normalize_phone(phone, country_code) WHERE phone IS NOT NULL AND phone <> '';
UPDATE public.phone_change_requests pcr SET current_phone = public.normalize_phone(pcr.current_phone, pr.country_code), requested_phone = public.normalize_phone(pcr.requested_phone, pr.country_code) FROM public.profiles pr WHERE pcr.user_id = pr.id;

-- 3. set_initial_phone
CREATE OR REPLACE FUNCTION public.set_initial_phone(p_phone text)
 RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp' AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_country text;
  v_phone text;
  v_rows integer;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501'; END IF;
  SELECT country_code INTO v_country FROM public.profiles WHERE id = v_user_id;
  v_country := coalesce(v_country, 'JO');
  v_phone := public.normalize_phone(p_phone, v_country);
  IF v_phone IS NULL THEN RAISE EXCEPTION 'Invalid phone number' USING ERRCODE = '22023'; END IF;
  INSERT INTO public.profiles (id, phone, phone_locked) VALUES (v_user_id, v_phone, true)
  ON CONFLICT (id) DO UPDATE SET phone = EXCLUDED.phone, phone_locked = true
    WHERE public.profiles.phone IS NULL AND public.profiles.phone_locked = false;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RETURN v_rows = 1;
END;
$function$;

-- 4. request_phone_change
CREATE OR REPLACE FUNCTION public.request_phone_change(p_requested_phone text, p_reason text)
 RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp' AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_country text;
  v_reason text := btrim(coalesce(p_reason, ''));
  v_phone text;
  v_current_phone text;
  v_request_id uuid;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501'; END IF;
  SELECT country_code INTO v_country FROM public.profiles WHERE id = v_user_id;
  v_country := coalesce(v_country, 'JO');
  v_phone := public.normalize_phone(p_requested_phone, v_country);
  IF v_phone IS NULL THEN RAISE EXCEPTION 'Invalid phone number' USING ERRCODE = '22023'; END IF;
  IF length(v_reason) < 3 OR length(v_reason) > 500 THEN RAISE EXCEPTION 'Reason must be between 3 and 500 characters' USING ERRCODE = '22023'; END IF;
  SELECT p.phone INTO v_current_phone FROM public.profiles AS p WHERE p.id = v_user_id;
  IF v_current_phone IS NOT NULL AND v_current_phone = v_phone THEN RAISE EXCEPTION 'Requested phone matches the current phone' USING ERRCODE = '22023'; END IF;
  INSERT INTO public.phone_change_requests (user_id, current_phone, requested_phone, reason, status)
  VALUES (v_user_id, v_current_phone, v_phone, v_reason, 'pending') RETURNING id INTO v_request_id;
  RETURN v_request_id;
EXCEPTION
  WHEN unique_violation THEN RAISE EXCEPTION 'A pending phone-change request already exists' USING ERRCODE = '23505';
END;
$function$;

-- 5. admin_approve_phone_change
CREATE OR REPLACE FUNCTION public.admin_approve_phone_change(p_request_id uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp' AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_email text;
  v_target_user_id uuid;
  v_new_phone text;
  v_country text;
  v_rows integer;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501'; END IF;
  SELECT email INTO v_email FROM auth.users WHERE id = v_uid;
  IF v_email IS NULL OR lower(v_email) <> lower('Sufyanyounis83@gmail.com') THEN RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501'; END IF;
  SELECT user_id, requested_phone INTO v_target_user_id, v_new_phone FROM public.phone_change_requests WHERE id = p_request_id AND status = 'pending' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Request not found or already processed.'; END IF;
  SELECT country_code INTO v_country FROM public.profiles WHERE id = v_target_user_id;
  v_country := coalesce(v_country, 'JO');
  v_new_phone := public.normalize_phone(v_new_phone, v_country);
  UPDATE public.profiles SET phone = v_new_phone, phone_locked = true WHERE id = v_target_user_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 1 THEN RAISE EXCEPTION 'Target profile not found.'; END IF;
  UPDATE public.phone_change_requests SET status = 'approved', reviewed_at = now(), review_note = 'Approved via Admin RPC' WHERE id = p_request_id AND status = 'pending';
  IF NOT FOUND THEN RAISE EXCEPTION 'Request was already processed.'; END IF;
END;
$function$;
