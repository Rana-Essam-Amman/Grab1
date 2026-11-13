-- ============================================================================
-- 20261210 — Align search_listings_v2_intent_typo to verified production contract
--
-- Production uses an explicit 33-column RETURNS TABLE(...) contract.
-- The prior SETOF public.listings + (mask_listing_phone(...)).* expansion is
-- replaced with an explicit projection that forces NULL::text AS seller_phone
-- while preserving all filters, ranking, fallbacks, and grants.
--
-- DROP is required because PostgreSQL forbids changing return type via
-- CREATE OR REPLACE (42P13).
-- ============================================================================

BEGIN;

DROP FUNCTION IF EXISTS public.search_listings_v2_intent_typo(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
);

CREATE FUNCTION public.search_listings_v2_intent_typo(
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
  p_attrs jsonb DEFAULT NULL
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
SET search_path = public
AS $function$
DECLARE
  v_norm text;
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
BEGIN
  v_norm := btrim(public.normalize_search_text(coalesce(p_query, '')));
  IF v_norm = '' OR length(v_norm) < 3 THEN RETURN; END IF;

  IF NOT public.query_has_meaningful_tokens(coalesce(p_query, '')) THEN
    RETURN;
  END IF;

  -- Delegate to v2_intent when it returns rows (preserves original short-circuit).
  -- Explicit 33-column projection with NULL seller_phone.
  RETURN QUERY
  SELECT
    r.id, r.user_id, r.title, r.description, r.price, r.currency,
    r.country_code, r.city, r.neighborhood, r.category_slug, r.subcategory_slug,
    r.images, r.attributes, r.status, r.views, r.seller_name,
    NULL::text AS seller_phone,
    r.created_at, r.updated_at, r.bumps_today, r.bumps_reset_date,
    r.is_premium, r.premium_expires_at, r.auto_bump_active, r.auto_bump_expires_at,
    r.image_width, r.image_height, r.search_text, r.fts, r.search_chars,
    r.search_version, r.last_bumped_at, r.is_demo
  FROM public.search_listings_v2_intent(
    p_query, p_market, v_limit, v_offset,
    p_category_slug, p_subcategory_slug,
    p_min_price, p_max_price, p_city, p_neighborhood, p_attrs
  ) AS r;

  IF FOUND THEN
    RETURN;
  END IF;

  -- Direct fallback path (preserves original ranking and filters).
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
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND public.listing_passes_filters(
      l, p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price, p_city, p_neighborhood, p_attrs
    )
    AND public.search_text_has_all_tokens_strict(l.search_text, v_norm, 0.35)
  ORDER BY (
    SELECT max(
      strict_word_similarity(
        public.normalize_search_text(tok),
        public.normalize_search_text(l.search_text)
      )
    )
    FROM regexp_split_to_table(v_norm, '[[:space:]]+') AS tok
    WHERE tok <> ''
      AND length(public.normalize_search_text(tok)) >= 3
      AND public.normalize_search_text(tok) NOT IN (
        SELECT public.normalize_search_text(word)
        FROM public.search_stopwords
      )
  ) DESC NULLS LAST,
    l.created_at DESC,
    l.id ASC
  LIMIT v_limit OFFSET v_offset;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.search_listings_v2_intent_typo(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) TO anon, authenticated;

COMMIT;
