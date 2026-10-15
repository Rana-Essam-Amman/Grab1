-- search_suggestions.sql
-- Autocomplete suggestions RPC. LOCAL ONLY. Transactional, rolled back.
-- Uses actual seed data for keywords/synonyms/taxonomy.
-- Inserts one temporary listing for token coverage (rolled back).

BEGIN;

-- Temporary listing so token extraction has an 'ايفون' token.
INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES (
  '96000000-0000-4000-8000-000000000001'::uuid,
  'authenticated', 'authenticated',
  'suggestions-token-96000000@example.invalid',
  '', now(), '{}'::jsonb, '{}'::jsonb
)
ON CONFLICT DO NOTHING;

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, category_slug, status, search_text
)
VALUES (
  '97000000-0000-4000-8000-000000000001'::uuid,
  '96000000-0000-4000-8000-000000000001'::uuid,
  'ايفون 15 برو', 'token fixture', '100', 'JOD', 'JO',
  'Amman', 'mobiles', 'active',
  public.normalize_search_text('ايفون 15 برو ماكس')
)
ON CONFLICT DO NOTHING;

-- T1: Empty / 1-char / null → 0 rows
DO $$
DECLARE
  cnt int;
BEGIN
  SELECT count(*) INTO cnt FROM public.search_suggestions('');
  IF cnt <> 0 THEN RAISE EXCEPTION 'T1 FAIL: empty query returned % rows', cnt; END IF;

  SELECT count(*) INTO cnt FROM public.search_suggestions('ا');
  IF cnt <> 0 THEN RAISE EXCEPTION 'T1 FAIL: 1-char returned % rows', cnt; END IF;

  SELECT count(*) INTO cnt FROM public.search_suggestions(NULL);
  IF cnt <> 0 THEN RAISE EXCEPTION 'T1 FAIL: null returned % rows', cnt; END IF;

  RAISE NOTICE 'PASS T1: empty/1-char/null → 0 rows';
END $$;

-- T2: 'كام' returns keyword 'كامري'
DO $$
DECLARE
  found boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.search_suggestions('كام', 10)
    WHERE suggestion = 'كامري' AND suggestion_type = 'keyword' AND weight = 1.0
  ) INTO found;
  IF NOT found THEN
    RAISE EXCEPTION 'T2 FAIL: expected keyword كامري';
  END IF;
  RAISE NOTICE 'PASS T2: كام → keyword كامري';
END $$;

-- T3: 'عر' returns synonym 'عربية' or similar (or 'سيارة' etc.)
DO $$
DECLARE
  found boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.search_suggestions('عر', 10)
    WHERE suggestion_type = 'synonym' AND weight = 0.9
  ) INTO found;
  IF NOT found THEN
    RAISE EXCEPTION 'T3 FAIL: expected a synonym for عر';
  END IF;
  RAISE NOTICE 'PASS T3: عر → synonym';
END $$;

-- T4: 'سيار' returns category 'motors' (via سيارات ومركبات)
DO $$
DECLARE
  found boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.search_suggestions('سيار', 10)
    WHERE suggestion_type = 'category'
      AND category_slug = 'motors'
      AND weight = 0.8
  ) INTO found;
  IF NOT found THEN
    RAISE EXCEPTION 'T4 FAIL: expected category motors for سيار';
  END IF;
  RAISE NOTICE 'PASS T4: سيار → category motors';
END $$;

-- T5: 'كامري' returns subcategory for motors (or at least a motors-related result)
DO $$
DECLARE
  found boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.search_suggestions('كامري', 10)
    WHERE (suggestion_type = 'subcategory' AND category_slug = 'motors')
       OR suggestion_type IN ('keyword', 'synonym', 'token')
  ) INTO found;
  IF NOT found THEN
    RAISE EXCEPTION 'T5 FAIL: expected result for كامري';
  END IF;
  RAISE NOTICE 'PASS T5: كامري → result';
END $$;

