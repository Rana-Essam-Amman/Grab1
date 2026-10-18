-- 20261095_phone_uniqueness_ux.sql
-- Adds explicit duplicate phone checks to 3 RPCs so users/admins
-- get a clear error instead of a generic unique_violation.
-- Database-level UNIQUE INDEX (profiles_phone_unique) remains the
-- final guard; this layer only improves UX and prevents bad requests.

begin;

-- ============================================================
-- 1. set_initial_phone — explicit duplicate check
-- ============================================================
create or replace function public.set_initial_phone(p_phone text)
returns boolean
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_user_id uuid := auth.uid();
  v_country text;
  v_phone text;
  v_rows integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select country_code into v_country from public.profiles where id = v_user_id;
  v_country := coalesce(v_country, 'JO');
  v_phone := public.normalize_phone(p_phone, v_country);

  if v_phone is null then
    raise exception 'Invalid phone number' using errcode = '22023';
  end if;

  -- NEW: explicit duplicate check (clear error before hitting unique index)
  if exists (
    select 1 from public.profiles
    where phone = v_phone and id <> v_user_id
  ) then
    raise exception 'PHONE_ALREADY_USED' using errcode = '23505';
  end if;

  insert into public.profiles (id, phone, phone_locked)
  values (v_user_id, v_phone, true)
  on conflict (id) do update
    set phone = excluded.phone, phone_locked = true
    where public.profiles.phone is null
      and public.profiles.phone_locked = false;

  get diagnostics v_rows = row_count;
  return v_rows = 1;
end;
$function$;

-- ============================================================
-- 2. admin_approve_phone_change — explicit duplicate check
-- ============================================================
create or replace function public.admin_approve_phone_change(p_request_id uuid)
returns void
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_target_user_id uuid;
  v_new_phone text;
  v_country text;
  v_rows integer;
begin
  if v_uid is null then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  select email into v_email from auth.users where id = v_uid;
  if v_email is null or lower(v_email) <> lower('Sufyanyounis83@gmail.com') then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  select user_id, requested_phone
    into v_target_user_id, v_new_phone
    from public.phone_change_requests
   where id = p_request_id and status = 'pending'
   for update;

  if not found then
    raise exception 'Request not found or already processed.';
  end if;

  select country_code into v_country from public.profiles where id = v_target_user_id;
  v_country := coalesce(v_country, 'JO');
  v_new_phone := public.normalize_phone(v_new_phone, v_country);

  -- NEW: explicit duplicate check
  if exists (
    select 1 from public.profiles
    where phone = v_new_phone and id <> v_target_user_id
  ) then
    raise exception 'PHONE_ALREADY_USED' using errcode = '23505';
  end if;

  update public.profiles
     set phone = v_new_phone, phone_locked = true
   where id = v_target_user_id;

  get diagnostics v_rows = row_count;
  if v_rows <> 1 then
    raise exception 'Target profile not found.';
  end if;

  update public.phone_change_requests
     set status = 'approved',
         reviewed_at = now(),
         review_note = 'Approved via Admin RPC'
   where id = p_request_id and status = 'pending';

  if not found then
    raise exception 'Request was already processed.';
  end if;
end;
$function$;

-- ============================================================
-- 3. request_phone_change — explicit duplicate check at request time
-- NOTE: uses errcode 23514 (check_violation), NOT 23505, because the
-- function has a WHEN unique_violation handler that would swallow our
-- error and show "A pending phone-change request exists" instead.
-- ============================================================
create or replace function public.request_phone_change(p_requested_phone text, p_reason text)
returns uuid
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_user_id uuid := auth.uid();
  v_country text;
  v_reason text := btrim(coalesce(p_reason, ''));
  v_phone text;
  v_current_phone text;
  v_request_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select country_code into v_country from public.profiles where id = v_user_id;
  v_country := coalesce(v_country, 'JO');
  v_phone := public.normalize_phone(p_requested_phone, v_country);

  if v_phone is null then
    raise exception 'Invalid phone number' using errcode = '22023';
  end if;

  if length(v_reason) < 3 or length(v_reason) > 500 then
    raise exception 'Reason must be between 3 and 500 characters' using errcode = '22023';
  end if;

  select p.phone into v_current_phone from public.profiles as p where p.id = v_user_id;

  if v_current_phone is not null and v_current_phone = v_phone then
    raise exception 'Requested phone matches the current phone' using errcode = '22023';
  end if;

  -- NEW: explicit duplicate check (reject at request time, not at admin approval)
  if exists (
    select 1 from public.profiles
    where phone = v_phone and id <> v_user_id
  ) then
    raise exception 'PHONE_ALREADY_USED' using errcode = '23514';
  end if;

  insert into public.phone_change_requests
    (user_id, current_phone, requested_phone, reason, status)
  values
    (v_user_id, v_current_phone, v_phone, v_reason, 'pending')
  returning id into v_request_id;

  return v_request_id;
exception
  when unique_violation then
    raise exception 'A pending phone-change request already exists' using errcode = '23505';
end;
$function$;

commit;
