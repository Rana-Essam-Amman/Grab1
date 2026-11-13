-- ============================================================================
-- Mask seller_phone on SECURITY DEFINER RPCs that return SETOF listings.
--
-- Column-level SELECT revocation does not apply to SECURITY DEFINER function
-- results. listings_by_seller (and hybrid's result path) returned l.*, which
-- exposed the stored phone. This migration keeps the public signatures and
-- behavior, and forces seller_phone = NULL on every returned composite row.
-- ============================================================================

BEGIN;

-- Internal sanitizer. Not granted to client roles.
CREATE OR REPLACE FUNCTION public.mask_listing_phone(p_row public.listings)
RETURNS public.listings
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT jsonb_populate_record(
    NULL::public.listings,
    to_jsonb(p_row) || jsonb_build_object('seller_phone', NULL)
  );
$$;

REVOKE ALL ON FUNCTION public.mask_listing_phone(public.listings)
  FROM PUBLIC, anon, authenticated;

-- listings_by_seller: same signature, same three branches, phone masked.
CREATE OR REPLACE FUNCTION public.listings_by_seller(
  p_seller_key text,
  p_market text DEFAULT NULL::text,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS SETOF public.listings
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
  IF v_key = '' THEN
    RETURN;
  END IF;

  v_is_uuid := v_key ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

  IF v_is_uuid THEN
    RETURN QUERY
    SELECT (public.mask_listing_phone(l)).*
    FROM public.listings l
    WHERE l.status = 'active'
      AND l.is_demo = false
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.user_id = v_key::uuid
    ORDER BY l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;

  -- Phone key: find every user_id that ever used this phone.
  SELECT array_agg(DISTINCT l.user_id)
  INTO v_user_ids
  FROM public.listings l
  WHERE l.seller_phone = v_key
    AND l.user_id IS NOT NULL;

  IF v_user_ids IS NOT NULL AND array_length(v_user_ids, 1) > 0 THEN
    RETURN QUERY
    SELECT (public.mask_listing_phone(l)).*
    FROM public.listings l
    WHERE l.status = 'active'
      AND l.is_demo = false
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.user_id = ANY(v_user_ids)
    ORDER BY l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;
    RETURN;
  END IF;

  -- No user_id found (orphan phone): fall back to direct match.
  RETURN QUERY
  SELECT (public.mask_listing_phone(l)).*
  FROM public.listings l
  WHERE l.status = 'active'
    AND l.is_demo = false
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND l.seller_phone = v_key
  ORDER BY l.created_at DESC, l.id ASC
  LIMIT v_limit OFFSET v_offset;
END;
$function$;

COMMENT ON FUNCTION public.listings_by_seller(text, text, integer, integer) IS
  'Active non-demo listings for a seller (UUID key, phone key, or orphan-phone fallback). seller_phone is always NULL.';

GRANT EXECUTE ON FUNCTION public.listings_by_seller(text, text, integer, integer)
  TO anon, authenticated;

-- Hybrid result path. Both the FTS-only return and the fused listings join
-- previously selected the raw composite, which carried seller_phone.
CREATE OR REPLACE FUNCTION public.search_listings_hybrid(
  p_query text,
  p_query_vector extensions.vector(384) default null,
  p_market text default null,
  p_limit integer default 20,
  p_offset integer default 0,
  p_max_distance float8 default 0.85,
  p_category_hint text default null,
  p_category_slug text default null,
  p_subcategory_slug text default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_city text default null,
  p_neighborhood text default null,
  p_attrs jsonb default null
)
RETURNS SETOF public.listings
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
      SELECT (public.mask_listing_phone(l)).*
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
      SELECT f.id AS listing_id,
             row_number() OVER () AS rank_fts
      FROM public.search_listings(
        p_query, p_market, v_fetch, 0,
        v_effective_category, p_subcategory_slug,
        p_min_price, p_max_price, p_city, p_neighborhood, p_attrs
      ) AS f
    ),
    sem_ranked AS (
      SELECT s.id AS listing_id,
             row_number() OVER () AS rank_sem
      FROM public.search_listings_semantic(
        p_query_vector, p_market, v_fetch, 0, p_max_distance
      ) AS s
      WHERE public.listing_passes_filters(
        s,
        v_effective_category, p_subcategory_slug,
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
  SELECT (public.mask_listing_phone(l)).*
  FROM fused
  JOIN public.listings l ON l.id = fused.listing_id
  ORDER BY fused.rrf_score DESC, l.created_at DESC, l.id ASC
  LIMIT v_limit
  OFFSET v_offset;
END;
$function$;

COMMENT ON FUNCTION public.search_listings_hybrid(
  text, extensions.vector, text, integer, integer, float8, text,
  text, text, numeric, numeric, text, text, jsonb
) IS
  'RRF hybrid search with full server-side filters. FTS-only when vector is null. seller_phone is always NULL.';

GRANT EXECUTE ON FUNCTION public.search_listings_hybrid(
  text, extensions.vector, text, integer, integer, float8, text,
  text, text, numeric, numeric, text, text, jsonb
) TO anon, authenticated;

-- search_listings is a public RPC (and hybrid's FTS source). Mask every
-- RETURN QUERY projection. Filtering, ranking, and fallbacks are unchanged.
CREATE OR REPLACE FUNCTION public.search_listings(
  p_query text,
  p_market text default null,
  p_limit integer default 20,
  p_offset integer default 0,
  p_category_slug text default null,
  p_subcategory_slug text default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_city text default null,
  p_neighborhood text default null,
  p_attrs jsonb default null
)
RETURNS SETOF public.listings
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

  IF v_norm = '' OR length(v_norm) < 3 THEN
    RETURN;
  END IF;

  v_query := public.expand_search_keywords(v_norm);
  v_chars := public.search_character_array(v_norm);

  IF cardinality(v_chars) = 1 AND length(v_norm) >= 3 THEN
    IF EXISTS (
      SELECT 1
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND l.search_chars @> v_chars
        AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
    ) THEN
      RETURN QUERY
      SELECT (public.mask_listing_phone(l)).*
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
    SELECT 1
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.fts @@ v_tsq
      AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
  ) THEN
    RETURN QUERY
    SELECT (public.mask_listing_phone(l)).*
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.fts @@ v_tsq
      AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
    ORDER BY ts_rank_cd(l.fts, v_tsq) DESC, l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;

    RETURN;
  END IF;

  v_syn_query := public.expand_search_keywords(
    public.expand_search_query_synonyms(v_norm)
  );
  v_syn_tsq := public.build_prefix_tsquery(v_syn_query);

  IF v_syn_query <> v_query
     AND v_syn_tsq IS NOT NULL
     AND EXISTS (
       SELECT 1
       FROM public.listings AS l
       WHERE l.status = 'active'
         AND (p_market IS NULL OR l.country_code = upper(p_market))
         AND l.fts @@ v_syn_tsq
         AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
     ) THEN
    RETURN QUERY
    SELECT (public.mask_listing_phone(l)).*
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
    SELECT 1
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND word_similarity(v_norm, l.search_text) > 0.5
      AND public.search_text_has_all_tokens(l.search_text, v_norm)
      AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
  ) THEN
    RETURN QUERY
    SELECT (public.mask_listing_phone(l)).*
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
  SELECT (public.mask_listing_phone(l)).*
  FROM public.listings AS l
  WHERE l.status = 'active'
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND public.normalize_search_text(l.search_text) LIKE '%' || v_norm || '%'
    AND public.search_text_has_all_tokens(l.search_text, v_norm)
    AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
  ORDER BY l.created_at DESC, l.id ASC
  LIMIT v_limit OFFSET v_offset;

  RETURN;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.search_listings(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) TO anon, authenticated;

-- Frontend also calls search_listings_v2_intent_typo. Mask both its
-- delegated result and its direct fallback.
CREATE OR REPLACE FUNCTION public.search_listings_v2_intent_typo(
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
RETURNS SETOF public.listings
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

  RETURN QUERY
    SELECT (public.mask_listing_phone(r)).*
    FROM public.search_listings_v2_intent(
      p_query, p_market, v_limit, v_offset,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs
    ) AS r;

  IF FOUND THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT (public.mask_listing_phone(l)).*
  FROM public.listings l
  WHERE l.status = 'active'
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND public.listing_passes_filters(
      l,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs
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
