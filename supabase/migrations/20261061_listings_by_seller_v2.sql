-- 20261061_listings_by_seller_v2.sql
-- Session 14 — D12 fix: handle phone keys by looking up the seller's user_id.
--
-- v1 matched phone keys against listings.seller_phone directly. That
-- returns only 1 row per phone because each listing can have a different
-- seller_phone (verification or local numbering). Meanwhile the seller's
-- actual identity is listings.user_id.
--
-- Root cause in production: users carry stale localStorage without
-- userId (schema fix lands for new writes only), so the chip passes
-- sellerPhone. The RPC then fails to find the other 16 listings.
--
-- v2 behavior:
--   - UUID key  → match user_id directly (unchanged).
--   - Phone key → look up DISTINCT user_id(s) sharing this phone, then
--     return all listings from any of them.
--
-- If the phone maps to no user_id, fall back to the direct phone match.

begin;

create or replace function public.listings_by_seller(
  p_seller_key text,
  p_market text default null,
  p_limit integer default 20,
  p_offset integer default 0
)
returns setof public.listings
language plpgsql
stable
security definer
set search_path = public
as $function$
declare
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
  v_offset integer := greatest(0, coalesce(p_offset, 0));
  v_key text;
  v_is_uuid boolean;
  v_user_ids uuid[];
begin
  v_key := btrim(coalesce(p_seller_key, ''));
  if v_key = '' then return; end if;

  v_is_uuid := v_key ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

  if v_is_uuid then
    return query
    select l.*
    from public.listings l
    where l.status = 'active'
      and (p_market is null or l.country_code = upper(p_market))
      and l.user_id = v_key::uuid
    order by l.created_at desc, l.id asc
    limit v_limit offset v_offset;
    return;
  end if;

  -- Phone key: find every user_id that ever used this phone.
  select array_agg(distinct l.user_id)
  into v_user_ids
  from public.listings l
  where l.seller_phone = v_key
    and l.user_id is not null;

  if v_user_ids is not null and array_length(v_user_ids, 1) > 0 then
    return query
    select l.*
    from public.listings l
    where l.status = 'active'
      and (p_market is null or l.country_code = upper(p_market))
      and l.user_id = any(v_user_ids)
    order by l.created_at desc, l.id asc
    limit v_limit offset v_offset;
    return;
  end if;

  -- No user_id found (orphan phone): fall back to direct match.
  return query
  select l.*
  from public.listings l
  where l.status = 'active'
    and (p_market is null or l.country_code = upper(p_market))
    and l.seller_phone = v_key
  order by l.created_at desc, l.id asc
  limit v_limit offset v_offset;
end;
$function$;

comment on function public.listings_by_seller(text, text, integer, integer) is
  'All active listings for a seller. UUID keys match user_id. Phone keys are resolved to user_id(s) first (falls back to direct phone match when orphan).';

commit;
