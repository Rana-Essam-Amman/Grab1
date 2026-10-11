-- Forward source-of-truth reconciliation (2026-10-11 corrective revision).
--
-- Purpose:
-- Bring a fresh application of checked-in migrations in line with the live
-- search_listings behavior verified by ChatGPT on hosted Supabase.
--
-- Preserved live paths (must not be removed):
-- 1. Early return for empty or normalized length < 3.
-- 2. expand_search_keywords on the primary query.
-- 3. Prefix full-text search (build_prefix_tsquery + fts @@).
-- 4. Synonym retry:
--      v_syn_query := expand_search_keywords(expand_search_query_synonyms(v_norm));
--      v_syn_tsq   := build_prefix_tsquery(v_syn_query);
--    executed only when the expanded query differs and matches exist.
-- 5. Trigram fallback only when length(v_norm) >= 4 AND word_similarity > 0.5.
-- 6. Final normalized substring fallback.
-- 7. status = 'active' and optional country_code = upper(p_market) filters.
-- 8. Stable tie-breakers (relevance, created_at, id).
--
-- Intentionally NOT done:
-- - No INSERT into search_keywords for a new "samsung" group.
--   Live uses group_key conventions such as "brand_toyota". Adding a
--   "samsung" group is not verified to affect expand_search_keywords
--   correctly and is unnecessary: live search_synonyms already maps
--   سامسونج → samsung, which the synonym retry path consumes.
-- - No weakening of the short-query or trigram guards.
--
-- ChatGPT must still compare this body to the live function definition
-- and migration ledger before any apply. If live already contains an
-- equivalent or stricter body, this migration is a no-op reconciliation
-- for local reproducibility only.
--
-- Execution status at authoring: local PostgreSQL was unavailable in the
-- execution environment. This SQL is statically reviewed only.

BEGIN;

-- ============================================================
-- 1. Idempotent Samsung synonym on search_synonyms only.
-- Live already has term = سامسونج, expansions containing samsung.
-- Do not touch search_keywords.
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
-- 2. Synonym-retry helper used by the live search path.
-- CREATE OR REPLACE so re-application is safe.
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
-- 3. search_listings — preserve verified live paths.
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
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_chars text[];
BEGIN
  v_norm := btrim(public.normalize_search_text(coalesce(p_query, '')));

  -- Empty and short ambiguous queries return no rows.
  IF v_norm = '' OR length(v_norm) < 3 THEN
    RETURN;
  END IF;

  v_query := public.expand_search_keywords(v_norm);
  v_chars := public.search_character_array(v_norm);

  -- Character-containment path (unreachable for length < 3).
  IF cardinality(v_chars) = 1 AND length(v_norm) >= 3 THEN
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
  ) THEN
    RETURN QUERY
    SELECT l.*
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.fts @@ v_tsq
    ORDER BY
      ts_rank_cd(l.fts, v_tsq) DESC,
      l.created_at DESC,
      l.id ASC
    LIMIT v_limit OFFSET v_offset;

    RETURN;
  END IF;

  -- Synonym retry: expand via search_synonyms, then keywords, then FTS.
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
     ) THEN
    RETURN QUERY
    SELECT l.*
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.fts @@ v_syn_tsq
    ORDER BY
      ts_rank_cd(l.fts, v_syn_tsq) DESC,
      l.created_at DESC,
      l.id ASC
    LIMIT v_limit OFFSET v_offset;

    RETURN;
  END IF;

  -- Trigram fallback only for sufficiently long queries.
  IF length(v_norm) >= 4 AND EXISTS (
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
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND public.normalize_search_text(l.search_text)
      LIKE '%' || v_norm || '%'
  ORDER BY l.created_at DESC, l.id ASC
  LIMIT v_limit OFFSET v_offset;

  RETURN;
END;
$function$;

COMMIT;
