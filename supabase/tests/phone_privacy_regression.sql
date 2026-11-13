-- supabase/tests/phone_privacy_regression.sql
-- Regression coverage for P1 seller-phone privacy.
-- Run against a local or staging database after migrations.
-- Uses synthetic checks only; never selects real phone values into output.

BEGIN;

-- A. Direct column access
DO $$
BEGIN
  -- anon cannot select seller_phone
  SET LOCAL ROLE anon;
  BEGIN
    PERFORM seller_phone FROM public.listings LIMIT 1;
    RAISE EXCEPTION 'FAIL A1: anon can SELECT seller_phone';
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'PASS A1: anon cannot SELECT seller_phone';
  END;
  RESET ROLE;

  -- authenticated cannot select seller_phone
  SET LOCAL ROLE authenticated;
  BEGIN
    PERFORM seller_phone FROM public.listings LIMIT 1;
    RAISE EXCEPTION 'FAIL A2: authenticated can SELECT seller_phone';
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'PASS A2: authenticated cannot SELECT seller_phone';
  END;
  RESET ROLE;

  -- Normal fields remain readable (assuming RLS allows active listings)
  SET LOCAL ROLE anon;
  BEGIN
    PERFORM id, title FROM public.listings WHERE status = 'active' LIMIT 1;
    RAISE NOTICE 'PASS A3: anon can read normal public listing fields';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'NOTE A3: could not verify normal field read (check RLS/data): %', SQLERRM;
  END;
  RESET ROLE;
END $$;

-- B. Public RPC outputs return NULL for seller_phone
-- (Add specific calls for exact, tiered, seller, semantic if executable, etc.
--  Example skeleton; expand with real fixtures in full test suite.)

DO $$
DECLARE
  v_phone text;
BEGIN
  -- Example for search_listings_v4_exact if present
  IF to_regprocedure('public.search_listings_v4_exact(text,text,integer,integer,text,text,numeric,numeric,text,text,jsonb)') IS NOT NULL THEN
    SET LOCAL ROLE anon;
    SELECT seller_phone INTO v_phone
    FROM public.search_listings_v4_exact('test', NULL, 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
    LIMIT 1;
    IF v_phone IS NOT NULL THEN
      RAISE EXCEPTION 'FAIL B1: search_listings_v4_exact returned non-null seller_phone';
    END IF;
    RAISE NOTICE 'PASS B1: search_listings_v4_exact masks seller_phone';
    RESET ROLE;
  END IF;

  -- Add similar blocks for other RPCs: v4_tiered_v4, listings_by_seller, etc.
  -- Always assert IS NULL; never log the value.
END $$;

-- C. Internal semantic search
-- Confirm search_listings_hybrid still callable (if present) and semantic not directly executable by anon.

DO $$
BEGIN
  SET LOCAL ROLE anon;
  BEGIN
    PERFORM 1 FROM public.search_listings_semantic(NULL, NULL, 1, 0, NULL) LIMIT 1;
    RAISE EXCEPTION 'FAIL C1: anon can execute search_listings_semantic';
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'PASS C1: anon cannot execute search_listings_semantic';
  END;
  RESET ROLE;
END $$;

-- D. Authorized phone reveal (skeleton; requires authenticated context and fixtures)
-- See get_listing_phone tests in full suite. Do not print phone values.

ROLLBACK;
