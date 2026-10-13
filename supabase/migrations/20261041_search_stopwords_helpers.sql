-- 20261041_search_stopwords_helpers.sql
-- Session 10 — C2 Part 1/2: stopwords + v2 token guard.
--
-- Does NOT touch search_listings or search_text_has_all_tokens.
-- Adds new objects only. Safe to apply independently.

begin;

-- 1) Stopwords table — function words only. Separate from search_keywords
--    (which remains synonyms-only per Rule 14).
create table if not exists public.search_stopwords (
  word text primary key
);

comment on table public.search_stopwords is
  'Function words (colloquial Arabic + English) ignored by v2 token guard. Separate from search_keywords (synonyms).';

insert into public.search_stopwords (word) values
  ('بدي'),('شو'),('كم'),('في'),('عندك'),('مين'),('وين'),('هل'),('يا'),
  ('بس'),('كل'),('شي'),('اي'),('أي'),('هو'),('هي'),
  ('انا'),('أنا'),('انت'),('أنت'),('احنا'),('نحن'),('هم'),('هما'),
  ('من'),('الى'),('إلى'),('عن'),('مع'),('لي'),('لك'),('له'),('لها'),
  ('the'),('a'),('an'),('of'),('to'),('for'),('is'),('are'),('was'),
  ('were'),('be'),('been'),('with'),('and'),('or'),('in'),('on'),('at'),
  ('by'),('as'),('it'),('this'),('that'),('these'),('those')
on conflict (word) do nothing;

-- 2) v2 token guard — ignores stopwords and tokens < 3 chars.
--    If no meaningful tokens remain → TRUE (never block).
create or replace function public.search_text_has_all_tokens_v2(
  p_search_text text,
  p_norm_query text
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
  )
  select
    not exists (select 1 from meaningful)
    or not exists (
      select 1
      from meaningful m
      where public.normalize_search_text(coalesce(p_search_text, ''))
        not like '%' || m.tok || '%'
    );
$func$;

comment on function public.search_text_has_all_tokens_v2(text, text) is
  'Token guard that ignores stopwords and tokens < 3 chars. Used by search_listings_v2 only.';

grant execute on function public.search_text_has_all_tokens_v2(text, text)
  to anon, authenticated;

-- 3) Helper — detects whether a query contains any stopword.
--    Gates FTS-OR fallback in search_listings_v2.
create or replace function public.query_has_stopword(p_norm_query text)
returns boolean
language sql
stable
set search_path = public
as $func$
  select exists (
    select 1
    from regexp_split_to_table(
      btrim(coalesce(p_norm_query, '')), '[[:space:]]+'
    ) as tok
    where public.normalize_search_text(tok) in (
      select public.normalize_search_text(word)
      from public.search_stopwords
    )
  );
$func$;

comment on function public.query_has_stopword(text) is
  'TRUE if the normalized query contains any stopword. Gates FTS-OR fallback in search_listings_v2.';

grant execute on function public.query_has_stopword(text)
  to anon, authenticated;

commit;
