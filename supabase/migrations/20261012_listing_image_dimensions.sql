-- 20261012_listing_image_dimensions.sql
-- Forward-compat: store original image dimensions to enable smart cropping
-- later without re-uploading. Nullable — zero impact on existing rows.

alter table public.listings
  add column if not exists image_width integer,
  add column if not exists image_height integer;

comment on column public.listings.image_width is
  'Original uploaded image width in pixels. Null until populated.';
comment on column public.listings.image_height is
  'Original uploaded image height in pixels. Null until populated.';
