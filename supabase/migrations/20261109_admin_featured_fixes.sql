-- ============================================================================
-- Fixes for Admin Featured & Status RPCs
-- 1. admin_set_featured_free: reject p_days = NULL (bypassing bounds check)
-- 2. admin_unset_featured: add explicit listing existence check
-- ============================================================================

begin;

-- 1. Fix admin_set_featured_free (add NULL check)
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
  
  -- Added IS NULL check to prevent NULL bypass
  if p_days is null or p_days <= 0 or p_days > 365 then
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

-- 2. Fix admin_unset_featured (add listing existence check)
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
  
  -- Added listing existence check
  if not exists (select 1 from public.listings where id = p_listing_id) then
    raise exception 'Listing not found' using errcode = '22023';
  end if;
  
  update public.listings
    set is_premium = false,
        premium_expires_at = null
    where id = p_listing_id;
  
  return jsonb_build_object('success', true, 'listing_id', p_listing_id);
end;
$$;

commit;
