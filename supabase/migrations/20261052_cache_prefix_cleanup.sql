-- 20261052_cache_prefix_cleanup.sql
-- Session 11 — remove prefix-typed cache entries.
--
-- Cache pollution: typing "بدي سيارة كيا" letter by letter created one
-- row per prefix within seconds (بدي / بدي س / بدي سي / ...). The 600ms
-- debounce (20261051 commit) prevents future pollution; this migration
-- cleans up existing prefix rows.
--
-- Rule: delete entry A if another entry B exists such that:
--   - B starts with A (A is a prefix of B)
--   - B is strictly longer than A
--   - |B.updated_at - A.updated_at| <= 5 minutes (same typing session)
--   - B.normalized_query <> A.normalized_query (safety)
--
-- Only the shorter/older prefixes are removed. The longest completion
-- entry in each session survives. Queries typed on different sessions
-- (outside the 5-minute window) are preserved even if one is a prefix
-- of the other.

begin;

delete from public.search_query_embeddings a
where exists (
  select 1
  from public.search_query_embeddings b
  where b.normalized_query <> a.normalized_query
    and starts_with(b.normalized_query, a.normalized_query)
    and length(b.normalized_query) > length(a.normalized_query)
    and abs(extract(epoch from (b.updated_at - a.updated_at))) <= 300
);

commit;
