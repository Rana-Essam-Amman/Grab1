-- 20261204_location_slugs.sql
-- Nullable location slugs. No backfill. Historical rows stay NULL.
-- Adds a backward-compatible search wrapper that returns the slug columns
-- and filters by slug when both sides have one.

BEGIN;

SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';

ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS city_slug text,
  ADD COLUMN IF NOT EXISTS district_slug text,
  ADD COLUMN IF NOT EXISTS neighborhood_slug text;

CREATE INDEX IF NOT EXISTS listings_location_slugs_idx
  ON public.listings (country_code, city_slug, district_slug, neighborhood_slug);

COMMENT ON COLUMN public.listings.city_slug IS
  'Canonical governorate/city slug. NULL on historical rows; never backfilled.';
COMMENT ON COLUMN public.listings.district_slug IS
  'Canonical district slug. NULL on historical rows; never backfilled.';
COMMENT ON COLUMN public.listings.neighborhood_slug IS
  'Canonical village/neighborhood slug. NULL on historical rows; never backfilled.';

CREATE OR REPLACE FUNCTION public.search_listings_v4_tiered_v3(
  p_query text,
  p_market text DEFAULT NULL,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0,
  p_category_slug text DEFAULT NULL,
  p_subcategory_slug text DEFAULT NULL,
  p_min_price numeric DEFAULT NULL,
  p_max_price numeric DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_neighborhood text DEFAULT NULL,
  p_attrs jsonb DEFAULT NULL,
  p_tier2_limit integer DEFAULT 5,
  p_city_slug text DEFAULT NULL,
  p_district_slug text DEFAULT NULL,
  p_neighborhood_slug text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  title text,
  description text,
  price text,
  currency text,
  country_code text,
  city text,
  neighborhood text,
  category_slug text,
  subcategory_slug text,
  images text[],
  attributes jsonb,
  status text,
  views integer,
  seller_name text,
  seller_phone text,
  created_at timestamptz,
  updated_at timestamptz,
  is_demo boolean,
  match_kind text,
  matched_tokens text[],
  total_matched_tokens integer,
  tier integer,
  tier_reason text,
  rank_in_tier integer,
  city_slug text,
  district_slug text,
  neighborhood_slug text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $func$
  SELECT
    c.id, c.user_id, c.title, c.description, c.price, c.currency,
    c.country_code, c.city, c.neighborhood, c.category_slug,
    c.subcategory_slug, c.images, c.attributes, c.status, c.views,
    c.seller_name, c.seller_phone, c.created_at, c.updated_at,
    c.is_demo, c.match_kind, c.matched_tokens, c.total_matched_tokens,
    c.tier, c.tier_reason, c.rank_in_tier,
    l.city_slug, l.district_slug, l.neighborhood_slug
  FROM public.search_listings_v4_tiered_v2(
    p_query, p_market, p_limit, p_offset,
    p_category_slug, p_subcategory_slug,
    p_min_price, p_max_price,
    p_city, p_neighborhood, p_attrs, p_tier2_limit
  ) AS c
  JOIN public.listings l ON l.id = c.id
  WHERE (
    p_neighborhood_slug IS NULL
    OR l.neighborhood_slug IS NULL
    OR l.neighborhood_slug = p_neighborhood_slug
  )
  AND (
    p_district_slug IS NULL
    OR l.district_slug IS NULL
    OR l.district_slug = p_district_slug
  )
  AND (
    p_city_slug IS NULL
    OR l.city_slug IS NULL
    OR l.city_slug = p_city_slug
  );
$func$;

COMMENT ON FUNCTION public.search_listings_v4_tiered_v3(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb, integer, text, text, text
) IS
  'v2 plus location slugs. Slug filter applies only when the listing has a slug; NULL listings keep the text fallback from v2.';

GRANT EXECUTE ON FUNCTION public.search_listings_v4_tiered_v3(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb, integer, text, text, text
) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';

COMMIT;
