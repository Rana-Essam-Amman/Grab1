-- 20261040_search_query_normalize_rpc.sql
-- Session 10 — Cache normalization fix.
--
-- Root cause: supabase/functions/embed-query/index.ts used JS normalization
--   (NFKC + lowercase + whitespace collapse) to compute normalized_query,
--   while search RPCs call public.normalize_search_text() (unaccent + Arabic
--   hamza/taa normalization + diacritic strip). Result: cache MISS on any
--   query containing ة/أ/إ/آ/ى/ؤ/ئ or Arabic-Indic digits, despite a
--   semantically-equivalent row being cached.
--
-- Fix: expose SQL normalization as a stable RPC; embed-query calls it.
-- Backfill existing rows so historical cache entries become hit-able.

begin;

create or replace function public.normalize_search_query(p_query text)
returns text
language sql
immutable
parallel safe
as $func$
  select public.normalize_search_text(coalesce(p_query, ''));
$func$;

comment on function public.normalize_search_query(text) is
  'Canonical query normalization for search_query_embeddings. Must match normalize_search_text used by search RPCs.';

grant execute on function public.normalize_search_query(text)
  to anon, authenticated, service_role;

-- Backfill 1: drop older duplicates that collide after normalization.
delete from public.search_query_embeddings a
where exists (
  select 1
  from public.search_query_embeddings b
  where public.normalize_search_text(a.normalized_query)
      = public.normalize_search_text(b.normalized_query)
    and b.updated_at > a.updated_at
);

-- Backfill 2: normalize remaining keys in place.
update public.search_query_embeddings
set normalized_query = public.normalize_search_text(normalized_query)
where normalized_query <> public.normalize_search_text(normalized_query);

commit;
