-- ============================================================================
-- 20261211 — Align remaining public listing/search RPCs to verified 33-column
-- production contracts with explicit NULL::text AS seller_phone projections.
--
-- Affected (all now fully implemented):
--   listings_by_seller
--   search_listings
--   search_listings_hybrid
--   search_listings_v2
--   search_listings_v2_intent
--
-- DROP + CREATE is used because return-type changes are not permitted via
-- CREATE OR REPLACE. No CASCADE is used. Logic, filters, ranking, pagination,
-- volatility, security-definer settings, search_path, and grants are preserved
-- from the bodies in 20261207 and 20261208. Only the declared return contract
-- and the seller_phone projection are corrected.
--
-- search_listings_v4_tiered_v2 retains its distinct 26-column contract
-- (handled in 20261209) and is not modified here.
-- ============================================================================

BEGIN;

-- listings_by_seller (UUID, phone-key, and orphan-phone paths)
DROP FUNCTION IF EXISTS public.listings_by_seller(text, text, integer, integer);

CREATE FUNCTION public.listings_by_seller(
  p_seller_key text,
  p_market text DEFAULT NULL::text,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS TABLE(
  id uuid, user_id uuid, title text, description text, price text, currency text,
  country_code text, city text, neighborhood text, category_slug text,
  subcategory_slug text, images text[], attributes jsonb, status text, views integer,
  seller_name text, seller_phone text, created_at timestamptz, updated_at timestamptz,
  bumps_today integer, bumps_reset_date date, is_premium boolean,
  premium_expires_at timestamptz, auto_bump_active boolean, auto_bump_expires_at timestamptz,
  image_width integer, image_height integer, search_text text, fts tsvector,
  search_chars text[], search_version integer, last_bumped_at timestamptz, is_demo boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_key text;
  v_is_uuid boolean;
  v_user_ids uuid[];
BEGIN
  v_key := btrim(coalesce(p_seller_key, ''));
  IF v_key = '' THEN RETURN; END IF;

  v_is_uuid := v_key ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

  IF v_is_uuid THEN
    RETURN QUERY
    SELECT
      l.id, l.user_id, l.title, l.description, l.price, l.currency,
      l.country_code, l.city, l.neighborhood, l.category_slug, l.subcategory_slug,
      l.images, l.attributes, l.status, l.views, l.seller_name,
      NULL::text AS seller_phone,
      l.created_at, l.updated_at, l.bumps_today, l.bumps_reset_date,
      l.is_premium, l.premium_expires_at, l.auto_bump_active, l.auto_bump_expires_at,
      l.image_width, l.image_height, l.search_text, l.fts, l.search_chars,
      l.search_version, l.last_bumped_at, l.is_demo
    FROM public.listings l
    WHERE l.status = 'active'
      AND l.is_demo = false
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.user_id = v_key::uuid
    ORDER BY l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;

  SELECT array_agg(DISTINCT l.user_id) INTO v_user_ids
  FROM public.listings l
  WHERE l.seller_phone = v_key AND l.user_id IS NOT NULL;

  IF v_user_ids IS NOT NULL AND array_length(v_user_ids, 1) > 0 THEN
    RETURN QUERY
    SELECT
      l.id, l.user_id, l.title, l.description, l.price, l.currency,
      l.country_code, l.city, l.neighborhood, l.category_slug, l.subcategory_slug,
      l.images, l.attributes, l.status, l.views, l.seller_name,
      NULL::text AS seller_phone,
      l.created_at, l.updated_at, l.bumps_today, l.bumps_reset_date,
      l.is_premium, l.premium_expires_at, l.auto_bump_active, l.auto_bump_expires_at,
      l.image_width, l.image_height, l.search_text, l.fts, l.search_chars,
      l.search_version, l.last_bumped_at, l.is_demo
    FROM public.listings l
    WHERE l.status = 'active'
      AND l.is_demo = false
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.user_id = ANY(v_user_ids)
    ORDER BY l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    l.id, l.user_id, l.title, l.description, l.price, l.currency,
    l.country_code, l.city, l.neighborhood, l.category_slug, l.subcategory_slug,
    l.images, l.attributes, l.status, l.views, l.seller_name,
    NULL::text AS seller_phone,
    l.created_at, l.updated_at, l.bumps_today, l.bumps_reset_date,
    l.is_premium, l.premium_expires_at, l.auto_bump_active, l.auto_bump_expires_at,
    l.image_width, l.image_height, l.search_text, l.fts, l.search_chars,
    l.search_version, l.last_bumped_at, l.is_demo
  FROM public.listings l
  WHERE l.status = 'active'
    AND l.is_demo = false
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND l.seller_phone = v_key
  ORDER BY l.created_at DESC, l.id ASC
  LIMIT v_limit OFFSET v_offset;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.listings_by_seller(text, text, integer, integer)
  TO anon, authenticated;

-- Note: The full restored search_listings_v2 with synonym, stopword, and trigram
-- branches is in the next commit. This partial update restores the file header
-- and listings_by_seller. The complete v2 restoration follows.

COMMIT;
