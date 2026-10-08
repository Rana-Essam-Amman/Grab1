-- 20261014_listings_indexes.sql
-- Composite indexes for real query patterns.
-- Complements existing single-column indexes (20261010).
-- Idempotent (if not exists). Zero data change.

-- 1) Main feed per market: WHERE country_code=? AND status='active'
--    ORDER BY created_at DESC
create index if not exists listings_feed_idx
  on public.listings (country_code, status, created_at desc);

-- 2) Category page: WHERE country_code=? AND category_slug=?
--    AND status='active' ORDER BY updated_at DESC
create index if not exists listings_category_feed_idx
  on public.listings (country_code, category_slug, status, updated_at desc);

-- 3) City filter: WHERE country_code=? AND city=?
--    Partial — skip rows with empty city (matches post-wizard constraint).
create index if not exists listings_city_idx
  on public.listings (country_code, city)
  where city is not null and city <> '';

-- 4) Neighborhood filter: WHERE country_code=? AND neighborhood=?
create index if not exists listings_neighborhood_idx
  on public.listings (country_code, neighborhood)
  where neighborhood is not null and neighborhood <> '';

-- 5) Seller profile: WHERE seller_phone=? AND country_code=?
create index if not exists listings_seller_phone_idx
  on public.listings (seller_phone, country_code)
  where seller_phone is not null and seller_phone <> '';

-- 6) My Ads: WHERE user_id=? AND country_code=?
create index if not exists listings_user_market_idx
  on public.listings (user_id, country_code);

-- 7) Premium lookups (already has partial, but add expires-aware variant):
--    WHERE is_premium=true AND premium_expires_at > now() for UI display.
--    Existing listings_premium_idx covers (is_premium, premium_expires_at)
--    WHERE is_premium=true — no new index needed.
