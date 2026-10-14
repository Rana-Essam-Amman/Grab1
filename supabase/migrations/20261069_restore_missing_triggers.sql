-- 20261069_restore_missing_triggers.sql
-- Restore 3 triggers defined in migration 20261010 but absent from
-- production. All three failed to apply silently at some point in the
-- migration chain. Same drift pattern observed today on other objects.
--
-- Impact of the drift:
--   listings_rate_limit            → unlimited listing creation by any user
--   listings_set_updated_at        → updated_at stale on every listing update
--                                     (compounded by C2 revoking updated_at
--                                     from the UPDATE grant)
--   seller_reviews_set_updated_at  → same staleness on seller_reviews
--
-- Functions already exist in production (check_listing_rate_limit,
-- set_updated_at). Only the triggers are missing.

begin;

-- 1. listings_rate_limit (BEFORE INSERT ON listings)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='listings'
      and column_name='user_id'
  ) then
    execute 'drop trigger if exists listings_rate_limit on public.listings';
    execute 'create trigger listings_rate_limit before insert on public.listings for each row execute function public.check_listing_rate_limit()';
  end if;
end $$;

-- 2. listings_set_updated_at (BEFORE UPDATE ON listings)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='listings'
      and column_name='updated_at'
  ) then
    execute 'drop trigger if exists listings_set_updated_at on public.listings';
    execute 'create trigger listings_set_updated_at before update on public.listings for each row execute function public.set_updated_at()';
  end if;
end $$;

-- 3. seller_reviews_set_updated_at (BEFORE UPDATE ON seller_reviews)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='seller_reviews'
      and column_name='updated_at'
  ) then
    execute 'drop trigger if exists seller_reviews_set_updated_at on public.seller_reviews';
    execute 'create trigger seller_reviews_set_updated_at before update on public.seller_reviews for each row execute function public.set_updated_at()';
  end if;
end $$;

commit;
