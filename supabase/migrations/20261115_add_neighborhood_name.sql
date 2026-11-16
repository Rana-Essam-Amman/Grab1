-- Forward-only migration: optional free-text neighbourhood name
-- Distinct from the canonical neighborhood (area) field.
-- Does not affect slugs, RLS, or existing location resolution.

ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS neighborhood_name text;

-- No index needed for free-text optional field.
-- Existing SELECT grants remain unchanged; new column is nullable and safe.

COMMENT ON COLUMN public.listings.neighborhood_name IS
  'Optional free-text neighbourhood name entered by the seller. Not a canonical slug.';
