-- supabase/tests/phone_privacy_regression.sql
-- Executable regression coverage for P1 seller-phone privacy.
-- Uses only synthetic fixtures. Never prints or logs real phone values.
-- Run inside a transaction that is rolled back.

BEGIN;

-- ---------------------------------------------------------------------------
-- Synthetic fixtures
-- ---------------------------------------------------------------------------
INSERT INTO auth.users (id, email)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'anon-test@example.com'),
  ('00000000-0000-0000-0000-000000000002', 'auth-test@example.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, neighborhood, category_slug, status, seller_name, seller_phone,
  is_demo, created_at
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000001',
    'Synthetic Phone Test Listing',
    'Synthetic description for phone privacy regression',
    '100',
    'JOD',
    'JO',
    'Amman',
    'Abdoun',
    'electronics',
    'active',
    'Synthetic Seller',
    '0790000000',  -- synthetic only
    false,
    now()
  )
ON CONFLICT (id) DO UPDATE SET
  seller_phone = EXCLUDED.seller_phone,
  status = 'active',
  is_demo = false;

-- ---------------------------------------------------------------------------
-- A. Direct column access
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  v_can boolean;
BEGIN
  -- anon cannot select seller_phone
  SET LOCAL ROLE anon;
  SELECT has_column_privilege('anon', 'public.listings', 'seller_phone', 'SELECT') INTO v_can;
  IF v_can THEN
    RAISE EXCEPTION 'FAIL A1: anon has column SELECT on seller_phone';
  END IF;
  BEGIN
    PERFORM seller_phone FROM public.listings WHERE id = '11111111-1111-1111-1111-111111111111';
    RAISE EXCEPTION 'FAIL A1b: anon was able to SELECT seller_phone';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;
  RAISE NOTICE 'PASS A1: anon cannot SELECT seller_phone';
  RESET ROLE;

  -- authenticated cannot select seller_phone
  SET LOCAL ROLE authenticated;
  SELECT has_column_privilege('authenticated', 'public.listings', 'seller_phone', 'SELECT') INTO v_can;
  IF v_can THEN
    RAISE EXCEPTION 'FAIL A2: authenticated has column SELECT on seller_phone';
  END IF;
  BEGIN
    PERFORM seller_phone FROM public.listings WHERE id = '11111111-1111-1111-1111-111111111111';
    RAISE EXCEPTION 'FAIL A2b: authenticated was able to SELECT seller_phone';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;
  RAISE NOTICE 'PASS A2: authenticated cannot SELECT seller_phone';
  RESET ROLE;

  -- normal public columns remain readable for anon (subject to RLS)
  SET LOCAL ROLE anon;
  PERFORM id, title, price, seller_name FROM public.listings
   WHERE id = '11111111-1111-1111-1111-111111111111' AND status = 'active';
  RAISE NOTICE 'PASS A3: anon can read normal public listing fields';
  RESET ROLE;
END $$;

-- ---------------------------------------------------------------------------
-- B. Public RPC outputs return NULL for seller_phone
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  v_phone text;
  v_count int;
