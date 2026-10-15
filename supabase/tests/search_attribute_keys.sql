-- search_attribute_keys.sql
-- Attribute keys are indexed and Arabic aliases match.
-- LOCAL ONLY. Fixtures rolled back.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = '92000000-0000-4000-8000-000000000001'::uuid
  ) THEN
    RAISE EXCEPTION 'PREREQ FAIL: attribute-key fixture user already exists';
  END IF;
END $$;

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES (
  '92000000-0000-4000-8000-000000000001'::uuid,
  'authenticated', 'authenticated',
  'attr-keys-92000000@example.invalid',
  '', now(), '{}'::jsonb, '{}'::jsonb
);

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, category_slug, subcategory_slug, status, attributes
)
VALUES
  ('93000000-0000-4000-8000-000000000001'::uuid,
   '92000000-0000-4000-8000-000000000001'::uuid,
   'akprobe color only', 'color fixture', '100', 'JOD', 'JO',
   'Amman', 'motors', 'cars', 'active',
   '[{"key":"color","value":"أحمر"}]'::jsonb),
  ('93000000-0000-4000-8000-000000000002'::uuid,
   '92000000-0000-4000-8000-000000000001'::uuid,
   'akprobe color year', 'color year fixture', '100', 'JOD', 'JO',
   'Amman', 'motors', 'cars', 'active',
   '[{"key":"color","value":"أحمر"},{"key":"year","value":"2022"}]'::jsonb),
  ('93000000-0000-4000-8000-000000000003'::uuid,
   '92000000-0000-4000-8000-000000000001'::uuid,
   'akprobe rooms area', 'real estate fixture', '200', 'JOD', 'JO',
   'Amman', 'real-estate', 'for-sale', 'active',
   '[{"key":"rooms","value":"3"},{"key":"area","value":"120"}]'::jsonb),
  ('93000000-0000-4000-8000-000000000004'::uuid,
   '92000000-0000-4000-8000-000000000001'::uuid,
   'akprobe brand', 'electronics fixture', '300', 'JOD', 'JO',
   'Amman', 'electronics', NULL, 'active',
   '[{"key":"brand","value":"سامسونج"}]'::jsonb),
  ('93000000-0000-4000-8000-000000000005'::uuid,
   '92000000-0000-4000-8000-000000000001'::uuid,
   'akprobe other', 'other fixture', '100', 'JOD', 'JO',
   'Amman', 'motors', 'cars', 'active',
   '[{"key":"fuel","value":"بنزين"}]'::jsonb),
  ('93000000-0000-4000-8000-000000000006'::uuid,
   '92000000-0000-4000-8000-000000000001'::uuid,
   'akprobe device', 'device fixture', '400', 'JOD', 'JO',
   'Amman', 'electronics', NULL, 'active',
   '[{"key":"network","value":"5G"},{"key":"storage","value":"256GB"},{"key":"processor","value":"Snapdragon"}]'::jsonb);

DO $$
DECLARE
  v_text text;
  v_found boolean;
  v_count integer;
  v_before text;
  v_after text;
