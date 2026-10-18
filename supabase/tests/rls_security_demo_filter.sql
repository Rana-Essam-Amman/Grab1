BEGIN;

DO $fixture$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.listings
    WHERE id = '90000000-0000-4000-8000-000000000001'::uuid
  ) THEN
    INSERT INTO public.listings (
      id,
      user_id,
      title,
      description,
      price,
      currency,
      country_code,
      city,
      category_slug,
      status,
      seller_phone,
      is_demo,
      created_at
    )
    VALUES (
      '90000000-0000-4000-8000-000000000001'::uuid,
      '20000000-0000-4000-8000-000000000001'::uuid,
      'Wave2BDemoFixtureToken',
      'Wave2BDemoFixtureToken regression fixture',
      '100',
      'JOD',
      'JO',
      'Amman',
      'cars',
      'active',
      '07990000001',
      true,
      now()
    );
  END IF;
END
$fixture$;

GRANT USAGE ON SCHEMA extensions TO anon;

SET LOCAL ROLE anon;

-- T1: anon cannot see demo fixture in listings
DO $t1$
DECLARE
  v_count integer;
BEGIN
  SELECT count(*)::integer INTO v_count
  FROM public.listings
  WHERE id = '90000000-0000-4000-8000-000000000001'::uuid;

  IF v_count <> 0 THEN
    RAISE EXCEPTION 'T1 FAIL: anon sees demo fixture';
  END IF;
  RAISE NOTICE 'PASS T1: anon cannot see demo fixture';
END
$t1$;

-- T2: anon cannot retrieve demo fixture by exact ID
DO $t2$
DECLARE
  v_count integer;
BEGIN
  SELECT count(*)::integer INTO v_count
  FROM public.listings
  WHERE id = '90000000-0000-4000-8000-000000000001'::uuid;

  IF v_count <> 0 THEN
    RAISE EXCEPTION 'T2 FAIL: anon retrieved demo fixture by ID';
  END IF;
  RAISE NOTICE 'PASS T2: anon cannot retrieve demo fixture by ID';
END
$t2$;

-- T3: search_listings excludes demo fixture
DO $t3$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.search_listings('Wave2BDemoFixtureToken', 'JO', 100, 0)
    WHERE id = '90000000-0000-4000-8000-000000000001'::uuid
  ) THEN
    RAISE EXCEPTION 'T3 FAIL: search_listings returned demo fixture';
  END IF;
  RAISE NOTICE 'PASS T3: search_listings excludes demo fixture';
END
$t3$;

-- T4: search_listings_v2 excludes demo fixture
DO $t4$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.search_listings_v2('Wave2BDemoFixtureToken', 'JO', 100, 0)
    WHERE id = '90000000-0000-4000-8000-000000000001'::uuid
  ) THEN
    RAISE EXCEPTION 'T4 FAIL: search_listings_v2 returned demo fixture';
  END IF;
  RAISE NOTICE 'PASS T4: search_listings_v2 excludes demo fixture';
END
$t4$;

-- T5: search_listings_hybrid excludes demo fixture
DO $t5$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.search_listings_hybrid(
      p_query            => 'Wave2BDemoFixtureToken',
      p_query_vector     => NULL,
      p_market           => 'JO',
      p_limit            => 100,
      p_offset           => 0,
      p_max_distance     => 0.85,
      p_category_hint    => NULL,
      p_category_slug    => NULL,
      p_subcategory_slug => NULL,
      p_min_price        => NULL,
      p_max_price        => NULL,
      p_city             => NULL,
      p_neighborhood     => NULL,
      p_attrs            => NULL
    )
    WHERE id = '90000000-0000-4000-8000-000000000001'::uuid
  ) THEN
    RAISE EXCEPTION 'T5 FAIL: search_listings_hybrid returned demo fixture';
  END IF;
  RAISE NOTICE 'PASS T5: search_listings_hybrid excludes demo fixture';
END
$t5$;


