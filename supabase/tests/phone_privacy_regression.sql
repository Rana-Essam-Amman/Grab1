-- supabase/tests/phone_privacy_regression.sql
-- Executable regression coverage for P1 seller-phone privacy.
-- Synthetic fixtures only. Never prints or logs real phone values.
-- Wrapped in a transaction that is rolled back.

BEGIN;

-- ---------------------------------------------------------------------------
-- Synthetic fixtures (isolated)
-- ---------------------------------------------------------------------------
INSERT INTO auth.users (id, email)
VALUES
  ('00000000-0000-0000-0000-0000000000a1', 'phone-test-anon@example.com'),
  ('00000000-0000-0000-0000-0000000000a2', 'phone-test-auth@example.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, neighborhood, category_slug, status, seller_name, seller_phone,
  is_demo, created_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-0000000000a1',
  'PhonePrivacySynthetic',
  'Synthetic listing used only for phone privacy regression',
  '150',
  'JOD',
  'JO',
  'Amman',
  'Abdoun',
  'electronics',
  'active',
  'SyntheticSeller',
  '0791111111',
  false,
  now()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  seller_phone = EXCLUDED.seller_phone,
  status = 'active',
  is_demo = false;

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, category_slug, status, seller_name, seller_phone, is_demo, created_at
) VALUES
  (
    '44444444-4444-4444-4444-444444444444',
    '00000000-0000-0000-0000-0000000000a1',
    'PhonePrivacyInactive',
    'Synthetic inactive listing',
    '10', 'JOD', 'JO', 'Amman', 'electronics', 'sold',
    'SyntheticSeller', '0793333333', false, now()
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '00000000-0000-0000-0000-0000000000a1',
    'PhonePrivacyDemo',
    'Synthetic demo listing',
    '10', 'JOD', 'JO', 'Amman', 'electronics', 'active',
    'SyntheticSeller', '0794444444', true, now()
  )
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  is_demo = EXCLUDED.is_demo,
  seller_phone = EXCLUDED.seller_phone;

-- Orphan-phone fixture. user_id is NOT NULL in the checked-in schema, so the
-- fallback branch is otherwise unreachable. Drop the constraint only inside
-- this rolled-back transaction.
ALTER TABLE public.listings ALTER COLUMN user_id DROP NOT NULL;
INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, category_slug, status, seller_name, seller_phone, is_demo, created_at
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  NULL,
  'PhonePrivacyOrphan',
  'Synthetic orphan-phone listing',
  '90',
  'JOD',
  'JO',
  'Amman',
  'electronics',
  'active',
  'OrphanSeller',
  '0792222222',
  false,
  now()
)
ON CONFLICT (id) DO UPDATE SET
  user_id = NULL,
  seller_phone = EXCLUDED.seller_phone,
  status = 'active',
  is_demo = false;

-- ---------------------------------------------------------------------------
-- A. Direct column access
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  v_can boolean;
  v_seen int;
