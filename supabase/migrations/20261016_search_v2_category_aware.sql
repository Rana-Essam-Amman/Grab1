-- ============================================================
-- FOX Search V2 — Category-aware FTS + synonyms + Arabic prefix-strip
--                    + Farsi normalization + typo tolerance
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

insert into public.search_subcategory_labels (category_slug, subcategory_slug, name_ar, name_en) values
  ('motors','cars','سيارات للبيع','Cars for Sale'),
  ('motors','motorbikes','دراجات وسكوتر','Motorcycles & Scooters'),
  ('motors','heavy','شاحنات وآليات ثقيلة','Heavy Vehicles & Trucks'),
  ('motors','plates','لوحات سيارات','Car Plates'),
  ('motors','parts','قطع غيار سيارات','Auto Spare Parts'),
  ('motors','boats','قوارب وجت سكي','Boats & Watercraft'),
  ('motors','accessories','إكسسوارات سيارات','Car Accessories'),
  ('real-estate','for-sale','عقارات للبيع شقق شقة بيت بيوت فيلا فلل اراضي','Properties for Sale Apartments Houses Villas'),
  ('real-estate','for-rent','عقارات للإيجار شقق شقة بيت بيوت','Properties for Rent Apartments Houses'),
  ('real-estate','commercial','عقارات تجارية مكتب مكاتب محل محلات','Commercial Real Estate Office Shop'),
  ('real-estate','lands','أراضي للبيع أرض','Lands for Sale Plot'),
  ('real-estate','chalets','شاليهات ومزارع شاليه مزرعة','Chalets & Farmhouses'),
  ('real-estate','foreign','عقارات بالخارج','Foreign Real Estate'),
  ('mobiles','phones','هواتف محمولة موبايل جوال','Mobile Phones'),
  ('mobiles','tablets','تابلت وآيباد','Tablets & iPads'),
  ('mobiles','smart-watches','ساعات ذكية','Smart Watches'),
  ('mobiles','accessories','إكسسوارات هواتف','Phone Accessories'),
  ('mobiles','numbers','أرقام مميزة','VIP Numbers'),
  ('watches','luxury','ساعات فاخرة','Luxury Watches'),
  ('watches','everyday','ساعات يومية','Everyday Watches'),
  ('watches','vintage-watch','ساعات كلاسيكية','Vintage Watches'),
  ('watches','straps','أساور وصناديق','Straps & Boxes'),
  ('computers','laptops','لابتوبات لابتوب','Laptops'),
  ('computers','desktops','كمبيوترات مكتبية','Desktop Computers'),
  ('computers','screens','شاشات','Monitors & Displays'),
  ('computers','parts-pc','قطع كمبيوتر','Computer Parts'),
  ('computers','accessories-pc','ملحقات وإكسسوارات','Computer Accessories'),
  ('electronics','tv','شاشات وتلفزيونات تلفزيون','TVs & Displays'),
  ('electronics','audio','سماعات وصوتيات','Audio & Speakers'),
  ('electronics','gaming','ألعاب فيديو وأجهزة بلايستيشن','Video Games & Consoles'),
  ('electronics','cameras','كاميرات وعدسات','Cameras & Lenses'),
  ('electronics','home-appliances','أجهزة منزلية ثلاجة غسالة مكيف','Home Appliances'),
  ('furniture','living','أثاث غرف جلوس كنبة كنب','Living Room Furniture'),
  ('furniture','bedroom','أثاث غرف نوم سرير','Bedroom Furniture'),
  ('furniture','tables','سفرة وطاولات','Dining & Tables'),
  ('furniture','outdoor','أثاث حدائق وخارجي','Outdoor Furniture'),
  ('furniture','decor','ديكور ومفروشات','Home Decor'),
  ('furniture','office','أثاث مكتبي','Office Furniture'),
  ('fashion','women','أزياء نسائية','Women''s Fashion'),
  ('fashion','men','أزياء رجالية','Men''s Fashion'),
  ('fashion','watches-jewelry','مجوهرات وإكسسوارات','Jewelry & Accessories'),
  ('fashion','bags','حقائب وشنط','Bags & Luggage'),
  ('fashion','shoes','أحذية','Footwear'),
  ('fashion','perfumes','عطور','Perfumes & Fragrances'),
  ('services','delivery','توصيل ونقل','Delivery & Transport'),
  ('services','events','مناسبات وضيافة','Events & Catering'),
  ('services','design','تصميم وتسويق','Design & Marketing'),
  ('services','tutor','دروس خصوصية','Private Tutoring'),
  ('jobs','vacancies','وظائف شاغرة','Job Openings'),
  ('jobs','cvs','باحثون عن عمل','Job Seekers & CVs'),
  ('kids','clothes','ملابس أطفال','Baby & Kids Clothes'),
  ('kids','toys','ألعاب أطفال','Toys & Games'),
  ('kids','strollers','عربات ومقاعد','Strollers & Car Seats'),
  ('kids','feeding','مستلزمات رضاعة وعناية','Feeding & Care'),
  ('beauty','perfumes-cosmetics','عطور ومكياج','Perfumes & Cosmetics'),
  ('beauty','hair','عناية بالشعر','Hair Care'),
  ('beauty','skin','عناية بالبشرة','Skin Care'),
  ('beauty','care','أجهزة عناية شخصية','Personal Care Devices'),
  ('pets','dogs','كلاب','Dogs'),
  ('pets','cats','قطط','Cats'),
  ('pets','birds','طيور','Birds'),
  ('pets','fish','أسماك وأحواض','Fish & Aquariums'),
  ('pets','pet-supplies','مستلزمات حيوانات','Pet Supplies'),
  ('sports','fitness','أجهزة رياضية وللياقة','Gym & Fitness'),
  ('sports','bicycles','دراجات هوائية','Bicycles'),
  ('sports','camping','تخييم ورحلات','Camping & Outdoor'),
  ('sports','water-sports','رياضات مائية','Water Sports'),
  ('books','books-magazines','كتب ومجلات','Books & Magazines'),
  ('books','instruments','آلات موسيقية','Musical Instruments'),
  ('books','antiques','تحف ومقتنيات','Antiques & Collectibles'),
  ('books','crafts','أعمال يدوية وفنية','Handicrafts'),
  ('home-garden','garden-furniture','أثاث حدائق','Garden Furniture'),
  ('home-garden','plants','نباتات وأشجار','Plants & Trees'),
  ('home-garden','bbq','شوايات ومستلزمات','BBQ & Outdoor Cooking'),
  ('home-garden','tools','أدوات حدائق','Garden Tools'),
  ('krakeeb','general','مستعمل عام','General Used Items'),
  ('krakeeb','vintage','قديم وأنتيك','Vintage & Retro'),
  ('krakeeb','clearances','تصفيات وشروات','Clearance Deals'),
  ('cleaning','homes','تنظيف منازل','Home Cleaning'),
  ('cleaning','offices','تنظيف مكاتب','Office Cleaning'),
  ('cleaning','sofas-carpets','كنب وسجاد','Sofas & Carpets'),
  ('cleaning','water-tanks','خزانات مياه','Water Tanks'),
  ('cleaning','pools','مسابح','Pools'),
  ('cleaning','post-construction','تنظيف بعد التشطيب','Post-Construction'),
  ('cleaning','windows-facades','واجهات وزجاج','Windows & Facades'),
  ('handymen','electrician','كهربائي','Electrician'),
  ('handymen','plumber','سباك ومواسرجي','Plumber'),
  ('handymen','carpenter','نجار','Carpenter'),
  ('handymen','painter','دهان','Painter'),
  ('handymen','blacksmith','حداد','Blacksmith'),
  ('handymen','ac-technician','فني تكييف','AC Technician'),
  ('handymen','aluminum','ألمنيوم','Aluminum'),
  ('handymen','gypsum','جبصين وديكور','Gypsum & Decor'),
  ('handymen','tiles-marble','بلاط ورخام','Tiles & Marble'),
  ('handymen','appliance-repair','صيانة أجهزة','Appliance Repair'),
  ('handymen','locksmith','فتح أقفال','Locksmith'),
  ('handymen','glass','زجاج ومرايا','Glass & Mirrors'),
  ('handymen','furniture-assembly','تركيب أثاث','Furniture Assembly'),
  ('handymen','general','صيانة عامة','General Maintenance'),
  ('projects','restaurant','مطعم أو كافيه','Restaurant & Cafe'),
  ('projects','shop','محل تجاري','Shop'),
  ('projects','factory','مصنع وورشة','Factory'),
  ('projects','online-store','متجر إلكتروني','Online Store'),
  ('projects','franchise','حق امتياز','Franchise'),
  ('projects','licenses','تراخيص ورخص','Licenses'),
  ('projects','equipment','معدات ومستلزمات','Equipment'),
  ('projects','partnership','شراكة ومستثمر','Partnership'),
  ('projects','software','مشروع برمجي','Software Project'),
  ('projects','agri','مشروع زراعي','Agricultural Project'),
  ('projects','other','مشاريع أخرى','Other')
