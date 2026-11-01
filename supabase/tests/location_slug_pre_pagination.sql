-- location_slug_pre_pagination.sql
-- Executable slug, pagination, and phone regressions. LOCAL ONLY. Rolled back.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.listings
    WHERE id BETWEEN '99110000-0000-4000-8000-000000000001'::uuid
                 AND '99110000-0000-4000-8000-000000000040'::uuid
  ) THEN
    RAISE EXCEPTION 'PREREQ FAIL: slug fixture UUID already exists';
  END IF;
END $$;

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES (
  '99100000-0000-4000-8000-000000000001'::uuid,
  'authenticated', 'authenticated',
  'slug-99100000@example.invalid',
  '', now(), '{}'::jsonb, '{}'::jsonb
);

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, neighborhood, category_slug, subcategory_slug, status,
  attributes, seller_phone, is_demo, created_at,
  city_slug, district_slug, neighborhood_slug
)
VALUES
  ('99110000-0000-4000-8000-000000000001'::uuid,
   '99100000-0000-4000-8000-000000000001'::uuid,
   'slugtest chair marka', 'same name', '10', 'JOD', 'JO',
   'OtherLabel', 'Same', 'furniture', 'chairs', 'active',
   '[]'::jsonb, '0790000001', false, '2026-10-01T10:00:00Z',
   'amman', 'marka', 'same-a'),
  ('99110000-0000-4000-8000-000000000002'::uuid,
   '99100000-0000-4000-8000-000000000001'::uuid,
   'slugtest chair naoor', 'same name', '10', 'JOD', 'JO',
   'OtherLabel', 'Same', 'furniture', 'chairs', 'active',
   '[]'::jsonb, '0790000002', false, '2026-10-02T10:00:00Z',
   'amman', 'naoor', 'same-b'),
  ('99110000-0000-4000-8000-000000000003'::uuid,
   '99100000-0000-4000-8000-000000000001'::uuid,
   'slugtest chair zarqa', 'same district label', '10', 'JOD', 'JO',
   'Zarqa', 'Same', 'furniture', 'chairs', 'active',
   '[]'::jsonb, '0790000003', false, '2026-10-03T10:00:00Z',
   'zarqa', 'marka', 'same-a'),
  ('99110000-0000-4000-8000-000000000004'::uuid,
   '99100000-0000-4000-8000-000000000001'::uuid,
   'slugtest chair legacy', 'null slug', '10', 'JOD', 'JO',
   'Amman', 'Abdoun', 'furniture', 'chairs', 'active',
   '[]'::jsonb, '0790000004', false, '2026-10-04T10:00:00Z',
   NULL, NULL, NULL),
  ('99110000-0000-4000-8000-000000000005'::uuid,
   '99100000-0000-4000-8000-000000000001'::uuid,
   'slugtest chair demo', 'demo', '10', 'JOD', 'JO',
   'Amman', 'Same', 'furniture', 'chairs', 'active',
   '[]'::jsonb, '0790000005', true, '2026-10-05T10:00:00Z',
   'amman', 'marka', 'same-a'),
  ('99110000-0000-4000-8000-000000000006'::uuid,
   '99100000-0000-4000-8000-000000000001'::uuid,
   'slugtest chair sold', 'sold', '10', 'JOD', 'JO',
   'Amman', 'Same', 'furniture', 'chairs', 'sold',
   '[]'::jsonb, '0790000006', false, '2026-10-06T10:00:00Z',
   'amman', 'marka', 'same-a'),
  ('99110000-0000-4000-8000-000000000007'::uuid,
   '99100000-0000-4000-8000-000000000001'::uuid,
   'slugtest chair partial', 'null child', '10', 'JOD', 'JO',
   'Amman', 'Abdoun', 'furniture', 'chairs', 'active',
   '[]'::jsonb, '0790000007', false, '2026-10-07T10:00:00Z',
   'amman', 'marka', NULL),
  ('99110000-0000-4000-8000-000000000009'::uuid,
   '99100000-0000-4000-8000-000000000001'::uuid,
   'slugtest chair other city', 'shared label', '11', 'JOD', 'JO',
   'Zarqa', 'Abdoun', 'furniture', 'chairs', 'active',
   '[]'::jsonb, '0790000009', false, '2026-10-09T10:00:00Z',
   NULL, NULL, NULL),
  ('99110000-0000-4000-8000-000000000008'::uuid,
   '99100000-0000-4000-8000-000000000001'::uuid,
   'other furniture piece', 'no search token', '40', 'JOD', 'JO',
   'Different', 'Elsewhere', 'furniture', 'chairs', 'active',
   '[{"key":"color","value":"red"}]'::jsonb, '0790000008', false, '2026-10-08T10:00:00Z',
   'amman', 'marka', 'same-a');

