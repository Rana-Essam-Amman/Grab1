-- 20261092_search_attribute_keys.sql
-- Index attribute keys and expand Arabic/English aliases.
-- Does not modify v1/v2/v3/v4 search functions.

BEGIN;

SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';

CREATE OR REPLACE FUNCTION public.search_json_keys(p_value jsonb)
RETURNS text
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
SET search_path = public
AS $function$
  SELECT coalesce(string_agg(elem->>'key', ' '), '')
  FROM jsonb_array_elements(
    CASE
      WHEN p_value IS NULL THEN '[]'::jsonb
      WHEN jsonb_typeof(p_value) = 'array' THEN p_value
      ELSE '[]'::jsonb
    END
  ) AS elem
  WHERE elem ? 'key' AND elem->>'key' IS NOT NULL;
$function$;

-- Body is the 20261027 function. Only the v_attrs assignment changed.
CREATE OR REPLACE FUNCTION public.set_listings_search_text()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_cat_ar text;
  v_cat_en text;
  v_sub_ar text;
  v_sub_en text;
  v_attrs text := '';
  v_source text;
  v_expanded text := '';
  v_norm text;
BEGIN
  SELECT name_ar, name_en
  INTO v_cat_ar, v_cat_en
  FROM public.search_category_labels
  WHERE category_slug = NEW.category_slug;

  SELECT name_ar, name_en
  INTO v_sub_ar, v_sub_en
  FROM public.search_subcategory_labels
  WHERE category_slug = NEW.category_slug
    AND subcategory_slug = NEW.subcategory_slug;

  v_attrs := public.search_json_values(NEW.attributes)
          || ' ' || public.search_json_keys(NEW.attributes);

  v_source :=
    coalesce(NEW.title, '') || ' ' ||
    coalesce(NEW.description, '') || ' ' ||
    coalesce(NEW.city, '') || ' ' ||
    coalesce(NEW.neighborhood, '') || ' ' ||
    coalesce(NEW.seller_name, '') || ' ' ||
    coalesce(NEW.seller_phone, '') || ' ' ||
    coalesce(v_cat_ar, '') || ' ' ||
    coalesce(v_cat_en, '') || ' ' ||
    coalesce(v_sub_ar, '') || ' ' ||
    coalesce(v_sub_en, '') || ' ' ||
    coalesce(v_attrs, '');

  v_norm := public.normalize_search_text(v_source);
  v_expanded := public.expand_search_keywords(v_norm);

  NEW.search_text :=
    public.expand_search_keywords(
      public.normalize_arabic(
        public.expand_arabic_variants(v_norm)
      )
    ) || ' ' || coalesce(v_expanded, '');

  NEW.search_chars := public.search_character_array(NEW.search_text);
  NEW.search_version := 3;

  RETURN NEW;
END;
$function$;

