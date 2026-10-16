-- search_typo_fuzzy_guard.sql
-- Guard: search_text_has_all_tokens_fuzzy returns FALSE on zero meaningful tokens.
-- LOCAL ONLY. All fixtures rolled back.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = '92000000-0000-4000-8000-000000000001'::uuid
  ) OR EXISTS (
    SELECT 1 FROM public.listings
    WHERE id BETWEEN '93000000-0000-4000-8000-000000000001'::uuid
                 AND '93000000-0000-4000-8000-000000000010'::uuid
  ) THEN
    RAISE EXCEPTION 'PREREQ FAIL: fuzzy-guard fixture UUID already exists';
  END IF;
END $$;

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES (
  '92000000-0000-4000-8000-000000000001'::uuid,
  'authenticated', 'authenticated',
  'fuzzy-guard-92000000@example.invalid',
  '', now(), '{}'::jsonb, '{}'::jsonb
);

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, neighborhood, category_slug, subcategory_slug, status,
  attributes, created_at
)
VALUES
  (
    '93000000-0000-4000-8000-000000000001'::uuid,
    '92000000-0000-4000-8000-000000000001'::uuid,
    'fuzzyguard تسلا احمر', 'motors fixture', '100', 'JOD', 'JO',
    'Amman', 'Abdoun', 'motors', 'cars', 'active', '[]'::jsonb,
    '2026-10-04T10:00:00Z'
  ),
  (
    '93000000-0000-4000-8000-000000000002'::uuid,
    '92000000-0000-4000-8000-000000000001'::uuid,
    'fuzzyguard كيا ازرق', 'motors other', '100', 'JOD', 'JO',
    'Amman', 'Abdoun', 'motors', 'cars', 'active', '[]'::jsonb,
    '2026-10-03T10:00:00Z'
  );

DO $$
DECLARE
  v_result boolean;
  v_count integer;
  v_norm text;
BEGIN
  -- T1: empty query → FALSE
  SELECT public.search_text_has_all_tokens_fuzzy('', public.normalize_search_text(''), 0.4)
  INTO v_result;
  IF v_result IS DISTINCT FROM FALSE THEN
    RAISE EXCEPTION 'TEST T1 FAIL: empty query returned %', v_result;
  END IF;
  RAISE NOTICE 'PASS T1: empty query returns FALSE';

  -- T2: all tokens < 3 chars → FALSE
  SELECT public.search_text_has_all_tokens_fuzzy('anything', public.normalize_search_text('ab cd'), 0.4)
  INTO v_result;
  IF v_result IS DISTINCT FROM FALSE THEN
    RAISE EXCEPTION 'TEST T2 FAIL: short tokens returned %', v_result;
  END IF;
  RAISE NOTICE 'PASS T2: tokens shorter than 3 chars return FALSE';

  -- T3: stopword-only 'من في' → FALSE
  SELECT public.search_text_has_all_tokens_fuzzy('anything', public.normalize_search_text('من في'), 0.4)
  INTO v_result;
  IF v_result IS DISTINCT FROM FALSE THEN
    RAISE EXCEPTION 'TEST T3 FAIL: stopword-only returned %', v_result;
  END IF;
  RAISE NOTICE 'PASS T3: stopword-only query returns FALSE';

  -- T4: mixed meaningful + stopwords — meaningful token must match
  SELECT public.search_text_has_all_tokens_fuzzy(
    'fuzzyguard تسلا احمر',
    public.normalize_search_text('من تسلا'),
    0.4
  ) INTO v_result;
  IF v_result IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'TEST T4 FAIL: mixed query with matching token returned %', v_result;
  END IF;

  SELECT public.search_text_has_all_tokens_fuzzy(
    'fuzzyguard تسلا احمر',
    public.normalize_search_text('من كيا'),
    0.4
  ) INTO v_result;
  IF v_result IS DISTINCT FROM FALSE THEN
    RAISE EXCEPTION 'TEST T4 FAIL: mixed query with non-matching token returned %', v_result;
  END IF;
  RAISE NOTICE 'PASS T4: mixed meaningful + stopwords behaves as before';

  -- T5: typo 'تسله' vs fixture 'تسلا' still matches
  SELECT public.normalize_search_text('تسله') INTO v_norm;
  SELECT public.search_text_has_all_tokens_fuzzy(
    'fuzzyguard تسلا احمر',
    v_norm,
    0.4
  ) INTO v_result;
  IF v_result IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'TEST T5 FAIL: typo query تسله did not match تسلا fixture (got %)', v_result;
  END IF;
  RAISE NOTICE 'PASS T5: fuzzy matcher still finds typo تسله → تسلا';

  -- T6: wrapper search_listings_v2_intent_typo('من في', ...) returns zero rows
  -- when v2_intent returns zero rows
  SELECT count(*) INTO v_count
  FROM public.search_listings_v2_intent_typo('من في', 'JO', 100, 0);
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T6 FAIL: stopword-only wrapper returned % rows', v_count;
  END IF;
  RAISE NOTICE 'PASS T6: stopword-only wrapper returns zero rows';
END $$;

ROLLBACK;
