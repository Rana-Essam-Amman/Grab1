-- search_v2_intent_stopword_guard.sql
-- Guard: search_listings_v2_intent returns zero rows on zero meaningful tokens.
-- LOCAL ONLY. All fixtures rolled back.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = '94000000-0000-4000-8000-000000000001'::uuid
  ) OR EXISTS (
    SELECT 1 FROM public.listings
    WHERE id BETWEEN '95000000-0000-4000-8000-000000000001'::uuid
                 AND '95000000-0000-4000-8000-000000000010'::uuid
  ) THEN
    RAISE EXCEPTION 'PREREQ FAIL: v2-intent-guard fixture UUID already exists';
  END IF;
END $$;

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES (
  '94000000-0000-4000-8000-000000000001'::uuid,
  'authenticated', 'authenticated',
  'v2-intent-guard-94000000@example.invalid',
  '', now(), '{}'::jsonb, '{}'::jsonb
);

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, neighborhood, category_slug, subcategory_slug, status,
  attributes, created_at
)
VALUES
  (
    '95000000-0000-4000-8000-000000000001'::uuid,
    '94000000-0000-4000-8000-000000000001'::uuid,
    'guard كامري احمر', 'motors fixture', '100', 'JOD', 'JO',
    'Amman', 'Abdoun', 'motors', 'cars', 'active', '[]'::jsonb,
    '2026-10-04T10:00:00Z'
  ),
  (
    '95000000-0000-4000-8000-000000000002'::uuid,
    '94000000-0000-4000-8000-000000000001'::uuid,
    'guard كيا ازرق', 'motors other', '100', 'JOD', 'JO',
    'Amman', 'Abdoun', 'motors', 'cars', 'active', '[]'::jsonb,
    '2026-10-03T10:00:00Z'
  );

DO $$
DECLARE
  v_count integer;
  v_found boolean;
  v_camry uuid := '95000000-0000-4000-8000-000000000001'::uuid;
BEGIN
  -- T1: stopword-only 'من في' → 0 rows
  SELECT count(*) INTO v_count
  FROM public.search_listings_v2_intent('من في', 'JO', 100, 0);
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T1 FAIL: من في returned % rows', v_count;
  END IF;
  RAISE NOTICE 'PASS T1: من في returns 0 rows';

  -- T2: single stopword 'من' → 0 rows
  SELECT count(*) INTO v_count
  FROM public.search_listings_v2_intent('من', 'JO', 100, 0);
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T2 FAIL: من returned % rows', v_count;
  END IF;
  RAISE NOTICE 'PASS T2: من returns 0 rows';

  -- T3: single stopword 'في' → 0 rows
  SELECT count(*) INTO v_count
  FROM public.search_listings_v2_intent('في', 'JO', 100, 0);
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T3 FAIL: في returned % rows', v_count;
  END IF;
  RAISE NOTICE 'PASS T3: في returns 0 rows';

  -- T4: one meaningful token 'كامري' → returns the fixture (guard does not block)
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v2_intent('كامري', 'JO', 100, 0)
    WHERE id = v_camry
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T4 FAIL: كامري did not return the fixture';
  END IF;
  RAISE NOTICE 'PASS T4: كامري returns the fixture (guard does not block)';

  -- T5: mixed 'من كامري' → same fixture returned (guard must not block)
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v2_intent('من كامري', 'JO', 100, 0)
    WHERE id = v_camry
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T5 FAIL: من كامري did not return the fixture';
  END IF;
  RAISE NOTICE 'PASS T5: mixed من كامري returns the fixture';

  -- T6: empty → 0 rows (unchanged)
  SELECT count(*) INTO v_count
  FROM public.search_listings_v2_intent('', 'JO', 100, 0);
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T6 FAIL: empty query returned % rows', v_count;
  END IF;
  RAISE NOTICE 'PASS T6: empty query returns 0 rows';

  -- T7: short token 'سي' → 0 rows (unchanged)
  SELECT count(*) INTO v_count
  FROM public.search_listings_v2_intent('سي', 'JO', 100, 0);
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T7 FAIL: short token سي returned % rows', v_count;
  END IF;
  RAISE NOTICE 'PASS T7: short token سي returns 0 rows';

  -- T8: wrapper search_listings_v2_intent_typo('من في', ...) → 0 rows
  SELECT count(*) INTO v_count
  FROM public.search_listings_v2_intent_typo('من في', 'JO', 100, 0);
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T8 FAIL: typo wrapper returned % rows for من في', v_count;
  END IF;
  RAISE NOTICE 'PASS T8: typo wrapper returns 0 rows for stopword-only';
END $$;

ROLLBACK;
