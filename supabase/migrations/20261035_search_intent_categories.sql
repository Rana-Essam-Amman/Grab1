-- 20261035_search_intent_categories.sql
-- Maps common Arabic/English query keywords to their implied category.
-- Solves the "سيارات returns villa" case: the villa's description mentions
-- "3 سيارات" (parking for 3 cars), so FTS matches it. Category inference
-- narrows results to the right vertical.
--
-- Two pieces:
--   1. search_intent_categories table (keyword → category_slug)
--   2. detect_query_category(text) returns text — the RPC the frontend
--      calls before search_listings_hybrid.

create table if not exists public.search_intent_categories (
  keyword text primary key,
  category_slug text not null
);

comment on table public.search_intent_categories is
  'Query keyword → implied category_slug. Used by detect_query_category.';

-- Seed: one row per (keyword, category). Idempotent via ON CONFLICT.
insert into public.search_intent_categories (keyword, category_slug) values
-- motors
('سيارة','motors'),('سيارات','motors'),('سياره','motors'),
('عربية','motors'),('عربيات','motors'),('موتر','motors'),
('car','motors'),('cars','motors'),('vehicle','motors'),
('كامري','motors'),('تويوتا','motors'),('كيا','motors'),('هيونداي','motors'),
('kia','motors'),('toyota','motors'),('hyundai','motors'),
-- real-estate
('شقة','real-estate'),('شقق','real-estate'),('شقه','real-estate'),
('فيلا','real-estate'),('فلل','real-estate'),('بيت','real-estate'),
('منزل','real-estate'),('أرض','real-estate'),('ارض','real-estate'),
('apartment','real-estate'),('apartments','real-estate'),
('villa','real-estate'),('house','real-estate'),('flat','real-estate'),
-- mobiles
('موبايل','mobiles'),('موبايلات','mobiles'),('هاتف','mobiles'),
('هواتف','mobiles'),('جوال','mobiles'),('جوالات','mobiles'),
('phone','mobiles'),('phones','mobiles'),('mobile','mobiles'),
('iphone','mobiles'),('galaxy','mobiles'),
-- electronics
('شاشة','electronics'),('شاشات','electronics'),('شاشه','electronics'),
('تلفزيون','electronics'),('tv','electronics'),('television','electronics'),
('ps5','electronics'),('بلايستيشن','electronics'),
-- computers
('لابتوب','computers'),('لابتوبات','computers'),
('laptop','computers'),('macbook','computers'),('computer','computers'),
-- furniture
('كنبة','furniture'),('كنبات','furniture'),('صالون','furniture'),
('طاولة','furniture'),('أثاث','furniture'),('اثاث','furniture'),
('sofa','furniture'),('table','furniture'),
-- watches
('ساعة','watches'),('ساعات','watches'),('watch','watches'),
('watches','watches'),('rolex','watches'),('seiko','watches'),('omega','watches'),
-- fashion
('ملابس','fashion'),('أزياء','fashion'),('حذاء','fashion'),
('shoes','fashion'),('clothes','fashion'),('fashion','fashion'),
-- home-garden
('حديقة','home-garden'),('garden','home-garden'),
-- pets
('كلب','pets'),('كلاب','pets'),('قط','pets'),('قطط','pets'),
('dog','pets'),('cat','pets'),('pets','pets'),
-- handymen (services)
('سباك','handymen'),('كهربائي','handymen'),('صيانة','handymen'),
('plumber','handymen'),('electrician','handymen')
on conflict (keyword) do update set category_slug = excluded.category_slug;

-- Detection function: returns the category implied by a query, or NULL.
-- Token-based match: normalizes the query, splits into tokens, matches
-- against normalized keywords. Picks the longest keyword on ties for
-- stability.
create or replace function public.detect_query_category(p_query text)
returns text
language plpgsql
stable
security definer
set search_path = public
as $func$
declare
  v_norm text;
  v_tokens text[];
  v_match text;
begin
  v_norm := public.normalize_search_text(coalesce(p_query, ''));
  if v_norm = '' then
    return null;
  end if;

  v_tokens := regexp_split_to_array(v_norm, '\s+');

  select sic.category_slug
    into v_match
    from public.search_intent_categories sic
   where public.normalize_search_text(sic.keyword) = any(v_tokens)
   order by length(sic.keyword) desc, sic.category_slug asc
   limit 1;

  return v_match;
end;
$func$;

comment on function public.detect_query_category(text) is
  'Returns the category_slug implied by a query, or NULL if none matches.';

revoke all on function public.detect_query_category(text) from public;
grant execute on function public.detect_query_category(text) to anon, authenticated;