-- WHERE NOT EXISTS: works with or without a unique constraint. Idempotent.
INSERT INTO public.search_keywords (group_key, keyword)
SELECT v.group_key, v.keyword
FROM (VALUES
  ('attr_color', 'color'),
  ('attr_color', 'colour'),
  ('attr_color', 'لون'),
  ('attr_color', 'لونها'),
  ('attr_color', 'لونو'),
  ('attr_color', 'اللون'),
  ('attr_year', 'year'),
  ('attr_year', 'سنة'),
  ('attr_year', 'السنة'),
  ('attr_year', 'سنة الصنع'),
  ('attr_year', 'موديل السنة'),
  ('attr_make', 'make'),
  ('attr_make', 'brand'),
  ('attr_make', 'ماركة'),
  ('attr_make', 'الماركة'),
  ('attr_make', 'الشركة'),
  ('attr_model', 'model'),
  ('attr_model', 'موديل'),
  ('attr_model', 'الموديل'),
  ('attr_km', 'km'),
  ('attr_km', 'mileage'),
  ('attr_km', 'عداد'),
  ('attr_km', 'العداد'),
  ('attr_km', 'ممشى'),
  ('attr_km', 'كيلومترات'),
  ('attr_condition', 'condition'),
  ('attr_condition', 'حالة'),
  ('attr_condition', 'الحالة'),
  ('attr_transmission', 'transmission'),
  ('attr_transmission', 'ناقل'),
  ('attr_transmission', 'ناقل الحركة'),
  ('attr_transmission', 'جير'),
  ('attr_fuel', 'fuel'),
  ('attr_fuel', 'وقود'),
  ('attr_fuel', 'الوقود'),
  ('attr_inspection', 'inspection'),
  ('attr_inspection', 'فحص'),
  ('attr_inspection', 'الفحص'),
  ('attr_origin', 'origin'),
  ('attr_origin', 'وارد'),
  ('attr_origin', 'الوارد'),
  ('attr_bodytype', 'bodyType'),
  ('attr_bodytype', 'body'),
  ('attr_bodytype', 'هيكل'),
  ('attr_bodytype', 'نوع الهيكل'),
  ('attr_features', 'features'),
  ('attr_features', 'إضافات'),
  ('attr_features', 'ميزات'),
  ('attr_unittype', 'unitType'),
  ('attr_unittype', 'نوع الوحدة'),
  ('attr_unittype', 'نوع العقار'),
  ('attr_area', 'area'),
  ('attr_area', 'مساحة'),
  ('attr_area', 'المساحة'),
  ('attr_area', 'متر'),
  ('attr_area', 'متر مربع'),
  ('attr_rooms', 'rooms'),
  ('attr_rooms', 'غرف'),
  ('attr_rooms', 'غرفة'),
  ('attr_rooms', 'عدد الغرف'),
  ('attr_bathrooms', 'bathrooms'),
  ('attr_bathrooms', 'حمام'),
  ('attr_bathrooms', 'حمامات'),
  ('attr_bathrooms', 'الحمامات'),
  ('attr_floor', 'floor'),
  ('attr_floor', 'طابق'),
  ('attr_floor', 'الطابق'),
  ('attr_buildingage', 'buildingAge'),
  ('attr_buildingage', 'عمر البناء'),
  ('attr_ownershiptype', 'ownershipType'),
  ('attr_ownershiptype', 'ملكية'),
  ('attr_ownershiptype', 'نوع الملكية'),
  ('attr_furnished', 'furnished'),
  ('attr_furnished', 'مفروشة'),
  ('attr_furnished', 'مفروش'),
  ('attr_view', 'view'),
  ('attr_view', 'إطلالة'),
  ('attr_view', 'الاطلالة'),
  ('attr_storage', 'storage'),
  ('attr_storage', 'ذاكرة'),
  ('attr_storage', 'تخزين'),
  ('attr_storage', 'الذاكرة'),
  ('attr_network', 'network'),
  ('attr_network', 'شبكة'),
  ('attr_network', 'الشبكة'),
  ('attr_battery', 'battery'),
  ('attr_battery', 'بطارية'),
  ('attr_battery', 'صحة البطارية'),
  ('attr_screensize', 'screenSize'),
  ('attr_screensize', 'screen size'),
  ('attr_screensize', 'شاشة'),
  ('attr_screensize', 'حجم الشاشة'),
  ('attr_screensize', 'حجم الشاشه'),
  ('attr_screensize', 'size'),
  ('attr_gpu', 'gpu'),
  ('attr_gpu', 'graphics card'),
  ('attr_gpu', 'كرت الشاشة'),
  ('attr_gpu', 'كرت شاشه'),
  ('attr_type', 'type'),
  ('attr_type', 'نوع'),
  ('attr_type', 'النوع'),
  ('attr_processor', 'processor'),
  ('attr_processor', 'معالج'),
  ('attr_processor', 'المعالج'),
  ('attr_ram', 'ram'),
  ('attr_ram', 'رام'),
  ('attr_ram', 'الرام'),
  ('attr_warranty', 'warranty'),
  ('attr_warranty', 'ضمان'),
  ('attr_warranty', 'الضمان'),
  ('attr_size', 'size'),
  ('attr_size', 'مقاس'),
  ('attr_size', 'المقاس'),
  ('attr_size', 'حجم'),
  ('attr_gender', 'gender'),
  ('attr_gender', 'جنس'),
  ('attr_material', 'material'),
  ('attr_material', 'مادة'),
  ('attr_material', 'المادة'),
  ('attr_dimensions', 'dimensions'),
  ('attr_dimensions', 'أبعاد'),
  ('attr_dimensions', 'الأبعاد'),
  ('attr_jobtype', 'jobType'),
  ('attr_jobtype', 'نوع الوظيفة'),
  ('attr_field', 'field'),
  ('attr_field', 'مجال'),
  ('attr_experience', 'experience'),
  ('attr_experience', 'خبرة'),
  ('attr_experience', 'سنوات الخبرة'),
  ('attr_education', 'education'),
  ('attr_education', 'مؤهل'),
  ('attr_education', 'المؤهل'),
  ('attr_salary', 'salary'),
  ('attr_salary', 'راتب'),
  ('attr_salary', 'الراتب'),
  ('attr_servicetype', 'serviceType'),
  ('attr_servicetype', 'نوع الخدمة'),
  ('attr_servicearea', 'serviceArea'),
  ('attr_servicearea', 'نطاق'),
  ('attr_availability', 'availability'),
  ('attr_availability', 'توفر'),
  ('attr_breed', 'breed'),
  ('attr_breed', 'سلالة'),
  ('attr_breed', 'السلالة'),
  ('attr_age', 'age'),
  ('attr_age', 'عمر'),
  ('attr_author', 'author'),
  ('attr_author', 'مؤلف'),
  ('attr_author', 'المؤلف'),
  ('attr_language', 'language'),
  ('attr_language', 'لغة'),
  ('attr_language', 'اللغة'),
  ('attr_level', 'level'),
  ('attr_level', 'مستوى'),
  ('val_red', 'احمر'),
  ('val_red', 'أحمر'),
  ('val_red', 'red'),
  ('val_white', 'ابيض'),
  ('val_white', 'أبيض'),
  ('val_white', 'white'),
  ('val_black', 'اسود'),
  ('val_black', 'أسود'),
  ('val_black', 'black'),
  ('val_silver', 'فضي'),
  ('val_silver', 'silver'),
  ('val_gray', 'رمادي'),
  ('val_gray', 'gray'),
  ('val_gray', 'grey'),
  ('val_blue', 'ازرق'),
  ('val_blue', 'أزرق'),
  ('val_blue', 'blue'),
  ('val_green', 'اخضر'),
  ('val_green', 'أخضر'),
  ('val_green', 'green'),
  ('val_yellow', 'اصفر'),
  ('val_yellow', 'أصفر'),
  ('val_yellow', 'yellow'),
  ('val_brown', 'بني'),
  ('val_brown', 'brown'),
  ('val_beige', 'بيج'),
  ('val_beige', 'beige'),
  ('val_orange', 'برتقالي'),
  ('val_orange', 'orange'),
  ('val_gold', 'ذهبي'),
  ('val_gold', 'gold'),
  ('val_purple', 'بنفسجي'),
  ('val_purple', 'purple'),
  ('val_pink', 'وردي'),
  ('val_pink', 'pink'),
  ('val_new', 'جديد'),
  ('val_new', 'new'),
  ('val_used', 'مستعمل'),
  ('val_used', 'used'),
  ('val_used', 'مستعمل - ممتاز'),
  ('val_used', 'مستعمل - جيد'),
  ('val_used', 'مستعمل - مقبول'),
  ('val_automatic', 'اوتوماتيك'),
  ('val_automatic', 'أوتوماتيك'),
  ('val_automatic', 'automatic'),
  ('val_auto', 'auto'),
  ('val_manual', 'عادي'),
  ('val_manual', 'manual'),
  ('val_petrol', 'بنزين'),
  ('val_petrol', 'petrol'),
  ('val_petrol', 'gasoline'),
  ('val_diesel', 'ديزل'),
  ('val_diesel', 'diesel'),
  ('val_hybrid', 'هايبرد'),
  ('val_hybrid', 'hybrid'),
  ('val_electric', 'كهرباء'),
  ('val_electric', 'electric'),
  ('val_electric', 'ev'),
  ('val_male', 'ذكر'),
  ('val_male', 'male'),
  ('val_male', 'رجالي'),
  ('val_female', 'انثى'),
  ('val_female', 'أنثى'),
  ('val_female', 'female'),
  ('val_female', 'نسائي')
) AS v(group_key, keyword)
WHERE NOT EXISTS (
  SELECT 1 FROM public.search_keywords sk
  WHERE sk.group_key = v.group_key
    AND sk.keyword = v.keyword
);

UPDATE public.listings
SET search_version = 0
WHERE status = 'active';

COMMENT ON FUNCTION public.search_json_keys(jsonb) IS
  'Extracts attribute keys from a {key,value}[] array as space-separated text.';

COMMIT;
