-- 20261044_search_listings_v3_intent.sql
-- Session 10 — C3 iteration 2: hard intent exclusion.
--
-- v3 (20261043) applied intent as a soft ranking factor (× 0.3 when
-- missing). Diagnostic on 2026-10-13 showed that was insufficient: for
-- query "في شقة للإيجار؟" the villa (has_sale=true) and the Abdoun
-- apartment (has_sale=true) still ranked in the top 3.
--
-- This migration replaces search_listings_v3 with a version that treats
-- intent contradiction as a hard filter:
--   - query intent = rental → exclude listings whose search_text has "للبيع"
--   - query intent = sale   → exclude listings whose search_text has "للايجار"
--   - query intent = new    → exclude listings whose search_text has "مستعمل"
--   - query intent = used   → exclude listings whose search_text has "جديد"
--   - no intent detected    → no exclusion
--
-- Signature unchanged (11 args). v1 and v2 untouched.

begin;

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
  v_contradiction text;
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

  -- Natural-language path: intent detection, hard contradiction filter.
  v_intent := public.detect_query_intent(v_norm);

  v_contradiction := case v_intent
    when 'rental' then public.normalize_search_text('للبيع')
    when 'sale'   then public.normalize_search_text('للايجار')
    when 'new'    then public.normalize_search_text('مستعمل')
    when 'used'   then public.normalize_search_text('جديد')
    else null
  end;

  return query
  select l.*
  from public.listings l
  where l.status = 'active'
    and (p_market is null or l.country_code = upper(p_market))
    and public.listing_passes_filters(l,
      p_category_slug, p_subcategory_slug,
      p_min_price, p_max_price,
      p_city, p_neighborhood, p_attrs)
    and (
      v_contradiction is null
      or public.normalize_search_text(l.search_text)
         not like '%' || v_contradiction || '%'
    )
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
  ) desc, l.created_at desc, l.id asc
  limit v_limit offset v_offset;

  return;
end;
$function$;

comment on function public.search_listings_v3(
  text, text, integer, integer, text, text, numeric, numeric, text, text, jsonb
) is
  'Parallel search v3 (iteration 2). v1 behavior for non-stopword queries; intent-hard-excluded ranked FTS-OR for stopword queries.';

commit;
