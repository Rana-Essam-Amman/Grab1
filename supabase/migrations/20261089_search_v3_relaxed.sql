-- 20261089_search_v3_relaxed.sql
-- Additive progressive relaxation RPC. Does not replace or modify
-- any existing search RPC.

BEGIN;

SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '15s';

CREATE OR REPLACE FUNCTION public.search_relaxed_subsets(
  p_query text
)
RETURNS TABLE (
  attempt_no integer,
  subset_tokens text[]
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $function$
DECLARE
  v_norm text;
  v_tokens text[];
  v_n integer;
  v_mask integer;
  v_subset text[];
  v_attempt integer := 0;
  v_stopwords text[];
BEGIN
  v_norm := btrim(
    public.normalize_search_text(coalesce(p_query, ''))
  );

  IF v_norm = '' THEN
    RETURN;
  END IF;

  SELECT array_agg(DISTINCT public.normalize_search_text(word))
  INTO v_stopwords
  FROM public.search_stopwords;

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
    AND NOT (t.token = ANY(coalesce(v_stopwords, ARRAY[]::text[])));

  v_n := coalesce(cardinality(v_tokens), 0);

  IF v_n = 0 OR v_n > 5 THEN
    RETURN;
  END IF;

  FOR v_mask IN
    SELECT m
    FROM generate_series(1, (1 << v_n) - 1) AS g(m)
    WHERE (m & 1) = 1
    ORDER BY
      bit_count(m::bit(32)) DESC,
      m ASC
  LOOP
    SELECT array_agg(v_tokens[i] ORDER BY i)
    INTO v_subset
    FROM generate_series(1, v_n) AS g(i)
    WHERE (v_mask & (1 << (i - 1))) <> 0;

    v_attempt := v_attempt + 1;

    attempt_no := v_attempt;
    subset_tokens := v_subset;
    RETURN NEXT;

    EXIT WHEN v_attempt >= 4;
  END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.search_listings_v3_relaxed(
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
  v_subset record;
  v_meaningful_count integer;
  v_has_any boolean;
BEGIN
  v_norm := btrim(
    public.normalize_search_text(coalesce(p_query, ''))
  );

  IF v_norm = '' OR length(v_norm) < 3 THEN
    RETURN;
  END IF;

  -- Count meaningful tokens (>=3 chars, non-stopword) to decide path.
  SELECT count(*) INTO v_meaningful_count
  FROM regexp_split_to_table(v_norm, '[[:space:]]+') AS s(token)
  WHERE length(public.normalize_search_text(s.token)) >= 3
    AND NOT EXISTS (
      SELECT 1 FROM public.search_stopwords w
      WHERE public.normalize_search_text(w.word) =
            public.normalize_search_text(s.token)
    );

  IF v_meaningful_count = 0 THEN
    RETURN;
  END IF;

  -- >5 meaningful tokens: delegate to existing v2_intent_typo once.
  IF v_meaningful_count > 5 THEN
    RETURN QUERY
    SELECT l.*
    FROM public.search_listings_v2_intent_typo(
      p_query, p_market, v_limit, v_offset,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs
    ) AS l;
    RETURN;
  END IF;

  -- 1-5 meaningful tokens: progressive relaxation.
  FOR v_subset IN
    SELECT s.attempt_no, s.subset_tokens
    FROM public.search_relaxed_subsets(v_norm) AS s
    ORDER BY s.attempt_no
  LOOP
    -- Step A: does this subset have ANY match (ignoring pagination)?
    SELECT EXISTS (
      SELECT 1
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND public.listing_passes_filters(
          l, p_category_slug, p_subcategory_slug,
          p_min_price, p_max_price,
          p_city, p_neighborhood, p_attrs
        )
        AND NOT EXISTS (
          SELECT 1
          FROM unnest(v_subset.subset_tokens) AS required(token)
          WHERE strpos(
            public.normalize_search_text(coalesce(l.search_text, '')),
            public.normalize_search_text(required.token)
          ) = 0
        )
    ) INTO v_has_any;

    -- Step B: this is the winning subset. Return its paginated rows.
    -- Even if pagination yields 0 rows, do NOT fall through.
    IF v_has_any THEN
      RETURN QUERY
      SELECT l.*
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (p_market IS NULL OR l.country_code = upper(p_market))
        AND public.listing_passes_filters(
          l, p_category_slug, p_subcategory_slug,
          p_min_price, p_max_price,
          p_city, p_neighborhood, p_attrs
        )
        AND NOT EXISTS (
          SELECT 1
          FROM unnest(v_subset.subset_tokens) AS required(token)
          WHERE strpos(
            public.normalize_search_text(coalesce(l.search_text, '')),
            public.normalize_search_text(required.token)
          ) = 0
        )
      ORDER BY l.created_at DESC, l.id ASC
      LIMIT v_limit OFFSET v_offset;

      RETURN;
    END IF;
  END LOOP;

  RETURN;
END;
$function$;

COMMENT ON FUNCTION public.search_relaxed_subsets(text) IS
  'Generates at most four deterministic subsets, preserving the first meaningful token.';

COMMENT ON FUNCTION public.search_listings_v3_relaxed(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb
) IS
  'Experimental progressive relaxation RPC. Strict token AND per subset; first non-empty subset wins.';

GRANT EXECUTE ON FUNCTION public.search_relaxed_subsets(text)
  TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.search_listings_v3_relaxed(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb
) TO anon, authenticated;

COMMIT;
