-- ============================================================================
-- Admin Featured + Status Override
-- Allows admin to feature listings for free, unfeature, and change status.
-- Uses the same admin check pattern as other RPCs (auth.users lookup + lower).
-- ============================================================================

begin;

-- 1. Set Featured (Free)
create or replace function public.admin_set_featured_free(
  p_listing_id uuid,
  p_days int default 14
)
returns jsonb
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_expires timestamptz;
begin
  if v_uid is null then raise exception 'Unauthorized' using errcode = '42501'; end if;
  v_email := (select email from auth.users where id = v_uid);
  if v_email is null or lower(v_email) <> lower('Sufyanyounis83@gmail.com') then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;
  
  if p_days <= 0 or p_days > 365 then
    raise exception 'Invalid days' using errcode = '22023';
  end if;
  
  if not exists (select 1 from public.listings where id = p_listing_id) then
    raise exception 'Listing not found' using errcode = '22023';
  end if;
  
  v_expires := now() + (p_days || ' days')::interval;
  
  update public.listings
    set is_premium = true,
        premium_expires_at = v_expires
    where id = p_listing_id;
  
  return jsonb_build_object('success', true, 'listing_id', p_listing_id, 'expires_at', v_expires);
end;
$$;

grant execute on function public.admin_set_featured_free(uuid, int) to authenticated;

-- 2. Unset Featured
create or replace function public.admin_unset_featured(p_listing_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
begin
  if v_uid is null then raise exception 'Unauthorized' using errcode = '42501'; end if;
  v_email := (select email from auth.users where id = v_uid);
  if v_email is null or lower(v_email) <> lower('Sufyanyounis83@gmail.com') then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;
  
  update public.listings
    set is_premium = false,
        premium_expires_at = null
    where id = p_listing_id;
  
  return jsonb_build_object('success', true, 'listing_id', p_listing_id);
end;
$$;

grant execute on function public.admin_unset_featured(uuid) to authenticated;

commit;
