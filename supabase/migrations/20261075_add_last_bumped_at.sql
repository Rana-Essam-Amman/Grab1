-- 20261075_add_last_bumped_at.sql
-- Fix missing column referenced by bump_listing and apply_premium_purchase.
--
-- Root cause: migration 20261010 created the listings table without
-- last_bumped_at, but the bump_listing function (old and new versions)
-- and apply_premium_purchase (Turbo branch) reference it. Regular bumps
-- and Turbo purchases fail with 42703 in production.
--
-- Idempotent: guarded by IF NOT EXISTS.

begin;

alter table public.listings
  add column if not exists last_bumped_at timestamptz;

comment on column public.listings.last_bumped_at is
  'Timestamp of the most recent bump. Updated by bump_listing() and the Turbo branch of apply_premium_purchase().';

commit;
