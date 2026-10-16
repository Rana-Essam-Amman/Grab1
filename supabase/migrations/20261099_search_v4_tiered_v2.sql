-- 20261099_search_v4_tiered_v2.sql
-- C2 wrapper: returns C1 classified rows (Tier 1 exact + Tier 2 non-exact)
-- PLUS independent same-category recommendations (union, deduplicated).
-- Frontend renders two sections. v4 and C1 unchanged.

BEGIN;

SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '15s';

CREATE OR REPLACE FUNCTION public.search_listings_v4_tiered_v2(
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
  p_tier2_limit integer DEFAULT 5
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
  rank_in_tier integer
)
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $func$
#variable_conflict use_column
DECLARE
  v_norm_query text;
  v_tier1_ids uuid[] := ARRAY[]::uuid[];
  v_tier2_ids_c1 uuid[] := ARRAY[]::uuid[];
  v_excluded_ids uuid[] := ARRAY[]::uuid[];
  v_tier2_category text;
  v_top_tier1_subcategory text;
  v_top_tier1_city text;
  v_median_tier1_price numeric;
  v_has_tier1 boolean := false;
  v_tier2_limit_clamped integer;
  v_c1_tier2_max_rank integer := 0;
BEGIN
  -- 1. Normalize query (same as v4 / C1)
  v_norm_query := btrim(public.normalize_search_text(coalesce(p_query, '')));
  v_norm_query := translate(v_norm_query, 'یک', 'يك');

  -- Clamp p_tier2_limit: 0..5
  v_tier2_limit_clamped := least(greatest(coalesce(p_tier2_limit, 5), 0), 5);

  -- 2. Materialize C1 results into temp table (preserves order via ordinality)
  DROP TABLE IF EXISTS pg_temp._c2_c1_rows;
  CREATE TEMP TABLE _c2_c1_rows (
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
    c1_order integer
  ) ON COMMIT DROP;

  TRUNCATE _c2_c1_rows;

  INSERT INTO _c2_c1_rows (
    id, user_id, title, description, price, currency, country_code,
    city, neighborhood, category_slug, subcategory_slug, images,
    attributes, status, views, seller_name, seller_phone,
    created_at, updated_at, is_demo, match_kind, matched_tokens,
    total_matched_tokens, tier, tier_reason, c1_order
  )
  SELECT
    c.id, c.user_id, c.title, c.description, c.price, c.currency,
    c.country_code, c.city, c.neighborhood, c.category_slug,
    c.subcategory_slug, c.images, c.attributes, c.status, c.views,
    c.seller_name, c.seller_phone, c.created_at, c.updated_at,
    c.is_demo, c.match_kind, c.matched_tokens,
    c.total_matched_tokens, c.tier, c.tier_reason,
    c.ord AS c1_order
  FROM public.search_listings_v4_tiered(
    p_query, p_market, p_limit, p_offset,
    p_category_slug, p_subcategory_slug,
    p_min_price, p_max_price,
    p_city, p_neighborhood, p_attrs
  ) WITH ORDINALITY AS c(
    id, user_id, title, description, price, currency, country_code,
    city, neighborhood, category_slug, subcategory_slug, images,
    attributes, status, views, seller_name, seller_phone,
    created_at, updated_at, is_demo, match_kind, matched_tokens,
    total_matched_tokens, tier, tier_reason, ord
  );

  -- 3. Extract ids, top tier1 metadata, median price
  SELECT COALESCE(array_agg(id), ARRAY[]::uuid[])
  INTO v_tier1_ids
  FROM _c2_c1_rows
  WHERE tier = 1;

  SELECT COALESCE(array_agg(id), ARRAY[]::uuid[])
  INTO v_tier2_ids_c1
  FROM _c2_c1_rows
  WHERE tier = 2;

  v_has_tier1 := (cardinality(v_tier1_ids) > 0);

  IF v_has_tier1 THEN
    SELECT subcategory_slug, city
    INTO v_top_tier1_subcategory, v_top_tier1_city
    FROM _c2_c1_rows
    WHERE tier = 1
    ORDER BY c1_order ASC
    LIMIT 1;

    SELECT percentile_cont(0.5) WITHIN GROUP (
      ORDER BY CASE
        WHEN price ~ '^[0-9]+(\.[0-9]+)?$'
        THEN price::numeric
        ELSE NULL
      END
    )
    INTO v_median_tier1_price
    FROM _c2_c1_rows
    WHERE tier = 1;
  END IF;

  -- 4. Determine tier2_category by precedence
  IF p_category_slug IS NOT NULL THEN
    v_tier2_category := p_category_slug;
  ELSIF v_has_tier1 THEN
    SELECT category_slug
    INTO v_tier2_category
    FROM _c2_c1_rows
    WHERE tier = 1
    ORDER BY c1_order ASC
    LIMIT 1;
  ELSE
    v_tier2_category := public.detect_query_category(v_norm_query);
  END IF;

  -- 5. Build excluded ids (union, non-null)
  v_excluded_ids := v_tier1_ids || v_tier2_ids_c1;

  -- 6. Max rank among C1 tier 2 (for continuing numbering)
  SELECT COALESCE(MAX(rn), 0)
  INTO v_c1_tier2_max_rank
  FROM (
    SELECT row_number() OVER (ORDER BY c1_order) AS rn
    FROM _c2_c1_rows
    WHERE tier = 2
  ) t;

  -- 7. Return combined results with rank_in_tier
  IF v_tier2_category IS NOT NULL AND v_tier2_limit_clamped > 0 THEN
    RETURN QUERY
    WITH c1_ranked AS (
      SELECT
        r.*,
        row_number() OVER (PARTITION BY r.tier ORDER BY r.c1_order)::integer AS rank_in_tier
      FROM _c2_c1_rows r
    ),
    independent AS (
      SELECT * FROM (
        SELECT
          l.id,
          l.user_id,
          l.title,
          l.description,
          l.price,
          l.currency,
          l.country_code,
          l.city,
          l.neighborhood,
          l.category_slug,
          l.subcategory_slug,
          l.images,
          l.attributes,
          l.status,
          l.views,
          l.seller_name,
          l.seller_phone,
          l.created_at,
          l.updated_at,
          l.is_demo,
          NULL::text AS match_kind,
          NULL::text[] AS matched_tokens,
          0 AS total_matched_tokens,
          2 AS tier,
          'similar_category'::text AS tier_reason,
          (v_c1_tier2_max_rank + row_number() OVER (
            ORDER BY
              CASE WHEN v_has_tier1 THEN (l.subcategory_slug = v_top_tier1_subcategory)::int ELSE 0 END DESC NULLS LAST,
              CASE WHEN v_has_tier1 THEN abs(
                CASE WHEN l.price ~ '^[0-9]+(\.[0-9]+)?$' THEN l.price::numeric ELSE NULL END
                - COALESCE(v_median_tier1_price, 0)
              ) ELSE 0 END ASC NULLS LAST,
              CASE WHEN v_has_tier1 THEN (l.city = v_top_tier1_city)::int ELSE 0 END DESC NULLS LAST,
              l.created_at DESC,
              l.id ASC
          ))::integer AS rank_in_tier
        FROM public.listings l
        WHERE l.status = 'active'
          AND l.country_code = upper(coalesce(p_market, 'JO'))
          AND l.category_slug = v_tier2_category
          AND l.id <> ALL(v_excluded_ids)
          AND (p_min_price IS NULL OR (
            CASE WHEN l.price ~ '^[0-9]+(\.[0-9]+)?$' THEN l.price::numeric ELSE NULL END
          ) >= p_min_price)
          AND (p_max_price IS NULL OR (
            CASE WHEN l.price ~ '^[0-9]+(\.[0-9]+)?$' THEN l.price::numeric ELSE NULL END
          ) <= p_max_price)
          AND (p_city IS NULL OR l.city = p_city)
          AND (p_neighborhood IS NULL OR l.neighborhood = p_neighborhood)
          AND (p_subcategory_slug IS NULL OR l.subcategory_slug = p_subcategory_slug)
      ) ranked
      ORDER BY
        CASE WHEN v_has_tier1 THEN (subcategory_slug = v_top_tier1_subcategory)::int ELSE 0 END DESC NULLS LAST,
        CASE WHEN v_has_tier1 THEN abs(
          CASE WHEN price ~ '^[0-9]+(\.[0-9]+)?$' THEN price::numeric ELSE NULL END
          - COALESCE(v_median_tier1_price, 0)
        ) ELSE 0 END ASC NULLS LAST,
        CASE WHEN v_has_tier1 THEN (city = v_top_tier1_city)::int ELSE 0 END DESC NULLS LAST,
        created_at DESC,
        id ASC
      LIMIT v_tier2_limit_clamped
    )
    SELECT
      id, user_id, title, description, price, currency, country_code,
      city, neighborhood, category_slug, subcategory_slug, images,
      attributes, status, views, seller_name, seller_phone,
      created_at, updated_at, is_demo, match_kind, matched_tokens,
      total_matched_tokens, tier, tier_reason, rank_in_tier::integer
    FROM c1_ranked
    UNION ALL
    SELECT
      id, user_id, title, description, price, currency, country_code,
      city, neighborhood, category_slug, subcategory_slug, images,
      attributes, status, views, seller_name, seller_phone,
      created_at, updated_at, is_demo, match_kind, matched_tokens,
      total_matched_tokens, tier, tier_reason, rank_in_tier::integer
    FROM independent
    ORDER BY tier ASC, rank_in_tier ASC;
  ELSE
    RETURN QUERY
    SELECT
      r.id, r.user_id, r.title, r.description, r.price, r.currency, r.country_code,
      r.city, r.neighborhood, r.category_slug, r.subcategory_slug, r.images,
      r.attributes, r.status, r.views, r.seller_name, r.seller_phone,
      r.created_at, r.updated_at, r.is_demo, r.match_kind, r.matched_tokens,
      r.total_matched_tokens, r.tier, r.tier_reason,
      row_number() OVER (PARTITION BY r.tier ORDER BY r.c1_order)::integer AS rank_in_tier
    FROM _c2_c1_rows r
    ORDER BY r.tier ASC, r.c1_order ASC;
  END IF;
END;
$func$;

COMMENT ON FUNCTION public.search_listings_v4_tiered_v2(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb, integer
) IS
  'C2 wrapper: C1 classified rows + independent same-category Tier 2 recommendations. Union deduplicated. Page-local ranking.';

GRANT EXECUTE ON FUNCTION public.search_listings_v4_tiered_v2(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb, integer
) TO anon, authenticated;

COMMIT;

-- ROLLBACK PROCEDURE:
-- DROP FUNCTION IF EXISTS public.search_listings_v4_tiered_v2(
--   text, text, integer, integer, text, text,
--   numeric, numeric, text, text, jsonb, integer
-- );
