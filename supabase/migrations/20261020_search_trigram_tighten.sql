CREATE OR REPLACE FUNCTION public.search_listings(
  p_query text,
  p_market text DEFAULT NULL,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS SETOF public.listings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_norm text;
  v_query text;
  v_tsq tsquery;
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_chars text[];
BEGIN
  v_norm := btrim(public.normalize_search_text(coalesce(p_query, '')));

  IF v_norm = '' THEN
    RETURN;
  END IF;

  v_query := public.expand_search_keywords(v_norm);
  v_chars := public.search_character_array(v_norm);

  IF cardinality(v_chars) = 1 THEN
    IF EXISTS (
      SELECT 1
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND l.search_chars @> v_chars
    ) THEN
      RETURN QUERY
      SELECT l.*
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND l.search_chars @> v_chars
      ORDER BY l.created_at DESC
      LIMIT v_limit OFFSET v_offset;

      RETURN;
    END IF;
  END IF;

  v_tsq := public.build_prefix_tsquery(v_query);

  IF v_tsq IS NOT NULL THEN
    IF EXISTS (
      SELECT 1
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND l.fts @@ v_tsq
    ) THEN
      RETURN QUERY
      SELECT l.*
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND l.fts @@ v_tsq
      ORDER BY
        ts_rank_cd(l.fts, v_tsq) DESC,
        l.created_at DESC
      LIMIT v_limit OFFSET v_offset;

      RETURN;
    END IF;
  END IF;

  -- Trigram fallback: reject short queries and tighten similarity.
  IF length(v_norm) >= 4 THEN
    IF EXISTS (
      SELECT 1
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND word_similarity(v_norm, l.search_text) > 0.5
    ) THEN
      RETURN QUERY
      SELECT l.*
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND word_similarity(v_norm, l.search_text) > 0.5
      ORDER BY
        word_similarity(v_norm, l.search_text) DESC,
        l.created_at DESC
      LIMIT v_limit OFFSET v_offset;

      RETURN;
    END IF;
  END IF;

  RETURN QUERY
  SELECT l.*
  FROM public.listings AS l
  WHERE l.status = 'active'
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND public.normalize_search_text(l.search_text)
      LIKE '%' || v_norm || '%'
  ORDER BY l.created_at DESC
  LIMIT v_limit OFFSET v_offset;

  RETURN;
END;
$function$;