BEGIN
  -- T1
  IF public.search_json_keys(
       '[{"key":"color","value":"أحمر"},{"key":"year","value":"2022"}]'::jsonb
     ) IS DISTINCT FROM 'color year' THEN
    RAISE EXCEPTION 'TEST T1 FAIL: keys=%',
      public.search_json_keys(
        '[{"key":"color","value":"أحمر"},{"key":"year","value":"2022"}]'::jsonb
      );
  END IF;
  RAISE NOTICE 'PASS T1: search_json_keys returns keys only';

  -- T2
  IF public.search_json_keys(NULL) IS DISTINCT FROM ''
     OR public.search_json_keys('[]'::jsonb) IS DISTINCT FROM ''
     OR public.search_json_keys('[{"value":"x"}]'::jsonb) IS DISTINCT FROM ''
  THEN
    RAISE EXCEPTION 'TEST T2 FAIL: null/empty/missing not handled';
  END IF;
  RAISE NOTICE 'PASS T2: null, empty, and missing keys return empty';

  -- T3
  SELECT search_text INTO v_text
  FROM public.listings
  WHERE id = '93000000-0000-4000-8000-000000000001'::uuid;
  IF strpos(coalesce(v_text, ''), 'color') = 0 THEN
    RAISE EXCEPTION 'TEST T3 FAIL: search_text missing color key: %', v_text;
  END IF;
  RAISE NOTICE 'PASS T3: trigger writes attribute keys into search_text';

  -- T4
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact('لون احمر 2022', 'JO', 100, 0)
    WHERE id = '93000000-0000-4000-8000-000000000002'::uuid
      AND match_kind = 'exact'
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T4 FAIL: Arabic key query did not exact-match';
  END IF;
  RAISE NOTICE 'PASS T4: Arabic key query matches exactly';

  -- T5
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact('color red 2022', 'JO', 100, 0)
    WHERE id = '93000000-0000-4000-8000-000000000002'::uuid
      AND match_kind = 'exact'
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T5 FAIL: English key query did not exact-match';
  END IF;
  RAISE NOTICE 'PASS T5: English key query matches exactly';

  -- T6
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact('غرف 3 مساحة 120', 'JO', 100, 0)
    WHERE id = '93000000-0000-4000-8000-000000000003'::uuid
      AND match_kind = 'exact'
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T6 FAIL: real-estate key query did not exact-match';
  END IF;
  RAISE NOTICE 'PASS T6: real-estate Arabic keys match';

  -- T7
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact('ماركة سامسونج', 'JO', 100, 0)
    WHERE id = '93000000-0000-4000-8000-000000000004'::uuid
      AND match_kind = 'exact'
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T7 FAIL: electronics key query did not exact-match';
  END IF;
  RAISE NOTICE 'PASS T7: electronics Arabic key matches';

  -- T8
  SELECT count(*) INTO v_count
  FROM public.search_listings_v2_intent_typo('لون احمر 2022', 'JO', 100, 0);
  IF v_count < 1 THEN
    RAISE EXCEPTION 'TEST T8 FAIL: v2 returned no rows';
  END IF;
  RAISE NOTICE 'PASS T8: v2 still returns results';

  -- T9
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact('لون ازرق', 'JO', 100, 0)
    WHERE id = '93000000-0000-4000-8000-000000000001'::uuid
      AND match_kind = 'exact'
  ) INTO v_found;
  IF v_found THEN
    RAISE EXCEPTION 'TEST T9 FAIL: non-matching color was exact';
  END IF;
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact('لون ازرق', 'JO', 100, 0)
    WHERE id = '93000000-0000-4000-8000-000000000001'::uuid
      AND match_kind = 'related'
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T9 FAIL: non-matching color was not related';
  END IF;
  RAISE NOTICE 'PASS T9: wrong color is related, not exact';

  -- T10
  SELECT search_text INTO v_text
  FROM public.listings
  WHERE id = '93000000-0000-4000-8000-000000000005'::uuid;
  IF strpos(coalesce(v_text, ''), 'color') > 0 THEN
    RAISE EXCEPTION 'TEST T10 FAIL: color key leaked into the other listing';
  END IF;
  RAISE NOTICE 'PASS T10: attribute keys do not leak across listings';

  -- T11
  ALTER TABLE public.listings DISABLE TRIGGER set_listings_search_text_trigger;
  UPDATE public.listings
  SET search_text = 'corrupt'
  WHERE id = '93000000-0000-4000-8000-000000000001'::uuid;
  ALTER TABLE public.listings ENABLE TRIGGER set_listings_search_text_trigger;

  UPDATE public.listings
  SET search_version = 0
  WHERE id = '93000000-0000-4000-8000-000000000001'::uuid;

  SELECT search_text INTO v_text
  FROM public.listings
  WHERE id = '93000000-0000-4000-8000-000000000001'::uuid;
  IF strpos(coalesce(v_text, ''), 'color') = 0 OR v_text = 'corrupt' THEN
    RAISE EXCEPTION 'TEST T11 FAIL: backfill did not rebuild keys: %', v_text;
  END IF;
  RAISE NOTICE 'PASS T11: backfill rebuilds search_text with keys';

  -- T12
  SELECT search_text INTO v_before
  FROM public.listings
  WHERE id = '93000000-0000-4000-8000-000000000002'::uuid;

  UPDATE public.listings
  SET attributes = '[{"key":"color","value":"أحمر"},{"key":"year","value":"2022"}]'::jsonb
  WHERE id = '93000000-0000-4000-8000-000000000002'::uuid;

  SELECT search_text INTO v_after
  FROM public.listings
  WHERE id = '93000000-0000-4000-8000-000000000002'::uuid;

  IF v_before IS DISTINCT FROM v_after THEN
    RAISE EXCEPTION 'TEST T12 FAIL: search_text changed on idempotent update';
  END IF;
  RAISE NOTICE 'PASS T12: trigger is idempotent for the same attributes';

  -- T13
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact('الشبكة 5G', 'JO', 100, 0)
    WHERE id = '93000000-0000-4000-8000-000000000006'::uuid
      AND match_kind = 'exact'
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T13 FAIL: الشبكة 5G was not exact';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact('الذاكرة 256GB', 'JO', 100, 0)
    WHERE id = '93000000-0000-4000-8000-000000000006'::uuid
      AND match_kind = 'exact'
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T13 FAIL: الذاكرة 256GB was not exact';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact('المعالج Snapdragon', 'JO', 100, 0)
    WHERE id = '93000000-0000-4000-8000-000000000006'::uuid
      AND match_kind = 'exact'
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T13 FAIL: المعالج Snapdragon was not exact';
  END IF;
  RAISE NOTICE 'PASS T13: UI-style exact phrases match';

  RAISE NOTICE 'ALL ATTRIBUTE KEY TESTS PASSED';
END $$;

ROLLBACK;

SELECT 'ALL ATTRIBUTE KEY TESTS PASSED; FIXTURES ROLLED BACK' AS result;
