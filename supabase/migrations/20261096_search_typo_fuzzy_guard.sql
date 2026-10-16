-- 20261096_search_typo_fuzzy_guard.sql
-- Latent bug fix in search_text_has_all_tokens_fuzzy.
--
-- BUG: the function returned TRUE when the query produced zero meaningful
-- tokens (empty string, all tokens shorter than 3 characters, or all
-- stopwords). The expression was:
--   not exists (meaningful) OR not exists (failing tokens)
-- An empty meaningful set makes the first term TRUE, so the whole
-- predicate is TRUE. If the typo fallback is ever reached with a
-- stopword-only query it would match every active listing.
--
-- FIX: require at least one meaningful token. Empty meaningful set
-- now returns FALSE. All other matching logic is unchanged.
--
-- ROLLBACK: see comments at the end of this file.

begin;

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
    exists (select 1 from meaningful)
    and not exists (
      select 1
      from meaningful m
      cross join norm_text nt
      where nt.s not like '%' || m.tok || '%'
        and word_similarity(m.tok, nt.s) < p_threshold
    );
$func$;

comment on function public.search_text_has_all_tokens_fuzzy(text, text, float8) is
  'Fuzzy token guard. Returns false on zero meaningful tokens. Token passes if LIKE match OR word_similarity >= threshold.';

grant execute on function public.search_text_has_all_tokens_fuzzy(text, text, float8)
  to anon, authenticated;

commit;

-- ROLLBACK PROCEDURE:
-- 1. Revert Phase B (frontend) first.
-- 2. Then restore the original function body from
--    supabase/migrations/20261056_search_typo_tolerance.sql.
