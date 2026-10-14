-- 20261071_bump_listing_limit.sql
-- Enforce the daily bump limit server-side.
--
-- Current bump_listing increments bumps_today with no upper bound.
-- The 3/day free-tier limit exists only in src/data/monetization.ts
-- (freeLimits.bumpDailyLimit) and in the frontend helper
-- src/features/my-ads/helpers/bumpLimit.ts.
--
-- Production evidence: 0 users currently bumped today, so no rows are
-- reset. Exceeding users will start to be blocked on the next call.

begin;

create or replace function public.bump_listing(p_listing_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_count int;
  v_current int;
  v_limit constant int := 3;  -- matches MONETIZATION_MATRIX.freeLimits.bumpDailyLimit
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  -- Fetch today's bump count for this listing (0 if reset date is stale)
  select case
    when bumps_reset_date = current_date then bumps_today
    else 0
  end
  into v_current
  from public.listings
  where id = p_listing_id and user_id = auth.uid();

  if v_current is null then
    raise exception 'listing not found or not owned by user';
  end if;

  if v_current >= v_limit then
    raise exception 'Daily bump limit reached (% per day)', v_limit;
  end if;

  update public.listings
  set
    bumps_today = case
      when bumps_reset_date = current_date then bumps_today + 1
      else 1
    end,
    bumps_reset_date = current_date,
    last_bumped_at = now()
  where id = p_listing_id and user_id = auth.uid()
  returning bumps_today into v_new_count;

  return v_new_count;
end;
$$;

comment on function public.bump_listing(uuid) is
  'Increments the daily bump counter. Enforces 3/day free-tier limit matching src/data/monetization.ts.';

commit;
