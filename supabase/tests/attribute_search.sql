-- attribute_search.sql
-- Regression guard: listing attribute values must remain searchable.
-- LOCAL ONLY: invoked by test-search-rpc-local.sh.
-- Every fixture and trigger mutation is rolled back.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = '70000000-0000-4000-8000-000000000001'::uuid
  ) THEN
    RAISE EXCEPTION 'PREREQ FAIL: attribute-search fixture user UUID already exists';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.listings
    WHERE id IN (
      '71000000-0000-4000-8000-000000000001'::uuid,
      '71000000-0000-4000-8000-000000000002'::uuid
    )
  ) THEN
    RAISE EXCEPTION 'PREREQ FAIL: attribute-search fixture listing UUID already exists';
  END IF;
END $$;

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES (
  '70000000-0000-4000-8000-000000000001'::uuid,
  'authenticated',
  'authenticated',
  'attribute-search-70000000@example.invalid',
  '',
  now(),
  '{}'::jsonb,
  '{}'::jsonb
);

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, category_slug, status, attributes
)
VALUES (
  '71000000-0000-4000-8000-000000000001'::uuid,
  '70000000-0000-4000-8000-000000000001'::uuid,
  'Attribute search regression fixture A',
  'Description deliberately excludes every probe value.',
  '100', 'JOD', 'JO', 'Amman', 'cars', 'active',
  '[
    {"key":"color","label":"اللون","value":"فرشاتي-ثقيل-اختبار"},
    {"key":"fuel","label":"الوقود","value":"بنزين-ثقيل-اختبار"}
  ]'::jsonb
);

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, category_slug, status, attributes
)
VALUES (
  '71000000-0000-4000-8000-000000000002'::uuid,
  '70000000-0000-4000-8000-000000000001'::uuid,
  'Attribute search regression fixture B',
  'Description deliberately excludes the real-estate probe value.',
  '200', 'JOD', 'JO', 'Amman', 'real-estate', 'active',
  '[{"key":"future_field_probe","label":"حقل اختبار","value":"عقار-صفة-اختبار"}]'::jsonb
);

DO $$
DECLARE
  v_listing_id uuid := '71000000-0000-4000-8000-000000000001'::uuid;
  v_real_estate_id uuid := '71000000-0000-4000-8000-000000000002'::uuid;
  v_search_text text;
  v_found boolean;