-- T6: search_listings_semantic excludes demo fixture
DO $t6$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.search_listings_semantic(
      array_fill(0::real, ARRAY[384])::extensions.vector, 'JO', 100, 0, NULL
    )
    WHERE id = '90000000-0000-4000-8000-000000000001'::uuid
  ) THEN
    RAISE EXCEPTION 'T6 FAIL: search_listings_semantic returned demo fixture';
  END IF;
  RAISE NOTICE 'PASS T6: search_listings_semantic excludes demo fixture';
END
$t6$;

-- T7: search_listings_v2_intent excludes demo fixture
DO $t7$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.search_listings_v2_intent('Wave2BDemoFixtureToken', 'JO', 100, 0)
    WHERE id = '90000000-0000-4000-8000-000000000001'::uuid
  ) THEN
    RAISE EXCEPTION 'T7 FAIL: search_listings_v2_intent returned demo fixture';
  END IF;
  RAISE NOTICE 'PASS T7: search_listings_v2_intent excludes demo fixture';
END
$t7$;

-- T7b: search_listings_v2_intent_typo excludes demo fixture
DO $t7b$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.search_listings_v2_intent_typo('Wave2BDemoFixtureToken', 'JO', 100, 0)
    WHERE id = '90000000-0000-4000-8000-000000000001'::uuid
  ) THEN
    RAISE EXCEPTION 'T7b FAIL: search_listings_v2_intent_typo returned demo fixture';
  END IF;
  RAISE NOTICE 'PASS T7b: search_listings_v2_intent_typo excludes demo fixture';
END
$t7b$;

-- T8: listings_by_seller excludes demo fixture (UUID + phone)
DO $t8$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.listings_by_seller('20000000-0000-4000-8000-000000000001', 'JO', 100, 0)
    WHERE id = '90000000-0000-4000-8000-000000000001'::uuid
  ) THEN
    RAISE EXCEPTION 'T8 FAIL: listings_by_seller UUID lookup returned demo fixture';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.listings_by_seller('07990000001', 'JO', 100, 0)
    WHERE id = '90000000-0000-4000-8000-000000000001'::uuid
  ) THEN
    RAISE EXCEPTION 'T8 FAIL: listings_by_seller phone lookup returned demo fixture';
  END IF;
  RAISE NOTICE 'PASS T8: listings_by_seller excludes demo fixture';
END
$t8$;

RESET ROLE;

-- T9: authenticated owner still sees own demo fixture
SELECT set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000001', true);
SELECT set_config('request.jwt.claims', '{"sub":"20000000-0000-4000-8000-000000000001","role":"authenticated"}', true);

SET LOCAL ROLE authenticated;
DO $t9$
DECLARE
  v_count integer;
BEGIN
  SELECT count(*)::integer INTO v_count
  FROM public.listings
  WHERE id = '90000000-0000-4000-8000-000000000001'::uuid;

  IF v_count <> 1 THEN
    RAISE EXCEPTION 'T9 FAIL: authenticated owner cannot see own demo fixture';
  END IF;
  RAISE NOTICE 'PASS T9: authenticated owner can see own demo fixture';
END
$t9$;

RESET ROLE;

-- T10: policy qual contains is_demo
DO $t10$
DECLARE
  v_qual text;
BEGIN
  SELECT qual INTO v_qual
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'listings'
    AND policyname = 'listings_select_public_or_owner_or_admin';

  IF v_qual IS NULL OR position('is_demo' IN lower(v_qual)) = 0 THEN
    RAISE EXCEPTION 'T10 FAIL: policy qual does not reference is_demo';
  END IF;
  RAISE NOTICE 'PASS T10: policy qual references is_demo';
END
$t10$;

-- T11: listing_passes_filters source contains is_demo
DO $t11$
DECLARE
  v_src text;
BEGIN
  SELECT p.prosrc INTO v_src
  FROM pg_proc p
  WHERE p.oid = to_regprocedure(
    'public.listing_passes_filters(public.listings,text,text,numeric,numeric,text,text,jsonb)'
  );

  IF v_src IS NULL OR position('is_demo' IN lower(v_src)) = 0 THEN
    RAISE EXCEPTION 'T11 FAIL: listing_passes_filters does not reference is_demo';
  END IF;
  RAISE NOTICE 'PASS T11: listing_passes_filters references is_demo';
END
$t11$;

ROLLBACK;
