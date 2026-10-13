-- 20261049_v2_intent_always.sql
-- Session 10 — C3.3: apply intent filter regardless of stopword presence.
--
-- Bug observed in production 2026-10-13:
--   "فيه شقة للايجار؟" → villa + Abdoun apt + Shmeisani apt (3 rows)
--   "بدي شقة للايجار" → Shmeisani apt only (1 row)         [correct]
--
-- Root cause: search_listings_v2_intent delegated to v2 unchanged when
-- the query contained no stopword. "فيه" is not in search_stopwords, so
-- the rental intent was never applied and the villa (has_sale=true) leaked.
--
-- Fix: when intent is detected, always apply the contradiction filter,
-- regardless of stopword presence. When no intent, delegate to v2 as
-- before (identical behavior).

begin;

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

  -- No intent: delegate to v2 unchanged.
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

  -- Intent but unknown contradiction kind: delegate to v2 unchanged.
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

  -- Intent detected: always apply the contradiction filter.
  -- Fetch deeper from v2 to compensate for filtered-out rows.
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
  'Wrapper around search_listings_v2. Applies intent hard filter whenever an intent is detected, regardless of stopword presence. v1 and v2 untouched.';

commit;
