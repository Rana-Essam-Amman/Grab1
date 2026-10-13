-- 20261060_listings_by_seller.sql
-- Session 14 — D12: list all active listings by a seller.
--
-- SellerProfileScreen currently filters the in-memory listings store
-- (which holds only the last page loaded for the home feed). Clicking a
-- seller chip shows at most the one listing the user came from.
--
-- Fix: expose an RPC that returns all active listings for a given
-- seller identifier (user_id when present, seller_phone otherwise),
-- filtered by market and paginated.
--
-- Mirrors the search RPCs' contract: same shape of filters (market,
-- limit, offset), SECURITY DEFINER, search_path locked, stable.

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
begin
  v_key := btrim(coalesce(p_seller_key, ''));
  if v_key = '' then return; end if;

  -- Detect UUID-shaped keys to match against user_id. Anything else is
  -- treated as a phone string (legacy listings).
  v_is_uuid := v_key ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

  return query
  select l.*
  from public.listings l
  where l.status = 'active'
    and (p_market is null or l.country_code = upper(p_market))
    and (
      (v_is_uuid and l.user_id = v_key::uuid)
      or (not v_is_uuid and l.seller_phone = v_key)
    )
  order by l.created_at desc, l.id asc
  limit v_limit
  offset v_offset;
end;
$function$;

comment on function public.listings_by_seller(text, text, integer, integer) is
  'All active listings for a seller (user_id if UUID-shaped key, seller_phone otherwise). Market-scoped, paginated.';

grant execute on function public.listings_by_seller(text, text, integer, integer)
  to anon, authenticated;

commit;
