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

-- search_listings (all fallback paths)
DROP FUNCTION IF EXISTS public.search_listings(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
);

CREATE FUNCTION public.search_listings(
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
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_norm text;
  v_query text;
  v_syn_query text;
  v_tsq tsquery;
  v_syn_tsq tsquery;
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_chars text[];
BEGIN
  v_norm := btrim(public.normalize_search_text(coalesce(p_query, '')));
  IF v_norm = '' OR length(v_norm) < 3 THEN RETURN; END IF;

  v_query := public.expand_search_keywords(v_norm);
  v_chars := public.search_character_array(v_norm);

  IF cardinality(v_chars) = 1 AND length(v_norm) >= 3 THEN
    IF EXISTS (
      SELECT 1 FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND l.search_chars @> v_chars
        AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
    ) THEN
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
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND l.search_chars @> v_chars
        AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
      ORDER BY l.created_at DESC, l.id ASC
      LIMIT v_limit OFFSET v_offset;
      RETURN;
    END IF;
  END IF;

  v_tsq := public.build_prefix_tsquery(v_query);
  IF v_tsq IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.fts @@ v_tsq
      AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
  ) THEN
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
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.fts @@ v_tsq
      AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
    ORDER BY ts_rank_cd(l.fts, v_tsq) DESC, l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;

  v_syn_query := public.expand_search_keywords(public.expand_search_query_synonyms(v_norm));
  v_syn_tsq := public.build_prefix_tsquery(v_syn_query);
  IF v_syn_query <> v_query AND v_syn_tsq IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.fts @@ v_syn_tsq
      AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
  ) THEN
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
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.fts @@ v_syn_tsq
      AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
    ORDER BY ts_rank_cd(l.fts, v_syn_tsq) DESC, l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;

  IF length(v_norm) >= 4 AND EXISTS (
    SELECT 1 FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND word_similarity(v_norm, l.search_text) > 0.5
      AND public.search_text_has_all_tokens(l.search_text, v_norm)
      AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
  ) THEN
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
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND word_similarity(v_norm, l.search_text) > 0.5
      AND public.search_text_has_all_tokens(l.search_text, v_norm)
      AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
    ORDER BY word_similarity(v_norm, l.search_text) DESC, l.created_at DESC, l.id ASC
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
  FROM public.listings AS l
  WHERE l.status = 'active'
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND public.normalize_search_text(l.search_text) LIKE '%' || v_norm || '%'
    AND public.search_text_has_all_tokens(l.search_text, v_norm)
    AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
  ORDER BY l.created_at DESC, l.id ASC
  LIMIT v_limit OFFSET v_offset;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.search_listings(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) TO anon, authenticated;

-- search_listings_hybrid (FTS-only and fused paths)
DROP FUNCTION IF EXISTS public.search_listings_hybrid(
  text, extensions.vector, text, integer, integer, float8, text,
  text, text, numeric, numeric, text, text, jsonb
);

