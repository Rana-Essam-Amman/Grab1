-- 20261021_search_live_drift_reconciliation.sql
--
-- Purpose:
-- Reconcile checked-in migration source with verified live search behavior.
--
-- Restores:
-- 1. Short-query rejection (< 3 normalized characters).
-- 2. Search synonym retry through public.search_synonyms.
-- 3. Trigram fallback only for queries of at least 4 characters,
--    with word_similarity > 0.5.
-- 4. Stable tie-breaking by listing ID.
-- 5. Samsung Arabic/English synonym coverage.
--
-- IMPORTANT:
-- This migration must be tested in a disposable local/staging database
-- before any production deployment.

BEGIN;

-- ============================================================
-- 1. Ensure Samsung Arabic/English synonym coverage.
-- Preserve existing expansions and append only if missing.
-- ============================================================

INSERT INTO public.search_synonyms (term, expansions)
VALUES ('سامسونج', ARRAY['samsung']::text[])
ON CONFLICT (term) DO UPDATE
SET expansions =
  CASE
    WHEN 'samsung' = ANY(public.search_synonyms.expansions)
      THEN public.search_synonyms.expansions
    ELSE array_append(public.search_synonyms.expansions, 'samsung')
  END;

-- ============================================================
-- 2. Restore the live synonym query expansion function.
-- Maps one token to one alternate term, preferring:
-- - the first single-token expansion for a source term;
-- - otherwise, the source term matching an expansion.
-- ============================================================

CREATE OR REPLACE FUNCTION public.expand_search_query_synonyms(
  p_input text
)
RETURNS text
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  WITH tokens AS (
    SELECT token, ord
    FROM regexp_split_to_table(
      public.normalize_search_text(coalesce(p_input, '')),
      '[[:space:]]+'
    ) WITH ORDINALITY AS split(token, ord)
    WHERE token <> ''
  ),
  mapped AS (
    SELECT
      t.ord,
      coalesce(
        (
          SELECT public.normalize_search_text(e.expansion)
          FROM public.search_synonyms AS s
          CROSS JOIN LATERAL
            unnest(s.expansions)
            WITH ORDINALITY AS e(expansion, expansion_ord)
          WHERE public.normalize_search_text(s.term) = t.token
            AND e.expansion !~ '[[:space:]]'
            AND public.normalize_search_text(e.expansion) <> t.token
          ORDER BY e.expansion_ord
          LIMIT 1
        ),
        (
          SELECT public.normalize_search_text(s.term)
          FROM public.search_synonyms AS s
          CROSS JOIN LATERAL
            unnest(s.expansions) AS e(expansion)
          WHERE public.normalize_search_text(e.expansion) = t.token
            AND public.normalize_search_text(s.term) <> t.token
          ORDER BY s.term
          LIMIT 1
        ),
        t.token
      ) AS mapped_token
    FROM tokens AS t
  )
  SELECT coalesce(
    string_agg(mapped_token, ' ' ORDER BY ord),
    ''
  )
  FROM mapped;
$function$;

-- ============================================================
-- 3. Restore the verified live search RPC behavior.
-- ============================================================

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
  v_syn_query text;
  v_tsq tsquery;
  v_syn_tsq tsquery;
  v_limit integer :=
    greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer :=
    greatest(0, coalesce(p_offset, 0));
  v_chars text[];
BEGIN
  v_norm := btrim(
    public.normalize_search_text(coalesce(p_query, ''))
  );

  -- Reject empty and short ambiguous queries.
  IF v_norm = '' OR length(v_norm) < 3 THEN
    RETURN;
  END IF;

  v_query := public.expand_search_keywords(v_norm);
  v_chars := public.search_character_array(v_norm);

  -- Character-containment path for eligible queries.
  IF cardinality(v_chars) = 1 AND length(v_norm) >= 3 THEN
    IF EXISTS (
      SELECT 1
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (
          p_market IS NULL
          OR l.country_code = upper(p_market)
        )
        AND l.search_chars @> v_chars
    ) THEN
      RETURN QUERY
      SELECT l.*
      FROM public.listings AS l
      WHERE l.status = 'active'
        AND (
          p_market IS NULL
          OR l.country_code = upper(p_market)
        )
        AND l.search_chars @> v_chars
      ORDER BY l.created_at DESC, l.id ASC
      LIMIT v_limit OFFSET v_offset;

      RETURN;
    END IF;
  END IF;

  -- Primary prefix full-text search.
  v_tsq := public.build_prefix_tsquery(v_query);

  IF v_tsq IS NOT NULL AND EXISTS (
    SELECT 1
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (
        p_market IS NULL
        OR l.country_code = upper(p_market)
      )
      AND l.fts @@ v_tsq
  ) THEN
    RETURN QUERY
    SELECT l.*
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (
        p_market IS NULL
        OR l.country_code = upper(p_market)
      )
      AND l.fts @@ v_tsq
    ORDER BY
      ts_rank_cd(l.fts, v_tsq) DESC,
      l.created_at DESC,
      l.id ASC
    LIMIT v_limit OFFSET v_offset;

    RETURN;
  END IF;

  -- Retry using the maintained synonym table.
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
         AND (
           p_market IS NULL
           OR l.country_code = upper(p_market)
         )
         AND l.fts @@ v_syn_tsq
     ) THEN
    RETURN QUERY
    SELECT l.*
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (
        p_market IS NULL
        OR l.country_code = upper(p_market)
      )
      AND l.fts @@ v_syn_tsq
    ORDER BY
      ts_rank_cd(l.fts, v_syn_tsq) DESC,
      l.created_at DESC,
      l.id ASC
    LIMIT v_limit OFFSET v_offset;

    RETURN;
  END IF;

  -- Trigram fallback only for longer queries.
  IF length(v_norm) >= 4 AND EXISTS (
    SELECT 1
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (
        p_market IS NULL
        OR l.country_code = upper(p_market)
      )
      AND word_similarity(v_norm, l.search_text) > 0.5
  ) THEN
    RETURN QUERY
    SELECT l.*
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (
        p_market IS NULL
        OR l.country_code = upper(p_market)
      )
      AND word_similarity(v_norm, l.search_text) > 0.5
    ORDER BY
      word_similarity(v_norm, l.search_text) DESC,
      l.created_at DESC,
      l.id ASC
    LIMIT v_limit OFFSET v_offset;

    RETURN;
  END IF;

  -- Final normalized substring fallback.
  RETURN QUERY
  SELECT l.*
  FROM public.listings AS l
  WHERE l.status = 'active'
    AND (
      p_market IS NULL
      OR l.country_code = upper(p_market)
    )
    AND public.normalize_search_text(l.search_text)
      LIKE '%' || v_norm || '%'
  ORDER BY l.created_at DESC, l.id ASC
  LIMIT v_limit OFFSET v_offset;

  RETURN;
END;
$function$;

COMMIT;
