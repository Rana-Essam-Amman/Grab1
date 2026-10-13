-- 20261056_search_typo_tolerance.sql
-- Session 12 — C3.4: typo tolerance fallback.
--
-- Group H (typos) is the worst-performing group: 4% precision. Root
-- cause: the FTS-OR guard (search_text_has_all_tokens_v2) uses a LIKE
-- literal check per token, so "playstaton" never matches "playstation"
-- even though word_similarity is 0.73. The trigram fallback below it
-- only fires when the WHOLE query has word_similarity > 0.5 against
-- the whole search_text — impossible for multi-token Arabic queries.
--
-- Fix: two new functions, nothing existing is touched.
--   1. search_text_has_all_tokens_fuzzy — LIKE OR word_similarity per token
--   2. search_listings_v2_intent_typo — wrapper: calls v2_intent first,
--      falls back to fuzzy FTS-OR when it returns zero rows
--
-- v1 and v2_intent remain the production path. The typo wrapper is
-- parallel, frontend stays on v2_intent until A/B proves it.

begin;

-- 1) Fuzzy token guard — same shape as search_text_has_all_tokens_v2 but
--    accepts a token if either (a) it appears as a substring, or (b) its
--    trigram similarity to search_text is >= p_threshold.
create or replace function public.search_text_has_all_tokens_fuzzy(
  p_search_text text,
  p_norm_query text,
  p_threshold float8 default 0.4
)
returns boolean
language sql
stable
set search_path = public
as $func$
  with meaningful as (
    select public.normalize_search_text(tok) as tok
    from regexp_split_to_table(
      btrim(coalesce(p_norm_query, '')), '[[:space:]]+'
    ) as tok
    where tok <> ''
      and length(public.normalize_search_text(tok)) >= 3
      and public.normalize_search_text(tok) not in (
        select public.normalize_search_text(word)
        from public.search_stopwords
      )
  ),
  norm_text as (
    select public.normalize_search_text(coalesce(p_search_text, '')) as s
  )
  select
    not exists (select 1 from meaningful)
    or not exists (
      select 1
      from meaningful m
      cross join norm_text nt
      where nt.s not like '%' || m.tok || '%'
        and word_similarity(m.tok, nt.s) < p_threshold
    );
$func$;

comment on function public.search_text_has_all_tokens_fuzzy(text, text, float8) is
  'Fuzzy token guard. Token passes if LIKE match OR word_similarity >= threshold.';

grant execute on function public.search_text_has_all_tokens_fuzzy(text, text, float8)
  to anon, authenticated;

-- 2) Typo-tolerant wrapper. Calls v2_intent first. If zero rows returned,
--    runs a fuzzy FTS-OR over meaningful tokens. Same 11-arg signature.
create or replace function public.search_listings_v2_intent_typo(
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
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
begin
  v_norm := btrim(public.normalize_search_text(coalesce(p_query, '')));
  if v_norm = '' or length(v_norm) < 3 then return; end if;

  -- Path 1: existing v2_intent behavior (handles stopwords, intent,
  -- FTS-AND, synonym retry, FTS-OR). Covers Groups A–G when it fires.
  return query
    select * from public.search_listings_v2_intent(
      p_query, p_market, v_limit, v_offset,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs
    );

  if found then
    return;
  end if;

  -- Path 2: fuzzy fallback. Ranked by best per-token word_similarity.
  return query
  select l.*
  from public.listings l
  where l.status = 'active'
    and (p_market is null or l.country_code = upper(p_market))
    and public.listing_passes_filters(
      l,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs
    )
    and public.search_text_has_all_tokens_fuzzy(l.search_text, v_norm, 0.4)
  order by (
    select max(
      word_similarity(
        public.normalize_search_text(tok),
        public.normalize_search_text(l.search_text)
      )
    )
    from regexp_split_to_table(v_norm, '[[:space:]]+') as tok
    where tok <> ''
      and length(public.normalize_search_text(tok)) >= 3
      and public.normalize_search_text(tok) not in (
        select public.normalize_search_text(word)
        from public.search_stopwords
      )
  ) desc nulls last,
    l.created_at desc,
    l.id asc
  limit v_limit offset v_offset;
end;
$function$;

comment on function public.search_listings_v2_intent_typo(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) is
  'Typo-tolerant wrapper. v2_intent first; fuzzy FTS-OR fallback if empty. v1 and v2_intent untouched.';

grant execute on function public.search_listings_v2_intent_typo(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) to anon, authenticated;

commit;
