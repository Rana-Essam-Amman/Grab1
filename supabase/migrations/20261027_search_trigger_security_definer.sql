-- 20261027_search_trigger_security_definer.sql
-- Session 8 — regression fix
--
-- Context: 20261026 revoked anon/authenticated access on 5 internal search
-- tables (search_keywords, *_embeddings, *_jobs, storage_orphans).
-- That was correct for reads but broke listing inserts: the trigger
-- set_listings_search_text() calls expand_search_keywords() which reads
-- search_keywords. Because the function ran as the invoking user
-- (authenticated), inserts failed with:
--   ERROR: permission denied for table search_keywords
--
-- Fix: mark the trigger function SECURITY DEFINER so it runs as the
-- owner (postgres) and bypasses the revoked grants. The table stays
-- locked to anon/authenticated — this only elevates the trigger body.

create or replace function public.set_listings_search_text()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
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
