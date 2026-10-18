-- 20261102_drop_bump_listing_rpc.sql
-- Drops the bump_listing RPC after:
-- 1. UI removal (Batch 6 — MyAdsScreen bump button removed)
-- 2. Client wrapper removal (B.3.2 — bumpListing function removed)
-- 3. Zero production callers confirmed by recon.
--
-- Note: DB columns (bumps_today, bumps_reset_date, last_bumped_at) are
-- intentionally NOT dropped here. They will be handled separately after
-- verifying no remaining code reads them (Batch B.3.6).

begin;

drop function if exists public.bump_listing(uuid);

commit;
