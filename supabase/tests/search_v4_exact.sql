-- search_v4_exact.sql
-- Exact-first search. Related only when exact is empty.
-- LOCAL ONLY. All fixtures rolled back.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = '90000000-0000-4000-8000-000000000001'::uuid
  ) OR EXISTS (
    SELECT 1 FROM public.listings
    WHERE id BETWEEN '91000000-0000-4000-8000-000000000001'::uuid
                 AND '91000000-0000-4000-8000-000000000040'::uuid
  ) THEN
    RAISE EXCEPTION 'PREREQ FAIL: v4 fixture UUID already exists';
  END IF;
END $$;

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES (
  '90000000-0000-4000-8000-000000000001'::uuid,
  'authenticated', 'authenticated',
  'v4-exact-90000000@example.invalid',
  '', now(), '{}'::jsonb, '{}'::jsonb
);

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, neighborhood, category_slug, subcategory_slug, status,
  attributes, created_at
)
VALUES
  -- T1 motors
  ('91000000-0000-4000-8000-000000000001'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4m تسلا 2022 احمر', 'motors exact', '100', 'JOD', 'JO',
   'Amman', 'Abdoun', 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-04T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000002'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4m تسلا 2022 ازرق', 'motors related', '100', 'JOD', 'JO',
   'Amman', 'Abdoun', 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-03T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000003'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4m تسلا 2020 احمر', 'motors related', '100', 'JOD', 'JO',
   'Amman', 'Abdoun', 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-02T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000004'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4m تسلا 2020 ازرق', 'motors related', '100', 'JOD', 'JO',
   'Amman', 'Abdoun', 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-01T10:00:00Z'),
  -- T2 real estate
  ('91000000-0000-4000-8000-000000000005'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4re شقة غرف عمان', 're exact', '200', 'JOD', 'JO',
   'Amman', NULL, 'real-estate', 'for-sale', 'active', '[]'::jsonb,
   '2026-10-04T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000006'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4re شقة غرف', 're related', '200', 'JOD', 'JO',
   'Amman', NULL, 'real-estate', 'for-sale', 'active', '[]'::jsonb,
   '2026-10-03T10:00:00Z'),
  -- T3 services
  ('91000000-0000-4000-8000-000000000007'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4sv كهربائي عمان', 'svc exact', '50', 'JOD', 'JO',
   'Amman', NULL, 'services', 'delivery', 'active', '[]'::jsonb,
   '2026-10-04T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000008'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4sv كهربائي', 'svc related', '50', 'JOD', 'JO',
   'Amman', NULL, 'services', 'delivery', 'active', '[]'::jsonb,
   '2026-10-03T10:00:00Z'),
  -- T4 jobs
  ('91000000-0000-4000-8000-000000000009'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4jb مهندس برمجيات', 'job exact', '0', 'JOD', 'JO',
   'Amman', NULL, 'jobs', NULL, 'active', '[]'::jsonb,
   '2026-10-04T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000010'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4jb مهندس', 'job related', '0', 'JOD', 'JO',
   'Amman', NULL, 'jobs', NULL, 'active', '[]'::jsonb,
   '2026-10-03T10:00:00Z'),
  -- T5 electronics
  ('91000000-0000-4000-8000-000000000011'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4el ايفون برو', 'elec exact', '300', 'JOD', 'JO',
   'Amman', NULL, 'electronics', 'phones', 'active', '[]'::jsonb,
   '2026-10-04T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000012'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4el ايفون', 'elec related', '300', 'JOD', 'JO',
   'Amman', NULL, 'electronics', 'phones', 'active', '[]'::jsonb,
   '2026-10-03T10:00:00Z'),
  -- T6 no exact, has related
  ('91000000-0000-4000-8000-000000000013'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4nx تسلا ازرق', 'no exact', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-04T10:00:00Z'),
  -- T9 >5 tokens
  ('91000000-0000-4000-8000-000000000014'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4six alpha bravo charlie delta echo foxtrot', 'six exact',
   '100', 'JOD', 'JO', 'Amman', NULL, 'motors', 'cars', 'active',
   '[]'::jsonb, '2026-10-04T10:00:00Z'),
  -- T10 filters
  ('91000000-0000-4000-8000-000000000015'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4flt تسلا 2022 احمر', 'filter exact', '150', 'JOD', 'JO',
   'Amman', 'Abdoun', 'motors', 'cars', 'active',
   '[{"key":"make","value":"v4fltattr"}]'::jsonb,
   '2026-10-04T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000016'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4flt تسلا 2022 احمر', 'filter sa', '150', 'SAR', 'SA',
   'Riyadh', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-04T10:00:00Z'),
  -- T11 / T12 ordering
  ('91000000-0000-4000-8000-000000000017'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4ord تسلا 2022 احمر', 'older exact', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-01T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000018'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4ord تسلا 2022 احمر', 'newer exact', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-05T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000019'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4relordonly تسلا 2022', 'related two tokens', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-01T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000020'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4relordonly تسلا', 'related one token', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-05T10:00:00Z'),
  -- T10 filter mismatches: each filter excludes a deliberately wrong row.
  ('91000000-0000-4000-8000-000000000021'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4flt تسلا 2022 احمر', 'wrong category', '150', 'JOD', 'JO',
   'Amman', 'Abdoun', 'electronics', 'cars', 'active',
   '[{"key":"make","value":"v4fltattr"}]'::jsonb, '2026-10-04T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000022'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4flt تسلا 2022 احمر', 'wrong subcategory', '150', 'JOD', 'JO',
   'Amman', 'Abdoun', 'motors', 'parts', 'active',
   '[{"key":"make","value":"v4fltattr"}]'::jsonb, '2026-10-04T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000023'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4flt تسلا 2022 احمر', 'below min', '50', 'JOD', 'JO',
   'Amman', 'Abdoun', 'motors', 'cars', 'active',
   '[{"key":"make","value":"v4fltattr"}]'::jsonb, '2026-10-04T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000024'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4flt تسلا 2022 احمر', 'above max', '900', 'JOD', 'JO',
   'Amman', 'Abdoun', 'motors', 'cars', 'active',
   '[{"key":"make","value":"v4fltattr"}]'::jsonb, '2026-10-04T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000025'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4flt تسلا 2022 احمر', 'wrong city', '150', 'JOD', 'JO',
   'Zarqa', 'Abdoun', 'motors', 'cars', 'active',
   '[{"key":"make","value":"v4fltattr"}]'::jsonb, '2026-10-04T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000026'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4flt تسلا 2022 احمر', 'wrong neighborhood', '150', 'JOD', 'JO',
   'Amman', 'Jubeiha', 'motors', 'cars', 'active',
   '[{"key":"make","value":"v4fltattr"}]'::jsonb, '2026-10-04T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000027'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4flt تسلا 2022 احمر', 'wrong attrs', '150', 'JOD', 'JO',
   'Amman', 'Abdoun', 'motors', 'cars', 'active',
   '[{"key":"make","value":"other"}]'::jsonb, '2026-10-04T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000028'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4relbad تسلا ازرق', 'related wrong market', '150', 'SAR', 'SA',
   'Amman', 'Abdoun', 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-04T10:00:00Z'),
  ('91000000-0000-4000-8000-000000000029'::uuid,
   '90000000-0000-4000-8000-000000000001'::uuid,
   'v4ord تسلا', 'related candidate for T11', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-01T10:00:00Z');

-- Test-only instrumentation. Created inside this transaction and rolled back.
CREATE TABLE public.search_v4_trace (
  id bigserial PRIMARY KEY,
  branch text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$
DECLARE
  v_exact uuid[];
  v_related uuid[];
  v_count integer;
  v_found boolean;
  v_first uuid;
  v_second uuid;
  v_matched integer;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'search_listings_v4_exact'
  ) THEN
    RAISE EXCEPTION 'TEST T0 FAIL: search_listings_v4_exact missing';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'search_listings_v4_exact'
      AND p.prosrc ILIKE '%search_listings_v2%'
  ) THEN
    RAISE EXCEPTION 'TEST T0 FAIL: v4 references a v2 RPC';
  END IF;
  RAISE NOTICE 'PASS T0: v4 exists and does not call v2';

  -- T1 motors + branch instrumentation
  DELETE FROM public.search_v4_trace;
  PERFORM set_config('app.v4_trace', 'on', true);

  SELECT array_agg(id ORDER BY id) INTO v_exact
  FROM public.search_listings_v4_exact('تسلا 2022 احمر', 'JO', 100, 0)
  WHERE match_kind = 'exact' AND title LIKE 'v4m %';

  SELECT array_agg(id ORDER BY id) INTO v_related
  FROM public.search_listings_v4_exact('تسلا 2022 احمر', 'JO', 100, 0)
  WHERE match_kind = 'related' AND title LIKE 'v4m %';

  IF v_exact IS DISTINCT FROM ARRAY['91000000-0000-4000-8000-000000000001'::uuid]
     OR v_related IS NOT NULL
  THEN
    RAISE EXCEPTION 'TEST T1 FAIL: exact=% related=%', v_exact, v_related;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.search_v4_trace WHERE branch = 'exact')
     OR EXISTS (SELECT 1 FROM public.search_v4_trace WHERE branch = 'related')
  THEN
    RAISE EXCEPTION 'TEST T1 FAIL: related branch ran while exact existed';
  END IF;
  RAISE NOTICE 'PASS T1: exact branch only; related branch was not entered';

  -- T2 real estate
  SELECT array_agg(id) INTO v_exact
  FROM public.search_listings_v4_exact('شقة غرف عمان', 'JO', 100, 0)
  WHERE match_kind = 'exact' AND title LIKE 'v4re %';
  IF v_exact IS DISTINCT FROM ARRAY['91000000-0000-4000-8000-000000000005'::uuid] THEN
    RAISE EXCEPTION 'TEST T2 FAIL: exact=%', v_exact;
  END IF;
  RAISE NOTICE 'PASS T2: real-estate exact only';

  -- T3 services
  SELECT array_agg(id) INTO v_exact
  FROM public.search_listings_v4_exact('كهربائي عمان', 'JO', 100, 0)
  WHERE match_kind = 'exact' AND title LIKE 'v4sv %';
  IF v_exact IS DISTINCT FROM ARRAY['91000000-0000-4000-8000-000000000007'::uuid] THEN
    RAISE EXCEPTION 'TEST T3 FAIL: exact=%', v_exact;
  END IF;
  RAISE NOTICE 'PASS T3: services exact only';

  -- T4 jobs
  SELECT array_agg(id) INTO v_exact
  FROM public.search_listings_v4_exact('مهندس برمجيات', 'JO', 100, 0)
  WHERE match_kind = 'exact' AND title LIKE 'v4jb %';
  IF v_exact IS DISTINCT FROM ARRAY['91000000-0000-4000-8000-000000000009'::uuid] THEN
    RAISE EXCEPTION 'TEST T4 FAIL: exact=%', v_exact;
  END IF;
  RAISE NOTICE 'PASS T4: jobs exact only';

  -- T5 electronics
  SELECT array_agg(id) INTO v_exact
  FROM public.search_listings_v4_exact('ايفون برو', 'JO', 100, 0)
  WHERE match_kind = 'exact' AND title LIKE 'v4el %';
  IF v_exact IS DISTINCT FROM ARRAY['91000000-0000-4000-8000-000000000011'::uuid] THEN
    RAISE EXCEPTION 'TEST T5 FAIL: exact=%', v_exact;
  END IF;
  RAISE NOTICE 'PASS T5: electronics exact only';

  -- T6 no exact, has related + branch instrumentation
  DELETE FROM public.search_v4_trace;

  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('v4nx تسلا احمر', 'JO', 100, 0)
  WHERE match_kind = 'exact';
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T6 FAIL: exact was not empty';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact('v4nx تسلا احمر', 'JO', 100, 0)
    WHERE match_kind = 'related'
      AND id = '91000000-0000-4000-8000-000000000013'::uuid
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T6 FAIL: related fixture missing';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.search_v4_trace WHERE branch = 'related')
     OR EXISTS (SELECT 1 FROM public.search_v4_trace WHERE branch = 'exact')
  THEN
    RAISE EXCEPTION 'TEST T6 FAIL: related branch was not the path taken';
  END IF;
  RAISE NOTICE 'PASS T6: related branch entered only because exact was empty';

  -- T7 no exact, no related
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('zzznomatch1 zzznomatch2', 'JO', 100, 0);
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T7 FAIL: expected empty, got %', v_count;
  END IF;
  RAISE NOTICE 'PASS T7: no exact and no related';

  -- T8 stopword-only
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('بدي شو', 'JO', 100, 0);
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T8 FAIL: stopword-only returned % rows', v_count;
  END IF;
  RAISE NOTICE 'PASS T8: stopword-only is empty, no fallback';

  -- T9 >5 tokens still exact
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact(
      'v4six alpha bravo charlie delta echo foxtrot', 'JO', 100, 0
    )
    WHERE match_kind = 'exact'
      AND id = '91000000-0000-4000-8000-000000000014'::uuid
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T9 FAIL: 6-token exact fixture missing';
  END IF;
  RAISE NOTICE 'PASS T9: >5 tokens still computed as exact';

  -- T10 filters
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact(
      'v4flt تسلا 2022 احمر', 'JO', 100, 0,
      'motors', 'cars', 100, 200, 'Amman', 'Abdoun',
      '[{"key":"make","value":"v4fltattr"}]'::jsonb
    )
    WHERE id = '91000000-0000-4000-8000-000000000015'::uuid
      AND match_kind = 'exact'
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T10 FAIL: filtered exact fixture missing';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact(
      'v4flt تسلا 2022 احمر', 'JO', 100, 0,
      'motors', 'cars', 100, 200, 'Amman', 'Abdoun',
      '[{"key":"make","value":"v4fltattr"}]'::jsonb
    )
    WHERE id = '91000000-0000-4000-8000-000000000016'::uuid
  ) INTO v_found;
  IF v_found THEN
    RAISE EXCEPTION 'TEST T10 FAIL: SA fixture leaked into JO filtered exact';
  END IF;

  -- T10 exact-branch: non-empty exact set, each mismatch excluded.
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact(
    'v4flt تسلا 2022 احمر', 'JO', 100, 0,
    'motors', 'cars', 100, 200, 'Amman', 'Abdoun',
    '[{"key":"make","value":"v4fltattr"}]'::jsonb
  )
  WHERE match_kind = 'exact';
  IF v_count < 1 THEN
    RAISE EXCEPTION 'TEST T10 FAIL: exact set was empty, filter exclusions are vacuous';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact(
      'v4flt تسلا 2022 احمر', 'JO', 100, 0,
      'motors', 'cars', 100, 200, 'Amman', 'Abdoun',
      '[{"key":"make","value":"v4fltattr"}]'::jsonb
    )
    WHERE match_kind = 'exact'
      AND id IN (
      '91000000-0000-4000-8000-000000000016'::uuid,
      '91000000-0000-4000-8000-000000000021'::uuid,
      '91000000-0000-4000-8000-000000000022'::uuid,
      '91000000-0000-4000-8000-000000000023'::uuid,
      '91000000-0000-4000-8000-000000000024'::uuid,
      '91000000-0000-4000-8000-000000000025'::uuid,
      '91000000-0000-4000-8000-000000000026'::uuid,
      '91000000-0000-4000-8000-000000000027'::uuid
    )
  ) THEN
    RAISE EXCEPTION 'TEST T10 FAIL: a mismatched fixture leaked into the non-empty exact set';
  END IF;

  -- Related-branch exclusions for every filter dimension.
  -- extraunmatched makes the exact set empty so related is computed.
  IF EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact(
      'v4flt تسلا 2022 احمر extraunmatched', 'JO', 100, 0,
      'motors', 'cars', 100, 200, 'Amman', 'Abdoun',
      '[{"key":"make","value":"v4fltattr"}]'::jsonb
    )
    WHERE match_kind = 'exact'
  ) THEN
    RAISE EXCEPTION 'TEST T10 FAIL: related-branch query unexpectedly had exact rows';
  END IF;

  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact(
    'v4flt تسلا 2022 احمر extraunmatched', 'JO', 100, 0,
    'motors', 'cars', 100, 200, 'Amman', 'Abdoun',
    '[{"key":"make","value":"v4fltattr"}]'::jsonb
  )
  WHERE match_kind = 'related';
  IF v_count < 1 THEN
    RAISE EXCEPTION 'TEST T10 FAIL: related set was empty, exclusion checks are vacuous';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact(
      'v4flt تسلا 2022 احمر extraunmatched', 'JO', 100, 0,
      'motors', 'cars', 100, 200, 'Amman', 'Abdoun',
      '[{"key":"make","value":"v4fltattr"}]'::jsonb
    )
    WHERE match_kind = 'related'
      AND id IN (
      '91000000-0000-4000-8000-000000000021'::uuid,
      '91000000-0000-4000-8000-000000000022'::uuid,
      '91000000-0000-4000-8000-000000000023'::uuid,
      '91000000-0000-4000-8000-000000000024'::uuid,
      '91000000-0000-4000-8000-000000000025'::uuid,
      '91000000-0000-4000-8000-000000000026'::uuid,
      '91000000-0000-4000-8000-000000000027'::uuid
    )
  ) THEN
    RAISE EXCEPTION 'TEST T10 FAIL: a mismatched fixture leaked into the related set';
  END IF;

  -- Related-branch market check on ...0028.
  IF EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact(
      'v4relbad تسلا', 'JO', 100, 0,
      'motors', 'cars', 100, 200, 'Amman', 'Abdoun', NULL
    )
    WHERE match_kind = 'related'
      AND id = '91000000-0000-4000-8000-000000000028'::uuid
  ) THEN
    RAISE EXCEPTION 'TEST T10 FAIL: related set ignored market filter';
  END IF;
  RAISE NOTICE 'PASS T10: exact and related sets exclude all seven filter mismatches';

  -- T11A: exact exists, offset past end, related candidate exists → empty
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('v4ord تسلا 2022 احمر', 'JO', 10, 5);
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T11 FAIL: offset past exact returned % rows', v_count;
  END IF;

  -- T11B: related pagination is independent when exact is empty
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('v4relordonly تسلا 2022 احمر', 'JO', 1, 1)
  WHERE match_kind = 'related';
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'TEST T11 FAIL: related pagination returned % rows', v_count;
  END IF;
  RAISE NOTICE 'PASS T11: exact page does not fall through; related paginates independently';

  -- T12 ordering
  SELECT id INTO v_first
  FROM public.search_listings_v4_exact('v4ord تسلا 2022 احمر', 'JO', 10, 0)
  ORDER BY created_at DESC
  LIMIT 1;
  IF v_first <> '91000000-0000-4000-8000-000000000018'::uuid THEN
    RAISE EXCEPTION 'TEST T12 FAIL: exact order first=%', v_first;
  END IF;

  SELECT id, total_matched_tokens INTO v_first, v_matched
  FROM public.search_listings_v4_exact('v4relordonly تسلا 2022 احمر', 'JO', 10, 0)
  WHERE match_kind = 'related'
    AND title LIKE 'v4relord %'
  ORDER BY total_matched_tokens DESC, created_at DESC
  LIMIT 1;
  IF v_first <> '91000000-0000-4000-8000-000000000019'::uuid OR v_matched < 2 THEN
    RAISE EXCEPTION 'TEST T12 FAIL: related order first=% matched=%', v_first, v_matched;
  END IF;
  RAISE NOTICE 'PASS T12: exact by created_at, related by matched tokens';

  RAISE NOTICE 'ALL V4 EXACT SEARCH TESTS PASSED';
END $$;

ROLLBACK;

SELECT 'ALL V4 EXACT SEARCH TESTS PASSED; FIXTURES ROLLED BACK' AS result;
