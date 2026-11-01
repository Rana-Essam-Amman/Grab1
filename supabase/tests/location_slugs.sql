-- location slug contract: columns exist, no backfill, v3 returns slug columns.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'listings' AND column_name = 'city_slug'
  ) THEN
    RAISE EXCEPTION 'FAIL: listings.city_slug missing';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'listings' AND column_name = 'district_slug'
  ) THEN
    RAISE EXCEPTION 'FAIL: listings.district_slug missing';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'listings' AND column_name = 'neighborhood_slug'
  ) THEN
    RAISE EXCEPTION 'FAIL: listings.neighborhood_slug missing';
  END IF;
  IF to_regprocedure('public.search_listings_v4_tiered_v3(text,text,integer,integer,text,text,numeric,numeric,text,text,jsonb,integer,text,text,text)') IS NULL THEN
    RAISE EXCEPTION 'FAIL: search_listings_v4_tiered_v3 missing';
  END IF;
  RAISE NOTICE 'PASS: location slug columns and v3 wrapper exist';
END $$;
