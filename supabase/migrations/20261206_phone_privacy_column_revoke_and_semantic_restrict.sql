-- ============================================================================
-- P1 CRITICAL: Close public seller-phone exposure paths (corrected)
--
-- Table-level SELECT implicitly grants access to every column. A column-level
-- REVOKE does not override an existing table-level GRANT. Therefore we:
--   1. Revoke table-level SELECT from anon and authenticated.
--   2. Explicitly GRANT column-level SELECT only on the approved public columns.
--   3. Never grant seller_phone to PUBLIC / anon / authenticated.
--
-- RLS policies remain unchanged and continue to filter rows.
-- search_listings_semantic is restricted to internal use only.
-- ============================================================================

BEGIN;

-- 1. Remove table-level SELECT so that column privileges become authoritative
REVOKE SELECT ON TABLE public.listings FROM anon;
REVOKE SELECT ON TABLE public.listings FROM authenticated;
REVOKE SELECT ON TABLE public.listings FROM PUBLIC;

-- 2. Grant column-level SELECT only on safe public listing columns.
--    These are the columns required by public listing reads, search RPCs,
--    seller profile listing results, and existing RLS-visible fields.
--    seller_phone is deliberately omitted.
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
  neighborhood_slug
) ON TABLE public.listings TO anon, authenticated;

-- Internal / monetization / search-helper columns (bumps_*, is_premium*, search_text, fts, etc.)
-- remain without public SELECT. They are accessed only through SECURITY DEFINER RPCs
-- or service-role paths that do not expose them to the client.

-- 3. Restrict search_listings_semantic (internal helper only)
REVOKE EXECUTE ON FUNCTION public.search_listings_semantic(
  extensions.vector, text, integer, integer, double precision
) FROM PUBLIC, anon, authenticated;

-- Owner retains the ability to call it from search_listings_hybrid and similar.

-- 4. get_listing_phone remains the only authenticated, rate-limited path to the phone.
--    No change to its definition or grants.

COMMIT;