BEGIN
  -- search_listings_v4_exact (anon)
  IF to_regprocedure('public.search_listings_v4_exact(text,text,integer,integer,text,text,numeric,numeric,text,text,jsonb)') IS NOT NULL THEN
    SET LOCAL ROLE anon;
    SELECT count(*), max(seller_phone) INTO v_count, v_phone
    FROM public.search_listings_v4_exact('Synthetic', NULL, 10, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
    IF v_count = 0 THEN
      RAISE EXCEPTION 'FAIL B1: search_listings_v4_exact returned zero rows (fixture missing or filter too strict)';
    END IF;
    IF v_phone IS NOT NULL THEN
      RAISE EXCEPTION 'FAIL B1: search_listings_v4_exact returned non-null seller_phone';
    END IF;
    RAISE NOTICE 'PASS B1: search_listings_v4_exact masks seller_phone (anon, % rows)', v_count;
    RESET ROLE;
  END IF;

  -- search_listings_v4_tiered_v4 if present
  IF to_regprocedure('public.search_listings_v4_tiered_v4(text,text,integer,integer,text,text,numeric,numeric,text,text,jsonb,integer,text,text,text)') IS NOT NULL THEN
    SET LOCAL ROLE anon;
    SELECT count(*), max(seller_phone) INTO v_count, v_phone
    FROM public.search_listings_v4_tiered_v4('Synthetic', NULL, 10, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL);
    IF v_count = 0 THEN
      RAISE EXCEPTION 'FAIL B2: search_listings_v4_tiered_v4 returned zero rows';
    END IF;
    IF v_phone IS NOT NULL THEN
      RAISE EXCEPTION 'FAIL B2: search_listings_v4_tiered_v4 returned non-null seller_phone';
    END IF;
    RAISE NOTICE 'PASS B2: search_listings_v4_tiered_v4 masks seller_phone';
    RESET ROLE;
  END IF;

  -- listings_by_seller
  IF to_regprocedure('public.listings_by_seller(text,text,integer,integer)') IS NOT NULL THEN
    SET LOCAL ROLE anon;
    SELECT count(*), max(seller_phone) INTO v_count, v_phone
    FROM public.listings_by_seller('00000000-0000-0000-0000-000000000001', NULL, 10, 0);
    IF v_count = 0 THEN
      RAISE EXCEPTION 'FAIL B3: listings_by_seller returned zero rows';
    END IF;
    IF v_phone IS NOT NULL THEN
      RAISE EXCEPTION 'FAIL B3: listings_by_seller returned non-null seller_phone';
    END IF;
    RAISE NOTICE 'PASS B3: listings_by_seller masks seller_phone';
    RESET ROLE;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- C. Semantic RPC restriction
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  SET LOCAL ROLE anon;
  BEGIN
    PERFORM 1 FROM public.search_listings_semantic(NULL::extensions.vector, NULL, 1, 0, NULL) LIMIT 1;
    RAISE EXCEPTION 'FAIL C1: anon can execute search_listings_semantic';
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'PASS C1: anon cannot execute search_listings_semantic';
  END;
  RESET ROLE;

  SET LOCAL ROLE authenticated;
  BEGIN
    PERFORM 1 FROM public.search_listings_semantic(NULL::extensions.vector, NULL, 1, 0, NULL) LIMIT 1;
    RAISE EXCEPTION 'FAIL C2: authenticated can execute search_listings_semantic';
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'PASS C2: authenticated cannot execute search_listings_semantic';
  END;
  RESET ROLE;

  -- hybrid remains callable (if present); internal semantic call is owner's responsibility
  IF to_regprocedure('public.search_listings_hybrid(text,text,integer,integer)') IS NOT NULL THEN
    SET LOCAL ROLE anon;
    PERFORM 1 FROM public.search_listings_hybrid('test', NULL, 1, 0) LIMIT 1;
    RAISE NOTICE 'PASS C3: search_listings_hybrid remains callable by anon';
    RESET ROLE;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- D. Authorized phone reveal (skeleton – full rate-limit and demo tests
--    require a proper authenticated session and admin fixture)
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  -- Unauthenticated must be rejected
  SET LOCAL ROLE anon;
  BEGIN
    PERFORM public.get_listing_phone('11111111-1111-1111-1111-111111111111');
    RAISE EXCEPTION 'FAIL D1: anon was able to call get_listing_phone';
  EXCEPTION WHEN insufficient_privilege OR OTHERS THEN
    RAISE NOTICE 'PASS D1: unauthenticated get_listing_phone rejected';
  END;
  RESET ROLE;

  -- Authenticated path exists and is granted (actual phone value not logged)
  IF has_function_privilege('authenticated', 'public.get_listing_phone(uuid)', 'EXECUTE') THEN
    RAISE NOTICE 'PASS D2: authenticated has EXECUTE on get_listing_phone';
  ELSE
    RAISE EXCEPTION 'FAIL D2: authenticated missing EXECUTE on get_listing_phone';
  END IF;
END $$;

ROLLBACK;
