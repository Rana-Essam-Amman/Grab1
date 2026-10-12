-- 20261038_search_listings_filters.sql
-- Adds optional filter parameters to search_listings.
-- All new parameters default NULL, so existing 4-argument callers
-- (including the internal call inside search_listings_hybrid) keep working.
--
-- IMPORTANT: This migration is based on the 20261022 body
-- (search_short_query_hardening), NOT 20261020. The multi-token guard
-- search_text_has_all_tokens is preserved in both the trigram fallback and
-- the final normalized-substring fallback, so "Toyota Samsung" does not
-- match a Samsung-only listing.

drop function if exists public.search_listings(text, text, integer, integer);

create or replace function public.search_listings(
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
returns setof public.listings
language plpgsql
security definer
set search_path = public
as $function$
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
      SELECT l.*
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
    SELECT l.*
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
    SELECT l.*
    FROM public.listings AS l
    WHERE l.status = 'active'
      AND (p_market IS NULL OR l.country_code = upper(p_market))
      AND l.fts @@ v_syn_tsq
      AND public.listing_passes_filters(l, p_category_slug, p_subcategory_slug, p_min_price, p_max_price, p_city, p_neighborhood, p_attrs)
    ORDER BY ts_rank_cd(l.fts, v_syn_tsq) DESC, l.created_at DESC, l.id ASC
    LIMIT v_limit OFFSET v_offset;

    RETURN;
  END IF;

  -- Trigram fallback — multi-token guard preserved from 20261022.
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
    SELECT l.*
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

  -- Final normalized-substring fallback — multi-token guard preserved.
  RETURN QUERY
  SELECT l.*
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

comment on function public.search_listings(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) is
  'FTS search with optional server-side filters and preserved multi-token AND guard.';

grant execute on function public.search_listings(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) to anon, authenticated;
