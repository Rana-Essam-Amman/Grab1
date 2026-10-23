-- ============================================================================
-- Fix F1: Enforce listing market (country_code) integrity on UPDATE
-- ----------------------------------------------------------------------------
-- Problem:
--   Migration 20261129 locked INSERT so a non-admin can only publish in their
--   own market. But the UPDATE policy from 20261104 ("listings_update_own_or_admin")
--   places no constraint on country_code, letting any owner move a published
--   listing to another market with a single client call:
--
--     await supabase.from('listings')
--       .update({ country_code: 'SA' })
--       .eq('id', '<own-listing-id>')
--
--   This re-opens the exact bypass that 20261129 closed on INSERT.
--
-- Fix:
--   BEFORE UPDATE trigger. Compares OLD.country_code vs NEW.country_code.
--   Non-admins cannot change it (to another country OR to NULL).
--   Admins retain full override via public.is_admin(), consistent with
--   20261104 and 20261129.
--
-- Why a trigger instead of RLS:
--   In PostgreSQL, RLS WITH CHECK cannot read the OLD row. A pure-RLS fix
--   would have to compare country_code against profiles.country_code, which
--   would wrongly block a user from editing their OLD-market listings after
--   they themselves moved to a new market. A trigger compares OLD vs NEW
--   directly, which is the exact invariant we want.
--
-- Scope:
--   Only fires when country_code is in the UPDATE SET clause (BEFORE UPDATE OF
--   country_code). Edits to title/price/description/images have zero overhead.
-- ============================================================================

begin;

-- 1. Trigger function: block country_code changes by non-admins
create or replace function public.prevent_listing_market_change()
returns trigger
language plpgsql
security definer
set search_path = 'public'
as $$
begin
  -- Admin override (same authorization source as is_admin() in 20261104)
  if public.is_admin() then
    return new;
  end if;

  -- Non-admin: country_code is immutable after publication.
  -- IS DISTINCT FROM also catches NULL <-> non-NULL transitions.
  if new.country_code is distinct from old.country_code then
    raise exception
      'Market change is not permitted on existing listings.'
      using
        errcode = '42501',   -- insufficient_privilege -> maps to HTTP 403
        hint    = 'country_code is immutable after publication for non-admins.';
  end if;

  return new;
end;
$$;

comment on function public.prevent_listing_market_change() is
  'F1 fix: blocks UPDATE of listings.country_code for non-admin users. Admin bypass via public.is_admin().';

-- 2. Attach trigger (idempotent)
drop trigger if exists trg_prevent_listing_market_change on public.listings;
create trigger trg_prevent_listing_market_change
  before update of country_code on public.listings
  for each row
  execute function public.prevent_listing_market_change();

commit;
