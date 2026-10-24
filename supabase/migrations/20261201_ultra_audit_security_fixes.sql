-- PART 1: Secure Admin Table
alter table public.admins enable row level security;
drop policy if exists "allow_all_admins" on public.admins;

-- PART 2: Fix Rate Limit Concurrency (Listings)
create or replace function public.check_listing_rate_limit()
returns trigger language plpgsql security definer set search_path to 'public' as $$
declare recent_count integer;
begin
  perform pg_advisory_xact_lock(hashtext(new.user_id::text));

  select count(*) into recent_count
    from public.listings
    where user_id = new.user_id
      and created_at > now() - interval '1 hour';

  if recent_count >= 20 then
    raise exception 'Rate limit: max 20 listings per hour';
  end if;
  return new;
end;
$$;

-- PART 3: Fix Phone Reveal Concurrency
create or replace function public.get_listing_phone(p_listing_id uuid)
returns text
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  v_phone text;
  v_reveal_count int;
begin
  perform pg_advisory_xact_lock(hashtext(auth.uid()::text));

  select count(*) into v_reveal_count
  from public.phone_reveal_logs
  where user_id = auth.uid() and revealed_at > now() - interval '24 hours';

  if v_reveal_count >= 20 then
    raise exception 'RATE_LIMIT_EXCEEDED' using errcode = 'P0001';
  end if;

  select seller_phone into v_phone
  from public.listings
  where id = p_listing_id and status = 'active' and is_demo = false;

  if v_phone is not null then
    insert into public.phone_reveal_logs (user_id, listing_id) values (auth.uid(), p_listing_id);
  end if;

  return v_phone;
end;
$$;
