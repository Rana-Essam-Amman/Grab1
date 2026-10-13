-- 20261051_intent_categories_cleanup.sql
-- Session 11 — remove over-generic keywords from intent map.
--
-- Bug: Query "بدي طاولة للحديقة" returned L-Shape Sofa (furniture) and
-- excluded Garden Table (home-garden). Root cause: detect_query_category
-- matched "طاولة" → furniture. The category_hint was passed as
-- p_category_slug to search_listings_v2_intent, which then filtered out
-- any listing not in category_slug = 'furniture'.
--
-- "طاولة" (table) and "table" are generic — they exist in furniture,
-- home-garden, and other subcategories. Matching them to a single
-- category_hint is wrong. Removing them lets other query tokens
-- ("حديقة" → home-garden) drive the hint.
--
-- Also adds garden keywords that were missing.

begin;

-- Remove over-generic keywords
delete from public.search_intent_categories
where keyword in ('طاولة', 'table', 'طاوله');

-- Add home-garden keywords
insert into public.search_intent_categories (keyword, category_slug) values
  ('حديقة', 'home-garden'),
  ('حدائق', 'home-garden'),
  ('حدايق', 'home-garden'),
  ('حديقه', 'home-garden'),
  ('garden', 'home-garden'),
  ('outdoor', 'home-garden'),
  ('terrace', 'home-garden'),
  ('تراس', 'home-garden'),
  ('تراس', 'home-garden')
on conflict (keyword) do update set category_slug = excluded.category_slug;

commit;
