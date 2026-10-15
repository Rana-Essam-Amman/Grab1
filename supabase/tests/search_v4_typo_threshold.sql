-- search_v4_typo_threshold.sql
-- Trigram fallback and related threshold. LOCAL ONLY.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = '94000000-0000-4000-8000-000000000001'::uuid
  ) THEN
    RAISE EXCEPTION 'PREREQ FAIL: v4 typo fixture user already exists';
  END IF;
END $$;

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES (
  '94000000-0000-4000-8000-000000000001'::uuid,
  'authenticated', 'authenticated',
  'v4-typo-94000000@example.invalid',
  '', now(), '{}'::jsonb, '{}'::jsonb
);

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, neighborhood, category_slug, subcategory_slug, status, attributes
)
VALUES
  ('95000000-0000-4000-8000-000000000001'::uuid,
   '94000000-0000-4000-8000-000000000001'::uuid,
   'Tesla Model 3', 'typo exact', '100', 'JOD', 'JO',
   'Amman', 'Abdoun', 'motors', 'cars', 'active',
   '[{"key":"color","value":"أحمر"},{"key":"year","value":"2022"}]'::jsonb),
  ('95000000-0000-4000-8000-000000000002'::uuid,
   '94000000-0000-4000-8000-000000000001'::uuid,
   'تويوتا كامري 2018', 'typo toyota', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb),
  ('95000000-0000-4000-8000-000000000003'::uuid,
   '94000000-0000-4000-8000-000000000001'::uuid,
   'سامسونج جالاكسي', 'typo samsung', '300', 'JOD', 'JO',
   'Amman', NULL, 'electronics', NULL, 'active', '[]'::jsonb),
  ('95000000-0000-4000-8000-000000000004'::uuid,
   '94000000-0000-4000-8000-000000000001'::uuid,
   'سيارة كيا سبورتاج', 'weak related', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb),
  ('95000000-0000-4000-8000-000000000005'::uuid,
   '94000000-0000-4000-8000-000000000001'::uuid,
   'سيارة كهربائية تسلا 2022', 'strong related', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb),
  ('95000000-0000-4000-8000-000000000006'::uuid,
   '94000000-0000-4000-8000-000000000001'::uuid,
   'ak red', 'n2 color', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active',
   '[{"key":"color","value":"أحمر"}]'::jsonb),
  ('95000000-0000-4000-8000-000000000007'::uuid,
   '94000000-0000-4000-8000-000000000001'::uuid,
   'iPhone 15', 'unrelated', '100', 'JOD', 'JO',
   'Amman', NULL, 'electronics', NULL, 'active', '[]'::jsonb),
  ('95000000-0000-4000-8000-000000000008'::uuid,
   '94000000-0000-4000-8000-000000000001'::uuid,
   'v4page تسلا 2022 احمر', 'page exact', '150', 'JOD', 'JO',
   'Amman', 'Abdoun', 'motors', 'cars', 'active', '[]'::jsonb),
  ('95000000-0000-4000-8000-000000000009'::uuid,
   '94000000-0000-4000-8000-000000000001'::uuid,
   'v4page تسلا 2022', 'page related candidate', '150', 'JOD', 'JO',
   'Amman', 'Abdoun', 'motors', 'cars', 'active', '[]'::jsonb),
  ('95000000-0000-4000-8000-000000000010'::uuid,
   '94000000-0000-4000-8000-000000000001'::uuid,
   'تسلا احمر 2022', 'multi token near', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb);

DO $$
DECLARE
  v_count integer;
  v_kind text;
  v_matched integer;
  v_found boolean;
  v_score real;
