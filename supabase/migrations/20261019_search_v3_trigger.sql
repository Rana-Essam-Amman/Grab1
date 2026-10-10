BEGIN;

CREATE OR REPLACE FUNCTION public.set_listings_search_text()
RETURNS trigger
LANGUAGE plpgsql
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

  v_attrs := public.search_json_values(NEW.attributes);

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

DROP TRIGGER IF EXISTS set_listings_search_text_trigger
  ON public.listings;

CREATE TRIGGER set_listings_search_text_trigger
BEFORE INSERT OR UPDATE ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.set_listings_search_text();

UPDATE public.listings
SET search_text = search_text
WHERE search_version <> 3;

COMMIT;
