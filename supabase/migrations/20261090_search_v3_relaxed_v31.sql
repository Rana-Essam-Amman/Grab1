-- 20261090_search_v3_relaxed_v31.sql
-- v3.1: bounded subsets (full set, then one-token omissions right-to-left)
-- plus v2_intent_typo fallback when no subset matches.
-- CREATE OR REPLACE only. Does not drop the functions. Does not touch v2.
--
-- bit_count() is used for mask ordering. Available in PostgreSQL 14+
-- (production is 17.11, CI is pg16). No length(replace(...)) fallback needed.

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
  v_min_size integer;
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

  -- N=0 or N>5: helper yields nothing. RPC decides the path.
  IF v_n = 0 OR v_n > 5 THEN
    RETURN;
  END IF;

  -- Real rule: keep the full set and the (N-1)-token omissions.
  -- Singletons are excluded. The EXIT below is only the hard cap.
  v_min_size := greatest(v_n - 1, 2);

  FOR v_mask IN
    SELECT m
    FROM generate_series(1, (1 << v_n) - 1) AS g(m)
    ORDER BY
      bit_count(m::bit(32)) DESC,
      m ASC
  LOOP
    SELECT array_agg(v_tokens[i] ORDER BY i)
    INTO v_subset
    FROM generate_series(1, v_n) AS g(i)
    WHERE (v_mask & (1 << (i - 1))) <> 0;

    IF coalesce(cardinality(v_subset), 0) < v_min_size THEN
      CONTINUE;
    END IF;

    v_attempt := v_attempt + 1;

    attempt_no := v_attempt;
    subset_tokens := v_subset;
    RETURN NEXT;

    EXIT WHEN v_attempt >= 5;
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
  v_any_subset_hit boolean := false;
BEGIN
  v_norm := btrim(
    public.normalize_search_text(coalesce(p_query, ''))
  );

  IF v_norm = '' OR length(v_norm) < 3 THEN
    RETURN;
  END IF;

  -- TECHNICAL DEBT: v3.1 re-normalizes the query in both the RPC and
  -- the helper. Deferred optimization: pass text[] directly to the
  -- helper. Revisit if latency regresses under A/B.
  SELECT count(*) INTO v_meaningful_count
  FROM regexp_split_to_table(v_norm, '[[:space:]]+') AS s(token)
  WHERE length(public.normalize_search_text(s.token)) >= 3
    AND NOT EXISTS (
      SELECT 1 FROM public.search_stopwords w
      WHERE public.normalize_search_text(w.word) =
            public.normalize_search_text(s.token)
    );

  -- Explicit decision: stopword-only / no meaningful tokens return
  -- empty. Do NOT fall back to v2.
  IF v_meaningful_count = 0 THEN
    RETURN;
  END IF;

  -- >5 meaningful tokens: preserve the direct-to-v2 path.
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

  FOR v_subset IN
    SELECT s.attempt_no, s.subset_tokens
    FROM public.search_relaxed_subsets(v_norm) AS s
    ORDER BY s.attempt_no
  LOOP
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

    IF v_has_any THEN
      v_any_subset_hit := true;

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

      -- Winning subset owns the page, even when offset is past the end.
      RETURN;
    END IF;
  END LOOP;

  -- No subset matched. Delegate to v2 with the original query and
  -- every original filter argument unchanged.
  IF NOT v_any_subset_hit THEN
    RETURN QUERY
    SELECT l.*
    FROM public.search_listings_v2_intent_typo(
      p_query, p_market, v_limit, v_offset,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs
    ) AS l;
  END IF;

  RETURN;
END;
$function$;

COMMENT ON FUNCTION public.search_relaxed_subsets(text) IS
  'v3.1 subsets: full token set, then one-token omissions in right-to-left order. Size >= greatest(N-1, 2). Hard cap 5. No singletons, no first-token anchoring.';

COMMENT ON FUNCTION public.search_listings_v3_relaxed(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb
) IS
  'v3.1 progressive relaxation. First non-empty subset wins and owns pagination. No-subset-match falls back to search_listings_v2_intent_typo with original args. Stopword-only returns empty.';

GRANT EXECUTE ON FUNCTION public.search_relaxed_subsets(text)
  TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.search_listings_v3_relaxed(
  text, text, integer, integer, text, text,
  numeric, numeric, text, text, jsonb
) TO anon, authenticated;

COMMIT;
