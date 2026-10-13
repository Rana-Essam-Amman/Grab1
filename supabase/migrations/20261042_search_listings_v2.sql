-- 20261042_search_listings_v2.sql
-- Session 10 — C2 Part 2/2: parallel search function.
--
-- Does NOT modify search_listings. Adds search_listings_v2 as an
-- independent function. Frontend keeps calling search_listings until
-- A/B results prove v2 superiority. Rollback = keep frontend as-is.
--
-- Differences from v1:
--   1. FTS-OR fallback — runs only when the query contains a stopword.
--      Token match uses LIKE OR over meaningful tokens (>= 3 chars,
--      non-stopword). This is an intentional design choice: to_tsquery
--      on Arabic is unreliable without custom dictionaries, and LIKE
--      over the already-normalized search_text column is equivalent.
--   2. Trigram guard uses search_text_has_all_tokens_v2 (ignores
--      stopwords and short tokens).
--   3. Final LIKE fallback uses search_text_has_all_tokens_v2.
--
-- Preserved (unchanged from v1):
--   - 11-arg signature (positional compatible with search_listings)
--   - SECURITY DEFINER + search_path = public
--   - Empty / < 3 char early return
--   - Single-char branch
--   - FTS-AND with expand_search_keywords
--   - Synonym retry via expand_search_query_synonyms
--   - Trigram fallback (word_similarity > 0.5)
--   - listing_passes_filters on every branch
--   - Multi-token AND guard for the non-stopword path