CREATE FUNCTION public.search_listings_hybrid(
  p_query text,
  p_query_vector extensions.vector(384) DEFAULT NULL,
  p_market text DEFAULT NULL,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0,
  p_max_distance float8 DEFAULT 0.85,
  p_category_hint text DEFAULT NULL,
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
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_rrf_k constant integer := 60;
  v_fetch integer := least(greatest(v_limit * 3, 30), 100);
  v_effective_category text := coalesce(p_category_slug, p_category_hint);
BEGIN
  IF p_query_vector IS NULL THEN
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
    FROM public.search_listings(
      p_query, p_market, v_limit, v_offset,
      v_effective_category, p_subcategory_slug,
      p_min_price, p_max_price, p_city, p_neighborhood, p_attrs
    ) AS l;
    RETURN;
  END IF;

  RETURN QUERY
  WITH
    fts_ranked AS (
      SELECT f.id AS listing_id, row_number() OVER () AS rank_fts
      FROM public.search_listings(
        p_query, p_market, v_fetch, 0,
        v_effective_category, p_subcategory_slug,
        p_min_price, p_max_price, p_city, p_neighborhood, p_attrs
      ) AS f
    ),
    sem_ranked AS (
      SELECT s.id AS listing_id, row_number() OVER () AS rank_sem
      FROM public.search_listings_semantic(
        p_query_vector, p_market, v_fetch, 0, p_max_distance
      ) AS s
      WHERE public.listing_passes_filters(
        s, v_effective_category, p_subcategory_slug,
        p_min_price, p_max_price, p_city, p_neighborhood, p_attrs
      )
    ),
    fused AS (
      SELECT
        coalesce(f.listing_id, s.listing_id) AS listing_id,
        (
          CASE WHEN f.rank_fts IS NOT NULL THEN 1.0 / (v_rrf_k + f.rank_fts) ELSE 0.0 END
          +
          CASE WHEN s.rank_sem IS NOT NULL THEN 1.0 / (v_rrf_k + s.rank_sem) ELSE 0.0 END
        )::float8 AS rrf_score
      FROM fts_ranked f
      FULL OUTER JOIN sem_ranked s ON f.listing_id = s.listing_id
    )
  SELECT
    l.id, l.user_id, l.title, l.description, l.price, l.currency,
    l.country_code, l.city, l.neighborhood, l.category_slug, l.subcategory_slug,
    l.images, l.attributes, l.status, l.views, l.seller_name,
    NULL::text AS seller_phone,
    l.created_at, l.updated_at, l.bumps_today, l.bumps_reset_date,
    l.is_premium, l.premium_expires_at, l.auto_bump_active, l.auto_bump_expires_at,
    l.image_width, l.image_height, l.search_text, l.fts, l.search_chars,
    l.search_version, l.last_bumped_at, l.is_demo
  FROM fused
  JOIN public.listings l ON l.id = fused.listing_id
  ORDER BY fused.rrf_score DESC, l.created_at DESC, l.id ASC
  LIMIT v_limit OFFSET v_offset;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.search_listings_hybrid(
  text, extensions.vector, text, integer, integer, float8, text,
  text, text, numeric, numeric, text, text, jsonb
) TO anon, authenticated;

-- search_listings_v2
DROP FUNCTION IF EXISTS public.search_listings_v2(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
);

CREATE FUNCTION public.search_listings_v2(
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
  v_query text;
  v_syn_query text;
  v_tsq tsquery;
  v_syn_tsq tsquery;
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_chars text[];
  v_has_stopword boolean;
BEGIN
  v_norm := btrim(public.normalize_search_text(coalesce(p_query, '')));

  IF v_norm = '' OR length(v_norm) < 3 THEN
    RETURN;
  END IF;

  v_query := public.expand_search_keywords(v_norm);
  v_chars := public.search_character_array(v_norm);
  v_has_stopword := public.query_has_stopword(v_norm);

  IF cardinality(v_chars) = 1 AND length(v_norm) >= 3 THEN
    IF EXISTS (
      SELECT 1 FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND l.search_chars @> v_chars
        AND public.listing_passes_filters(l,
          p_category_slug, p_subcategory_slug,
          p_min_price, p_max_price,
          p_city, p_neighborhood, p_attrs)
    ) THEN
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
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND l.search_chars @> v_chars
        AND public.listing_passes_filters(l,
          p_category_slug, p_subcategory_slug,
          p_min_price, p_max_price,
          p_city, p_neighborhood, p_attrs)
      ORDER BY l.created_at DESC, l.id ASC
      LIMIT v_limit OFFSET v_offset;
      RETURN;
    END IF;
  END IF;

  v_tsq := public.build_prefix_tsquery(v_query);

  IF v_tsq IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.fts @@ v_tsq
      AND public.listing_passes_filters(l,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs)
  ) THEN
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
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.fts @@ v_tsq
      AND public.listing_passes_filters(l,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs)
    ORDER BY ts_rank_cd(l.fts, v_tsq) DESC, l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;

  -- Synonym search (restored from 20261208)
  v_syn_query := public.expand_search_keywords(
    public.expand_search_query_synonyms(v_norm)
  );
  v_syn_tsq := public.build_prefix_tsquery(v_syn_query);

  IF v_syn_query <> v_query
     AND v_syn_tsq IS NOT NULL
     AND EXISTS (
       SELECT 1 FROM public.listings AS l
       WHERE l.status = 'active'
         AND (p_market IS NULL OR l.country_code = upper(p_market))
         AND l.fts @@ v_syn_tsq
         AND public.listing_passes_filters(l,
           p_category_slug, p_subcategory_slug,
           p_min_price, p_max_price,
           p_city, p_neighborhood, p_attrs)
     ) THEN
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
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.fts @@ v_syn_tsq
      AND public.listing_passes_filters(l,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs)
    ORDER BY ts_rank_cd(l.fts, v_syn_tsq) DESC, l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;

  -- Stopword fallback (restored from 20261208)
  IF v_has_stopword THEN
    IF EXISTS (
      SELECT 1 FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND public.listing_passes_filters(l,
          p_category_slug, p_subcategory_slug,
          p_min_price, p_max_price,
          p_city, p_neighborhood, p_attrs)
        AND EXISTS (
          SELECT 1
          FROM regexp_split_to_table(v_query, '[[:space:]]+') AS tok
          WHERE tok <> ''
            AND length(public.normalize_search_text(tok)) >= 3
            AND public.normalize_search_text(tok) NOT IN (
              SELECT public.normalize_search_text(word)
              FROM public.search_stopwords
            )
            AND public.normalize_search_text(l.search_text)
              LIKE '%' || public.normalize_search_text(tok) || '%'
        )
    ) THEN
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
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND public.listing_passes_filters(l,
          p_category_slug, p_subcategory_slug,
          p_min_price, p_max_price,
          p_city, p_neighborhood, p_attrs)
        AND EXISTS (
          SELECT 1
          FROM regexp_split_to_table(v_query, '[[:space:]]+') AS tok
          WHERE tok <> ''
            AND length(public.normalize_search_text(tok)) >= 3
            AND public.normalize_search_text(tok) NOT IN (
              SELECT public.normalize_search_text(word)
              FROM public.search_stopwords
            )
            AND public.normalize_search_text(l.search_text)
              LIKE '%' || public.normalize_search_text(tok) || '%'
        )
      ORDER BY (
        SELECT count(*)
        FROM regexp_split_to_table(v_query, '[[:space:]]+') AS tok
        WHERE tok <> ''
          AND length(public.normalize_search_text(tok)) >= 3
          AND public.normalize_search_text(tok) NOT IN (
            SELECT public.normalize_search_text(word)
            FROM public.search_stopwords
          )
          AND public.normalize_search_text(l.search_text)
            LIKE '%' || public.normalize_search_text(tok) || '%'
      ) DESC, l.created_at DESC, l.id ASC
      LIMIT v_limit OFFSET v_offset;
      RETURN;
    END IF;
  END IF;

  -- Trigram similarity fallback (restored from 20261208)
  IF length(v_norm) >= 4 AND EXISTS (
    SELECT 1 FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND word_similarity(v_norm, l.search_text) > 0.5
      AND public.search_text_has_all_tokens_v2(l.search_text, v_norm)
      AND public.listing_passes_filters(l,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs)
  ) THEN
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
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND word_similarity(v_norm, l.search_text) > 0.5
      AND public.search_text_has_all_tokens_v2(l.search_text, v_norm)
      AND public.listing_passes_filters(l,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs)
    ORDER BY word_similarity(v_norm, l.search_text) DESC,
             l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;

  -- Final substring fallback
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
  FROM public.listings AS l
  WHERE l.status = 'active'
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND public.normalize_search_text(l.search_text)
      LIKE '%' || v_norm || '%'
    AND public.search_text_has_all_tokens_v2(l.search_text, v_norm)
    AND public.listing_passes_filters(l,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs)
  ORDER BY l.created_at DESC, l.id ASC
  LIMIT v_limit OFFSET v_offset;

  RETURN;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.search_listings_v2(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) TO anon, authenticated;

-- search_listings_v2_intent (delegates to corrected v2)
DROP FUNCTION IF EXISTS public.search_listings_v2_intent(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
);

CREATE FUNCTION public.search_listings_v2_intent(
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
  v_intent text;
  v_contradiction text;
  v_fetch_limit integer;
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
BEGIN
  v_norm := btrim(public.normalize_search_text(coalesce(p_query, '')));
  IF v_norm = '' OR length(v_norm) < 3 THEN RETURN; END IF;

  IF NOT public.query_has_meaningful_tokens(coalesce(p_query, '')) THEN
    RETURN;
  END IF;

  v_intent := public.detect_query_intent(v_norm);

  IF v_intent IS NULL THEN
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
    FROM public.search_listings_v2(
      p_query, p_market, v_limit, v_offset,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price, p_city, p_neighborhood, p_attrs
    ) AS l;
    RETURN;
  END IF;

  v_contradiction := CASE v_intent
    WHEN 'rental' THEN public.normalize_search_text('للبيع')
    WHEN 'sale'   THEN public.normalize_search_text('للايجار')
    WHEN 'new'    THEN public.normalize_search_text('مستعمل')
    WHEN 'used'   THEN public.normalize_search_text('جديد')
    ELSE NULL
  END;

  IF v_contradiction IS NULL THEN
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
    FROM public.search_listings_v2(
      p_query, p_market, v_limit, v_offset,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price, p_city, p_neighborhood, p_attrs
    ) AS l;
    RETURN;
  END IF;

  v_fetch_limit := least(greatest(v_limit * 5, 30), 100);

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
  FROM public.search_listings_v2(
    p_query, p_market, v_fetch_limit, 0,
    p_category_slug, p_subcategory_slug,
    p_min_price, p_max_price, p_city, p_neighborhood, p_attrs
  ) AS l
  WHERE public.normalize_search_text(l.search_text) NOT LIKE '%' || v_contradiction || '%'
  LIMIT v_limit OFFSET v_offset;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.search_listings_v2_intent(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) TO anon, authenticated;

COMMIT;

