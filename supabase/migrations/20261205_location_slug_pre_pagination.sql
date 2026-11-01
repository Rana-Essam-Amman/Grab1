-- 20261205_location_slug_pre_pagination.sql
-- Slug filters are applied inside the search WHERE, before LIMIT/OFFSET.
-- Existing v2/v3 RPCs are left in place for older clients.

BEGIN;

SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';


CREATE OR REPLACE FUNCTION public.listing_matches_slugs(
  p_row public.listings,
  p_city_slug text,
  p_district_slug text,
  p_neighborhood_slug text,
  p_city text,
  p_neighborhood text
)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $slugs$
  SELECT
    (p_city_slug IS NULL OR p_row.city_slug IS NULL OR p_row.city_slug = p_city_slug)
    AND (p_district_slug IS NULL OR p_row.district_slug IS NULL OR p_row.district_slug = p_district_slug)
    AND (p_neighborhood_slug IS NULL OR p_row.neighborhood_slug IS NULL OR p_row.neighborhood_slug = p_neighborhood_slug)
    AND (
      p_neighborhood_slug IS NULL
      OR p_row.neighborhood_slug = p_neighborhood_slug
      OR (
        p_row.neighborhood_slug IS NULL
        AND p_neighborhood IS NOT NULL
        AND lower(coalesce(p_row.neighborhood, '')) = lower(p_neighborhood)
        AND (
          (p_city_slug IS NOT NULL AND p_row.city_slug = p_city_slug)
          OR (p_city IS NOT NULL AND lower(coalesce(p_row.city, '')) = lower(p_city))
          OR (p_city_slug IS NULL AND p_city IS NULL)
        )
      )
    )
    AND (
      p_district_slug IS NULL
      OR p_row.district_slug = p_district_slug
      OR (
        p_row.district_slug IS NULL
        AND p_neighborhood_slug IS NULL
        AND p_neighborhood IS NOT NULL
        AND lower(coalesce(p_row.neighborhood, '')) = lower(p_neighborhood)
        AND (
          (p_city_slug IS NOT NULL AND p_row.city_slug = p_city_slug)
          OR (p_city IS NOT NULL AND lower(coalesce(p_row.city, '')) = lower(p_city))
        )
      )
    )
    AND (
      p_city_slug IS NULL
      OR p_row.city_slug = p_city_slug
      OR (
        p_row.city_slug IS NULL
        AND p_city IS NOT NULL
        AND lower(coalesce(p_row.city, '')) = lower(p_city)
      )
    );
$slugs$;

COMMENT ON FUNCTION public.listing_matches_slugs(public.listings, text, text, text, text, text) IS
  'Authoritative slug match. Conflicting non-NULL slug rejects. NULL listing slug falls back to text. No invented slugs.';


CREATE OR REPLACE FUNCTION public.search_listings_v4_exact_slugs(
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
  total_matched_tokens integer
)
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_norm text;
  v_tokens text[];
  v_n integer;
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_exact_count integer;
  v_trigram_count integer;
  v_threshold integer;