BEGIN
  -- T1
  SELECT count(*), max(match_kind) INTO v_count, v_kind
  FROM public.search_listings_v4_exact('لون احمر 2022', 'JO', 100, 0)
  WHERE id = '95000000-0000-4000-8000-000000000001'::uuid;
  IF v_count <> 1 OR v_kind <> 'exact' THEN
    RAISE EXCEPTION 'TEST T1 FAIL: count=% kind=%', v_count, v_kind;
  END IF;
  RAISE NOTICE 'PASS T1: exact still works';

  -- T2
  SELECT word_similarity(
    public.normalize_search_text('تيوتا'),
    public.normalize_search_text(coalesce(search_text, ''))
  ) INTO v_score
  FROM public.listings
  WHERE id = '95000000-0000-4000-8000-000000000002'::uuid;
  RAISE NOTICE 'T2 normalized score for تيوتا vs تويوتا: %', v_score;

  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('تويوتا', 'JO', 100, 0)
  WHERE id = '95000000-0000-4000-8000-000000000002'::uuid
    AND match_kind = 'exact';
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'TEST T2 FAIL: correct spelling missed';
  END IF;
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('تيوتا', 'JO', 100, 0)
  WHERE id = '95000000-0000-4000-8000-000000000002'::uuid
    AND match_kind = 'exact';
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'TEST T2 FAIL: typo تيوتا missed';
  END IF;
  RAISE NOTICE 'PASS T2: typo caught by trigram at score %', v_score;

  -- T3
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('سامسونغ', 'JO', 100, 0)
  WHERE id = '95000000-0000-4000-8000-000000000003'::uuid
    AND match_kind = 'exact';
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'TEST T3 FAIL: سامسونغ was not exact';
  END IF;
  RAISE NOTICE 'PASS T3: different-letter typo matched as exact';

  -- T4
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('سيارة كهربائية تسلا 2050', 'JO', 100, 0)
  WHERE id = '95000000-0000-4000-8000-000000000004'::uuid;
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T4 FAIL: weak N=4 match was returned';
  END IF;
  RAISE NOTICE 'PASS T4: N=4 threshold blocks a 1-token match';

  -- T5
  SELECT count(*), max(match_kind), max(total_matched_tokens)
    INTO v_count, v_kind, v_matched
  FROM public.search_listings_v4_exact('سيارة كهربائية تسلا 2050', 'JO', 100, 0)
  WHERE id = '95000000-0000-4000-8000-000000000005'::uuid;
  IF v_count <> 1 OR v_kind <> 'related' OR v_matched <> 3 THEN
    RAISE EXCEPTION 'TEST T5 FAIL: count=% kind=% matched=%', v_count, v_kind, v_matched;
  END IF;
  RAISE NOTICE 'PASS T5: N=4 threshold allows a 3-token related match';

  -- T6
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('لون ازرق', 'JO', 100, 0)
  WHERE id = '95000000-0000-4000-8000-000000000006'::uuid;
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T6 FAIL: N=2 one-token match was returned';
  END IF;
  RAISE NOTICE 'PASS T6: N=2 requires both tokens';

  -- T6b: multi-token near match must not be promoted to exact.
  -- Exactly one related row is required. Zero rows would hide a
  -- broken trigram or a broken related stage.
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('تسلا ازرق 2022', 'JO', 100, 0)
  WHERE id = '95000000-0000-4000-8000-000000000010'::uuid
    AND match_kind = 'exact';
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T6b FAIL: multi-token near match was promoted to exact (% rows)', v_count;
  END IF;

  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('تسلا ازرق 2022', 'JO', 100, 0)
  WHERE id = '95000000-0000-4000-8000-000000000010'::uuid
    AND match_kind = 'related';
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'TEST T6b FAIL: expected exactly 1 related row, got %', v_count;
  END IF;
  RAISE NOTICE 'PASS T6b: zero exact rows and exactly 1 related row';

  -- T7
  SELECT count(*), max(match_kind) INTO v_count, v_kind
  FROM public.search_listings_v4_exact('تويوتا كامري ازرق', 'JO', 100, 0)
  WHERE id = '95000000-0000-4000-8000-000000000002'::uuid;
  IF v_count <> 1 OR v_kind <> 'related' THEN
    RAISE EXCEPTION 'TEST T7 FAIL: 2-of-3 count=% kind=%', v_count, v_kind;
  END IF;
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('تويوتا ازرق اسود', 'JO', 100, 0)
  WHERE id = '95000000-0000-4000-8000-000000000002'::uuid;
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T7 FAIL: 1-of-3 was returned';
  END IF;
  RAISE NOTICE 'PASS T7: N=3 requires 2';

  -- T8
  SELECT word_similarity(
    public.normalize_search_text('كمری'),
    public.normalize_search_text(coalesce(search_text, ''))
  ) INTO v_score
  FROM public.listings
  WHERE id = '95000000-0000-4000-8000-000000000002'::uuid;
  RAISE NOTICE 'T8 normalized score for كمری vs كامري: %', v_score;

  SELECT count(*), max(match_kind) INTO v_count, v_kind
  FROM public.search_listings_v4_exact('تويوتا', 'JO', 100, 0)
  WHERE id = '95000000-0000-4000-8000-000000000002'::uuid;
  IF v_count <> 1 OR v_kind <> 'exact' THEN
    RAISE EXCEPTION 'TEST T8 FAIL: N=1 exact count=% kind=%', v_count, v_kind;
  END IF;
  SELECT count(*), max(match_kind) INTO v_count, v_kind
  FROM public.search_listings_v4_exact('كمری', 'JO', 100, 0)
  WHERE id = '95000000-0000-4000-8000-000000000002'::uuid;
  IF v_count <> 1 OR v_kind <> 'exact' THEN
    RAISE EXCEPTION 'TEST T8 FAIL: N=1 typo count=% kind=%', v_count, v_kind;
  END IF;
  RAISE NOTICE 'PASS T8: N=1 exact and N=1 typo both exact at score %', v_score;

  -- T8b: existing Samsung fixture, well above the boundary.
  SELECT word_similarity(
    public.normalize_search_text('سامسونغ'),
    public.normalize_search_text(coalesce(search_text, ''))
  ) INTO v_score
  FROM public.listings
  WHERE id = '95000000-0000-4000-8000-000000000003'::uuid;
  RAISE NOTICE 'T8b normalized score for سامسونغ vs سامسونج: %', v_score;

  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('سامسونغ', 'JO', 100, 0)
  WHERE id = '95000000-0000-4000-8000-000000000003'::uuid
    AND match_kind = 'exact';
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'TEST T8b FAIL: سامسونغ was not exact';
  END IF;
  RAISE NOTICE 'PASS T8b: existing Samsung fixture matched as exact at score %', v_score;

  -- T9 filters on all stages
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact(
      'لون احمر 2022', 'JO', 100, 0,
      'motors', 'cars', 50, 200, 'Amman', 'Abdoun', NULL
    )
    WHERE id = '95000000-0000-4000-8000-000000000001'::uuid
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T9 FAIL: exact stage ignored filters';
  END IF;
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact(
      'تيوتا', 'SA', 100, 0
    )
    WHERE id = '95000000-0000-4000-8000-000000000002'::uuid
  ) INTO v_found;
  IF v_found THEN
    RAISE EXCEPTION 'TEST T9 FAIL: trigram stage ignored market';
  END IF;
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v4_exact(
      'سيارة كهربائية تسلا 2050', 'JO', 100, 0,
      'electronics', NULL, NULL, NULL, NULL, NULL, NULL
    )
    WHERE id = '95000000-0000-4000-8000-000000000005'::uuid
  ) INTO v_found;
  IF v_found THEN
    RAISE EXCEPTION 'TEST T9 FAIL: related stage ignored category';
  END IF;
  RAISE NOTICE 'PASS T9: filters apply on exact, trigram, and related';

  -- T10 pagination isolation
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('v4page تسلا 2022 احمر', 'JO', 10, 5);
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T10 FAIL: offset past exact fell through, got %', v_count;
  END IF;
  RAISE NOTICE 'PASS T10: offset past exact does not fall through';

  -- T11
  -- Behavior is verified at the measured scores printed by T2, T8,
  -- and this test. It is not an exhaustive boundary validation.
  -- A near-boundary negative (0.35-0.39) is deferred: the current
  -- fixtures do not naturally produce one, and inventing a string
  -- to land in that band would not be evidence.
  SELECT word_similarity(
    'xyzabc',
    public.normalize_search_text(coalesce(search_text, ''))
  ) INTO v_score
  FROM public.listings
  WHERE id = '95000000-0000-4000-8000-000000000007'::uuid;
  RAISE NOTICE 'T11 similarity score for xyzabc vs iPhone fixture: %', v_score;
  IF v_score IS NULL OR v_score >= 0.4 THEN
    RAISE EXCEPTION 'TEST T11 FAIL: negative fixture score % is not below 0.4', v_score;
  END IF;

  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact('xyzabc', 'JO', 100, 0)
  WHERE id = '95000000-0000-4000-8000-000000000007'::uuid;
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T11 FAIL: unrelated trigram match';
  END IF;
  RAISE NOTICE 'PASS T11: trigram does not match unrelated text (score=%)', v_score;

  RAISE NOTICE 'ALL V4 TYPO THRESHOLD TESTS PASSED';
END $$;

ROLLBACK;

SELECT 'ALL V4 TYPO THRESHOLD TESTS PASSED; FIXTURES ROLLED BACK' AS result;
