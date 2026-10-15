-- search_suggestions_perf.sql
-- Performance path tests. LOCAL ONLY. Transactional, rolled back.

BEGIN;

-- Ensure at least one token exists for T14
INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES (
  '97000000-0000-4000-8000-000000000001'::uuid,
  'authenticated', 'authenticated',
  'perf-base-97000000@example.invalid',
  '', now(), '{}'::jsonb, '{}'::jsonb
)
ON CONFLICT DO NOTHING;

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, category_slug, status, search_text
)
VALUES (
  '97100000-0000-4000-8000-000000000001'::uuid,
  '97000000-0000-4000-8000-000000000001'::uuid,
  'ايفون 15', 'base fixture', '100', 'JOD', 'JO',
  'Amman', 'mobiles', 'active',
  public.normalize_search_text('ايفون 15 برو')
)
ON CONFLICT DO NOTHING;

-- T14: Token pool populated
SELECT public.refresh_suggestion_tokens();

DO $$
DECLARE
  cnt int;
BEGIN
  SELECT count(*) INTO cnt FROM public.search_suggestion_tokens;
  IF cnt <= 0 THEN
    RAISE EXCEPTION 'T14 FAIL: token pool empty';
  END IF;
  RAISE NOTICE 'PASS T14: token pool has % rows', cnt;
END $$;

-- T15: Token pool updates on listing insert
INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES (
  '98000000-0000-4000-8000-000000000001'::uuid,
  'authenticated', 'authenticated',
  'perf-token-98000000@example.invalid',
  '', now(), '{}'::jsonb, '{}'::jsonb
)
ON CONFLICT DO NOTHING;

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, category_slug, status, search_text
)
VALUES (
  '99000000-0000-4000-8000-000000000001'::uuid,
  '98000000-0000-4000-8000-000000000001'::uuid,
  'يوجا مات', 'token fixture', '50', 'JOD', 'JO',
  'Amman', 'sports', 'active',
  public.normalize_search_text('يوجا مات جديد')
)
ON CONFLICT DO NOTHING;

DO $$
DECLARE
  found boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.search_suggestion_tokens WHERE word = 'يوجا'
  ) INTO found;
  IF NOT found THEN
    RAISE EXCEPTION 'T15 FAIL: يوجا not in token pool after insert';
  END IF;
  RAISE NOTICE 'PASS T15: trigger populated يوجا';
END $$;

-- T16: Suggestions read from token pool
DO $$
DECLARE
  found boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.search_suggestions('يوج', 5)
    WHERE suggestion = 'يوجا' AND suggestion_type = 'token'
  ) INTO found;
  IF NOT found THEN
    RAISE EXCEPTION 'T16 FAIL: expected token يوجا from pool';
  END IF;
  RAISE NOTICE 'PASS T16: suggestions read from token pool';
END $$;

-- T17: Brand keyword suggestions
DO $$
DECLARE
  found boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.search_suggestions('ايف', 5)
    WHERE suggestion = 'ايفون' AND suggestion_type = 'keyword'
  ) INTO found;
  IF NOT found THEN
    RAISE EXCEPTION 'T17 FAIL: expected keyword ايفون';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_suggestions('تسل', 5)
    WHERE suggestion = 'تسلا' AND suggestion_type = 'keyword'
  ) INTO found;
  IF NOT found THEN
    RAISE EXCEPTION 'T17 FAIL: expected keyword تسلا';
  END IF;

  RAISE NOTICE 'PASS T17: brand keywords returned';
END $$;

-- T19: Timing smoke (record only)
DO $$
DECLARE
  start_ts timestamptz;
  elapsed interval;
BEGIN
  start_ts := clock_timestamp();
  PERFORM * FROM public.search_suggestions('كامري', 10);
  elapsed := clock_timestamp() - start_ts;
  RAISE NOTICE 'T19 timing for كامري: %', elapsed;
  IF extract(milliseconds FROM elapsed) > 100 THEN
    RAISE EXCEPTION 'T19 FAIL: took % (>100ms)', elapsed;
  END IF;
  RAISE NOTICE 'PASS T19: under 100ms';
END $$;

ROLLBACK;