BEGIN
  v_norm := btrim(public.normalize_search_text(coalesce(p_query, '')));
  -- Fold Persian yeh/kaf so measured typos like كمری match كامري.
  v_norm := translate(v_norm, 'یک', 'يك');
  IF v_norm = '' OR length(v_norm) < 3 THEN
    RETURN;
  END IF;

  SELECT array_agg(t.token ORDER BY t.ordinality)
  INTO v_tokens
  FROM (
    SELECT
      s.ordinality,
      public.normalize_search_text(s.token) AS token
    FROM regexp_split_to_table(v_norm, '[[:space:]]+')
         WITH ORDINALITY AS s(token, ordinality)
  ) AS t
  WHERE t.token <> ''
    AND length(t.token) >= 3
    AND NOT EXISTS (
      SELECT 1 FROM public.search_stopwords w
      WHERE public.normalize_search_text(w.word) = t.token
    );

  v_n := coalesce(cardinality(v_tokens), 0);

  IF v_n = 0 THEN
    RETURN;
  END IF;

  SELECT count(*) INTO v_exact_count
  FROM public.listings AS l
  WHERE l.status = 'active'
    AND (l.is_demo = false OR public.is_admin())
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND public.listing_passes_filters(
      l, p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      CASE WHEN p_city_slug IS NULL THEN p_city ELSE NULL END,
      CASE WHEN p_neighborhood_slug IS NULL AND p_district_slug IS NULL THEN p_neighborhood ELSE NULL END,
      p_attrs
    )
    AND public.listing_matches_slugs(l, p_city_slug, p_district_slug, p_neighborhood_slug, p_city, p_neighborhood)
    AND NOT EXISTS (
      SELECT 1
      FROM unnest(v_tokens) AS required(token)
      WHERE strpos(
        public.normalize_search_text(coalesce(l.search_text, '')),
        required.token
      ) = 0
    );

  IF v_exact_count > 0 THEN
    IF current_setting('app.v4_trace', true) = 'on'
       AND to_regclass('public.search_v4_trace') IS NOT NULL THEN
      INSERT INTO public.search_v4_trace(branch) VALUES ('exact');
    END IF;

    RETURN QUERY
    SELECT
      l.id, l.user_id, l.title, l.description, l.price, l.currency,
      l.country_code, l.city, l.neighborhood, l.category_slug,
      l.subcategory_slug, l.images, l.attributes, l.status, l.views,
      l.seller_name, NULL::text AS seller_phone, l.created_at, l.updated_at,
      l.is_demo,
      'exact'::text,
      v_tokens,
      v_n
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (l.is_demo = false OR public.is_admin())
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND public.listing_passes_filters(
        l, p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        CASE WHEN p_city_slug IS NULL THEN p_city ELSE NULL END,
        CASE WHEN p_neighborhood_slug IS NULL AND p_district_slug IS NULL THEN p_neighborhood ELSE NULL END,
        p_attrs
      )
      AND public.listing_matches_slugs(l, p_city_slug, p_district_slug, p_neighborhood_slug, p_city, p_neighborhood)
      AND NOT EXISTS (
        SELECT 1
        FROM unnest(v_tokens) AS required(token)
        WHERE strpos(
          public.normalize_search_text(coalesce(l.search_text, '')),
          required.token
        ) = 0
      )
    ORDER BY l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;

  -- Trigram fallback for single-token typos only. Multi-token near
  -- matches stay in related so a missing token is not promoted to exact.
  IF v_n = 1 THEN
  SELECT count(*) INTO v_trigram_count
  FROM public.listings AS l
  WHERE l.status = 'active'
    AND (l.is_demo = false OR public.is_admin())
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND public.listing_passes_filters(
      l, p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      CASE WHEN p_city_slug IS NULL THEN p_city ELSE NULL END,
      CASE WHEN p_neighborhood_slug IS NULL AND p_district_slug IS NULL THEN p_neighborhood ELSE NULL END,
      p_attrs
    )
    AND public.listing_matches_slugs(l, p_city_slug, p_district_slug, p_neighborhood_slug, p_city, p_neighborhood)
    AND word_similarity(
      v_norm,
      public.normalize_search_text(coalesce(l.search_text, ''))
    ) >= 0.4;

  IF v_trigram_count > 0 THEN
    IF current_setting('app.v4_trace', true) = 'on'
       AND to_regclass('public.search_v4_trace') IS NOT NULL THEN
      INSERT INTO public.search_v4_trace(branch) VALUES ('trigram');
    END IF;

    RETURN QUERY
    SELECT
      l.id, l.user_id, l.title, l.description, l.price, l.currency,
      l.country_code, l.city, l.neighborhood, l.category_slug,
      l.subcategory_slug, l.images, l.attributes, l.status, l.views,
      l.seller_name, NULL::text AS seller_phone, l.created_at, l.updated_at,
      l.is_demo,
      'exact'::text,
      v_tokens,
      v_n
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (l.is_demo = false OR public.is_admin())
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND public.listing_passes_filters(
        l, p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        CASE WHEN p_city_slug IS NULL THEN p_city ELSE NULL END,
        CASE WHEN p_neighborhood_slug IS NULL AND p_district_slug IS NULL THEN p_neighborhood ELSE NULL END,
        p_attrs
      )
      AND public.listing_matches_slugs(l, p_city_slug, p_district_slug, p_neighborhood_slug, p_city, p_neighborhood)
      AND word_similarity(
        v_norm,
        public.normalize_search_text(coalesce(l.search_text, ''))
      ) >= 0.4
    ORDER BY word_similarity(
      v_norm,
      public.normalize_search_text(coalesce(l.search_text, ''))
    ) DESC, l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;
  END IF;

  -- Related threshold. N=1 is never related.
  v_threshold := CASE
    WHEN v_n <= 1 THEN NULL
    WHEN v_n = 2 THEN 2
    WHEN v_n = 3 THEN 2
    WHEN v_n = 4 THEN 3
    ELSE ceil(v_n * 0.6)::integer
  END;

  IF v_threshold IS NULL THEN
    RETURN;
  END IF;

  IF current_setting('app.v4_trace', true) = 'on'
     AND to_regclass('public.search_v4_trace') IS NOT NULL THEN
    INSERT INTO public.search_v4_trace(branch) VALUES ('related');
  END IF;

  RETURN QUERY
  SELECT
    s.id, s.user_id, s.title, s.description, s.price, s.currency,
    s.country_code, s.city, s.neighborhood, s.category_slug,
    s.subcategory_slug, s.images, s.attributes, s.status, s.views,
    s.seller_name, NULL::text AS seller_phone, s.created_at, s.updated_at,
    s.is_demo,
    'related'::text,
    s.matched_tokens,
    s.total_matched_tokens
  FROM (
    SELECT
      l.*,
      (
        SELECT array_agg(required.token ORDER BY required.token)
        FROM unnest(v_tokens) AS required(token)
        WHERE strpos(
          public.normalize_search_text(coalesce(l.search_text, '')),
          required.token
        ) > 0
      ) AS matched_tokens,
      (
        SELECT count(*)::integer
        FROM unnest(v_tokens) AS required(token)
        WHERE strpos(
          public.normalize_search_text(coalesce(l.search_text, '')),
          required.token
        ) > 0
      ) AS total_matched_tokens
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (l.is_demo = false OR public.is_admin())
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND public.listing_passes_filters(
        l, p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        CASE WHEN p_city_slug IS NULL THEN p_city ELSE NULL END,
        CASE WHEN p_neighborhood_slug IS NULL AND p_district_slug IS NULL THEN p_neighborhood ELSE NULL END,
        p_attrs
      )
      AND public.listing_matches_slugs(l, p_city_slug, p_district_slug, p_neighborhood_slug, p_city, p_neighborhood)
  ) AS s
  WHERE s.total_matched_tokens >= v_threshold
  ORDER BY s.total_matched_tokens DESC, s.created_at DESC, s.id ASC
  LIMIT v_limit OFFSET v_offset;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.search_listings_v4_exact_slugs(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb, text, text, text
) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.search_listings_v4_tiered_slugs(
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
  tier_reason text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $func$
DECLARE
  v_norm_query text;
  v_tokens text[];
BEGIN
  -- Normalize query EXACTLY as v4 does (Constraint 1).
  -- Copied from 20261093_search_v4_typo_threshold.sql lines 47-50.
  v_norm_query := btrim(public.normalize_search_text(coalesce(p_query, '')));
  -- Fold Persian yeh/kaf so measured typos like كمری match كامري.
  v_norm_query := translate(v_norm_query, 'یک', 'يك');

  -- Extract meaningful tokens exactly as v4's exact stage does
  -- (lines 55-70 of 20261093). Length >= 3, not stopword.
  SELECT array_agg(t.token ORDER BY t.ordinality)
  INTO v_tokens
  FROM (
    SELECT
      s.ordinality,
      public.normalize_search_text(s.token) AS token
    FROM regexp_split_to_table(v_norm_query, '[[:space:]]+')
         WITH ORDINALITY AS s(token, ordinality)
  ) AS t
  WHERE t.token <> ''
    AND length(t.token) >= 3
    AND NOT EXISTS (
      SELECT 1 FROM public.search_stopwords w
      WHERE public.normalize_search_text(w.word) = t.token
    );

  RETURN QUERY
  WITH v4r AS (
    SELECT *,
           ordinality AS v4_order
    FROM public.search_listings_v4_exact_slugs(
      p_query, p_market, p_limit, p_offset,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs,
      p_city_slug, p_district_slug, p_neighborhood_slug
    ) WITH ORDINALITY
  )
  SELECT
    v4r.id,
    v4r.user_id,
    v4r.title,
    v4r.description,
    v4r.price,
    v4r.currency,
    v4r.country_code,
    v4r.city,
    v4r.neighborhood,
    v4r.category_slug,
    v4r.subcategory_slug,
    v4r.images,
    v4r.attributes,
    v4r.status,
    v4r.views,
    v4r.seller_name,
    v4r.seller_phone,
    v4r.created_at,
    v4r.updated_at,
    v4r.is_demo,
    v4r.match_kind,
    v4r.matched_tokens,
    v4r.total_matched_tokens,
    CASE
      WHEN v_tokens IS NOT NULL
           AND cardinality(v_tokens) > 0
           AND NOT EXISTS (
             SELECT 1
             FROM unnest(v_tokens) AS required(token)
             WHERE strpos(
               public.normalize_search_text(coalesce(l.search_text, '')),
               required.token
             ) = 0
           ) THEN 1
      WHEN v4r.match_kind = 'related' THEN 2
      ELSE 2
    END AS tier,
    CASE
      WHEN v_tokens IS NOT NULL
           AND cardinality(v_tokens) > 0
           AND NOT EXISTS (
             SELECT 1
             FROM unnest(v_tokens) AS required(token)
             WHERE strpos(
               public.normalize_search_text(coalesce(l.search_text, '')),
               required.token
             ) = 0
           ) THEN 'exact_substring'
      WHEN v4r.match_kind = 'related' THEN 'related'
      ELSE 'trigram_fuzzy'
    END AS tier_reason
  FROM v4r
  JOIN public.listings AS l ON l.id = v4r.id
  ORDER BY
    (CASE
      WHEN v_tokens IS NOT NULL
           AND cardinality(v_tokens) > 0
           AND NOT EXISTS (
             SELECT 1
             FROM unnest(v_tokens) AS required(token)
             WHERE strpos(
               public.normalize_search_text(coalesce(l.search_text, '')),
               required.token
             ) = 0
           ) THEN 1
      ELSE 2
    END) ASC,
    v4r.v4_order ASC;
END;
$func$;

GRANT EXECUTE ON FUNCTION public.search_listings_v4_tiered_slugs(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb, text, text, text
) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.search_listings_v4_tiered_v4(
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
  v_norm_query := btrim(public.normalize_search_text(coalesce(p_query, '')));
  v_norm_query := translate(v_norm_query, 'یک', 'يك');

  v_tier2_limit_clamped := least(greatest(coalesce(p_tier2_limit, 5), 0), 5);

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
  FROM public.search_listings_v4_tiered_slugs(
    p_query, p_market, p_limit, p_offset,
    p_category_slug, p_subcategory_slug,
    p_min_price, p_max_price,
    p_city, p_neighborhood, p_attrs,
    p_city_slug, p_district_slug, p_neighborhood_slug
  ) WITH ORDINALITY AS c(
    id, user_id, title, description, price, currency, country_code,
    city, neighborhood, category_slug, subcategory_slug, images,
    attributes, status, views, seller_name, seller_phone,
    created_at, updated_at, is_demo, match_kind, matched_tokens,
    total_matched_tokens, tier, tier_reason, ord
  );

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

  v_excluded_ids := v_tier1_ids || v_tier2_ids_c1;

  SELECT COALESCE(MAX(rn), 0)
  INTO v_c1_tier2_max_rank
  FROM (
    SELECT row_number() OVER (ORDER BY c1_order) AS rn
    FROM _c2_c1_rows
    WHERE tier = 2
  ) t;

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
          NULL::text AS seller_phone,
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
          AND (l.is_demo = false OR public.is_admin())
          AND (p_market IS NULL OR l.country_code = upper(p_market))
          AND l.category_slug = v_tier2_category
          AND l.id <> ALL(v_excluded_ids)
          AND public.listing_passes_filters(
            l, v_tier2_category, p_subcategory_slug,
            p_min_price, p_max_price,
            CASE WHEN p_city_slug IS NULL THEN p_city ELSE NULL END,
            CASE WHEN p_neighborhood_slug IS NULL AND p_district_slug IS NULL THEN p_neighborhood ELSE NULL END,
            p_attrs
          )
          AND public.listing_matches_slugs(l, p_city_slug, p_district_slug, p_neighborhood_slug, p_city, p_neighborhood)
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
      c.id, c.user_id, c.title, c.description, c.price, c.currency, c.country_code,
      c.city, c.neighborhood, c.category_slug, c.subcategory_slug, c.images,
      c.attributes, c.status, c.views, c.seller_name, c.seller_phone,
      c.created_at, c.updated_at, c.is_demo, c.match_kind, c.matched_tokens,
      c.total_matched_tokens, c.tier, c.tier_reason, c.rank_in_tier,
      l.city_slug, l.district_slug, l.neighborhood_slug
    FROM (
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
    ) c
    JOIN public.listings l ON l.id = c.id
    ORDER BY c.tier ASC, c.rank_in_tier ASC;
  ELSE
    RETURN QUERY
    SELECT
      r.id, r.user_id, r.title, r.description, r.price, r.currency, r.country_code,
      r.city, r.neighborhood, r.category_slug, r.subcategory_slug, r.images,
      r.attributes, r.status, r.views, r.seller_name, r.seller_phone,
      r.created_at, r.updated_at, r.is_demo, r.match_kind, r.matched_tokens,
      r.total_matched_tokens, r.tier, r.tier_reason,
      row_number() OVER (PARTITION BY r.tier ORDER BY r.c1_order)::integer AS rank_in_tier,
      l.city_slug, l.district_slug, l.neighborhood_slug
    FROM _c2_c1_rows r
    JOIN public.listings l ON l.id = r.id
    ORDER BY r.tier ASC, r.c1_order ASC;
  END IF;
END;
$func$;

GRANT EXECUTE ON FUNCTION public.search_listings_v4_tiered_v4(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb, integer, text, text, text
) TO anon, authenticated;

-- v3 keeps its signature for older clients, but delegates to the
-- pre-pagination v4 implementation so slug filters are not applied after LIMIT.
CREATE OR REPLACE FUNCTION public.search_listings_v4_tiered_v3(
  p_query text, p_market text DEFAULT NULL, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0,
  p_category_slug text DEFAULT NULL, p_subcategory_slug text DEFAULT NULL,
  p_min_price numeric DEFAULT NULL, p_max_price numeric DEFAULT NULL,
  p_city text DEFAULT NULL, p_neighborhood text DEFAULT NULL, p_attrs jsonb DEFAULT NULL,
  p_tier2_limit integer DEFAULT 5, p_city_slug text DEFAULT NULL,
  p_district_slug text DEFAULT NULL, p_neighborhood_slug text DEFAULT NULL
)
RETURNS TABLE (
  id uuid, user_id uuid, title text, description text, price text, currency text,
  country_code text, city text, neighborhood text, category_slug text, subcategory_slug text,
  images text[], attributes jsonb, status text, views integer, seller_name text,
  seller_phone text, created_at timestamptz, updated_at timestamptz, is_demo boolean,
  match_kind text, matched_tokens text[], total_matched_tokens integer,
  tier integer, tier_reason text, rank_in_tier integer,
  city_slug text, district_slug text, neighborhood_slug text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $v3$
  SELECT * FROM public.search_listings_v4_tiered_v4(
    p_query, p_market, p_limit, p_offset, p_category_slug, p_subcategory_slug,
    p_min_price, p_max_price, p_city, p_neighborhood, p_attrs, p_tier2_limit,
    p_city_slug, p_district_slug, p_neighborhood_slug
  );
$v3$;

REVOKE ALL ON FUNCTION public.search_listings_v4_tiered_v4(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb, integer, text, text, text
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_listings_v4_tiered_v4(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb, integer, text, text, text
) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.search_listings_v4_tiered_v3(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb, integer, text, text, text
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_listings_v4_tiered_v3(
  text, text, integer, integer, text, text, jsonb, integer, text, text, text
) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';

COMMIT;