BEGIN
  -- A1: anon cannot select seller_phone
  SET LOCAL ROLE anon;
  SELECT has_column_privilege('anon', 'public.listings', 'seller_phone', 'SELECT') INTO v_can;
  IF v_can THEN
    RAISE EXCEPTION 'FAIL A1: anon has column SELECT on seller_phone';
  END IF;
  BEGIN
    PERFORM seller_phone FROM public.listings WHERE id = '22222222-2222-2222-2222-222222222222';
    RAISE EXCEPTION 'FAIL A1b: anon SELECT seller_phone succeeded';
  EXCEPTION
    WHEN insufficient_privilege THEN
      NULL;
  END;
  RAISE NOTICE 'PASS A1: anon cannot SELECT seller_phone';
  RESET ROLE;

  -- A2: authenticated cannot select seller_phone
  SET LOCAL ROLE authenticated;
  SELECT has_column_privilege('authenticated', 'public.listings', 'seller_phone', 'SELECT') INTO v_can;
  IF v_can THEN
    RAISE EXCEPTION 'FAIL A2: authenticated has column SELECT on seller_phone';
  END IF;
  BEGIN
    PERFORM seller_phone FROM public.listings WHERE id = '22222222-2222-2222-2222-222222222222';
    RAISE EXCEPTION 'FAIL A2b: authenticated SELECT seller_phone succeeded';
  EXCEPTION
    WHEN insufficient_privilege THEN
      NULL;
  END;
  RAISE NOTICE 'PASS A2: authenticated cannot SELECT seller_phone';
  RESET ROLE;

  -- A3: normal public columns are readable and at least one row is returned
  SET LOCAL ROLE anon;
  SELECT count(*) INTO v_seen
  FROM public.listings
  WHERE id = '22222222-2222-2222-2222-222222222222'
    AND status = 'active'
    AND title = 'PhonePrivacySynthetic';
  IF v_seen < 1 THEN
    RAISE EXCEPTION 'FAIL A3: expected public listing row not returned to anon';
  END IF;
  RAISE NOTICE 'PASS A3: anon can read normal public listing fields (% row)', v_seen;
  RESET ROLE;
END $$;

-- ---------------------------------------------------------------------------
-- A4. Privilege matrix after column-level revoke + re-grant
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  v_can boolean;
  v_col text;
  v_internal text[] := ARRAY[
    'seller_phone',
    'bumps_today',
    'bumps_reset_date',
    'auto_bump_active',
    'auto_bump_expires_at',
    'search_text',
    'fts',
    'search_chars',
    'search_version'
  ];
  v_public text[] := ARRAY[
    'id',
    'title',
    'seller_name',
    'is_premium',
    'premium_expires_at',
    'is_demo',
    'city_slug'
  ];
