-- 20261048_search_v2_intent.sql
-- Session 10 — C3.2: v2 + intent hard filter.
--
-- Reintroduces intent detection (dropped in 20261046 after C3 failure)
-- and adds a wrapper that calls v2 as the retrieval layer, then filters
-- intent contradictions BEFORE pagination.
--
-- Difference from abandoned v3 (20261043/44/45):
--   v3: reimplemented retrieval (FTS-OR direct) → 5 violations, no gain.
--   v3.2: delegates retrieval entirely to v2, then filters. v2's
--         FTS-AND / synonym retry / category-hint layers are preserved.
--
-- Design:
--   - No intent detected → call v2 unchanged (identical to v2).
--   - Intent detected → fetch up to 5x limit from v2, drop contradicting
--     rows, take the top v_limit.
--   - Signature matches v1/v2 (11 args).
--   - v1 and v2 are untouched.

begin;

-- 1) Intent markers table (re-added)
create table if not exists public.search_intent_markers (
  marker text primary key,
  kind text not null check (kind in ('rental','sale','new','used'))
);

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

-- 2) Intent detector (with punctuation strip — same as 20261045)
create or replace function public.detect_query_intent(p_norm_query text)
returns text
language sql
stable
set search_path = public
as $func$
  select im.kind
  from regexp_split_to_table(
    btrim(coalesce(p_norm_query, '')), '[[:space:]]+'
  ) as raw_tok
  cross join lateral (
    select public.normalize_search_text(
      regexp_replace(raw_tok, '[[:punct:]]+', '', 'g')
    ) as tok
  ) as cleaned
  join public.search_intent_markers im
    on public.normalize_search_text(im.marker) = cleaned.tok
  where cleaned.tok <> ''
  limit 1;
$func$;

grant execute on function public.detect_query_intent(text)
  to anon, authenticated;

-- 3) Wrapper: v2 + intent hard filter
create or replace function public.search_listings_v2_intent(
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
  v_intent text;
  v_contradiction text;
  v_fetch_limit integer;
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
begin
  v_norm := btrim(public.normalize_search_text(coalesce(p_query, '')));
  if v_norm = '' or length(v_norm) < 3 then return; end if;

  v_intent := public.detect_query_intent(v_norm);

  -- No intent: delegate to v2 unchanged
  if v_intent is null then
    return query
      select l.* from public.search_listings_v2(
        p_query, p_market, v_limit, v_offset,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs
      ) as l;
    return;
  end if;

  v_contradiction := case v_intent
    when 'rental' then public.normalize_search_text('للبيع')
    when 'sale'   then public.normalize_search_text('للايجار')
    when 'new'    then public.normalize_search_text('مستعمل')
    when 'used'   then public.normalize_search_text('جديد')
    else null
  end;

  -- Intent but no contradiction token: delegate to v2
  if v_contradiction is null then
    return query
      select l.* from public.search_listings_v2(
        p_query, p_market, v_limit, v_offset,
        p_category_slug, p_subcategory_slug,
        p_min_price, p_max_price,
        p_city, p_neighborhood, p_attrs
      ) as l;
    return;
  end if;

  -- Fetch more from v2, filter contradictions, then paginate.
  v_fetch_limit := least(greatest(v_limit * 5, 30), 100);

  return query
  select l.*
  from public.search_listings_v2(
    p_query, p_market, v_fetch_limit, 0,
    p_category_slug, p_subcategory_slug,
    p_min_price, p_max_price,
    p_city, p_neighborhood, p_attrs
  ) as l
  where public.normalize_search_text(l.search_text)
        not like '%' || v_contradiction || '%'
  limit v_limit
  offset v_offset;
end;
$function$;

comment on function public.search_listings_v2_intent(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) is
  'Wrapper around search_listings_v2. Adds intent hard filter for rental/sale/new/used. v1 and v2 untouched.';

grant execute on function public.search_listings_v2_intent(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) to anon, authenticated;

commit;
