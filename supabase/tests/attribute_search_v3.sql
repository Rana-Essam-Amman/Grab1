-- attribute_search_v3.sql
-- Regression for search_relaxed_subsets + search_listings_v3_relaxed.
-- LOCAL ONLY. All fixtures and mutations are rolled back.
-- T9 preserves PR #322 assertions A-H and additionally asserts v3_relaxed
-- finds the same attribute-only fixtures for B, F, G.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id IN (
      '80000000-0000-4000-8000-000000000001'::uuid,
      '70000000-0000-4000-8000-000000000001'::uuid
    )
  ) THEN
    RAISE EXCEPTION 'PREREQ FAIL: v3 fixture user UUID already exists';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.listings
    WHERE id IN (
      '81000000-0000-4000-8000-000000000001'::uuid,
      '81000000-0000-4000-8000-000000000002'::uuid,
      '81000000-0000-4000-8000-000000000003'::uuid,
      '81000000-0000-4000-8000-000000000004'::uuid,
      '81000000-0000-4000-8000-000000000005'::uuid,
      '81000000-0000-4000-8000-000000000006'::uuid,
      '81000000-0000-4000-8000-000000000007'::uuid,
      '81000000-0000-4000-8000-000000000008'::uuid,
      '81000000-0000-4000-8000-000000000009'::uuid,
      '71000000-0000-4000-8000-000000000001'::uuid,
      '71000000-0000-4000-8000-000000000002'::uuid
    )
  ) THEN
    RAISE EXCEPTION 'PREREQ FAIL: v3 fixture listing UUID already exists';
  END IF;
END $$;

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES
  (
    '80000000-0000-4000-8000-000000000001'::uuid,
    'authenticated', 'authenticated',
    'v3-relaxed-80000000@example.invalid',
    '', now(), '{}'::jsonb, '{}'::jsonb
  ),
  (
    '70000000-0000-4000-8000-000000000001'::uuid,
    'authenticated', 'authenticated',
    'attribute-search-70000000@example.invalid',
    '', now(), '{}'::jsonb, '{}'::jsonb
  );

-- T7 fixtures: JO vs SA, price, category, city, neighborhood, attrs.
INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, neighborhood, category_slug, subcategory_slug, status, attributes
)
VALUES
  (
    '81000000-0000-4000-8000-000000000001'::uuid,
    '80000000-0000-4000-8000-000000000001'::uuid,
    'v3probe jo tesla red 2022 abdoun motors',
    'Description excludes probe tokens on purpose.',
    '150', 'JOD', 'JO', 'Amman', 'Abdoun', 'motors', 'cars', 'active',
    '[{"key":"make","label":"Make","value":"v3joattr"}]'::jsonb
  ),
  (
    '81000000-0000-4000-8000-000000000002'::uuid,
    '80000000-0000-4000-8000-000000000001'::uuid,
    'v3probe sa tesla red 2022 riyadh motors',
    'Description excludes probe tokens on purpose.',
    '150', 'SAR', 'SA', 'Riyadh', 'Olaya', 'motors', 'cars', 'active',
    '[{"key":"make","label":"Make","value":"v3saattr"}]'::jsonb
  ),
  (
    '81000000-0000-4000-8000-000000000003'::uuid,
    '80000000-0000-4000-8000-000000000001'::uuid,
    'v3probe cheap tesla red 2022',
    'Price filter fixture.',
    '50', 'JOD', 'JO', 'Amman', 'Abdoun', 'motors', 'cars', 'active',
    '[]'::jsonb
  ),
  (
    '81000000-0000-4000-8000-000000000004'::uuid,
    '80000000-0000-4000-8000-000000000001'::uuid,
    'v3probe expensive tesla red 2022',
    'Price filter fixture.',
    '900', 'JOD', 'JO', 'Amman', 'Abdoun', 'motors', 'cars', 'active',
    '[]'::jsonb
  );

