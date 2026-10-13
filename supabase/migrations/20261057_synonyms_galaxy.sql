-- 20261057_synonyms_galaxy.sql
-- Session 12 — D7 follow-up: add missing Galaxy synonym.
--
-- Group H test "سامسونج جالاكسي" returned [] because:
--   - "سامسونج" already maps to "samsung" via search_synonyms
--   - "جالاكسي" has no synonym → stays as-is
--   - The listing title is English: "Samsung Galaxy S24 Plus"
--   - search_text_has_all_tokens_fuzzy cannot bridge جالاكسي → galaxy
--     (word_similarity ≈ 0, different scripts)
--
-- Fix: add a synonym group {galaxy, جالاكسي, جالكسي, جلاكسي} so
-- expand_search_keywords rewrites the query token.
--
-- search_synonyms structure (from 20261022 body): term → expansions[]
-- Confirm schema before applying; adjust if the actual column names differ.

begin;

insert into public.search_synonyms (term, expansions) values
  ('جالاكسي', array['galaxy']::text[]),
  ('جالكسي', array['galaxy']::text[]),
  ('جلاكسي', array['galaxy']::text[]),
  ('galaxy',  array['جالاكسي','جالكسي','جلاكسي']::text[])
on conflict (term) do update
  set expansions = (
    select array_agg(distinct e)
    from unnest(
      public.search_synonyms.expansions || excluded.expansions
    ) as e
  );

commit;
