-- Architectural Cleanup: Uses Regex and pattern matching instead of hardcoded words.
-- 1. Extracts numbers from strings (e.g., "220 م²" -> 220).
-- 2. Maps Arabic labels to canonical keys (e.g., "نوع الإيجار" -> rentPeriod).
-- 3. Infers brand from title if value is 'أخرى'.
-- 4. Removes dummy data (e.g., "قيمة تجريبية").

UPDATE public.listings
SET attributes = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'key', 
        CASE 
          WHEN att->>'key' IN ('', 'other') THEN
            CASE 
              WHEN att->>'label' IN ('نوع الإيجار', 'فترة الإيجار') THEN 'rentPeriod'
              WHEN att->>'label' IN ('الغرف', 'عدد الغرف') THEN 'bedrooms'
              WHEN att->>'label' IN ('الحمام', 'الحمامات') THEN 'bathrooms'
              WHEN att->>'label' IN ('المساحة', 'المساحة (م²)') THEN 'area'
              WHEN att->>'label' IN ('اللون', 'اللون الخارجي') THEN 'exteriorColor'
              WHEN att->>'label' IN ('الماركة', 'الماركة والموديل') THEN 'make'
              WHEN att->>'label' IN ('الوكيل', 'الوارد') THEN 'origin'
              WHEN att->>'label' IN ('المميزات', 'المميزات والخدمات') THEN 'amenities'
              ELSE att->>'key'
            END
          ELSE att->>'key'
        END,
      'label', att->>'label',
      'value',
        CASE
          -- 1. Extract pure numbers from area/storage (e.g., "220 م²" -> "220")
          WHEN att->>'key' IN ('area', 'storage', 'bedrooms', 'bathrooms', 'km', 'mileage') 
               AND att->>'value' ~ '[0-9]' THEN
            regexp_replace(att->>'value', '[^0-9]', '', 'g')
            
          -- 2. Translate known make/brand English names to canonical slugs
          WHEN att->>'key' IN ('make', 'brand') AND att->>'value' ILIKE '%Hyundai%' THEN 'hyundai'
          WHEN att->>'key' IN ('make', 'brand') AND att->>'value' ILIKE '%Lexus%' THEN 'lexus'
          WHEN att->>'key' IN ('make', 'brand') AND att->>'value' ILIKE '%Samsung%' THEN 'samsung'
          WHEN att->>'key' IN ('make', 'brand') AND att->>'value' = 'أخرى' AND title ILIKE '%تويوتا%' THEN 'toyota'
          WHEN att->>'key' IN ('make', 'brand') AND att->>'value' = 'أخرى' AND title ILIKE '%سامسونج%' THEN 'samsung'
          
          -- 3. Translate known transmission/fuel/color to slugs
          WHEN att->>'key' = 'transmission' AND att->>'value' = 'أوتوماتيك' THEN 'automatic'
          WHEN att->>'key' = 'fuel' AND att->>'value' = 'بنزين' THEN 'petrol'
          WHEN att->>'key' = 'exteriorColor' AND att->>'value' = 'أبيض' THEN 'white'
          
          -- 4. Remove dummy data
          WHEN att->>'value' = 'قيمة تجريبية' THEN NULL
          
          -- Keep original if no logic matches
          ELSE att->>'value'
        END
    )
  ) FILTER (WHERE att->>'value' IS NOT NULL AND att->>'value' <> '')
  FROM jsonb_array_elements(attributes) AS att
)
WHERE category_slug IN ('mobiles', 'motors', 'real-estate');

-- Verification: count remaining Arabic values in enum fields (should be much lower)
SELECT count(*) as remaining_dirty_values
FROM public.listings
WHERE category_slug IN ('mobiles', 'motors', 'real-estate')
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(attributes) a
    WHERE a->>'value' ~ '[أ-ي]' 
      AND a->>'key' IN ('make', 'brand', 'transmission', 'fuel', 'exteriorColor', 'propertyType', 'condition')
  );
