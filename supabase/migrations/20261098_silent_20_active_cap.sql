-- 20261098_silent_20_active_cap.sql
-- Enforces max 20 active listings per user (advertised in UI).
-- Admin (Sufyanyounis83@gmail.com) is exempt for the seeding phase.
-- Active = status <> 'sold'.
-- Trigger fires on INSERT and on UPDATE when status transitions from
-- 'sold' to non-sold (prevents bypass by reactivating sold listings).

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
begin
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

drop trigger if exists listings_active_cap on public.listings;

create trigger listings_active_cap
  before insert or update on public.listings
  for each row execute function public.check_active_listing_cap();

create index if not exists idx_listings_user_active
  on public.listings (user_id) where status <> 'sold';

commit;
