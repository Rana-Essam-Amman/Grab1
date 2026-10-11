-- Forward reconciliation migration: align checked-in search_listings with
-- the live Supabase behavior verified on 2026-10-11.
--
-- Live protections (from prior direct inspection):
-- - Normalized queries shorter than 3 characters return no results.
-- - Trigram fallback only for length >= 4 with word_similarity > 0.5.
-- - Synonym expansion is applied before ranking paths.
--
-- This migration does not rewrite history. It is a forward additive/corrective
-- change that can be reviewed against the current live function before apply.
-- ChatGPT must verify the live function definition and migration ledger first.

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

  -- Short-query guard matching live verified behavior.
  IF v_norm = '' OR length(v_norm) < 3 THEN
    RETURN;
  END IF;

  v_query := public.expand_search_keywords(v_norm);
  v_chars := public.search_character_array(v_norm);

  -- Single-character path is unreachable under the <3 guard; retained for compatibility.
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
      ORDER BY l.created_at DESC, l.id
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
        l.created_at DESC,
        l.id
      LIMIT v_limit OFFSET v_offset;

      RETURN;
    END IF;
  END IF;

  -- Trigram fallback: only for sufficiently long queries.
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
        l.created_at DESC,
        l.id
      LIMIT v_limit OFFSET v_offset;

      RETURN;
    END IF;
  END IF;

  -- Final substring fallback only for queries that passed the length guard.
  RETURN QUERY
  SELECT l.*
  FROM public.listings AS l
  WHERE l.status = 'active'
    AND (p_market IS NULL OR l.country_code = upper(p_market))
    AND public.normalize_search_text(l.search_text)
      LIKE '%' || v_norm || '%'
  ORDER BY l.created_at DESC, l.id
  LIMIT v_limit OFFSET v_offset;

  RETURN;
END;
$function$;

-- Seed a missing Arabic synonym for Samsung if the group does not already exist.
-- This is additive and safe to re-run.
INSERT INTO public.search_keywords (group_key, keyword)
SELECT 'samsung', kw
FROM (VALUES
  ('samsung'),
  ('سامسونج'),
  ('سامسونغ')
) AS t(kw)
WHERE NOT EXISTS (
  SELECT 1 FROM public.search_keywords
  WHERE group_key = 'samsung' AND keyword = t.kw
)
ON CONFLICT (group_key, keyword) DO NOTHING;

COMMENT ON FUNCTION public.search_listings IS
  'Hardened search: short normalized queries (<3 chars) return empty; trigram gated at length>=4 and similarity>0.5; synonym expansion via search_keywords.';