create or replace function public.search_listings_v2(
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
stable
security definer
set search_path = public
as $function$
declare
  v_norm text;
  v_query text;
  v_syn_query text;
  v_tsq tsquery;
  v_syn_tsq tsquery;
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_chars text[];
  v_has_stopword boolean;
begin
  v_norm := btrim(public.normalize_search_text(coalesce(p_query, '')));

  if v_norm = '' or length(v_norm) < 3 then
    return;
  end if;

  v_query := public.expand_search_keywords(v_norm);
  v_chars := public.search_character_array(v_norm);
  v_has_stopword := public.query_has_stopword(v_norm);

  -- 1) Single-char branch
  if cardinality(v_chars) = 1 and length(v_norm) >= 3 then
    if exists (
      select 1 from public.listings as l
      where l.status = 'active'
        and (p_market is null or l.country_code = upper(p_market))
        and l.search_chars @> v_chars
        and public.listing_passes_filters(l,
          p_category_slug, p_subcategory_slug,
          p_min_price, p_max_price,
          p_city, p_neighborhood, p_attrs)
    ) then
      return query
      select l.* from public.listings as l
      where l.status = 'active'
        and (p_market is null or l.country_code = upper(p_market))
        and l.search_chars @> v_chars
        and public.listing_passes_filters(l,
          p_category_slug, p_subcategory_slug,
          p_min_price, p_max_price,
          p_city, p_neighborhood, p_attrs)
      order by l.created_at desc, l.id asc
      limit v_limit offset v_offset;
      return;
    end if;
  end if;

  -- 2) FTS-AND
  v_tsq := public.build_prefix_tsquery(v_query);

  if v_tsq is not null and exists (
    select 1 from public.listings as l
    where l.status = 'active'
      and (p_market is null or l.country_code = upper(p_market))
      and l.fts @@ v_tsq
      and public.listing_passes_filters(l,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs)
  ) then
    return query
    select l.* from public.listings as l
    where l.status = 'active'
      and (p_market is null or l.country_code = upper(p_market))
      and l.fts @@ v_tsq
      and public.listing_passes_filters(l,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs)
    order by ts_rank_cd(l.fts, v_tsq) desc, l.created_at desc, l.id asc
    limit v_limit offset v_offset;
    return;
  end if;

  -- 3) Synonym retry
  v_syn_query := public.expand_search_keywords(
    public.expand_search_query_synonyms(v_norm)
  );
  v_syn_tsq := public.build_prefix_tsquery(v_syn_query);

  if v_syn_query <> v_query
     and v_syn_tsq is not null
     and exists (
       select 1 from public.listings as l
       where l.status = 'active'
         and (p_market is null or l.country_code = upper(p_market))
         and l.fts @@ v_syn_tsq
         and public.listing_passes_filters(l,
           p_category_slug, p_subcategory_slug,
           p_min_price, p_max_price,
           p_city, p_neighborhood, p_attrs)
     ) then
    return query
    select l.* from public.listings as l
    where l.status = 'active'
      and (p_market is null or l.country_code = upper(p_market))
      and l.fts @@ v_syn_tsq
      and public.listing_passes_filters(l,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs)
    order by ts_rank_cd(l.fts, v_syn_tsq) desc, l.created_at desc, l.id asc
    limit v_limit offset v_offset;
    return;
  end if;

  -- 4) FTS-OR fallback — NEW in v2. Only fires when the query contains
  --    at least one stopword. Uses LIKE OR over meaningful tokens from
  --    v_query (>= 3 chars, non-stopword). Ranks by match count.
  if v_has_stopword then
    if exists (
      select 1 from public.listings as l
      where l.status = 'active'
        and (p_market is null or l.country_code = upper(p_market))
        and public.listing_passes_filters(l,
          p_category_slug, p_subcategory_slug,
          p_min_price, p_max_price,
          p_city, p_neighborhood, p_attrs)
        and exists (
          select 1
          from regexp_split_to_table(v_query, '[[:space:]]+') as tok
          where tok <> ''
            and length(public.normalize_search_text(tok)) >= 3
            and public.normalize_search_text(tok) not in (
              select public.normalize_search_text(word)
              from public.search_stopwords
            )
            and public.normalize_search_text(l.search_text)
              like '%' || public.normalize_search_text(tok) || '%'
        )
    ) then
      return query
      select l.* from public.listings as l
      where l.status = 'active'
        and (p_market is null or l.country_code = upper(p_market))
        and public.listing_passes_filters(l,
          p_category_slug, p_subcategory_slug,
          p_min_price, p_max_price,
          p_city, p_neighborhood, p_attrs)
        and exists (
          select 1
          from regexp_split_to_table(v_query, '[[:space:]]+') as tok
          where tok <> ''
            and length(public.normalize_search_text(tok)) >= 3
            and public.normalize_search_text(tok) not in (
              select public.normalize_search_text(word)
              from public.search_stopwords
            )
            and public.normalize_search_text(l.search_text)
              like '%' || public.normalize_search_text(tok) || '%'
        )
      order by (
        select count(*)
        from regexp_split_to_table(v_query, '[[:space:]]+') as tok
        where tok <> ''
          and length(public.normalize_search_text(tok)) >= 3
          and public.normalize_search_text(tok) not in (
            select public.normalize_search_text(word)
            from public.search_stopwords
          )
          and public.normalize_search_text(l.search_text)
            like '%' || public.normalize_search_text(tok) || '%'
      ) desc, l.created_at desc, l.id asc
      limit v_limit offset v_offset;
      return;
    end if;
  end if;

  -- 5) Trigram fallback — v2 guard.
  if length(v_norm) >= 4 and exists (
    select 1 from public.listings as l
    where l.status = 'active'
      and (p_market is null or l.country_code = upper(p_market))
      and word_similarity(v_norm, l.search_text) > 0.5
      and public.search_text_has_all_tokens_v2(l.search_text, v_norm)
      and public.listing_passes_filters(l,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs)
  ) then
    return query
    select l.* from public.listings as l
    where l.status = 'active'
      and (p_market is null or l.country_code = upper(p_market))
      and word_similarity(v_norm, l.search_text) > 0.5
      and public.search_text_has_all_tokens_v2(l.search_text, v_norm)
      and public.listing_passes_filters(l,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs)
    order by word_similarity(v_norm, l.search_text) desc,
             l.created_at desc, l.id asc
    limit v_limit offset v_offset;
    return;
  end if;

  -- 6) Final LIKE fallback — v2 guard.
  return query
  select l.* from public.listings as l
  where l.status = 'active'
    and (p_market is null or l.country_code = upper(p_market))
    and public.normalize_search_text(l.search_text)
      like '%' || v_norm || '%'
    and public.search_text_has_all_tokens_v2(l.search_text, v_norm)
    and public.listing_passes_filters(l,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs)
  order by l.created_at desc, l.id asc
  limit v_limit offset v_offset;

  return;
end;
$function$;

comment on function public.search_listings_v2(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) is
  'Parallel search function for A/B testing. Same signature as search_listings. Adds stopword-gated FTS-OR fallback and v2 token guard.';

grant execute on function public.search_listings_v2(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) to anon, authenticated;
