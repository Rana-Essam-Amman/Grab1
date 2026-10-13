-- 20261043_search_listings_v3.sql
-- Session 10 — C3: ranking improvements over v2.
--
-- Does NOT modify v1 or v2. Adds three things:
--   1. public.search_intent_markers — rental/sale/new/used markers
--   2. public.detect_query_intent — returns intent kind or NULL
--   3. public.search_listings_v3 — parallel ranking function
--
-- Design (see Session 10 agenda):
--   - Non-stopword queries: delegate entirely to v1 (exact behavior).
--   - Stopword queries: retrieve via v2's FTS-OR gate, then rerank by
--     (title_hits × 3 + body_hits), multiplied by:
--       - category_hint factor: 1.0 if matches, 0.5 otherwise
--       - intent factor: 1.0 if intent present or NULL, 0.3 if missing
--   - Weights chosen as starting point; will be validated via EVAL_SET.
--
-- Rationale for delegating to v1 when no stopword: prevents any behavior
-- drift on exact-match queries (e.g. "iPhone 15 Pro Max"), and keeps
-- v3's ranking logic scoped to the natural-language path only.

begin;

-- 1) Intent markers table
create table if not exists public.search_intent_markers (
  marker text primary key,
  kind text not null check (kind in ('rental','sale','new','used'))
);

comment on table public.search_intent_markers is
  'Query intent markers (rental/sale/new/used). Used by detect_query_intent.';

insert into public.search_intent_markers (marker, kind) values
  ('للإيجار','rental'),
  ('للايجار','rental'),
  ('إيجار','rental'),
  ('ايجار','rental'),
  ('للبيع','sale'),
  ('بيع','sale'),
  ('جديد','new'),
  ('مستعمل','used')
on conflict (marker) do nothing;

-- 2) Intent detector
create or replace function public.detect_query_intent(p_norm_query text)
returns text
language sql
stable
set search_path = public
as $func$
  select im.kind
  from regexp_split_to_table(
    btrim(coalesce(p_norm_query, '')), '[[:space:]]+'
  ) as tok
  join public.search_intent_markers im
    on public.normalize_search_text(im.marker)
     = public.normalize_search_text(tok)
  limit 1;
$func$;

comment on function public.detect_query_intent(text) is
  'Returns the intent kind (rental/sale/new/used) implied by a query, or NULL.';

grant execute on function public.detect_query_intent(text)
  to anon, authenticated;

-- 3) Parallel v3 search function
create or replace function public.search_listings_v3(
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
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_has_stopword boolean;
  v_intent text;
begin
  v_norm := btrim(public.normalize_search_text(coalesce(p_query, '')));
  if v_norm = '' or length(v_norm) < 3 then return; end if;

  v_query := public.expand_search_keywords(v_norm);
  v_has_stopword := public.query_has_stopword(v_norm);

  -- Fast path: no stopword → delegate entirely to v1 (identical behavior).
  if not v_has_stopword then
    return query
      select l.* from public.search_listings(
        p_query, p_market, v_limit, v_offset,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs
      ) as l;
    return;
  end if;

  -- Natural-language path: retrieve via FTS-OR (v2 gate), rerank.
  v_intent := public.detect_query_intent(v_norm);

  return query
  select l.*
  from public.listings l
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
    (
      (select count(*)
       from regexp_split_to_table(v_query, '[[:space:]]+') as tok
       where tok <> ''
         and length(public.normalize_search_text(tok)) >= 3
         and public.normalize_search_text(tok) not in (
           select public.normalize_search_text(word)
           from public.search_stopwords
         )
         and public.normalize_search_text(l.title)
           like '%' || public.normalize_search_text(tok) || '%'
      ) * 3
      +
      (select count(*)
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
    )::float8
    * case
        when p_category_slug is null or l.category_slug = p_category_slug
          then 1.0
        else 0.5
      end
    * case
        when v_intent is null then 1.0
        when public.normalize_search_text(l.search_text)
             like '%' || public.normalize_search_text(v_intent) || '%'
          then 1.0
        else 0.3
      end
  ) desc, l.created_at desc, l.id asc
  limit v_limit offset v_offset;

  return;
end;
$function$;

comment on function public.search_listings_v3(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) is
  'Parallel search v3. v1 behavior for non-stopword queries; ranked FTS-OR for stopword queries. Does not replace v1 or v2.';

grant execute on function public.search_listings_v3(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) to anon, authenticated;

commit;
