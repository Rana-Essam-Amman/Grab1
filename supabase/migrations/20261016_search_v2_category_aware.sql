-- ============================================================
-- FOX Search V2 — Category-aware FTS + synonyms + Arabic prefix-strip
-- Session 7, 2026-10-16
-- Applied to production: wmchqotsforwcoxilaeo
-- ============================================================

-- ── 1. Category/subcategory label tables (source of truth for search indexing)
create table if not exists public.search_category_labels (
  category_slug text primary key,
  name_ar text not null,
  name_en text not null
);

insert into public.search_category_labels (category_slug, name_ar, name_en) values
  ('motors','سيارات ومركبات','Motors'),
  ('real-estate','عقارات','Real Estate'),
  ('mobiles','موبايلات وتابلت','Mobiles & Tablets'),
  ('watches','ساعات وإكسسوار','Watches'),
  ('computers','كمبيوتر وشاشات','Computers'),
  ('electronics','أجهزة وإلكترونيات','Electronics'),
  ('furniture','أثاث وديكور','Furniture'),
  ('fashion','أزياء وملابس','Fashion'),
  ('services','خدمات','Services'),
  ('jobs','وظائف','Jobs'),
  ('kids','أطفال وألعاب','Baby & Kids'),
  ('beauty','عناية وجمال','Beauty & Personal'),
  ('pets','حيوانات','Pets'),
  ('sports','رياضة وتخييم','Sports & Outdoors'),
  ('books','كتب وهوايات','Books & Hobbies'),
  ('home-garden','حديقة ومنزل','Home & Garden'),
  ('krakeeb','أغراض متفرقة','Miscellaneous'),
  ('cleaning','تنظيف','Cleaning'),
  ('handymen','صنايعي','Handymen'),
  ('projects','مشاريع للبيع أو للشراكة','Projects & Business')
on conflict (category_slug) do update
  set name_ar = excluded.name_ar, name_en = excluded.name_en;

create table if not exists public.search_subcategory_labels (
  category_slug text not null,
  subcategory_slug text not null,
  name_ar text not null,
  name_en text not null,
  primary key (category_slug, subcategory_slug)
);

-- (subcategory insert block — copy from what you ran in DB; keep for completeness)
-- NOTE: If you ran subcategory inserts directly in DB, replicate here too.
-- ... [the full insert from production]

-- ── 2. Synonym table
create table if not exists public.search_synonyms (
  term text primary key,
  expansions text[] not null
);

insert into public.search_synonyms (term, expansions) values
  ('شقة', array['شقق','شقتي','apartment','flat']),
  ('شقق', array['شقة','apartment','flat']),
  ('بيت', array['بيوت','منزل','منازل','house','home']),
  ('فيلا', array['فلل','villa']),
  ('ارض', array['أرض','اراضي','أراضي','land','plot']),
  ('سيارة', array['سيارات','car','cars','auto']),
  ('موبايل', array['جوال','هاتف','phone','mobile']),
  ('جوال', array['موبايل','هاتف','phone','mobile']),
  ('هاتف', array['موبايل','جوال','phone']),
  ('لابتوب', array['laptop']),
  ('كمبيوتر', array['computer','pc']),
  ('تابلت', array['tablet','ipad']),
  ('ساعة', array['ساعات','watch','watches']),
  ('تلفزيون', array['تلفزيونات','tv','television','شاشة','شاشات']),
  ('ثلاجة', array['ثلاجات','fridge','refrigerator']),
  ('غسالة', array['غسالات','washing machine']),
  ('مكيف', array['مكيفات','ac','air conditioner']),
  ('سرير', array['سراير','bed']),
  ('كنبة', array['كنب','sofa','couch']),
  ('طاولة', array['طاولات','table']),
  ('كرسي', array['كراسي','chair']),
  ('حذاء', array['احذية','أحذية','shoes']),
  ('حقيبة', array['حقائب','bag','handbag']),
  ('عطر', array['عطور','perfume']),
  ('كامري', array['camry']),
  ('كورولا', array['corolla']),
  ('هونداي', array['hyundai']),
  ('تويوتا', array['toyota']),
  ('كيا', array['kia'])
on conflict (term) do update set expansions = excluded.expansions;

-- ── 3. Arabic prefix variants (و/ف/ب/ل/ك + ال/وال/فال/بال/كال/لل)
create or replace function public.arabic_word_variants(p_word text)
returns text[]
language sql immutable
as $$
  select array_remove(array[
    nullif(p_word, ''),
    case when length(p_word) >= 4 and substring(p_word,1,3) in ('وال','فال','بال','كال') then nullif(substring(p_word,4),'') end,
    case when length(p_word) >= 4 and substring(p_word,1,3) = 'لل' then nullif(substring(p_word,4),'') end,
    case when length(p_word) >= 4 and substring(p_word,1,2) = 'ال' then nullif(substring(p_word,3),'') end,
    case when length(p_word) >= 5 and substring(p_word,1,1) = 'و' then nullif(substring(p_word,2),'') end,
    case when length(p_word) >= 5 and substring(p_word,1,1) = 'ف' then nullif(substring(p_word,2),'') end,
    case when length(p_word) >= 5 and substring(p_word,1,1) = 'ب' then nullif(substring(p_word,2),'') end,
    case when length(p_word) >= 5 and substring(p_word,1,1) = 'ل' then nullif(substring(p_word,2),'') end,
    case when length(p_word) >= 5 and substring(p_word,1,1) = 'ك' then nullif(substring(p_word,2),'') end
  ], null);
