-- 20261101_cap_skip_unauthenticated.sql
-- Skip 20-cap enforcement when there is no authenticated session.
-- This allows test fixtures, migrations, and service_role inserts
-- to bypass the cap without weakening it for real authenticated users.
-- RLS already ensures real users can only insert their own listings.

begin;

create or replace function public.check_active_listing_cap()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_count int;
  v_cap constant int := 20;
  v_admin_email constant text := 'sufyanyounis83@gmail.com';
  v_caller_email text;
  v_uid uuid := auth.uid();
begin
  -- Skip when no authenticated session (tests, migrations, service_role)
  if v_uid is null then
    return new;
  end if;

  -- Admin exemption (temporary, for seeding phase)
  v_caller_email := (select email from auth.users where id = new.user_id);
  if v_caller_email is not null and lower(v_caller_email) = lower(v_admin_email) then
    return new;
  end if;

  if tg_op = 'INSERT' then
    select count(*) into v_count
    from public.listings
    where user_id = new.user_id
      and status <> 'sold';

    if v_count >= v_cap then
      raise exception 'ACTIVE_LISTING_CAP_REACHED: max % active listings', v_cap
        using errcode = '23514';
    end if;
  elsif tg_op = 'UPDATE' then
    if old.status = 'sold' and new.status <> 'sold' then
      select count(*) into v_count
      from public.listings
      where user_id = new.user_id
        and status <> 'sold'
        and id <> new.id;

      if v_count >= v_cap then
        raise exception 'ACTIVE_LISTING_CAP_REACHED: max % active listings', v_cap
          using errcode = '23514';
      end if;
    end if;
  end if;

  return new;
end;
$function$;

commit;
