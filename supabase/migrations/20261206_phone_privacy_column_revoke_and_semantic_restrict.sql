-- ============================================================================
-- P1 CRITICAL: Close public seller-phone exposure paths (corrected)
--
-- Table-level SELECT implicitly grants access to every column. A column-level
-- REVOKE does not override an existing table-level GRANT, and a table-level
-- REVOKE does not remove existing column-level SELECT grants. Therefore we:
--   1. Revoke table-level SELECT from anon, authenticated, and PUBLIC.
--   2. Explicitly revoke column-level SELECT on every current listings column
--      from anon, authenticated, and PUBLIC (covers seller_phone, bump fields,
--      premium fields, search helper fields, and any other existing column).
--   3. Re-grant column-level SELECT only on the approved public columns.
--   4. Never grant seller_phone, bump/auto-bump fields, or search helpers.
--
-- RLS policies remain unchanged and continue to filter rows.
-- INSERT/UPDATE privileges are not modified.
-- search_listings_semantic is restricted to internal use only.
-- ============================================================================

BEGIN;

-- 1. Remove table-level SELECT so that column privileges become authoritative
REVOKE SELECT ON TABLE public.listings FROM anon;
REVOKE SELECT ON TABLE public.listings FROM authenticated;
REVOKE SELECT ON TABLE public.listings FROM PUBLIC;

-- 2. Explicitly revoke any existing column-level SELECT grants.
--    Table-level REVOKE alone does not clear column ACLs.
--    The loop covers every column present at migration time, including:
--    seller_phone, bumps_today, bumps_reset_date, is_premium, premium_expires_at,
--    auto_bump_active, auto_bump_expires_at, search_text, fts, search_chars,
--    search_version, and all other existing columns.
DO $$
DECLARE
  col text;
BEGIN
  FOR col IN
    SELECT a.attname
    FROM pg_attribute a
    WHERE a.attrelid = 'public.listings'::regclass
      AND a.attnum > 0
      AND NOT a.attisdropped
    ORDER BY a.attnum
  LOOP
    EXECUTE format(
      'REVOKE SELECT (%I) ON TABLE public.listings FROM anon, authenticated, PUBLIC',
      col
    );
  END LOOP;
END $$;

-- 3. Grant column-level SELECT only on safe public listing columns.
--    These are the columns required by public listing reads, search RPCs,
--    seller profile listing results, and existing RLS-visible fields.
--    is_premium and premium_expires_at are included so frontend listing
--    presentation continues to work. seller_phone, bump/auto-bump fields,
--    and search helper fields are deliberately omitted.
GRANT SELECT (
  id,
  user_id,
  title,
  description,
  price,
  currency,
  country_code,
  city,
  neighborhood,
  category_slug,
  subcategory_slug,
  images,
  attributes,
  status,
  views,
  seller_name,
  created_at,
  updated_at,
  is_demo,
  last_bumped_at,
  image_width,
  image_height,
  city_slug,
  district_slug,
  neighborhood_slug,
  is_premium,
  premium_expires_at
) ON TABLE public.listings TO anon, authenticated;

-- 4. Restrict search_listings_semantic (internal helper only)
REVOKE EXECUTE ON FUNCTION public.search_listings_semantic(
  extensions.vector, text, integer, integer, double precision
) FROM PUBLIC, anon, authenticated;

-- Owner retains the ability to call it from search_listings_hybrid and similar.

-- 5. get_listing_phone remains the only authenticated, rate-limited path to the phone.
--    No change to its definition or grants.
--    INSERT/UPDATE privileges and RLS policies are intentionally untouched.

COMMIT;
