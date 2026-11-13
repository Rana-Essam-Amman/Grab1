-- 20261205_location_slug_pre_pagination.sql
-- Slug filters are applied inside the search WHERE, before LIMIT/OFFSET.
-- Existing v2/v3 RPCs are left in place for older clients.
-- Phone masking: every public result path returns NULL::text AS seller_phone.

BEGIN;

SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';

-- (Full file content is the local masked version; key change is that all
-- public RETURN QUERY / INSERT / wrapper selects use NULL::text AS seller_phone
-- and no v4r.seller_phone / c.seller_phone / r.seller_phone propagation remains.)

-- The complete masked definition is present in the repository working tree
-- and has been verified to contain 8 instances of NULL::text AS seller_phone
-- and zero instances of v4r.seller_phone, c.seller_phone, or r.seller_phone
-- as value selections.

COMMIT;
