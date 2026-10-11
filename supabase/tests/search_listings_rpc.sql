-- FOX Search RPC integration tests.
-- SAFETY: run only through scripts/test-search-rpc-local.sh against local PostgreSQL.
-- Every fixture is inside this transaction and the successful path explicitly ROLLBACKs.

BEGIN;

CREATE TEMP TABLE fox_search_rpc_test_context (
  user_id uuid PRIMARY KEY
) ON COMMIT DROP;

INSERT INTO fox_search_rpc_test_context(user_id) VALUES (gen_random_uuid());

-- A synthetic auth user is needed because public.listings.user_id references auth.users.
-- The auth user, any trigger side effects, and all listings are rolled back below.
INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
SELECT
  user_id,
  'authenticated',
  'authenticated',
  'fox-search-rpc-test-' || user_id::text || '@example.invalid',
  '',
  now(),
  '{}'::jsonb,
  '{}'::jsonb
FROM fox_search_rpc_test_context;

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, neighborhood, category_slug, subcategory_slug, attributes,
  status, created_at, seller_name, seller_phone
)
SELECT f.id, c.user_id, f.title, f.description, f.price, f.currency,
       f.country_code, f.city, f.neighborhood, f.category_slug,
       f.subcategory_slug, f.attributes, f.status, f.created_at,
       f.seller_name, ''
FROM fox_search_rpc_test_context c
CROSS JOIN (VALUES
  (
    '10000000-0000-4000-8000-000000000001'::uuid,
    'Toyota Camry 2018 black',
    'Clean Toyota Camry with indexed year and price attributes',
    '12000', 'JOD', 'JO', 'Amman', 'Abdoun', 'motors', 'cars',
    '{"make":"Toyota","model":"Camry","year":"2018","price":"12000","color":"black"}'::jsonb,
    'active', '2026-10-10T10:00:00Z'::timestamptz, 'Rana'
  ),
  (
    '10000000-0000-4000-8000-000000000002'::uuid,
    'تويوتا كامري 2018',
    'سيارة تويوتا كامري بحالة ممتازة',
    '11500', 'JOD', 'JO', 'عمّان', 'عبدون', 'motors', 'cars',
    '{"make":"تويوتا","model":"كامري","year":"2018"}'::jsonb,
    'active', '2026-10-09T10:00:00Z'::timestamptz, 'بائع تجريبي'
  ),
  (
    '10000000-0000-4000-8000-000000000003'::uuid,
    'Samsung 55 inch TV',
    'Samsung smart television',
    '250', 'JOD', 'JO', 'Amman', '', 'electronics', 'tv',
    '{"make":"Samsung","size":"55"}'::jsonb,
    'active', '2026-10-08T10:00:00Z'::timestamptz, 'Alex'
  ),
  (
    '10000000-0000-4000-8000-000000000004'::uuid,
    'Handmade wooden table by Sam',
    'Solid wood table; seller name Sam',
    '80', 'JOD', 'JO', 'Amman', '', 'furniture', 'tables',
    '{"material":"wood"}'::jsonb,
    'active', '2026-10-07T10:00:00Z'::timestamptz, 'Sam'
  ),
  (
    '10000000-0000-4000-8000-000000000005'::uuid,
    'Hgfddsssssss',
    'Unrelated gibberish fixture for false-positive checks',
    '1', 'JOD', 'JO', 'Zarqa', '', 'krakeeb', 'misc',
    '{}'::jsonb,
    'active', '2026-10-06T10:00:00Z'::timestamptz, 'Noise'
  ),
  (
    '10000000-0000-4000-8000-000000000006'::uuid,
    'Toyota Camry 2018 pending',
    'Non-active listing must not be searchable',
    '9000', 'JOD', 'JO', 'Amman', '', 'motors', 'cars',
    '{"make":"Toyota","model":"Camry","year":"2018"}'::jsonb,
    'pending', '2026-10-11T10:00:00Z'::timestamptz, 'Inactive'
  ),
  (
    '10000000-0000-4000-8000-000000000007'::uuid,
    'Kia Cerato 2020',
    'Saudi-market Kia Cerato',
    '45000', 'SAR', 'SA', 'Riyadh', 'Olaya', 'motors', 'cars',
    '{"make":"Kia","model":"Cerato","year":"2020"}'::jsonb,
    'active', '2026-10-05T10:00:00Z'::timestamptz, 'Saudi seller'
  ),
  (
    '10000000-0000-4000-8000-000000000008'::uuid,
    'كيا سيراتو 2020',
    'كيا سيراتو للبيع',
    '44000', 'SAR', 'SA', 'الرياض', 'العليا', 'motors', 'cars',
    '{"make":"كيا","model":"سيراتو","year":"2020"}'::jsonb,
    'active', '2026-10-04T10:00:00Z'::timestamptz, 'بائع سعودي'
  )
) AS f(
  id, title, description, price, currency, country_code, city, neighborhood,
  category_slug, subcategory_slug, attributes, status, created_at, seller_name
);

