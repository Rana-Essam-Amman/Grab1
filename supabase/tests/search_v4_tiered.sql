-- search_v4_tiered.sql
-- Wrapper reclassification tests. LOCAL ONLY. All fixtures rolled back.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = '96000000-0000-4000-8000-000000000001'::uuid
  ) OR EXISTS (
    SELECT 1 FROM public.listings
    WHERE id BETWEEN '97000000-0000-4000-8000-000000000001'::uuid
                 AND '97000000-0000-4000-8000-000000000010'::uuid
  ) THEN
    RAISE EXCEPTION 'PREREQ FAIL: v4 tiered fixture UUID already exists';
  END IF;
END $$;

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES (
  '96000000-0000-4000-8000-000000000001'::uuid,
  'authenticated', 'authenticated',
  'v4-tiered-96000000@example.invalid',
  '', now(), '{}'::jsonb, '{}'::jsonb
);

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, neighborhood, category_slug, subcategory_slug, status,
  attributes, created_at
)
VALUES
  -- Exact substring for ايفون
  ('97000000-0000-4000-8000-000000000001'::uuid,
   '96000000-0000-4000-8000-000000000001'::uuid,
   'ايفون 15 برو', 'exact iphone', '300', 'JOD', 'JO',
   'Amman', NULL, 'electronics', 'phones', 'active', '[]'::jsonb,
   '2026-10-05T10:00:00Z'),
  -- Exact substring for كامري
  ('97000000-0000-4000-8000-000000000002'::uuid,
   '96000000-0000-4000-8000-000000000001'::uuid,
   'تويوتا كامري 2018', 'exact camry', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-04T10:00:00Z'),
  -- Fuzzy candidate for تسله (similar to تسلا, does not contain تسله)
  ('97000000-0000-4000-8000-000000000003'::uuid,
   '96000000-0000-4000-8000-000000000001'::uuid,
   'تسلا موديل 3', 'fuzzy tesla', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-03T10:00:00Z'),
  -- Unrelated
  ('97000000-0000-4000-8000-000000000004'::uuid,
   '96000000-0000-4000-8000-000000000001'::uuid,
   'سامسونج جالاكسي', 'unrelated', '200', 'JOD', 'JO',
   'Amman', NULL, 'electronics', NULL, 'active', '[]'::jsonb,
   '2026-10-02T10:00:00Z'),
  -- Additional exact for ordering test
  ('97000000-0000-4000-8000-000000000005'::uuid,
   '96000000-0000-4000-8000-000000000001'::uuid,
   'كامري ايفون', 'mixed for ordering', '150', 'JOD', 'JO',
   'Amman', NULL, 'electronics', NULL, 'active', '[]'::jsonb,
   '2026-10-01T10:00:00Z'),
  -- T9: non-contiguous tokens (كامري ... تويوتا)
  ('97000000-0000-4000-8000-000000000006'::uuid,
   '96000000-0000-4000-8000-000000000001'::uuid,
   'كامري 2018 تويوتا', 'non-contiguous exact', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-06T10:00:00Z'),
  -- T10: Tesla (search_text populated by trigger from title containing تسلا)
  ('97000000-0000-4000-8000-000000000007'::uuid,
   '96000000-0000-4000-8000-000000000001'::uuid,
   'تسلا موديل 3 2023', 'tesla model 3', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-07T10:00:00Z'),
  -- T10: Kia false-positive candidate
  ('97000000-0000-4000-8000-000000000008'::uuid,
   '96000000-0000-4000-8000-000000000001'::uuid,
   'كيا سبورتاج 2022', 'kia sportage', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-08T10:00:00Z'),
  -- T10: Hyundai false-positive candidate
  ('97000000-0000-4000-8000-000000000009'::uuid,
   '96000000-0000-4000-8000-000000000001'::uuid,
   'هيونداي افانتي 2020', 'hyundai avante', '100', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-09T10:00:00Z'),
  -- T10: Lawn mower false-positive candidate
  ('97000000-0000-4000-8000-000000000010'::uuid,
   '96000000-0000-4000-8000-000000000001'::uuid,
   'ماكينة قص حشائش', 'lawn mower', '50', 'JOD', 'JO',
   'Amman', NULL, 'home-garden', NULL, 'active', '[]'::jsonb,
   '2026-10-10T10:00:00Z');

DO $$
DECLARE
  v_tier integer;
  v_reason text;
  v_count integer;
  v_prev_tier integer;
  v_row record;
  v_diff integer;
BEGIN
  -- T1: Query "ايفون" against listing whose search_text contains it
  SELECT tier, tier_reason INTO v_tier, v_reason
  FROM public.search_listings_v4_tiered('ايفون', 'JO', 100, 0)
  WHERE id = '97000000-0000-4000-8000-000000000001'::uuid;
  IF v_tier IS DISTINCT FROM 1 OR v_reason IS DISTINCT FROM 'exact_substring' THEN
    RAISE EXCEPTION 'TEST T1 FAIL: tier=% reason=%', v_tier, v_reason;
  END IF;
  RAISE NOTICE 'PASS T1: ايفون exact_substring tier=1';

  -- T2: Query "تسله" against listing that does not contain it (trigram fuzzy)
  SELECT tier, tier_reason INTO v_tier, v_reason
  FROM public.search_listings_v4_tiered('تسله', 'JO', 100, 0)
  WHERE id = '97000000-0000-4000-8000-000000000003'::uuid;
  IF v_tier IS DISTINCT FROM 2 OR v_reason IS DISTINCT FROM 'trigram_fuzzy' THEN
    RAISE EXCEPTION 'TEST T2 FAIL: tier=% reason=%', v_tier, v_reason;
  END IF;
  RAISE NOTICE 'PASS T2: تسله trigram_fuzzy tier=2';

  -- T3: Query "كامري" against listing containing it
  SELECT tier INTO v_tier
  FROM public.search_listings_v4_tiered('كامري', 'JO', 100, 0)
  WHERE id = '97000000-0000-4000-8000-000000000002'::uuid;
  IF v_tier IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'TEST T3 FAIL: tier=%', v_tier;
  END IF;
  RAISE NOTICE 'PASS T3: كامري tier=1';

  -- T4: Wrapper returns the SAME set of IDs as v4_exact (no drops, no substitutions)
  SELECT count(*) INTO v_diff
  FROM (
    SELECT id FROM public.search_listings_v4_exact('ايفون', 'JO', 100, 0)
    EXCEPT
    SELECT id FROM public.search_listings_v4_tiered('ايفون', 'JO', 100, 0)
  ) AS only_in_v4;
  IF v_diff <> 0 THEN
    RAISE EXCEPTION 'TEST T4 FAIL: % IDs only in v4_exact', v_diff;
  END IF;
  SELECT count(*) INTO v_diff
  FROM (
    SELECT id FROM public.search_listings_v4_tiered('ايفون', 'JO', 100, 0)
    EXCEPT
    SELECT id FROM public.search_listings_v4_exact('ايفون', 'JO', 100, 0)
  ) AS only_in_tiered;
  IF v_diff <> 0 THEN
    RAISE EXCEPTION 'TEST T4 FAIL: % IDs only in v4_tiered', v_diff;
  END IF;
  RAISE NOTICE 'PASS T4: identical ID sets (no drops, no substitutions)';

  -- T5: Within a page, all tier=1 rows appear BEFORE tier=2 rows
  -- (function return order, no client-side ORDER BY)
  v_prev_tier := 0;
  FOR v_row IN
    SELECT tier
    FROM public.search_listings_v4_tiered('كامري ايفون', 'JO', 100, 0)
  LOOP
    IF v_prev_tier = 2 AND v_row.tier = 1 THEN
      RAISE EXCEPTION 'TEST T5 FAIL: tier 1 appeared after tier 2';
    END IF;
    v_prev_tier := v_row.tier;
  END LOOP;
  RAISE NOTICE 'PASS T5: tier 1 before tier 2 within page';

  -- T6: Every returned row has tier in (1,2) and non-null tier_reason
  IF EXISTS (
    SELECT 1 FROM public.search_listings_v4_tiered('ايفون', 'JO', 100, 0)
    WHERE tier NOT IN (1, 2) OR tier_reason IS NULL
  ) THEN
    RAISE EXCEPTION 'TEST T6 FAIL: invalid tier or null tier_reason';
  END IF;
  RAISE NOTICE 'PASS T6: all rows have valid tier and non-null reason';

  -- T7: Query "من في" (stopword-only) → 0 rows
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered('من في', 'JO', 100, 0);
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T7 FAIL: stopword-only returned % rows', v_count;
  END IF;
  RAISE NOTICE 'PASS T7: stopword-only returns 0 rows';

  -- T8: Query with no matches → 0 rows
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered('zzznomatchxyz', 'JO', 100, 0);
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T8 FAIL: no-match query returned % rows', v_count;
  END IF;
  RAISE NOTICE 'PASS T8: no matches returns 0 rows';

  -- T9: multi-token non-contiguous → Tier 1
  SELECT tier, tier_reason INTO v_tier, v_reason
  FROM public.search_listings_v4_tiered('تويوتا كامري', 'JO', 100, 0)
  WHERE id = '97000000-0000-4000-8000-000000000006'::uuid;
  IF v_tier IS DISTINCT FROM 1 OR v_reason IS DISTINCT FROM 'exact_substring' THEN
    RAISE EXCEPTION 'TEST T9 FAIL: non-contiguous tier=% reason=%', v_tier, v_reason;
  END IF;
  RAISE NOTICE 'PASS T9: non-contiguous tokens classified as Tier 1';

  -- T10: 'تسله' returns Tesla as tier=2, excludes Kia/Hyundai/Lawn
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v2('تسله', 'JO', 20, 0)
  WHERE tier = 2 AND title ILIKE '%تسلا%';
  IF v_count < 1 THEN
    RAISE EXCEPTION 'T10 FAIL: Tesla not in tier 2 for تسله';
  END IF;

  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v2('تسله', 'JO', 20, 0)
  WHERE title ILIKE '%كيا%' OR title ILIKE '%هيونداي%' OR title ILIKE '%حشائش%';
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T10 FAIL: Kia/Hyundai/Lawn still in results (%)', v_count;
  END IF;

  RAISE NOTICE 'PASS T10: strict trigram excludes false positives, keeps Tesla';

  RAISE NOTICE 'ALL V4 TIERED WRAPPER TESTS PASSED';
END $$;

ROLLBACK;

SELECT 'ALL V4 TIERED WRAPPER TESTS PASSED; FIXTURES ROLLED BACK' AS result;
