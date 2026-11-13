-- ============================================================================
-- Mask seller_phone on the remaining public SETOF listings search RPCs.
--
-- search_listings_v2 and search_listings_v2_intent are SECURITY DEFINER,
-- granted to anon/authenticated, and return raw listing composites. A wrapper
-- that sanitizes does not make these functions themselves safe.
-- Signatures, filters, ranking, and grants are unchanged.
-- ============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.search_listings_v2(
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
      SELECT (public.mask_listing_phone(l)).* FROM public.listings AS l
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
    SELECT (public.mask_listing_phone(l)).* FROM public.listings AS l
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
    SELECT (public.mask_listing_phone(l)).* FROM public.listings AS l
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
      SELECT (public.mask_listing_phone(l)).* FROM public.listings AS l
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
    SELECT (public.mask_listing_phone(l)).* FROM public.listings AS l
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

  RETURN QUERY
  SELECT (public.mask_listing_phone(l)).* FROM public.listings AS l
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

CREATE OR REPLACE FUNCTION public.search_listings_v2_intent(
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
      SELECT (public.mask_listing_phone(l)).* FROM public.search_listings_v2(
        p_query, p_market, v_limit, v_offset,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs
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
      SELECT (public.mask_listing_phone(l)).* FROM public.search_listings_v2(
        p_query, p_market, v_limit, v_offset,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs
      ) AS l;
    RETURN;
  END IF;

  v_fetch_limit := least(greatest(v_limit * 5, 30), 100);

  RETURN QUERY
  SELECT (public.mask_listing_phone(l)).*
  FROM public.search_listings_v2(
    p_query, p_market, v_fetch_limit, 0,
    p_category_slug, p_subcategory_slug,
    p_min_price, p_max_price,
    p_city, p_neighborhood, p_attrs
  ) AS l
  WHERE public.normalize_search_text(l.search_text)
        NOT LIKE '%' || v_contradiction || '%'
  LIMIT v_limit
  OFFSET v_offset;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.search_listings_v2_intent(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) TO anon, authenticated;

COMMIT;