BEGIN
  -- Table-level SELECT must be gone for anon and authenticated
  IF has_table_privilege('anon', 'public.listings', 'SELECT') THEN
    RAISE EXCEPTION 'FAIL A4: anon still has table-level SELECT on listings';
  END IF;
  IF has_table_privilege('authenticated', 'public.listings', 'SELECT') THEN
    RAISE EXCEPTION 'FAIL A4: authenticated still has table-level SELECT on listings';
  END IF;
  RAISE NOTICE 'PASS A4: table-level SELECT revoked for anon and authenticated';

  -- Internal columns must not be selectable
  FOREACH v_col IN ARRAY v_internal LOOP
    SELECT has_column_privilege('anon', 'public.listings', v_col, 'SELECT') INTO v_can;
    IF v_can THEN
      RAISE EXCEPTION 'FAIL A5: anon has column SELECT on %', v_col;
    END IF;
    SELECT has_column_privilege('authenticated', 'public.listings', v_col, 'SELECT') INTO v_can;
    IF v_can THEN
      RAISE EXCEPTION 'FAIL A5: authenticated has column SELECT on %', v_col;
    END IF;
  END LOOP;
  RAISE NOTICE 'PASS A5: internal columns (phone, bumps, search helpers) not selectable';

  -- Approved public columns, including premium display fields, remain selectable
  FOREACH v_col IN ARRAY v_public LOOP
    SELECT has_column_privilege('anon', 'public.listings', v_col, 'SELECT') INTO v_can;
    IF NOT v_can THEN
      RAISE EXCEPTION 'FAIL A6: anon missing column SELECT on %', v_col;
    END IF;
    SELECT has_column_privilege('authenticated', 'public.listings', v_col, 'SELECT') INTO v_can;
    IF NOT v_can THEN
      RAISE EXCEPTION 'FAIL A6: authenticated missing column SELECT on %', v_col;
    END IF;
  END LOOP;
  RAISE NOTICE 'PASS A6: safe public columns including is_premium remain selectable';

  -- Direct SELECT of an internal column must fail; premium column must succeed
  SET LOCAL ROLE anon;
  BEGIN
    PERFORM bumps_today FROM public.listings WHERE id = '22222222-2222-2222-2222-222222222222';
    RAISE EXCEPTION 'FAIL A7: anon SELECT bumps_today succeeded';
  EXCEPTION
    WHEN insufficient_privilege THEN
      NULL;
  END;
  PERFORM is_premium FROM public.listings WHERE id = '22222222-2222-2222-2222-222222222222';
  RAISE NOTICE 'PASS A7: anon cannot read bumps_today; can read is_premium';
  RESET ROLE;

  -- INSERT/UPDATE privileges must be unchanged (column-level grants from 20261068)
  SELECT has_column_privilege('authenticated', 'public.listings', 'title', 'INSERT') INTO v_can;
  IF NOT v_can THEN
    RAISE EXCEPTION 'FAIL A8: authenticated lost INSERT on title';
  END IF;
  SELECT has_column_privilege('authenticated', 'public.listings', 'title', 'UPDATE') INTO v_can;
  IF NOT v_can THEN
    RAISE EXCEPTION 'FAIL A8: authenticated lost UPDATE on title';
  END IF;
  SELECT has_column_privilege('authenticated', 'public.listings', 'seller_phone', 'INSERT') INTO v_can;
  IF NOT v_can THEN
    RAISE EXCEPTION 'FAIL A8: authenticated lost INSERT on seller_phone';
  END IF;
  SELECT has_column_privilege('anon', 'public.listings', 'title', 'INSERT') INTO v_can;
  IF v_can THEN
    RAISE EXCEPTION 'FAIL A8: anon unexpectedly has INSERT on title';
  END IF;
  RAISE NOTICE 'PASS A8: INSERT/UPDATE privileges unchanged';

  -- RLS policies still present (current names after later migrations)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'listings'
      AND policyname = 'listings_select_public_or_owner_or_admin'
  ) THEN
    RAISE EXCEPTION 'FAIL A9: listings_select_public_or_owner_or_admin policy missing';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'listings'
      AND policyname = 'Allow authenticated insert with admin bypass'
  ) THEN
    RAISE EXCEPTION 'FAIL A9: listings insert policy missing';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'listings'
      AND policyname = 'listings_update_own_or_admin'
  ) THEN
    RAISE EXCEPTION 'FAIL A9: listings_update_own_or_admin policy missing';
  END IF;
  RAISE NOTICE 'PASS A9: RLS policies unchanged';
END $$;

-- ---------------------------------------------------------------------------
-- B. Public RPC outputs must return NULL for seller_phone
--    Required RPCs fail the test if the function is missing.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  v_phone text;
  v_count int;
  v_leaked int;
  v_sig text;
