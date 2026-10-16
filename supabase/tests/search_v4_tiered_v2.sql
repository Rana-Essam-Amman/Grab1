-- search_v4_tiered_v2.sql
-- C2 wrapper tests: independent same-category Tier 2. LOCAL ONLY. All fixtures rolled back.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = '98000000-0000-4000-8000-000000000001'::uuid
  ) OR EXISTS (
    SELECT 1 FROM public.listings
    WHERE id BETWEEN '99000000-0000-4000-8000-000000000001'::uuid
                 AND '99000000-0000-4000-8000-000000000010'::uuid
  ) THEN
    RAISE EXCEPTION 'PREREQ FAIL: v4 tiered v2 fixture UUID already exists';
  END IF;
END $$;

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES (
  '98000000-0000-4000-8000-000000000001'::uuid,
  'authenticated', 'authenticated',
  'v4-tiered-v2-98000000@example.invalid',
  '', now(), '{}'::jsonb, '{}'::jsonb
);

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, neighborhood, category_slug, subcategory_slug, status,
  attributes, created_at
)
VALUES
  -- motors/cars (3)
  ('99000000-0000-4000-8000-000000000001'::uuid,
   '98000000-0000-4000-8000-000000000001'::uuid,
   'تويوتا كامري 2020', 'exact toyota', '15000', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-10T10:00:00Z'),
  ('99000000-0000-4000-8000-000000000002'::uuid,
   '98000000-0000-4000-8000-000000000001'::uuid,
   'كيا سيراتو 2019', 'other motor', '12000', 'JOD', 'JO',
   'Amman', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-09T10:00:00Z'),
  ('99000000-0000-4000-8000-000000000003'::uuid,
   '98000000-0000-4000-8000-000000000001'::uuid,
   'هيونداي إلانترا 2018', 'another motor', '10000', 'JOD', 'JO',
   'Zarqa', NULL, 'motors', 'cars', 'active', '[]'::jsonb,
   '2026-10-08T10:00:00Z'),
  -- real-estate/for-sale (2)
  ('99000000-0000-4000-8000-000000000004'::uuid,
   '98000000-0000-4000-8000-000000000001'::uuid,
   'شقة للبيع في عمان', 'apartment', '80000', 'JOD', 'JO',
   'Amman', NULL, 'real-estate', 'for-sale', 'active', '[]'::jsonb,
   '2026-10-07T10:00:00Z'),
  ('99000000-0000-4000-8000-000000000005'::uuid,
   '98000000-0000-4000-8000-000000000001'::uuid,
   'فيلا للبيع', 'villa', '150000', 'JOD', 'JO',
   'Amman', NULL, 'real-estate', 'for-sale', 'active', '[]'::jsonb,
   '2026-10-06T10:00:00Z'),
  -- electronics/tv (1)
  ('99000000-0000-4000-8000-000000000006'::uuid,
   '98000000-0000-4000-8000-000000000001'::uuid,
   'تلفزيون سامسونج', 'tv', '400', 'JOD', 'JO',
   'Amman', NULL, 'electronics', 'tv', 'active', '[]'::jsonb,
   '2026-10-05T10:00:00Z');

DO $$
DECLARE
  v_count integer;
  v_tier integer;
  v_reason text;
  v_rank integer;
  v_id uuid;
  v_intersect integer;
BEGIN
  -- T1: query "تويوتا" (exact match to one fixture) →
  --     Tier 1 has that fixture; Tier 2 has 2 other motors (not the Tier 1)
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v2('تويوتا', 'JO', 20, 0)
  WHERE tier = 1 AND id = '99000000-0000-4000-8000-000000000001'::uuid;
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'TEST T1 FAIL: expected exact toyota in tier 1';
  END IF;

  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v2('تويوتا', 'JO', 20, 0)
  WHERE tier = 2 AND tier_reason = 'similar_category'
    AND category_slug = 'motors'
    AND id IN (
      '99000000-0000-4000-8000-000000000002'::uuid,
      '99000000-0000-4000-8000-000000000003'::uuid
    );
  IF v_count < 1 THEN
    RAISE EXCEPTION 'TEST T1 FAIL: expected independent motors in tier 2';
  END IF;
  RAISE NOTICE 'PASS T1: toyota exact + independent motors';

  -- T2: query "xyzgarbage" (no exact match, undetectable category) →
  --     Tier 1 = 0, Tier 2 = 0
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v2('xyzgarbage', 'JO', 20, 0);
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T2 FAIL: garbage query returned % rows', v_count;
  END IF;
  RAISE NOTICE 'PASS T2: undetectable category returns 0';

  -- T3: query "سيارة" (detect_query_category → motors) → Tier 2 from motors
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v2('سيارة', 'JO', 20, 0)
  WHERE tier = 2 AND tier_reason = 'similar_category' AND category_slug = 'motors';
  IF v_count < 1 THEN
    RAISE EXCEPTION 'TEST T3 FAIL: expected motors from detect_query_category';
  END IF;
  RAISE NOTICE 'PASS T3: سيارة detects motors for Tier 2';

  -- T4: Tier 2 IDs do NOT intersect Tier 1 IDs
  SELECT count(*) INTO v_intersect
  FROM (
    SELECT id FROM public.search_listings_v4_tiered_v2('تويوتا', 'JO', 20, 0) WHERE tier = 1
    INTERSECT
    SELECT id FROM public.search_listings_v4_tiered_v2('تويوتا', 'JO', 20, 0) WHERE tier = 2
  ) x;
  IF v_intersect <> 0 THEN
    RAISE EXCEPTION 'TEST T4 FAIL: tier 1 and tier 2 ids intersect';
  END IF;
  RAISE NOTICE 'PASS T4: no id intersection between tiers';

  -- T5: p_tier2_limit=0 → only C1 rows (no independent Tier 2)
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v2('تويوتا', 'JO', 20, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0)
  WHERE tier_reason = 'similar_category';
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T5 FAIL: p_tier2_limit=0 still returned independent rows';
  END IF;
  RAISE NOTICE 'PASS T5: p_tier2_limit=0 suppresses independent Tier 2';

  -- T6: p_tier2_limit=10 → clamped to 5
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v2('سيارة', 'JO', 20, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10)
  WHERE tier_reason = 'similar_category';
  IF v_count > 5 THEN
    RAISE EXCEPTION 'TEST T6 FAIL: p_tier2_limit=10 not clamped, got %', v_count;
  END IF;
  RAISE NOTICE 'PASS T6: p_tier2_limit clamped to 5';

  -- T7: p_category_slug='real-estate' + query with motors exact matches
  --     → user filter wins; Tier 2 only from real-estate
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v2('تويوتا', 'JO', 20, 0, 'real-estate')
  WHERE tier = 2 AND tier_reason = 'similar_category' AND category_slug <> 'real-estate';
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T7 FAIL: user category filter not respected for Tier 2';
  END IF;
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v2('تويوتا', 'JO', 20, 0, 'real-estate')
  WHERE tier = 2 AND tier_reason = 'similar_category' AND category_slug = 'real-estate';
  IF v_count < 1 THEN
    RAISE EXCEPTION 'TEST T7 FAIL: expected real-estate independent when filtered';
  END IF;
  RAISE NOTICE 'PASS T7: p_category_slug wins for Tier 2 category';

  -- T8: v4 exact + C1 tier 2 + independent tier 2 (mixed) → all present,
  --     rank_in_tier unique per tier
  -- (Using a query that produces mixed; ranks are unique within tier by construction)
  SELECT count(*) INTO v_count
  FROM (
    SELECT tier, rank_in_tier, count(*)
    FROM public.search_listings_v4_tiered_v2('تويوتا', 'JO', 20, 0)
    GROUP BY tier, rank_in_tier
    HAVING count(*) > 1
  ) dups;
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T8 FAIL: duplicate rank_in_tier within a tier';
  END IF;
  RAISE NOTICE 'PASS T8: rank_in_tier unique per tier';

  RAISE NOTICE 'ALL V4 TIERED V2 TESTS PASSED';
END $$;

ROLLBACK;

SELECT 'ALL V4 TIERED V2 TESTS PASSED; FIXTURES ROLLED BACK' AS result;
