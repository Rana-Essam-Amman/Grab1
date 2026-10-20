-- Data Cleanup: Normalize legacy attribute values to canonical slugs.
-- This uses generic CASE logic (not hardcoded IDs) to fix:
-- 1. Arabic brand/make/propertyType values -> canonical slugs
-- 2. Empty keys -> inferred from labels
-- 3. Specific known data corruptions (e.g., storage 11024 -> 1024)

UPDATE public.listings
SET attributes = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'key', 
        CASE 
          WHEN (att->>'key' IS NULL OR att->>'key' = '') THEN
            CASE 
              WHEN att->>'label' IN ('الضمان', 'الضمان') THEN 'warranty'
              WHEN att->>'label' IN ('اللون', 'اللون') THEN 'color'
              WHEN att->>'label' IN ('الموديل', 'الموديل') THEN 'model'
              WHEN att->>'label' IN ('السعة', 'السعة التخزينية') THEN 'storage'
              ELSE 'other'
            END
          ELSE att->>'key'
        END,
      'label', att->>'label',
      'value',
        CASE
          -- Brand / Make mapping
          WHEN att->>'value' = 'أبل' THEN 'apple'
          WHEN att->>'value' = 'سامسونج' THEN 'samsung'
          WHEN att->>'value' = 'شاومي' THEN 'xiaomi'
          WHEN att->>'value' = 'هواوي' THEN 'huawei'
          WHEN att->>'value' = 'أوبو' THEN 'oppo'
          WHEN att->>'value' = 'بايك' THEN 'baic'
          WHEN att->>'value' = 'تويوتا' THEN 'toyota'
          WHEN att->>'value' = 'هيونداي' THEN 'hyundai'
          WHEN att->>'value' = 'كيا' THEN 'kia'
          
          -- Property type mapping
          WHEN att->>'value' = 'فيلا' THEN 'villa'
          WHEN att->>'value' = 'شقة' THEN 'apartment'
          WHEN att->>'value' = 'منزل' THEN 'house'
          WHEN att->>'value' = 'أرض' THEN 'land'

          -- Fix corrupted storage value
          WHEN att->>'value' = '11024' THEN '1024'
          
          -- Handle "Other" (أخرى) for Samsung (title says Samsung)
          WHEN att->>'value' = 'أخرى' AND att->>'key' = 'brand' AND title ILIKE '%Samsung%' THEN 'samsung'
          WHEN att->>'value' = 'أخرى' AND att->>'key' = 'brand' AND title ILIKE '%iPhone%' THEN 'apple'
          
          -- Keep original value if no rule matches
          ELSE att->>'value'
        END
    )
  )
  FROM jsonb_array_elements(attributes) AS att
)
WHERE category_slug IN ('mobiles', 'motors', 'real-estate');

-- Verification query: counts any remaining Arabic values (should be 0)
SELECT count(*) as remaining_arabic_values
FROM public.listings
WHERE attributes::text ~ '[أ-ي]'
  AND category_slug IN ('mobiles', 'motors', 'real-estate');
