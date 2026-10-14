-- 20261068_lock_listing_monetized_columns.sql
-- Column-level lockdown of listings. Companion to 20261067 for profiles.
--
-- Root cause: RLS restricts rows (auth.uid() = user_id) but not columns.
-- Table-level INSERT/UPDATE grant exposes every column. Any signed-in
-- user could self-activate premium / bump counters / reset views.
--
-- Legitimate server-side writers (all SECDEF, run as postgres, unaffected):
--   is_premium, premium_expires_at, auto_bump_* → apply_premium_purchase
--   bumps_today, bumps_reset_date, last_bumped_at → bump_listing
--   fts, search_text, search_chars, search_version → set_listings_search_text
--   created_at, updated_at → DEFAULT / trigger
--
-- Column lists computed dynamically to tolerate schema drift in CI.

begin;

-- 1. Revoke table-level INSERT/UPDATE from authenticated + anon
revoke insert, update on table public.listings from authenticated, anon;

-- 2. Revoke column-level INSERT/UPDATE on every existing column
do $$
declare
  v_cols text;
begin
  select string_agg(quote_ident(column_name), ', ')
  into v_cols
  from information_schema.columns
  where table_schema = 'public' and table_name = 'listings';

  if v_cols is not null then
    execute format(
      'revoke insert (%s) on table public.listings from authenticated, anon',
      v_cols
    );
    execute format(
      'revoke update (%s) on table public.listings from authenticated, anon',
      v_cols
    );
  end if;
end $$;

-- 3. Grant column-level INSERT (createListing write surface)
do $$
declare
  v_cols text;
begin
  select string_agg(quote_ident(c), ', ')
  into v_cols
  from unnest(array[
    'user_id', 'title', 'description', 'price', 'currency', 'country_code',
    'city', 'neighborhood', 'category_slug', 'subcategory_slug', 'images',
    'image_width', 'image_height', 'attributes', 'seller_name', 'seller_phone'
  ]) as c
  where exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'listings' and column_name = c
  );

  if v_cols is not null then
    execute format(
      'grant insert (%s) on table public.listings to authenticated',
      v_cols
    );
  end if;
end $$;

-- 4. Grant column-level UPDATE (listing edit surface + status transitions)
do $$
declare
  v_cols text;
begin
  select string_agg(quote_ident(c), ', ')
  into v_cols
  from unnest(array[
    'title', 'description', 'price', 'currency', 'city', 'neighborhood',
    'category_slug', 'subcategory_slug', 'images', 'image_width', 'image_height',
    'attributes', 'seller_name', 'seller_phone', 'status'
  ]) as c
  where exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'listings' and column_name = c
  );

  if v_cols is not null then
    execute format(
      'grant update (%s) on table public.listings to authenticated',
      v_cols
    );
  end if;
end $$;

commit;
