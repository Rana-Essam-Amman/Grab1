-- Migration: 20261017_admin_panel.sql
-- Minimal admin panel functions and schema extensions

BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '15s';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banned boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banned_reason text;
ALTER TABLE public.listing_reports ADD COLUMN IF NOT EXISTS action_taken text;
CREATE INDEX IF NOT EXISTS profiles_banned_idx ON public.profiles (banned) WHERE banned = true;
COMMIT;

BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '15s';

-- FUNCTION 1: admin_get_dashboard
CREATE OR REPLACE FUNCTION public.admin_get_dashboard(p_country_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
  DECLARE
    v_uid uuid;
    v_email text;
    v_currency text;
    v_users bigint;
    v_listings bigint;
    v_reports bigint;
    v_revenue bigint;
    v_recent jsonb;
    v_res jsonb;
    v_listing_id uuid;
    v_owner uuid;
    v_duration int;
    v_tx_id uuid;
  BEGIN
    v_uid := auth.uid();
    IF v_uid IS NULL THEN
      RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;
    v_email := (SELECT email FROM auth.users WHERE id = v_uid);
    IF v_email IS NULL OR lower(v_email) <> lower('Sufyanyounis83@gmail.com') THEN
      RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;

    IF p_country_code NOT IN ('JO','SA','LB','PS','SY') THEN
      RAISE EXCEPTION 'Invalid country code';
    END IF;

    v_currency := CASE p_country_code
      WHEN 'JO' THEN 'JOD'
      WHEN 'SA' THEN 'SAR'
      WHEN 'LB' THEN 'USD'
      WHEN 'PS' THEN 'ILS'
      WHEN 'SY' THEN 'SYP'
    END;

    SELECT count(*) INTO v_users
    FROM public.profiles
    WHERE country_code = p_country_code AND banned = false;

    SELECT count(*) INTO v_listings
    FROM public.listings
    WHERE country_code = p_country_code AND status = 'active';

    SELECT count(*) INTO v_reports
    FROM public.listing_reports r
    JOIN public.listings l ON l.id = r.listing_id
    WHERE l.country_code = p_country_code AND r.status = 'pending';

    SELECT coalesce(sum(pt.amount_cents), 0) INTO v_revenue
    FROM public.premium_transactions pt
    LEFT JOIN public.listings l ON l.id = pt.listing_id
    LEFT JOIN public.profiles p ON p.id = pt.user_id
    WHERE pt.status = 'paid'
      AND coalesce(l.country_code, p.country_code) = p_country_code;

    SELECT coalesce(jsonb_agg(row_to_json(sub)::jsonb), '[]'::jsonb) INTO v_recent
    FROM (
      SELECT
        r.id,
        r.listing_id,
        l.title AS listing_title,
        l.country_code AS listing_country_code,
        r.reporter_id,
        trim(concat_ws(' ', rep.first_name, rep.last_name)) AS reporter_name,
        r.reason,
        r.details,
        r.status,
        r.action_taken,
        r.created_at,
        r.reviewed_at
      FROM public.listing_reports r
      JOIN public.listings l ON l.id = r.listing_id
      LEFT JOIN public.profiles rep ON rep.id = r.reporter_id
      WHERE l.country_code = p_country_code AND r.status = 'pending'
      ORDER BY r.created_at DESC
      LIMIT 5
    ) sub;

    RETURN jsonb_build_object(
      'metrics', jsonb_build_object(
        'users', v_users,
        'listings', v_listings,
        'reports', v_reports,
        'revenue_cents', v_revenue,
        'currency', v_currency
      ),
      'recent_reports', v_recent
    );
  END;
$$;

-- FUNCTION 2: admin_list_reports
CREATE OR REPLACE FUNCTION public.admin_list_reports(p_country_code text, p_status text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
  DECLARE
    v_uid uuid;
    v_email text;
    v_currency text;
    v_users bigint;
    v_listings bigint;
    v_reports bigint;
    v_revenue bigint;
    v_recent jsonb;
    v_res jsonb;
    v_listing_id uuid;
    v_owner uuid;
    v_duration int;
    v_tx_id uuid;
  BEGIN
    v_uid := auth.uid();
    IF v_uid IS NULL THEN
      RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;
    v_email := (SELECT email FROM auth.users WHERE id = v_uid);
    IF v_email IS NULL OR lower(v_email) <> lower('Sufyanyounis83@gmail.com') THEN
      RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;

    IF p_country_code NOT IN ('JO','SA','LB','PS','SY') THEN
      RAISE EXCEPTION 'Invalid country code';
    END IF;

    IF p_status NOT IN ('pending','reviewed','dismissed','actioned') THEN
      RAISE EXCEPTION 'Invalid status';
    END IF;

    SELECT coalesce(jsonb_agg(row_to_json(sub)::jsonb), '[]'::jsonb)
    INTO v_res
    FROM (
      SELECT
        r.id,
        r.listing_id,
        l.title AS listing_title,
        l.country_code AS listing_country_code,
        r.reporter_id,
        trim(concat_ws(' ', rep.first_name, rep.last_name)) AS reporter_name,
        r.reason,
        r.details,
        r.status,
        r.action_taken,
        r.created_at,
        r.reviewed_at
      FROM public.listing_reports r
      JOIN public.listings l ON l.id = r.listing_id
      LEFT JOIN public.profiles rep ON rep.id = r.reporter_id
      WHERE l.country_code = p_country_code AND r.status = p_status
      ORDER BY r.created_at DESC
      LIMIT 50
    ) sub;

    RETURN v_res;
  END;
$$;

-- FUNCTION 3: admin_list_listings
CREATE OR REPLACE FUNCTION public.admin_list_listings(p_country_code text, p_filter text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
  DECLARE
    v_uid uuid;
    v_email text;
    v_currency text;
    v_users bigint;
    v_listings bigint;
    v_reports bigint;
    v_revenue bigint;
    v_recent jsonb;
    v_res jsonb;
    v_listing_id uuid;
    v_owner uuid;
    v_duration int;
    v_tx_id uuid;
  BEGIN
    v_uid := auth.uid();
    IF v_uid IS NULL THEN
      RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;
    v_email := (SELECT email FROM auth.users WHERE id = v_uid);
    IF v_email IS NULL OR lower(v_email) <> lower('Sufyanyounis83@gmail.com') THEN
      RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;

    IF p_country_code NOT IN ('JO','SA','LB','PS','SY') THEN
      RAISE EXCEPTION 'Invalid country code';
    END IF;

    IF p_filter NOT IN ('active','hidden','premium','all') THEN
      RAISE EXCEPTION 'Invalid filter';
    END IF;

    SELECT coalesce(jsonb_agg(row_to_json(sub)::jsonb), '[]'::jsonb)
    INTO v_res
    FROM (
      SELECT
        id,
        title,
        price,
        currency,
        status,
        is_premium,
        premium_expires_at,
        user_id,
        created_at
      FROM public.listings
      WHERE country_code = p_country_code
        AND (
          (p_filter = 'all')
          OR (p_filter = 'active' AND status = 'active')
          OR (p_filter = 'hidden' AND status = 'hidden')
          OR (p_filter = 'premium' AND is_premium = true)
        )
      ORDER BY created_at DESC
      LIMIT 50
    ) sub;

    RETURN v_res;
  END;
$$;

-- FUNCTION 4: admin_list_users
CREATE OR REPLACE FUNCTION public.admin_list_users(p_country_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
  DECLARE
    v_uid uuid;
    v_email text;
    v_currency text;
    v_users bigint;
    v_listings bigint;
    v_reports bigint;
    v_revenue bigint;
    v_recent jsonb;
    v_res jsonb;
    v_listing_id uuid;
    v_owner uuid;
    v_duration int;
    v_tx_id uuid;
  BEGIN
    v_uid := auth.uid();
    IF v_uid IS NULL THEN
      RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;
    v_email := (SELECT email FROM auth.users WHERE id = v_uid);
    IF v_email IS NULL OR lower(v_email) <> lower('Sufyanyounis83@gmail.com') THEN
      RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;

    IF p_country_code NOT IN ('JO','SA','LB','PS','SY') THEN
      RAISE EXCEPTION 'Invalid country code';
    END IF;

    SELECT coalesce(jsonb_agg(row_to_json(sub)::jsonb), '[]'::jsonb)
    INTO v_res
    FROM (
      SELECT
        id,
        first_name,
        last_name,
        phone,
        country_code,
        banned,
        banned_reason,
        created_at
      FROM public.profiles
      WHERE country_code = p_country_code
      ORDER BY created_at DESC
      LIMIT 50
    ) sub;

    RETURN v_res;
  END;
$$;

-- FUNCTION 5: admin_action_report
CREATE OR REPLACE FUNCTION public.admin_action_report(p_report_id uuid, p_action text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
  DECLARE
    v_uid uuid;
    v_email text;
    v_currency text;
    v_users bigint;
    v_listings bigint;
    v_reports bigint;
    v_revenue bigint;
    v_recent jsonb;
    v_res jsonb;
    v_listing_id uuid;
    v_owner uuid;
    v_duration int;
    v_tx_id uuid;
  BEGIN
    v_uid := auth.uid();
    IF v_uid IS NULL THEN
      RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;
    v_email := (SELECT email FROM auth.users WHERE id = v_uid);
    IF v_email IS NULL OR lower(v_email) <> lower('Sufyanyounis83@gmail.com') THEN
      RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;

    IF p_action NOT IN ('dismiss','hide_listing','ban_user') THEN
      RAISE EXCEPTION 'Invalid action';
    END IF;

    SELECT listing_id INTO v_listing_id FROM public.listing_reports WHERE id = p_report_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Report not found';
    END IF;

    SELECT user_id INTO v_owner FROM public.listings WHERE id = v_listing_id;

    IF p_action = 'dismiss' THEN
      UPDATE public.listing_reports
      SET status = 'dismissed', action_taken = 'dismissed', reviewed_at = now(), reviewed_by = v_uid
      WHERE id = p_report_id;
    ELSIF p_action = 'hide_listing' THEN
      IF v_listing_id IS NULL THEN
        RAISE EXCEPTION 'Listing ID is null';
      END IF;
      UPDATE public.listings SET status = 'hidden' WHERE id = v_listing_id;
      UPDATE public.listing_reports
      SET status = 'actioned', action_taken = 'hidden_listing', reviewed_at = now(), reviewed_by = v_uid
      WHERE id = p_report_id;
    ELSIF p_action = 'ban_user' THEN
      IF v_owner IS NULL THEN
        RAISE EXCEPTION 'Owner not found';
      END IF;
      UPDATE public.profiles
      SET banned = true, banned_reason = 'Reported: ' || p_report_id::text
      WHERE id = v_owner;
      UPDATE public.listing_reports
      SET status = 'actioned', action_taken = 'banned_user', reviewed_at = now(), reviewed_by = v_uid
      WHERE id = p_report_id;
    END IF;

    RETURN jsonb_build_object('success', true, 'report_id', p_report_id, 'action', p_action);
  END;
$$;

-- FUNCTION 6: admin_hide_listing
CREATE OR REPLACE FUNCTION public.admin_hide_listing(p_listing_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
  DECLARE v_uid uuid; v_email text;
  BEGIN
    v_uid := auth.uid();
    IF v_uid IS NULL THEN RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501'; END IF;
    v_email := (SELECT email FROM auth.users WHERE id = v_uid);
    IF v_email IS NULL OR lower(v_email) <> lower('Sufyanyounis83@gmail.com') THEN
      RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;

    UPDATE public.listings SET status = 'hidden' WHERE id = p_listing_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Listing not found';
    END IF;

    RETURN jsonb_build_object('success', true, 'listing_id', p_listing_id);
  END;
$$;

-- FUNCTION 7: admin_ban_user
CREATE OR REPLACE FUNCTION public.admin_ban_user(p_user_id uuid, p_reason text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
  DECLARE v_uid uuid; v_email text;
  BEGIN
    v_uid := auth.uid();
    IF v_uid IS NULL THEN RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501'; END IF;
    v_email := (SELECT email FROM auth.users WHERE id = v_uid);
    IF v_email IS NULL OR lower(v_email) <> lower('Sufyanyounis83@gmail.com') THEN
      RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;

    IF p_reason IS NULL OR length(trim(p_reason)) < 3 THEN
      RAISE EXCEPTION 'Reason too short';
    END IF;

    UPDATE public.profiles SET banned = true, banned_reason = trim(p_reason) WHERE id = p_user_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'User not found';
    END IF;

    RETURN jsonb_build_object('success', true, 'user_id', p_user_id);
  END;
$$;

-- FUNCTION 8: admin_unban_user
CREATE OR REPLACE FUNCTION public.admin_unban_user(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
  DECLARE v_uid uuid; v_email text;
  BEGIN
    v_uid := auth.uid();
    IF v_uid IS NULL THEN RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501'; END IF;
    v_email := (SELECT email FROM auth.users WHERE id = v_uid);
    IF v_email IS NULL OR lower(v_email) <> lower('Sufyanyounis83@gmail.com') THEN
      RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;

    UPDATE public.profiles SET banned = false, banned_reason = NULL WHERE id = p_user_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'User not found';
    END IF;

    RETURN jsonb_build_object('success', true, 'user_id', p_user_id);
  END;
$$;

-- FUNCTION 9: admin_record_payment
CREATE OR REPLACE FUNCTION public.admin_record_payment(p_user_id uuid, p_listing_id uuid, p_product text, p_amount_cents int, p_currency text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
  DECLARE
    v_uid uuid;
    v_email text;
    v_currency text;
    v_users bigint;
    v_listings bigint;
    v_reports bigint;
    v_revenue bigint;
    v_recent jsonb;
    v_res jsonb;
    v_listing_id uuid;
    v_owner uuid;
    v_duration int;
    v_tx_id uuid;
  BEGIN
    v_uid := auth.uid();
    IF v_uid IS NULL THEN
      RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;
    v_email := (SELECT email FROM auth.users WHERE id = v_uid);
    IF v_email IS NULL OR lower(v_email) <> lower('Sufyanyounis83@gmail.com') THEN
      RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;

    IF p_product NOT IN ('turbo','auto_bump','featured','vip_store') THEN
      RAISE EXCEPTION 'Invalid product';
    END IF;
    IF p_amount_cents IS NULL OR p_amount_cents <= 0 THEN
      RAISE EXCEPTION 'Invalid amount';
    END IF;
    IF p_currency NOT IN ('JOD','SAR','USD','ILS','SYP') THEN
      RAISE EXCEPTION 'Invalid currency';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id) THEN
      RAISE EXCEPTION 'User not found';
    END IF;

    IF p_listing_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.listings WHERE id = p_listing_id) THEN
      RAISE EXCEPTION 'Listing not found';
    END IF;

    v_duration := CASE p_product
      WHEN 'turbo' THEN 1
      WHEN 'auto_bump' THEN 30
      WHEN 'featured' THEN 7
      WHEN 'vip_store' THEN 30
    END;

    INSERT INTO public.premium_transactions (
      user_id,
      listing_id,
      product,
      provider,
      amount_cents,
      currency,
      duration_days,
      status,
      paid_at
    )
    VALUES (
      p_user_id,
      p_listing_id,
      p_product,
      'manual',
      p_amount_cents,
      p_currency,
      v_duration,
      'paid',
      now()
    )
    RETURNING id INTO v_tx_id;

    PERFORM public.apply_premium_purchase(v_tx_id);

    RETURN jsonb_build_object('success', true, 'transaction_id', v_tx_id, 'applied', true);
  END;
$$;

COMMIT;

-- GRANTS (REVOKE FIRST, then GRANT)
REVOKE ALL ON FUNCTION public.admin_get_dashboard(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_get_dashboard(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_get_dashboard(text) TO authenticated;

REVOKE ALL ON FUNCTION public.admin_list_reports(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_list_reports(text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_list_reports(text, text) TO authenticated;

REVOKE ALL ON FUNCTION public.admin_list_listings(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_list_listings(text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_list_listings(text, text) TO authenticated;

REVOKE ALL ON FUNCTION public.admin_list_users(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_list_users(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users(text) TO authenticated;

REVOKE ALL ON FUNCTION public.admin_action_report(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_action_report(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_action_report(uuid, text) TO authenticated;

REVOKE ALL ON FUNCTION public.admin_hide_listing(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_hide_listing(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_hide_listing(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.admin_ban_user(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_ban_user(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_ban_user(uuid, text) TO authenticated;

REVOKE ALL ON FUNCTION public.admin_unban_user(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_unban_user(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_unban_user(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.admin_record_payment(uuid, uuid, text, integer, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_record_payment(uuid, uuid, text, integer, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_record_payment(uuid, uuid, text, integer, text) TO authenticated;