-- T8 fixtures: A matches all three tokens; B matches only core+color.
INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, category_slug, status, attributes
)
VALUES
  (
    '81000000-0000-4000-8000-000000000005'::uuid,
    '80000000-0000-4000-8000-000000000001'::uuid,
    'v3mix tesla red 2022 full match',
    'Matches core color and year.',
    '100', 'JOD', 'JO', 'Amman', 'motors', 'active',
    '[]'::jsonb
  ),
  (
    '81000000-0000-4000-8000-000000000006'::uuid,
    '80000000-0000-4000-8000-000000000001'::uuid,
    'v3mix tesla red partial match',
    'Matches core and color only.',
    '100', 'JOD', 'JO', 'Amman', 'motors', 'active',
    '[]'::jsonb
  );

-- T6B fixture: unique marker for >5 token delegation.
INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, category_slug, status, attributes
)
VALUES (
  '81000000-0000-4000-8000-000000000007'::uuid,
  '80000000-0000-4000-8000-000000000001'::uuid,
  'v3delegation test marker',
  'Delegation fixture for more than five tokens.',
  '100', 'JOD', 'JO', 'Amman', 'motors', 'active',
  '[]'::jsonb
);

-- T10 fixtures: A matches all three page tokens; B matches core+color only.
INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, category_slug, status, attributes
)
VALUES
  (
    '81000000-0000-4000-8000-000000000008'::uuid,
    '80000000-0000-4000-8000-000000000001'::uuid,
    'v3pagecore v3pagecolor v3pageyear full',
    'Matches all three pagination tokens.',
    '100', 'JOD', 'JO', 'Amman', 'motors', 'active',
    '[]'::jsonb
  ),
  (
    '81000000-0000-4000-8000-000000000009'::uuid,
    '80000000-0000-4000-8000-000000000001'::uuid,
    'v3pagecore v3pagecolor partial',
    'Matches core and color only.',
    '100', 'JOD', 'JO', 'Amman', 'motors', 'active',
    '[]'::jsonb
  );

-- T9 fixtures (same as attribute_search.sql).
INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, category_slug, status, attributes
)
VALUES
  (
    '71000000-0000-4000-8000-000000000001'::uuid,
    '70000000-0000-4000-8000-000000000001'::uuid,
    'Attribute search regression fixture A',
    'Description deliberately excludes every probe value.',
    '100', 'JOD', 'JO', 'Amman', 'cars', 'active',
    '[
      {"key":"color","label":"اللون","value":"فرشاتي-ثقيل-اختبار"},
      {"key":"fuel","label":"الوقود","value":"بنزين-ثقيل-اختبار"}
    ]'::jsonb
  ),
  (
    '71000000-0000-4000-8000-000000000002'::uuid,
    '70000000-0000-4000-8000-000000000001'::uuid,
    'Attribute search regression fixture B',
    'Description deliberately excludes the real-estate probe value.',
    '200', 'JOD', 'JO', 'Amman', 'real-estate', 'active',
    '[{"key":"future_field_probe","label":"حقل اختبار","value":"عقار-صفة-اختبار"}]'::jsonb
  );

DO $$
DECLARE
  v_subsets text[][];
  v_attempt integer;
  v_tokens text[];
  v_count integer;
  v_found boolean;
  v_search_text text;
  v_listing_id uuid := '71000000-0000-4000-8000-000000000001'::uuid;
  v_real_estate_id uuid := '71000000-0000-4000-8000-000000000002'::uuid;
  v_jo uuid := '81000000-0000-4000-8000-000000000001'::uuid;
  v_sa uuid := '81000000-0000-4000-8000-000000000002'::uuid;
  v_cheap uuid := '81000000-0000-4000-8000-000000000003'::uuid;
  v_expensive uuid := '81000000-0000-4000-8000-000000000004'::uuid;
  v_mix_a uuid := '81000000-0000-4000-8000-000000000005'::uuid;
  v_mix_b uuid := '81000000-0000-4000-8000-000000000006'::uuid;
  v_delegate uuid := '81000000-0000-4000-8000-000000000007'::uuid;
  v_page_a uuid := '81000000-0000-4000-8000-000000000008'::uuid;
  v_page_b uuid := '81000000-0000-4000-8000-000000000009'::uuid;