INSERT INTO public.listings (
  id, user_id, title, description, price, currency, country_code,
  city, neighborhood, category_slug, subcategory_slug, status,
  attributes, seller_phone, is_demo, created_at,
  city_slug, district_slug, neighborhood_slug
)
SELECT
  ('99110000-0000-4000-8000-0000000000' || lpad(n::text, 2, '0'))::uuid,
  '99100000-0000-4000-8000-000000000001'::uuid,
  'slugtest chair filler ' || n, 'filler', '10', 'JOD', 'JO',
  'Amman', 'Other', 'furniture', 'chairs', 'active',
  '[]'::jsonb, '0790000099', false,
  ('2026-11-01T10:00:00Z'::timestamptz - (n || ' minutes')::interval),
  'amman', 'other-dist', 'other'
FROM generate_series(10, 30) AS n;

DO $$
DECLARE
  v_count integer;
  v_phone text;
  v_ids text;
BEGIN
  -- Data check: slug columns were stored.
  SELECT count(*) INTO v_count
  FROM public.listings
  WHERE id = '99110000-0000-4000-8000-000000000001'::uuid
    AND city_slug = 'amman' AND district_slug = 'marka' AND neighborhood_slug = 'same-a';
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'FAIL 0: fixture slug columns were not stored';
  END IF;

  SELECT count(*) INTO v_count
  FROM public.listings l
  WHERE l.title LIKE 'slugtest%'
    AND public.listing_matches_slugs(l, 'amman', 'marka', 'same-a', NULL, NULL);
  IF v_count <> 3 THEN
    RAISE EXCEPTION 'FAIL 0b: helper matched % slugtest rows', v_count;
  END IF;

  -- 1. Same neighborhood label, two districts. No text neighborhood, no tier-2.
  SELECT count(*), string_agg(id::text, ',') INTO v_count, v_ids
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', 'JO', 20, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0,
    'amman', 'marka', 'same-a'
  );
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'FAIL 1: expected 1 marka/same-a row, got % ids %', v_count, v_ids;
  END IF;

  -- 2. Same district label, different governorate.
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', 'JO', 20, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5,
    'amman', 'marka', NULL
  ) r
  WHERE r.city_slug = 'zarqa';
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'FAIL 2: zarqa listing matched amman parent';
  END IF;

  -- 3/4. Correct slug with a different display label still matches.
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', 'JO', 20, 0, NULL, NULL, NULL, NULL, 'NotTheLabel', 'NotTheLabel', NULL, 5,
    'amman', 'marka', 'same-a'
  ) r
  WHERE r.id = '99110000-0000-4000-8000-000000000001'::uuid;
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'FAIL 3/4: slug match rejected because label differed';
  END IF;

  -- 5. NULL listing slug uses text fallback.
  SELECT count(*) INTO v_count
  FROM public.listings l
  WHERE l.id = '99110000-0000-4000-8000-000000000004'::uuid
    AND public.listing_matches_slugs(l, NULL, NULL, 'abdoun', NULL, 'Abdoun');
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'FAIL 5a: helper rejected NULL-slug Abdoun fallback';
  END IF;

  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_exact_slugs(
    'slugtest chair', 'JO', 20, 0, NULL, NULL, NULL, NULL, NULL, 'Abdoun', NULL,
    NULL, NULL, 'abdoun'
  ) r
  WHERE r.id = '99110000-0000-4000-8000-000000000004'::uuid;
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'FAIL 5b: exact_slugs dropped the NULL-slug fallback row';
  END IF;

  SELECT count(*), string_agg(id::text, ',') INTO v_count, v_ids
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', 'JO', 20, 0, NULL, NULL, NULL, NULL, NULL, 'Abdoun', NULL, 5,
    NULL, NULL, 'abdoun'
  ) r
  WHERE r.id = '99110000-0000-4000-8000-000000000004'::uuid;
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'FAIL 5: NULL slug did not fall back to text (matched %)', v_count;
  END IF;

  -- 6. Conflicting populated slug does not match on label.
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', 'JO', 20, 0, NULL, NULL, NULL, NULL, NULL, 'Same', NULL, 5,
    'amman', 'marka', 'same-a'
  ) r
  WHERE r.id = '99110000-0000-4000-8000-000000000002'::uuid;
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'FAIL 6: conflicting slug matched on shared label';
  END IF;

  -- 7. Partial hierarchy: parent slug plus NULL child uses text fallback.
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', 'JO', 20, 0, NULL, NULL, NULL, NULL, NULL, 'Abdoun', NULL, 5,
    'amman', 'marka', 'missing-child'
  ) r
  WHERE r.id = '99110000-0000-4000-8000-000000000007'::uuid;
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'FAIL 7: partial hierarchy fallback failed';
  END IF;

  -- 8. Pagination: oldest slug match is beyond the first unfiltered page.
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', 'JO', 5, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5,
    'amman', 'marka', 'same-a'
  ) r
  WHERE r.id = '99110000-0000-4000-8000-000000000001'::uuid;
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'FAIL 8: pre-pagination slug filter missed the old match';
  END IF;

  -- 10. No returned row exposes seller_phone.
  SELECT seller_phone INTO v_phone
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', 'JO', 20, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5,
    'amman', 'marka', NULL
  )
  WHERE seller_phone IS NOT NULL
  LIMIT 1;
  IF v_phone IS NOT NULL THEN
    RAISE EXCEPTION 'FAIL 10: seller_phone exposed: %', v_phone;
  END IF;

  -- 11. Sold and demo stay out.
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', 'JO', 20, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5,
    'amman', 'marka', 'same-a'
  ) r
  WHERE r.id IN (
    '99110000-0000-4000-8000-000000000005'::uuid,
    '99110000-0000-4000-8000-000000000006'::uuid
  );
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'FAIL 11: sold or demo listing returned';
  END IF;

  -- 12. District slug does not require the district label as neighborhood text.
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', 'JO', 20, 0, NULL, NULL, NULL, NULL, NULL, 'Marka', NULL, 5,
    'amman', 'marka', NULL
  ) r
  WHERE r.district_slug = 'marka' AND r.city_slug = 'amman';
  IF v_count < 1 THEN
    RAISE EXCEPTION 'FAIL 12: district slug rejected by neighborhood text';
  END IF;

  -- Independent Tier 2: category match, no search tokens, correct slug, phone masked.
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', 'JO', 20, 0, 'furniture', NULL, NULL, NULL, NULL, NULL,
    '[{"key":"color","value":"red"}]'::jsonb, 5, 'amman', 'marka', 'same-a'
  ) r
  WHERE r.id = '99110000-0000-4000-8000-000000000008'::uuid AND r.tier = 2 AND r.seller_phone IS NULL;
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'FAIL T2: independent tier-2 slug match missing or phone exposed';
  END IF;

  -- NULL market remains unrestricted: JO rows are still returned.
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', NULL, 20, 0, 'furniture', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'amman', 'marka', NULL
  ) r WHERE r.country_code = 'JO';
  IF v_count < 1 THEN
    RAISE EXCEPTION 'FAIL T2-market: NULL market excluded JO rows';
  END IF;

  -- Independent Tier 2 with NULL market and positive tier-2 limit.
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', NULL, 20, 0, 'furniture', NULL, NULL, NULL, NULL, NULL,
    '[{"key":"color","value":"red"}]'::jsonb, 5, NULL, NULL, NULL
  ) r
  WHERE r.id = '99110000-0000-4000-8000-000000000008'::uuid AND r.tier = 2 AND r.seller_phone IS NULL;
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'FAIL T2-null-market: independent tier-2 NULL market did not return fixture';
  END IF;

  -- Same neighborhood label in two cities. NULL-slug fallback must not cross-match.
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', 'JO', 20, 0, 'furniture', NULL, NULL, NULL, 'Amman', 'Abdoun', NULL, 0, 'amman', NULL, 'abdoun'
  ) r
  WHERE r.id = '99110000-0000-4000-8000-000000000002'::uuid;
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'FAIL cross-city: wrong-city slug row matched shared label';
  END IF;

  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', 'JO', 20, 0, 'furniture', NULL, NULL, NULL, 'Amman', 'Abdoun', NULL, 0, 'amman', NULL, 'abdoun'
  ) r
  WHERE r.id = '99110000-0000-4000-8000-000000000009'::uuid;
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'FAIL cross-city: NULL-slug row from Zarqa matched Amman request';
  END IF;

  -- 13. District filter parent-proof regression matrix:
  -- 13.1 Canonical matching district remains accepted.
  SELECT count(*) INTO v_count
  FROM public.listings l
  WHERE l.id = '99110000-0000-4000-8000-000000000001'::uuid
    AND public.listing_matches_slugs(l, 'amman', 'marka', NULL, 'Amman', 'Abdoun');
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'FAIL 13.1: canonical matching district rejected';
  END IF;

  -- 13.2 Conflicting canonical district remains rejected.
  SELECT count(*) INTO v_count
  FROM public.listings l
  WHERE l.id = '99110000-0000-4000-8000-000000000002'::uuid
    AND public.listing_matches_slugs(l, 'amman', 'marka', NULL, 'Amman', 'Abdoun');
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'FAIL 13.2: conflicting canonical district accepted';
  END IF;

  -- 13.3 NULL district slug + matching parent city proof behaves as specified.
  SELECT count(*) INTO v_count
  FROM public.listings l
  WHERE l.id = '99110000-0000-4000-8000-000000000004'::uuid
    AND public.listing_matches_slugs(l, 'amman', 'marka', NULL, 'Amman', 'Abdoun');
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'FAIL 13.3: NULL district slug with matching parent city proof rejected';
  END IF;

  -- 13.4 NULL district slug + conflicting city slug is rejected.
  SELECT count(*) INTO v_count
  FROM public.listings l
  WHERE l.id = '99110000-0000-4000-8000-000000000003'::uuid
    AND public.listing_matches_slugs(l, 'amman', 'marka', NULL, 'Amman', 'Same');
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'FAIL 13.4: NULL district slug with conflicting city slug accepted';
  END IF;

  -- 13.5 NULL district slug + conflicting city text is rejected.
  SELECT count(*) INTO v_count
  FROM public.listings l
  WHERE l.id = '99110000-0000-4000-8000-000000000009'::uuid
    AND public.listing_matches_slugs(l, 'amman', 'marka', NULL, 'Amman', 'Abdoun');
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'FAIL 13.5: NULL district slug with conflicting city text accepted';
  END IF;

  -- 13.6 NULL city slug + NULL district slug + identical neighborhood text under another city is rejected.
  SELECT count(*) INTO v_count
  FROM public.search_listings_v4_tiered_v4(
    'slugtest chair', 'JO', 20, 0, 'furniture', NULL, NULL, NULL, 'Amman', 'Abdoun', NULL, 0, 'amman', 'marka', NULL
  ) r
  WHERE r.id = '99110000-0000-4000-8000-000000000009'::uuid;
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'FAIL 13.6: Zarqa NULL-slug row cross-matched Amman district filter';
  END IF;

  -- 13.7 Ambiguous legacy parent data is rejected.
  SELECT count(*) INTO v_count
  FROM public.listings l
  WHERE l.id = '99110000-0000-4000-8000-000000000004'::uuid
    AND public.listing_matches_slugs(l, 'amman', 'marka', NULL, NULL, 'Abdoun');
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'FAIL 13.7: ambiguous legacy parent data accepted';
  END IF;

  -- 13.8 No-district behavior remains unchanged.
  SELECT count(*) INTO v_count
  FROM public.listings l
  WHERE l.id = '99110000-0000-4000-8000-000000000001'::uuid
    AND public.listing_matches_slugs(l, 'amman', NULL, NULL, 'Amman', NULL);
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'FAIL 13.8: city-only canonical match failed';
  END IF;
END $$;

ROLLBACK;
