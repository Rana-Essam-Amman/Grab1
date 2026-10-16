-- 20261097_search_v2_intent_stopword_guard.sql
-- Stopword-only queries must return zero rows from search_listings_v2_intent.
--
-- PROBLEM:
--   "من في" (all Arabic stopwords) returns incidental listings.
--   search_listings_v2_intent detects no intent and delegates to
--   search_listings_v2. The FTS-AND branch builds a tsquery from the
--   stopword tokens and matches any listing containing both, before the
--   stopword-aware FTS-OR fallback can run.
--
-- FIX:
--   After the existing empty/short-query early return, add a guard that
--   returns immediately when the normalized query has zero meaningful
--   tokens (length >= 3 and not a stopword). Same rules as
--   search_text_has_all_tokens_fuzzy.
--
-- CHOICE OF INSERTION POINT:
--   Inside search_listings_v2_intent, immediately after the existing
--   `if v_norm = '' or length(v_norm) < 3 then return; end if;`.
--   This is the earliest safe point: the query is already normalized,
--   short/empty cases are already handled, and the guard runs before
--   any intent detection or delegation to v2.
--
-- ROLLBACK: see comments at the end of this file.

begin;

-- Helper: true if the normalized query contains at least one meaningful token.
create or replace function public.query_has_meaningful_tokens(p_norm_query text)
returns boolean
language sql
stable
security definer
set search_path = public
as $func$
  select exists (
    select 1
    from regexp_split_to_table(
      btrim(coalesce(p_norm_query, '')), '[[:space:]]+'
    ) as tok
    where tok <> ''
      and length(public.normalize_search_text(tok)) >= 3
      and public.normalize_search_text(tok) not in (
        select public.normalize_search_text(word)
        from public.search_stopwords
      )
  );
$func$;

comment on function public.query_has_meaningful_tokens(text) is
  'True if the normalized query contains at least one token of length >= 3 that is not a stopword.';

grant execute on function public.query_has_meaningful_tokens(text)
  to anon, authenticated;

-- Replace search_listings_v2_intent with the guard added.
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

  -- Guard: zero meaningful tokens (all stopwords or all < 3 chars).
  if not public.query_has_meaningful_tokens(v_norm) then
    return;
  end if;

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

-- ROLLBACK PROCEDURE:
-- 1. Revert Phase B (frontend) first if it has been deployed.
-- 2. Drop the helper:
--    DROP FUNCTION IF EXISTS public.query_has_meaningful_tokens(text);
-- 3. Restore the original search_listings_v2_intent body from
--    supabase/migrations/20261049_v2_intent_always.sql.
