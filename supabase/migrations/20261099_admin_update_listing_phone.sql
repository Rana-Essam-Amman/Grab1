-- 20261099_admin_update_listing_phone.sql
-- Admin-only RPC to override seller_phone on any listing.
-- Used during seeding phase to post listings on behalf of real dealers/shops.
-- Does NOT touch profiles.phone — the dealer's number stays free for them
-- to register later. Does NOT violate profiles_phone_unique.

begin;

create or replace function public.admin_update_listing_phone(
  p_listing_id uuid,
  p_phone text
)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_clean_phone text;
begin
  -- Auth: admin only
  if v_uid is null then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;
  v_email := (select email from auth.users where id = v_uid);
  if v_email is null or lower(v_email) <> lower('Sufyanyounis83@gmail.com') then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  -- Validate listing exists
  if not exists (select 1 from public.listings where id = p_listing_id) then
    raise exception 'Listing not found';
  end if;

  -- Normalize phone if provided; empty string clears it
  v_clean_phone := btrim(coalesce(p_phone, ''));
  if v_clean_phone = '' then
    v_clean_phone := null;
  end if;

  -- Update listing.seller_phone only — never touches profiles.phone
  update public.listings
     set seller_phone = v_clean_phone
   where id = p_listing_id;
end;
$function$;

-- Grant execution to authenticated (function itself enforces admin email check)
revoke execute on function public.admin_update_listing_phone(uuid, text) from public, anon;
grant execute on function public.admin_update_listing_phone(uuid, text) to authenticated;

commit;