BEGIN
  SELECT search_text INTO v_search_text
  FROM public.listings WHERE id = v_listing_id;

  IF v_search_text IS NULL OR position('فرشاتي' IN v_search_text) = 0 THEN
    RAISE EXCEPTION 'TEST A FAIL: INSERT trigger did not expose the attribute value in search_text; got=%',
      v_search_text;
  END IF;
  RAISE NOTICE 'PASS A: INSERT trigger populated search_text from attributes';

  IF EXISTS (
    SELECT 1
    FROM public.listings
    WHERE id IN (v_listing_id, v_real_estate_id)
      AND (
        title LIKE '%فرشاتي-ثقيل-اختبار%'
        OR description LIKE '%فرشاتي-ثقيل-اختبار%'
        OR title LIKE '%بنزين-ثقيل-اختبار%'
        OR description LIKE '%بنزين-ثقيل-اختبار%'
        OR title LIKE '%عقار-صفة-اختبار%'
        OR description LIKE '%عقار-صفة-اختبار%'
      )
  ) THEN
    RAISE EXCEPTION 'TEST E FAIL: a probe value leaked into title or description';
  END IF;
  RAISE NOTICE 'PASS E: probe values exist only in attributes';

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v2_intent_typo(
      p_query => 'فرشاتي-ثقيل-اختبار',
      p_market => 'JO',
      p_limit => 100,
      p_offset => 0,
      p_category_slug => NULL,
      p_subcategory_slug => NULL,
      p_min_price => NULL,
      p_max_price => NULL,
      p_city => NULL,
      p_neighborhood => NULL,
      p_attrs => NULL
    ) AS r
    WHERE r.id = v_listing_id
  ) INTO v_found;

  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST B FAIL: v2_intent_typo did not return the attribute-only listing';
  END IF;
  RAISE NOTICE 'PASS B: v2_intent_typo finds attribute-only values';

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings(
      p_query => 'فرشاتي-ثقيل-اختبار',
      p_market => 'JO',
      p_limit => 100,
      p_offset => 0,
      p_category_slug => NULL,
      p_subcategory_slug => NULL,
      p_min_price => NULL,
      p_max_price => NULL,
      p_city => NULL,
      p_neighborhood => NULL,
      p_attrs => NULL
    ) AS r
    WHERE r.id = v_listing_id
  ) INTO v_found;

  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST C FAIL: search_listings did not return the attribute-only listing';
  END IF;
  RAISE NOTICE 'PASS C: search_listings finds attribute-only values';

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_hybrid(
      p_query => 'فرشاتي-ثقيل-اختبار',
      p_market => 'JO',
      p_limit => 100,
      p_offset => 0,
      p_max_distance => 0.85,
      p_category_hint => NULL,
      p_category_slug => NULL,
      p_subcategory_slug => NULL,
      p_min_price => NULL,
      p_max_price => NULL,
      p_city => NULL,
      p_neighborhood => NULL,
      p_attrs => NULL
    ) AS r
    WHERE r.id = v_listing_id
  ) INTO v_found;

  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST D FAIL: search_listings_hybrid did not return the attribute-only listing';
  END IF;
  RAISE NOTICE 'PASS D: hybrid search finds attribute-only values';

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v2_intent_typo(
      p_query => 'بنزين-ثقيل-اختبار',
      p_market => 'JO',
      p_limit => 100,
      p_offset => 0,
      p_category_slug => NULL,
      p_subcategory_slug => NULL,
      p_min_price => NULL,
      p_max_price => NULL,
      p_city => NULL,
      p_neighborhood => NULL,
      p_attrs => NULL
    ) AS r
    WHERE r.id = v_listing_id
  ) INTO v_found;

  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST F FAIL: v2_intent_typo did not find the fuel-key attribute';
  END IF;
  RAISE NOTICE 'PASS F: a second attribute key is searchable';

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v2_intent_typo(
      p_query => 'عقار-صفة-اختبار',
      p_market => 'JO',
      p_limit => 100,
      p_offset => 0,
      p_category_slug => NULL,
      p_subcategory_slug => NULL,
      p_min_price => NULL,
      p_max_price => NULL,
      p_city => NULL,
      p_neighborhood => NULL,
      p_attrs => NULL
    ) AS r
    WHERE r.id = v_real_estate_id
  ) INTO v_found;

  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST G FAIL: attribute-only value in real-estate category was not found';
  END IF;
  RAISE NOTICE 'PASS G: arbitrary attribute key is searchable across categories';

  UPDATE public.listings
  SET attributes = '[{"key":"color","label":"اللون","value":"محدث-ثقيل-اختبار"}]'::jsonb
  WHERE id = v_listing_id;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v2_intent_typo(
      p_query => 'فرشاتي-ثقيل-اختبار',
      p_market => 'JO',
      p_limit => 100,
      p_offset => 0,
      p_category_slug => NULL,
      p_subcategory_slug => NULL,
      p_min_price => NULL,
      p_max_price => NULL,
      p_city => NULL,
      p_neighborhood => NULL,
      p_attrs => NULL
    ) AS r
    WHERE r.id = v_listing_id
  ) INTO v_found;

  IF v_found THEN
    RAISE EXCEPTION 'TEST H FAIL: old attribute value still returns the updated listing';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v2_intent_typo(
      p_query => 'محدث-ثقيل-اختبار',
      p_market => 'JO',
      p_limit => 100,
      p_offset => 0,
      p_category_slug => NULL,
      p_subcategory_slug => NULL,
      p_min_price => NULL,
      p_max_price => NULL,
      p_city => NULL,
      p_neighborhood => NULL,
      p_attrs => NULL
    ) AS r
    WHERE r.id = v_listing_id
  ) INTO v_found;

  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST H FAIL: new attribute value was not searchable after UPDATE';
  END IF;
  RAISE NOTICE 'PASS H: UPDATE trigger removes old value and indexes new value';

  RAISE NOTICE 'ALL ATTRIBUTE SEARCH REGRESSION TESTS PASSED';
END $$;

ROLLBACK;

SELECT 'ALL ATTRIBUTE SEARCH REGRESSION TESTS PASSED; FIXTURES ROLLED BACK' AS result;
