-- 20261050_stopwords_colloquial_expansion.sql
-- Session 10 — expand search_stopwords with common Jordanian colloquial
-- function words that are not meaningful tokens.
--
-- Bug: "فيه شقة للايجار؟" returned 0 rows because "فيه" was not a
-- stopword. v2 then took the FTS-AND path, requiring all tokens to be
-- present in search_text. No listing contains "للايجار" (the Shmeisani
-- apartment says "للاجار"), so the AND failed and v2 returned nothing.
--
-- Fix: add "فيه" and other common function words so v2 goes to the
-- stopword-gated FTS-OR path, matching on the meaningful tokens only
-- ("شقه"), then the intent filter removes the villa and Abdoun apt.

begin;

insert into public.search_stopwords (word) values
  -- Possessive/existential forms of "في"
  ('فيه'),('فيها'),('فيهم'),('فيك'),('فيكن'),('فينا'),
  -- Possessive forms of "عند"
  ('عندكم'),('عندنا'),('عنده'),('عندها'),('عندهن'),('عندي'),
  -- Auxiliary forms of "بد"
  ('بدها'),('بدك'),('بدكم'),('بدنا'),('بدهم'),('بدي'),
  -- Politeness
  ('ممكن'),('لو'),('سمحت'),('لطفا'),('لو سمحت'),
  -- Deictic / time
  ('هسا'),('هلق'),('هيك'),('هاي'),('هاد'),('هدول'),('هادا'),('هذول'),
  -- Verbs of wanting/looking
  ('شوف'),('شوفي'),('دور'),('دوري'),('ابحث'),('ابحثي'),('حاب'),('حابة'),
  -- Also missing (formal)
  ('انا'),('انت'),('انتِ'),('احنا'),('انتم'),('هم'),('هن')
on conflict (word) do nothing;

commit;