BEGIN
  -- T1: both functions exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'search_relaxed_subsets'
  ) OR NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'search_listings_v3_relaxed'
  ) THEN
    RAISE EXCEPTION 'TEST T1 FAIL: search_relaxed_subsets or search_listings_v3_relaxed missing';
  END IF;
  RAISE NOTICE 'PASS T1: both functions exist';

  -- T2: stopword removal + core position
  SELECT subset_tokens INTO v_tokens
  FROM public.search_relaxed_subsets('بدي تسلا احمر 2022')
  WHERE attempt_no = 1;

  IF v_tokens IS DISTINCT FROM ARRAY['تسلا', 'احمر', '2022']::text[] THEN
    RAISE EXCEPTION 'TEST T2 FAIL: attempt 1 tokens = %', v_tokens;
  END IF;
  RAISE NOTICE 'PASS T2: stopword removed; core token first';

  -- T3: exact subset priority for 3 tokens
  IF (SELECT subset_tokens FROM public.search_relaxed_subsets('tesla red 2022') WHERE attempt_no = 1)
       IS DISTINCT FROM ARRAY['tesla', 'red', '2022']::text[]
     OR (SELECT subset_tokens FROM public.search_relaxed_subsets('tesla red 2022') WHERE attempt_no = 2)
       IS DISTINCT FROM ARRAY['tesla', 'red']::text[]
     OR (SELECT subset_tokens FROM public.search_relaxed_subsets('tesla red 2022') WHERE attempt_no = 3)
       IS DISTINCT FROM ARRAY['tesla', '2022']::text[]
     OR (SELECT subset_tokens FROM public.search_relaxed_subsets('tesla red 2022') WHERE attempt_no = 4)
       IS DISTINCT FROM ARRAY['tesla']::text[]
  THEN
    RAISE EXCEPTION 'TEST T3 FAIL: subset order is not [tesla,red,2022] / [tesla,red] / [tesla,2022] / [tesla]';
  END IF;
  RAISE NOTICE 'PASS T3: exact subset priority for 3 tokens';

  -- T4: max 4 attempts for 5 tokens + core always retained
  SELECT count(*) INTO v_count
  FROM public.search_relaxed_subsets('tesla red 2022 awd used');

  IF v_count <> 4 THEN
    RAISE EXCEPTION 'TEST T4 FAIL: expected 4 attempts, got %', v_count;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.search_relaxed_subsets('tesla red 2022 awd used') s
    WHERE NOT ('tesla' = ANY(s.subset_tokens))
  ) THEN
    RAISE EXCEPTION 'TEST T4 FAIL: a subset dropped the core token';
  END IF;
  RAISE NOTICE 'PASS T4: 5 tokens yield 4 attempts, core retained';

  -- T5: stopword-only query → no subsets
  SELECT count(*) INTO v_count
  FROM public.search_relaxed_subsets('بدي شو');

  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T5 FAIL: stopword-only query produced % subsets', v_count;
  END IF;
  RAISE NOTICE 'PASS T5: stopword-only query yields no subsets';

  -- T6: >5 meaningful tokens → 0 subsets
  SELECT count(*) INTO v_count
  FROM public.search_relaxed_subsets('tesla red 2022 awd used automatic');

  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T6 FAIL: >5 tokens produced % subsets', v_count;
  END IF;
  RAISE NOTICE 'PASS T6: more than 5 meaningful tokens yields no subsets';

  -- T6B: v3_relaxed delegates >5 meaningful tokens to v2_intent_typo.
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v3_relaxed(
      p_query => 'v3delegation test marker extra1 extra2 extra3',
      p_market => 'JO',
      p_limit => 100
    ) r WHERE r.id = v_delegate
  ) INTO v_found;

  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T6B FAIL: >5 token query did not delegate and return the fixture';
  END IF;
  RAISE NOTICE 'PASS T6B: >5 meaningful tokens delegate to v2_intent_typo';

  -- T7: market + hard filters preserved
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v3_relaxed(
      p_query => 'v3probe tesla red 2022',
      p_market => 'JO',
      p_limit => 100
    ) r WHERE r.id = v_sa
  ) INTO v_found;

  IF v_found THEN
    RAISE EXCEPTION 'TEST T7 FAIL: JO query returned the SA fixture';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v3_relaxed(
      p_query => 'v3probe tesla red 2022',
      p_market => 'JO',
      p_min_price => 100,
      p_max_price => 200,
      p_limit => 100
    ) r WHERE r.id IN (v_cheap, v_expensive)
  ) INTO v_found;

  IF v_found THEN
    RAISE EXCEPTION 'TEST T7 FAIL: price filter was bypassed';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v3_relaxed(
      p_query => 'v3probe tesla red 2022',
      p_market => 'JO',
      p_category_slug => 'motors',
      p_subcategory_slug => 'cars',
      p_city => 'Amman',
      p_neighborhood => 'Abdoun',
      p_attrs => '[{"key":"make","value":"v3joattr"}]'::jsonb,
      p_limit => 100
    ) r WHERE r.id = v_jo
  ) INTO v_found;

  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T7 FAIL: matching JO fixture was excluded by hard filters';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v3_relaxed(
      p_query => 'v3probe tesla red 2022',
      p_market => 'JO',
      p_category_slug => 'electronics',
      p_limit => 100
    ) r WHERE r.id = v_jo
  ) INTO v_found;

  IF v_found THEN
    RAISE EXCEPTION 'TEST T7 FAIL: category filter was bypassed';
  END IF;
  RAISE NOTICE 'PASS T7: market and hard filters are preserved';

  -- T8: no result mixing across subsets
  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v3_relaxed(
      p_query => 'v3mix tesla red 2022',
      p_market => 'JO',
      p_limit => 100
    ) r WHERE r.id = v_mix_a
  ) INTO v_found;

  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T8 FAIL: full-match fixture A was not returned';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v3_relaxed(
      p_query => 'v3mix tesla red 2022',
      p_market => 'JO',
      p_limit => 100
    ) r WHERE r.id = v_mix_b
  ) INTO v_found;

  IF v_found THEN
    RAISE EXCEPTION 'TEST T8 FAIL: partial fixture B mixed into the full-match result';
  END IF;

  UPDATE public.listings SET status = 'inactive' WHERE id = v_mix_a;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v3_relaxed(
      p_query => 'v3mix tesla red 2022',
      p_market => 'JO',
      p_limit => 100
    ) r WHERE r.id = v_mix_b
  ) INTO v_found;

  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T8 FAIL: after A inactive, relaxed subset did not return B';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v3_relaxed(
      p_query => 'v3mix tesla red 2022',
      p_market => 'JO',
      p_limit => 100
    ) r WHERE r.id = v_mix_a
  ) INTO v_found;

  IF v_found THEN
    RAISE EXCEPTION 'TEST T8 FAIL: inactive fixture A still returned';
  END IF;
  RAISE NOTICE 'PASS T8: first successful subset only; no cross-subset mixing';

  -- T9: preserve PR #322 assertions A-H, and assert v3_relaxed for B/F/G
  SELECT search_text INTO v_search_text
  FROM public.listings WHERE id = v_listing_id;

  IF v_search_text IS NULL OR position('فرشاتي' IN v_search_text) = 0 THEN
    RAISE EXCEPTION 'TEST A FAIL: INSERT trigger did not expose the attribute value in search_text; got=%',
      v_search_text;
  END IF;
  RAISE NOTICE 'PASS A: INSERT trigger populated search_text from attributes';

  IF EXISTS (
    SELECT 1 FROM public.listings
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
      p_query => 'فرشاتي-ثقيل-اختبار', p_market => 'JO', p_limit => 100
    ) r WHERE r.id = v_listing_id
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST B FAIL: v2_intent_typo did not return the attribute-only listing';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v3_relaxed(
      p_query => 'فرشاتي-ثقيل-اختبار', p_market => 'JO', p_limit => 100
    ) r WHERE r.id = v_listing_id
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST B FAIL: v3_relaxed did not return the attribute-only listing';
  END IF;
  RAISE NOTICE 'PASS B: v2_intent_typo and v3_relaxed find attribute-only values';

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings(
      p_query => 'فرشاتي-ثقيل-اختبار', p_market => 'JO', p_limit => 100
    ) r WHERE r.id = v_listing_id
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
      p_max_distance => 0.85
    ) r WHERE r.id = v_listing_id
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST D FAIL: search_listings_hybrid did not return the attribute-only listing';
  END IF;
  RAISE NOTICE 'PASS D: hybrid search finds attribute-only values';

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v2_intent_typo(
      p_query => 'بنزين-ثقيل-اختبار', p_market => 'JO', p_limit => 100
    ) r WHERE r.id = v_listing_id
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST F FAIL: v2_intent_typo did not find the fuel-key attribute';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v3_relaxed(
      p_query => 'بنزين-ثقيل-اختبار', p_market => 'JO', p_limit => 100
    ) r WHERE r.id = v_listing_id
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST F FAIL: v3_relaxed did not find the fuel-key attribute';
  END IF;
  RAISE NOTICE 'PASS F: a second attribute key is searchable via v2 and v3';

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v2_intent_typo(
      p_query => 'عقار-صفة-اختبار', p_market => 'JO', p_limit => 100
    ) r WHERE r.id = v_real_estate_id
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST G FAIL: attribute-only value in real-estate category was not found by v2';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v3_relaxed(
      p_query => 'عقار-صفة-اختبار', p_market => 'JO', p_limit => 100
    ) r WHERE r.id = v_real_estate_id
  ) INTO v_found;
  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST G FAIL: attribute-only value in real-estate category was not found by v3';
  END IF;
  RAISE NOTICE 'PASS G: arbitrary attribute key is searchable across categories via v2 and v3';

  UPDATE public.listings
  SET attributes = '[{"key":"color","label":"اللون","value":"محدث-ثقيل-اختبار"}]'::jsonb
  WHERE id = v_listing_id;

  SELECT search_text INTO v_search_text
  FROM public.listings WHERE id = v_listing_id;

  IF v_search_text IS NULL THEN
    RAISE EXCEPTION 'TEST H FAIL: search_text NULL after UPDATE';
  END IF;
  IF position('فرشاتي' IN v_search_text) > 0 THEN
    RAISE EXCEPTION 'TEST H FAIL: old attribute value still present in search_text';
  END IF;
  IF position('محدث' IN v_search_text) = 0 THEN
    RAISE EXCEPTION 'TEST H FAIL: new attribute value not present in search_text';
  END IF;
  RAISE NOTICE 'PASS H: UPDATE trigger regenerated search_text correctly';

  -- T10: pagination does not fall through to a looser subset.
  SELECT count(*) INTO v_count
  FROM public.search_listings_v3_relaxed(
    p_query => 'v3pagecore v3pagecolor v3pageyear',
    p_market => 'JO',
    p_limit => 10,
    p_offset => 1
  ) r;

  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TEST T10 FAIL: offset beyond the winning subset returned % rows', v_count;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v3_relaxed(
      p_query => 'v3pagecore v3pagecolor v3pageyear',
      p_market => 'JO',
      p_limit => 10,
      p_offset => 1
    ) r WHERE r.id = v_page_b
  ) INTO v_found;

  IF v_found THEN
    RAISE EXCEPTION 'TEST T10 FAIL: pagination fell through to the looser subset (fixture B)';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.search_listings_v3_relaxed(
      p_query => 'v3pagecore v3pagecolor v3pageyear',
      p_market => 'JO',
      p_limit => 10,
      p_offset => 0
    ) r WHERE r.id = v_page_a
  ) INTO v_found;

  IF NOT v_found THEN
    RAISE EXCEPTION 'TEST T10 FAIL: winning subset did not return fixture A at offset 0';
  END IF;
  RAISE NOTICE 'PASS T10: pagination stays in the winning subset';

  RAISE NOTICE 'PASS T9: PR #322 assertions A-H preserved, with v3_relaxed on B/F/G';
  RAISE NOTICE 'ALL V3 RELAXED REGRESSION TESTS PASSED';
END $$;

ROLLBACK;

SELECT 'ALL V3 RELAXED REGRESSION TESTS PASSED; FIXTURES ROLLED BACK' AS result;