BEGIN
  -- Exact path
  v_sig := 'public.search_listings_v4_exact(text,text,integer,integer,text,text,numeric,numeric,text,text,jsonb)';
  IF to_regprocedure(v_sig) IS NULL THEN
    RAISE EXCEPTION 'FAIL B-exact: required function % is missing', v_sig;
  END IF;
  SET LOCAL ROLE anon;
  SELECT count(*), max(seller_phone) INTO v_count, v_phone
  FROM public.search_listings_v4_exact('PhonePrivacySynthetic', NULL, 10, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
  IF v_count = 0 THEN
    RAISE EXCEPTION 'FAIL B-exact: returned zero rows';
  END IF;
  IF v_phone IS NOT NULL THEN
    RAISE EXCEPTION 'FAIL B-exact: non-null seller_phone';
  END IF;
  RAISE NOTICE 'PASS B-exact: masks seller_phone (% rows)', v_count;
  RESET ROLE;

  -- Tiered v4 (current app contract)
  v_sig := 'public.search_listings_v4_tiered_v4(text,text,integer,integer,text,text,numeric,numeric,text,text,jsonb,integer,text,text,text)';
  IF to_regprocedure(v_sig) IS NULL THEN
    RAISE EXCEPTION 'FAIL B-tiered-v4: required function % is missing', v_sig;
  END IF;
  SET LOCAL ROLE anon;
  SELECT count(*), max(seller_phone) INTO v_count, v_phone
  FROM public.search_listings_v4_tiered_v4(
    'PhonePrivacySynthetic', NULL, 10, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL
  );
  IF v_count = 0 THEN
    RAISE EXCEPTION 'FAIL B-tiered-v4: returned zero rows';
  END IF;
  IF v_phone IS NOT NULL THEN
    RAISE EXCEPTION 'FAIL B-tiered-v4: non-null seller_phone';
  END IF;
  RAISE NOTICE 'PASS B-tiered-v4: masks seller_phone (% rows)', v_count;
  RESET ROLE;

  -- Seller listings: UUID key, phone key, and orphan-phone fallback.
  v_sig := 'public.listings_by_seller(text,text,integer,integer)';
  IF to_regprocedure(v_sig) IS NULL THEN
    RAISE EXCEPTION 'FAIL B-seller: required function % is missing', v_sig;
  END IF;

  -- Branch 1: UUID seller key.
  SET LOCAL ROLE anon;
  SELECT count(*), count(*) FILTER (WHERE seller_phone IS NOT NULL)
  INTO v_count, v_leaked
  FROM public.listings_by_seller('00000000-0000-0000-0000-0000000000a1', NULL, 10, 0);
  IF v_count = 0 THEN
    RAISE EXCEPTION 'FAIL B-seller-uuid: returned zero rows';
  END IF;
  IF v_leaked > 0 THEN
    RAISE EXCEPTION 'FAIL B-seller-uuid: non-null seller_phone';
  END IF;
  RAISE NOTICE 'PASS B-seller-uuid: masks seller_phone (% rows)', v_count;
  RESET ROLE;

  -- Branch 2: phone key resolved to user_id.
  SET LOCAL ROLE anon;
  SELECT count(*), count(*) FILTER (WHERE seller_phone IS NOT NULL)
  INTO v_count, v_leaked
  FROM public.listings_by_seller('0791111111', NULL, 10, 0);
  IF v_count = 0 THEN
    RAISE EXCEPTION 'FAIL B-seller-phone: returned zero rows';
  END IF;
  IF v_leaked > 0 THEN
    RAISE EXCEPTION 'FAIL B-seller-phone: non-null seller_phone';
  END IF;
  RAISE NOTICE 'PASS B-seller-phone: masks seller_phone (% rows)', v_count;
  RESET ROLE;

  -- Branch 3: orphan phone (no non-null user_id for this phone).
  SET LOCAL ROLE anon;
  SELECT count(*), count(*) FILTER (WHERE seller_phone IS NOT NULL)
  INTO v_count, v_leaked
  FROM public.listings_by_seller('0792222222', NULL, 10, 0);
  IF v_count = 0 THEN
    RAISE EXCEPTION 'FAIL B-seller-orphan: returned zero rows';
  END IF;
  IF v_leaked > 0 THEN
    RAISE EXCEPTION 'FAIL B-seller-orphan: non-null seller_phone';
  END IF;
  RAISE NOTICE 'PASS B-seller-orphan: masks seller_phone (% rows)', v_count;
  RESET ROLE;

  -- Legacy v3 wrapper (15-arg signature)
  v_sig := 'public.search_listings_v4_tiered_v3(text,text,integer,integer,text,text,numeric,numeric,text,text,jsonb,integer,text,text,text)';
  IF to_regprocedure(v_sig) IS NULL THEN
    RAISE EXCEPTION 'FAIL B-tiered-v3: required function % is missing', v_sig;
  END IF;
  SET LOCAL ROLE anon;
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v3(
    'PhonePrivacySynthetic', NULL, 10, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL
  );
  IF v_count = 0 THEN
    RAISE EXCEPTION 'FAIL B-tiered-v3: returned zero rows';
  END IF;
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v3(
    'PhonePrivacySynthetic', NULL, 10, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL
  )
  WHERE seller_phone IS NOT NULL;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'FAIL B-tiered-v3: % row(s) with non-null seller_phone', v_count;
  END IF;
  RAISE NOTICE 'PASS B-tiered-v3: masks seller_phone (at least one row, zero non-null phones)';
  RESET ROLE;

  -- Exact slug-aware RPC
  v_sig := 'public.search_listings_v4_exact_slugs(text,text,integer,integer,text,text,numeric,numeric,text,text,jsonb,text,text,text)';
  IF to_regprocedure(v_sig) IS NULL THEN
    RAISE EXCEPTION 'FAIL B-exact-slugs: required function % is missing', v_sig;
  END IF;
  SET LOCAL ROLE anon;
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact_slugs(
    'PhonePrivacySynthetic', NULL, 10, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
  );
  IF v_count = 0 THEN
    RAISE EXCEPTION 'FAIL B-exact-slugs: returned zero rows';
  END IF;
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact_slugs(
    'PhonePrivacySynthetic', NULL, 10, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
  )
  WHERE seller_phone IS NOT NULL;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'FAIL B-exact-slugs: % row(s) with non-null seller_phone', v_count;
  END IF;
  RAISE NOTICE 'PASS B-exact-slugs: masks seller_phone (at least one row, zero non-null phones)';
  RESET ROLE;

  -- Tiered slug-aware RPC
  v_sig := 'public.search_listings_v4_tiered_slugs(text,text,integer,integer,text,text,numeric,numeric,text,text,jsonb,text,text,text)';
  IF to_regprocedure(v_sig) IS NULL THEN
    RAISE EXCEPTION 'FAIL B-tiered-slugs: required function % is missing', v_sig;
  END IF;
  SET LOCAL ROLE anon;
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_slugs(
    'PhonePrivacySynthetic', NULL, 10, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
  );
  IF v_count = 0 THEN
    RAISE EXCEPTION 'FAIL B-tiered-slugs: returned zero rows';
  END IF;
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_slugs(
    'PhonePrivacySynthetic', NULL, 10, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
  )
  WHERE seller_phone IS NOT NULL;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'FAIL B-tiered-slugs: % row(s) with non-null seller_phone', v_count;
  END IF;
  RAISE NOTICE 'PASS B-tiered-slugs: masks seller_phone (at least one row, zero non-null phones)';
  RESET ROLE;

  v_sig := 'public.search_listings_v4_tiered_v2(text,text,integer,integer,text,text,numeric,numeric,text,text,jsonb,integer)';
  IF to_regprocedure(v_sig) IS NULL THEN
    RAISE EXCEPTION 'FAIL B-tiered-v2: required function % is missing', v_sig;
  END IF;
  SET LOCAL ROLE anon;
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v2(
    'PhonePrivacySynthetic', NULL, 10, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5
  );
  IF v_count = 0 THEN
    RAISE EXCEPTION 'FAIL B-tiered-v2: returned zero rows';
  END IF;
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v2(
    'PhonePrivacySynthetic', NULL, 10, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5
  )
  WHERE seller_phone IS NOT NULL;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'FAIL B-tiered-v2: % row(s) with non-null seller_phone', v_count;
  END IF;
  RAISE NOTICE 'PASS B-tiered-v2: masks seller_phone (at least one row, zero non-null phones)';
  RESET ROLE;
END $$;

-- ---------------------------------------------------------------------------
-- C. Semantic restriction + hybrid still callable and masks phone
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  v_count int;
  v_leaked int;
BEGIN
  SET LOCAL ROLE anon;
  BEGIN
    PERFORM 1 FROM public.search_listings_semantic(NULL::extensions.vector, NULL, 1, 0, NULL) LIMIT 1;
    RAISE EXCEPTION 'FAIL C1: anon can execute search_listings_semantic';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'PASS C1: anon cannot execute search_listings_semantic';
  END;
  RESET ROLE;

  SET LOCAL ROLE authenticated;
  BEGIN
    PERFORM 1 FROM public.search_listings_semantic(NULL::extensions.vector, NULL, 1, 0, NULL) LIMIT 1;
    RAISE EXCEPTION 'FAIL C2: authenticated can execute search_listings_semantic';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'PASS C2: authenticated cannot execute search_listings_semantic';
  END;
  RESET ROLE;

  -- Hybrid signature is (text, extensions.vector, text, integer, integer, ...)
  -- with defaults. The previous (text,text,integer,integer) lookup matched
  -- no function and would fail before the callability assertion.
  IF to_regprocedure('public.search_listings_hybrid(text,extensions.vector,text,integer,integer,double precision,text,text,text,numeric,numeric,text,text,jsonb)') IS NULL THEN
    RAISE EXCEPTION 'FAIL C3: search_listings_hybrid is missing';
  END IF;
  SET LOCAL ROLE anon;
  SELECT count(*), count(*) FILTER (WHERE seller_phone IS NOT NULL)
  INTO v_count, v_leaked
  FROM public.search_listings_hybrid('PhonePrivacySynthetic');
  IF v_count = 0 THEN
    RAISE EXCEPTION 'FAIL C3: hybrid returned zero rows';
  END IF;
  IF v_leaked > 0 THEN
    RAISE EXCEPTION 'FAIL C3: hybrid returned non-null seller_phone';
  END IF;
  RAISE NOTICE 'PASS C3: hybrid masks seller_phone (% rows)', v_count;
  RESET ROLE;
END $$;

-- ---------------------------------------------------------------------------
-- D. Authorized phone reveal, restrictions, and rate limit
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  v_ok boolean;
  v_phone text;
  v_i int;
BEGIN
  -- D1: unauthenticated must be rejected
  SET LOCAL ROLE anon;
  BEGIN
    PERFORM public.get_listing_phone('22222222-2222-2222-2222-222222222222');
    RAISE EXCEPTION 'FAIL D1: anon successfully called get_listing_phone';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'PASS D1: unauthenticated get_listing_phone rejected with insufficient_privilege';
    WHEN OTHERS THEN
      IF SQLERRM LIKE 'FAIL D1%' THEN
        RAISE;
      END IF;
      RAISE NOTICE 'PASS D1: unauthenticated get_listing_phone rejected (%).', SQLSTATE;
  END;
  RESET ROLE;

  -- D2: authenticated holds EXECUTE
  SELECT has_function_privilege('authenticated', 'public.get_listing_phone(uuid)', 'EXECUTE') INTO v_ok;
  IF NOT v_ok THEN
    RAISE EXCEPTION 'FAIL D2: authenticated missing EXECUTE on get_listing_phone';
  END IF;
  RAISE NOTICE 'PASS D2: authenticated has EXECUTE on get_listing_phone';

  -- D3: authenticated role with no identity is rejected with AUTHENTICATION_REQUIRED
  SET LOCAL ROLE authenticated;
  BEGIN
    PERFORM public.get_listing_phone('22222222-2222-2222-2222-222222222222');
    RAISE EXCEPTION 'FAIL D3: authenticated with null auth.uid() revealed a phone';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'PASS D3: missing identity rejected';
    WHEN OTHERS THEN
      IF SQLERRM LIKE 'FAIL D3%' THEN
        RAISE;
      END IF;
      IF SQLERRM NOT LIKE '%AUTHENTICATION_REQUIRED%' THEN
        RAISE EXCEPTION 'FAIL D3: unexpected rejection (%)', SQLERRM;
      END IF;
      RAISE NOTICE 'PASS D3: missing identity rejected with AUTHENTICATION_REQUIRED';
  END;
  RESET ROLE;

  -- D4: non-owner authenticated caller gets the synthetic active phone.
  PERFORM set_config(
    'request.jwt.claims',
    '{"sub":"00000000-0000-0000-0000-0000000000a2","email":"phone-test-auth@example.com"}',
    true
  );
  SET LOCAL ROLE authenticated;
  v_phone := public.get_listing_phone('22222222-2222-2222-2222-222222222222');
  IF v_phone IS NULL THEN
    RAISE EXCEPTION 'FAIL D4: active non-demo listing returned NULL';
  END IF;
  RAISE NOTICE 'PASS D4: active non-demo listing phone revealed to authenticated';

  -- D5: inactive listing returns NULL and does not count as a reveal
  v_phone := public.get_listing_phone('44444444-4444-4444-4444-444444444444');
  IF v_phone IS NOT NULL THEN
    RAISE EXCEPTION 'FAIL D5: inactive listing returned a phone';
  END IF;
  RAISE NOTICE 'PASS D5: inactive listing returns NULL';

  -- D6: demo listing returns NULL
  v_phone := public.get_listing_phone('55555555-5555-5555-5555-555555555555');
  IF v_phone IS NOT NULL THEN
    RAISE EXCEPTION 'FAIL D6: demo listing returned a phone';
  END IF;
  RAISE NOTICE 'PASS D6: demo listing returns NULL';
  RESET ROLE;

  -- D7: admin can reveal active demo listing phone and is not rate-limited
  INSERT INTO public.admins (email)
  VALUES ('phone-test-auth@example.com')
  ON CONFLICT (email) DO NOTHING;
  PERFORM set_config(
    'request.jwt.claims',
    '{"sub":"00000000-0000-0000-0000-0000000000a2","email":"phone-test-auth@example.com"}',
    true
  );
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'FAIL D7: synthetic admin was not recognized';
  END IF;
  SET LOCAL ROLE authenticated;
  v_phone := public.get_listing_phone('55555555-5555-5555-5555-555555555555');
  IF v_phone IS NULL THEN
    RAISE EXCEPTION 'FAIL D7: admin could not reveal synthetic active demo listing phone';
  END IF;
  RAISE NOTICE 'PASS D7: admin can reveal active demo listing phone (synthetic only)';
  -- Admin can perform at least 21 successful reveals (rate limit bypass)
  FOR v_i IN 1..21 LOOP
    v_phone := public.get_listing_phone('55555555-5555-5555-5555-555555555555');
    IF v_phone IS NULL THEN
      RAISE EXCEPTION 'FAIL D7b: admin reveal % of 21 returned NULL', v_i;
    END IF;
  END LOOP;
  RAISE NOTICE 'PASS D7b: admin performed 21 successful demo reveals without rate limit';
  RESET ROLE;

  -- D8: rate limit allows the 20th reveal and rejects the 21st.
  -- D4 already consumed 1 reveal for a2. Use a fresh caller.
  INSERT INTO auth.users (id, email)
  VALUES ('00000000-0000-0000-0000-0000000000a3', 'phone-test-limit@example.com')
  ON CONFLICT (id) DO NOTHING;
  PERFORM set_config(
    'request.jwt.claims',
    '{"sub":"00000000-0000-0000-0000-0000000000a3","email":"phone-test-limit@example.com"}',
    true
  );
  SET LOCAL ROLE authenticated;
  FOR v_i IN 1..20 LOOP
    v_phone := public.get_listing_phone('22222222-2222-2222-2222-222222222222');
    IF v_phone IS NULL THEN
      RAISE EXCEPTION 'FAIL D8: reveal % of 20 returned NULL', v_i;
    END IF;
  END LOOP;
  BEGIN
    PERFORM public.get_listing_phone('22222222-2222-2222-2222-222222222222');
    RAISE EXCEPTION 'FAIL D8: 21st reveal succeeded';
  EXCEPTION
    WHEN OTHERS THEN
      IF SQLERRM LIKE 'FAIL D8%' THEN
        RAISE;
      END IF;
      IF SQLERRM NOT LIKE '%RATE_LIMIT_EXCEEDED%' THEN
        RAISE EXCEPTION 'FAIL D8: 21st reveal rejected with %', SQLERRM;
      END IF;
  END;
  RAISE NOTICE 'PASS D8: 20th reveal allowed, 21st rejected with RATE_LIMIT_EXCEEDED';
  RESET ROLE;
END $$;

ROLLBACK;