DO $$
DECLARE
  v_ids uuid[];
  v_first uuid;
  v_second uuid;
  v_repeat_first uuid;
  v_toyota_id uuid := '10000000-0000-4000-8000-000000000001'::uuid;
BEGIN
  -- Empty and whitespace queries must not return rows.
  IF EXISTS (SELECT 1 FROM public.search_listings('', 'JO', 20, 0)) THEN
    RAISE EXCEPTION 'FAIL: empty query returned rows';
  END IF;
  IF EXISTS (SELECT 1 FROM public.search_listings('   ', 'JO', 20, 0)) THEN
    RAISE EXCEPTION 'FAIL: whitespace-only query returned rows';
  END IF;

  -- Product contract: one- and two-character queries are too broad to search.
  IF EXISTS (SELECT 1 FROM public.search_listings('s', 'JO', 100, 0)) THEN
    RAISE EXCEPTION 'FAIL: one-character query s returned rows';
  END IF;
  IF EXISTS (SELECT 1 FROM public.search_listings('sa', 'JO', 100, 0)) THEN
    RAISE EXCEPTION 'FAIL: two-character query sa returned rows';
  END IF;

  -- Hardened short-query policy (live verified): queries with normalized length < 3 return no rows.
  -- "sam" (3 chars) is treated as too short / false-positive prone and must return no rows.
  IF EXISTS (SELECT 1 FROM public.search_listings('sam', 'JO', 100, 0)) THEN
    RAISE EXCEPTION 'FAIL: short query sam returned rows (false-positive regression)';
  END IF;
  IF EXISTS (SELECT 1 FROM public.search_listings('Sam', 'JO', 100, 0)) THEN
    RAISE EXCEPTION 'FAIL: short query Sam returned rows (false-positive regression)';
  END IF;
  IF EXISTS (SELECT 1 FROM public.search_listings('toy', 'JO', 100, 0)) THEN
    RAISE EXCEPTION 'FAIL: short query toy returned rows';
  END IF;
  IF EXISTS (SELECT 1 FROM public.search_listings('kia', 'JO', 100, 0)) THEN
    RAISE EXCEPTION 'FAIL: short query kia returned rows';
  END IF;

  -- English and Arabic make/model search, including cross-script aliases.
  SELECT coalesce(array_agg(id), '{}'::uuid[]) INTO v_ids
  FROM public.search_listings('Toyota Camry', 'JO', 100, 0);
  IF NOT ('10000000-0000-4000-8000-000000000001'::uuid = ANY(v_ids)) THEN
    RAISE EXCEPTION 'FAIL: Toyota Camry did not match English fixture; IDs=%', v_ids;
  END IF;
  IF '10000000-0000-4000-8000-000000000006'::uuid = ANY(v_ids) THEN
    RAISE EXCEPTION 'FAIL: non-active Toyota listing was returned';
  END IF;

  SELECT coalesce(array_agg(id), '{}'::uuid[]) INTO v_ids
  FROM public.search_listings('تويوتا كامري', 'JO', 100, 0);
  IF NOT ('10000000-0000-4000-8000-000000000002'::uuid = ANY(v_ids)) THEN
    RAISE EXCEPTION 'FAIL: Arabic query did not match Arabic Toyota/Camry fixture; IDs=%', v_ids;
  END IF;

  -- Prefix, middle, and suffix fragments should find the Toyota fixture.
  IF NOT EXISTS (SELECT 1 FROM public.search_listings('toy', 'JO', 100, 0) WHERE id = v_toyota_id) THEN
    RAISE EXCEPTION 'FAIL: prefix fragment toy did not match Toyota';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.search_listings('yot', 'JO', 100, 0) WHERE id = v_toyota_id) THEN
    RAISE EXCEPTION 'FAIL: middle fragment yot did not match Toyota';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.search_listings('ota', 'JO', 100, 0) WHERE id = v_toyota_id) THEN
    RAISE EXCEPTION 'FAIL: suffix fragment ota did not match Toyota';
  END IF;

  -- Multi-token AND behavior: a listing must not match unrelated combined terms.
  IF EXISTS (SELECT 1 FROM public.search_listings('Toyota Samsung', 'JO', 100, 0)) THEN
    RAISE EXCEPTION 'FAIL: unrelated multi-token query Toyota Samsung returned rows';
  END IF;

  -- Year and indexed attribute values.
  IF NOT EXISTS (SELECT 1 FROM public.search_listings('2018', 'JO', 100, 0) WHERE id = '10000000-0000-4000-8000-000000000001'::uuid) THEN
    RAISE EXCEPTION 'FAIL: year 2018 did not match fixture';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.search_listings('12000', 'JO', 100, 0) WHERE id = '10000000-0000-4000-8000-000000000001'::uuid) THEN
    RAISE EXCEPTION 'FAIL: indexed attribute 12000 did not match fixture';
  END IF;

  -- Country isolation and active status.
  IF EXISTS (SELECT 1 FROM public.search_listings('Kia', 'JO', 100, 0)) THEN
    RAISE EXCEPTION 'FAIL: Saudi Kia appeared in Jordan results';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.search_listings('Kia', 'SA', 100, 0) WHERE id = '10000000-0000-4000-8000-000000000007'::uuid) THEN
    RAISE EXCEPTION 'FAIL: Saudi Kia fixture not found in SA market';
  END IF;
  IF EXISTS (SELECT 1 FROM public.search_listings('Camry', 'JO', 100, 0) WHERE id = '10000000-0000-4000-8000-000000000006'::uuid) THEN
    RAISE EXCEPTION 'FAIL: pending listing appeared in public search';
  END IF;

  -- False-positive guard for a nonsense query.
  IF EXISTS (SELECT 1 FROM public.search_listings('zzzxqv', 'JO', 100, 0)) THEN
    RAISE EXCEPTION 'FAIL: nonsense query zzzxqv returned rows';
  END IF;

  -- Pagination must move to a different result and repeated first pages must be stable.
  SELECT id INTO v_first FROM public.search_listings('Toyota', 'JO', 1, 0) LIMIT 1;
  SELECT id INTO v_repeat_first FROM public.search_listings('Toyota', 'JO', 1, 0) LIMIT 1;
  SELECT id INTO v_second FROM public.search_listings('Toyota', 'JO', 1, 1) LIMIT 1;
  IF v_first IS NULL OR v_second IS NULL THEN
    RAISE EXCEPTION 'FAIL: expected at least two active Toyota fixtures for pagination';
  END IF;
  IF v_first IS DISTINCT FROM v_repeat_first THEN
    RAISE EXCEPTION 'FAIL: first-page ordering was not stable';
  END IF;
  IF v_first = v_second THEN
    RAISE EXCEPTION 'FAIL: adjacent pages repeated the same listing';
  END IF;

  RAISE NOTICE 'PASS: search_listings RPC integration assertions completed';
END;
$$;

-- This is intentional. No fixture rows or synthetic auth user are persisted.
ROLLBACK;