on conflict (category_slug, subcategory_slug) do update
  set name_ar = excluded.name_ar, name_en = excluded.name_en;

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

-- ── 2.5. normalize_arabic (Arabic + Farsi char unification)
create or replace function public.normalize_arabic(t text)
returns text
language sql immutable
as $fn$
  select regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              regexp_replace(unaccent(lower(coalesce(t, ''))), U&'[\064B-\065F\0670]', '', 'g'),
              U&'[\0671\0622\0623\0625\0627]', 'ا', 'g'
            ),
            U&'[\06CC\0649\064A\0626]', 'ي', 'g'
          ),
          U&'[\06A9\0643]', 'ك', 'g'
        ),
        U&'[\06BE\06C1\06D5\0629\0647]', 'ه', 'g'
      ),
      U&'[\0624]', 'و', 'g'
    );
$fn$;

-- ── 2.6. pg_trgm extension + trigram GIN index for typo tolerance
create extension if not exists pg_trgm;

create index if not exists listings_search_text_trgm_idx
  on public.listings using gin (search_text gin_trgm_ops);

-- ── 3. Arabic prefix strip helpers
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

-- ── 4. Trigger function: search_text = 9 fields + variants + synonyms
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

-- ── 7. search_listings RPC: FTS prefix first, trigram fallback for typos
create or replace function public.search_listings(
  p_query text,
  p_market text default null,
  p_limit integer default 20,
  p_offset integer default 0
)
returns setof listings
language plpgsql
security definer
set search_path to 'public'
as $fn$
declare
  v_tsq tsquery;
  v_norm text;
  v_limit int := greatest(1, least(p_limit, 100));
  v_offset int := greatest(0, p_offset);
begin
  v_tsq := public.build_prefix_tsquery(p_query);
  v_norm := public.normalize_arabic(coalesce(p_query, ''));

  if v_tsq is not null then
    if exists (
      select 1 from public.listings l
      where l.status = 'active'
        and (p_market is null or l.country_code = upper(p_market))
        and l.fts @@ v_tsq
    ) then
      return query
        select l.* from public.listings l
        where l.status = 'active'
          and (p_market is null or l.country_code = upper(p_market))
          and l.fts @@ v_tsq
        order by ts_rank_cd(l.fts, v_tsq) desc, l.created_at desc
        limit v_limit offset v_offset;
      return;
    end if;
  end if;

  if length(v_norm) >= 3 then
    return query
      select l.* from public.listings l
      where l.status = 'active'
        and (p_market is null or l.country_code = upper(p_market))
        and word_similarity(v_norm, l.search_text) > 0.3
      order by word_similarity(v_norm, l.search_text) desc, l.created_at desc
      limit v_limit offset v_offset;
  end if;
end;
$fn$;

-- ── 8. Backfill existing rows with new normalize + variants + synonyms
update public.listings set title = title;