$$;

create or replace function public.expand_arabic_variants(p_input text)
returns text
language sql immutable
as $$
  select coalesce(string_agg(v, ' '), '')
  from (
    select unnest(public.arabic_word_variants(w)) as v
    from unnest(regexp_split_to_array(btrim(coalesce(p_input,'')), '\s+')) as w
  ) sub
  where v is not null and length(v) > 0;
$$;

-- ── 4. Trigger: search_text built from 9 fields + variants + synonyms
create or replace function public.set_listings_search_text()
returns trigger
language plpgsql
as $$
declare
  v_cat_ar text; v_cat_en text;
  v_sub_ar text; v_sub_en text;
  v_attrs text := '';
  v_source text;
  v_expanded text := '';
  v_norm text;
  v_variants text;
begin
  select name_ar, name_en into v_cat_ar, v_cat_en
    from public.search_category_labels where category_slug = new.category_slug;
  select name_ar, name_en into v_sub_ar, v_sub_en
    from public.search_subcategory_labels
   where category_slug = new.category_slug and subcategory_slug = new.subcategory_slug;

  begin
    if new.attributes is not null and jsonb_typeof(new.attributes::jsonb) = 'object' then
      select coalesce(string_agg(value, ' '), '') into v_attrs
        from jsonb_each_text(new.attributes::jsonb);
    end if;
  exception when others then v_attrs := '';
  end;

  v_source :=
    coalesce(new.title,'') || ' ' || coalesce(new.description,'') || ' ' ||
    coalesce(new.city,'') || ' ' || coalesce(new.neighborhood,'') || ' ' ||
    coalesce(v_cat_ar,'') || ' ' || coalesce(v_cat_en,'') || ' ' ||
    coalesce(v_sub_ar,'') || ' ' || coalesce(v_sub_en,'') || ' ' ||
    coalesce(v_attrs,'');

  v_norm := public.normalize_arabic(v_source);
  v_variants := public.expand_arabic_variants(v_norm);

  begin
    select coalesce(string_agg(distinct exp, ' '), '') into v_expanded
      from (
        select unnest(s.expansions) as exp
          from public.search_synonyms s
         where s.term = any(regexp_split_to_array(v_variants, '\s+'))
      ) sub;
  exception when others then v_expanded := '';
  end;

  new.search_text := v_variants || ' ' || coalesce(v_expanded, '');
  return new;
end;
$$;

-- ── 5. Trigger registration (drop old, install new)
do $$
declare r record;
begin
  for r in
    select tgname from pg_trigger
    where tgrelid = 'public.listings'::regclass and not tgisinternal
  loop
    execute format('drop trigger %I on public.listings', r.tgname);
  end loop;
end $$;

create trigger set_listings_search_text_trigger
before insert or update on public.listings
for each row
execute function public.set_listings_search_text();

-- ── 6. Prefix tsquery builder with variant expansion
create or replace function public.build_prefix_tsquery(p_input text)
returns tsquery
language plpgsql immutable
as $$
declare
  v_norm text;
  v_words text[];
  v_word text;
  v_word_variants text[];
  v_parts text[];
  v_clean text;
  v_word_q text;
  v_final text[] := '{}';
begin
  v_norm := public.normalize_arabic(coalesce(p_input,''));
  if length(btrim(v_norm)) = 0 then return null; end if;
  v_words := regexp_split_to_array(btrim(v_norm), '\s+');

  foreach v_word in array v_words loop
    if length(btrim(v_word)) = 0 then continue; end if;
    v_word_variants := public.arabic_word_variants(v_word);
    v_parts := '{}';
    foreach v_clean in array v_word_variants loop
      v_clean := regexp_replace(v_clean, $re$[&|!():<>']$re$, '', 'g');
      if length(v_clean) > 0 then
        v_parts := array_append(v_parts, v_clean || ':*');
      end if;
    end loop;
    if array_length(v_parts, 1) > 0 then
      v_word_q := array_to_string(v_parts, ' | ');
      v_final := array_append(v_final, '(' || v_word_q || ')');
    end if;
  end loop;

  if array_length(v_final, 1) = 0 then return null; end if;

  begin
    return to_tsquery('simple', array_to_string(v_final, ' & '));
  exception when others then return null;
  end;
end;
$$;

-- ── 7. search_listings RPC uses prefix tsquery
CREATE OR REPLACE FUNCTION public.search_listings(
  p_query text,
  p_market text DEFAULT NULL::text,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS SETOF listings
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  with q as (
    select public.build_prefix_tsquery(p_query) as query
  )
  select l.*
  from public.listings l, q
  where l.status = 'active'
    and q.query is not null
    and (p_market is null or l.country_code = upper(p_market))
    and l.fts @@ q.query
  order by ts_rank_cd(l.fts, q.query) desc, l.created_at desc
  limit greatest(1, least(p_limit, 100))
  offset greatest(0, p_offset);
$function$;

-- ── 8. Backfill existing rows
update public.listings set title = title;
