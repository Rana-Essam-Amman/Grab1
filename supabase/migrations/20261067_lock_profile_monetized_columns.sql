-- 20261067_lock_profile_monetized_columns.sql
-- Column-level lockdown of profiles: authenticated users can only write
-- the fields the frontend actually sets. vip_store, vip_store_expires_at,
-- rating_avg, rating_count, created_at, updated_at are removed from the
-- client write surface.
--
-- Reason: RLS restricts rows (auth.uid() = id) but does not restrict
-- columns. Table-level INSERT/UPDATE grant exposes every column. Any
-- signed-in user could self-grant VIP status or fake their rating.
--
-- Legitimate writers of the excluded columns:
--   vip_store, vip_store_expires_at → apply_premium_purchase (SECDEF)
--   rating_avg, rating_count         → refresh_seller_rating (trigger)
--   created_at                       → DEFAULT now()
--   updated_at                       → profiles_set_updated_at (trigger)
-- All run as postgres → unaffected by client grants.
--
-- Column lists are computed dynamically to tolerate schema drift in CI.

begin;

-- 1. Revoke table-level INSERT and UPDATE (removes blanket write access)
revoke insert, update on table public.profiles from authenticated;

-- 2. Revoke column-level INSERT/UPDATE on every existing column
do $$
declare
  v_cols text;
begin
  select string_agg(quote_ident(column_name), ', ')
  into v_cols
  from information_schema.columns
  where table_schema = 'public' and table_name = 'profiles';

  if v_cols is not null then
    execute format(
      'revoke insert (%s) on table public.profiles from authenticated',
      v_cols
    );
    execute format(
      'revoke update (%s) on table public.profiles from authenticated',
      v_cols
    );
  end if;
end $$;

-- 3. Grant column-level INSERT for the columns the frontend actually writes
do $$
declare
  v_cols text;
begin
  select string_agg(quote_ident(c), ', ')
  into v_cols
  from unnest(array[
    'id', 'first_name', 'last_name', 'nickname', 'avatar_url',
    'country_code', 'feed_layout', 'browse_market', 'phone', 'phone_locked'
  ]) as c
  where exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles'
      and column_name = c
  );

  if v_cols is not null then
    execute format(
      'grant insert (%s) on table public.profiles to authenticated',
      v_cols
    );
  end if;
end $$;

-- 4. Grant column-level UPDATE for the columns the frontend actually writes
--    (id is a PK and never updated)
do $$
declare
  v_cols text;
begin
  select string_agg(quote_ident(c), ', ')
  into v_cols
  from unnest(array[
    'first_name', 'last_name', 'nickname', 'avatar_url',
    'country_code', 'feed_layout', 'browse_market', 'phone', 'phone_locked'
  ]) as c
  where exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles'
      and column_name = c
  );

  if v_cols is not null then
    execute format(
      'grant update (%s) on table public.profiles to authenticated',
      v_cols
    );
  end if;
end $$;

commit;