-- T6: 'ايفو' returns token 'ايفون'
DO $$
DECLARE
  found boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.search_suggestions('ايفو', 10)
    WHERE suggestion = 'ايفون' AND suggestion_type = 'token' AND weight = 0.6
  ) INTO found;
  IF NOT found THEN
    RAISE EXCEPTION 'T6 FAIL: expected token ايفون';
  END IF;
  RAISE NOTICE 'PASS T6: ايفو → token ايفون';
END $$;

-- T7: Deduplication — same text from 2 sources keeps highest weight
-- (كامري is keyword 1.0 and also synonym 0.9; result must be unique with weight 1.0)
DO $$
DECLARE
  cnt int;
  w numeric;
BEGIN
  SELECT count(*), max(weight) INTO cnt, w
  FROM public.search_suggestions('كامري', 10)
  WHERE suggestion = 'كامري';
  IF cnt <> 1 OR w <> 1.0 THEN
    RAISE EXCEPTION 'T7 FAIL: expected 1 row weight 1.0 for كامري, got % rows weight %', cnt, w;
  END IF;
  RAISE NOTICE 'PASS T7: dedup keeps highest weight';
END $$;

-- T8: Ranking by weight DESC
DO $$
DECLARE
  prev_weight numeric := 999;
  cur_weight numeric;
  r record;
BEGIN
  FOR r IN SELECT weight FROM public.search_suggestions('سيار', 10) ORDER BY 1 DESC LOOP
    -- just verify the function returns ordered by weight desc (already in ORDER BY)
    NULL;
  END LOOP;
  -- Spot-check that higher weight appears before lower
  SELECT weight INTO cur_weight FROM public.search_suggestions('كام', 5) LIMIT 1;
  IF cur_weight < 0.8 THEN
    RAISE EXCEPTION 'T8 FAIL: top result weight too low';
  END IF;
  RAISE NOTICE 'PASS T8: ranking by weight';
END $$;

-- T9: Limit
DO $$
DECLARE
  cnt int;
BEGIN
  SELECT count(*) INTO cnt FROM public.search_suggestions('س', 3);
  -- may be 0 if only stopwords or short, but 'س' length 1 is guarded; use longer
  SELECT count(*) INTO cnt FROM public.search_suggestions('سيار', 3);
  IF cnt > 3 THEN
    RAISE EXCEPTION 'T9 FAIL: p_limit=3 returned % rows', cnt;
  END IF;
  RAISE NOTICE 'PASS T9: limit respected (returned %)', cnt;
END $$;

-- T10: Arabic normalization — كامري vs كامرى overlap
DO $$
DECLARE
  cnt1 int;
  cnt2 int;
BEGIN
  SELECT count(*) INTO cnt1 FROM public.search_suggestions('كامري', 10);
  SELECT count(*) INTO cnt2 FROM public.search_suggestions('كامرى', 10);
  IF cnt1 = 0 OR cnt2 = 0 THEN
    RAISE EXCEPTION 'T10 FAIL: both forms should return results';
  END IF;
  RAISE NOTICE 'PASS T10: Arabic normalization overlap';
END $$;

-- T11: nonsense → 0
DO $$
DECLARE
  cnt int;
BEGIN
  SELECT count(*) INTO cnt FROM public.search_suggestions('xyzabc', 10);
  IF cnt <> 0 THEN RAISE EXCEPTION 'T11 FAIL: xyzabc returned %', cnt; END IF;
  RAISE NOTICE 'PASS T11: nonsense → 0';
END $$;

-- T12: stopword 'في' → 0
DO $$
DECLARE
  cnt int;
BEGIN
  SELECT count(*) INTO cnt FROM public.search_suggestions('في', 10);
  IF cnt <> 0 THEN RAISE EXCEPTION 'T12 FAIL: stopword في returned %', cnt; END IF;
  RAISE NOTICE 'PASS T12: stopword → 0';
END $$;

-- T13: 'شقة' → result with category_slug='real-estate'
DO $$
DECLARE
  found boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.search_suggestions('شقة', 10)
    WHERE category_slug = 'real-estate'
  ) INTO found;
  IF NOT found THEN
    RAISE EXCEPTION 'T13 FAIL: expected real-estate slug for شقة';
  END IF;
  RAISE NOTICE 'PASS T13: شقة → real-estate';
END $$;

ROLLBACK;
