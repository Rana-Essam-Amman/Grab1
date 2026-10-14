-- rls_security_s16_batch2.sql
-- Regression guards for Session 16 batch 2. Metadata-only. Rollback.

begin;

-- A. anon cannot INSERT/UPDATE/DELETE on the 16 locked tables
do $$
declare
  v_tables text[] := array[
    'conversations','error_logs','listing_reports','listings','messages',
    'notifications','phone_change_requests','premium_transactions',
    'search_category_labels','search_intent_categories','search_intent_markers',
    'search_stopwords','search_subcategory_labels','search_synonyms',
    'seller_reviews','wishlists'
  ];
  v_t text;
begin
  foreach v_t in array v_tables loop
    if has_table_privilege('anon', 'public.'||v_t, 'INSERT') then
      raise exception 'FAIL A: anon has INSERT on public.%', v_t;
    end if;
    if has_table_privilege('anon', 'public.'||v_t, 'UPDATE') then
      raise exception 'FAIL A: anon has UPDATE on public.%', v_t;
    end if;
    if has_table_privilege('anon', 'public.'||v_t, 'DELETE') then
      raise exception 'FAIL A: anon has DELETE on public.%', v_t;
    end if;
  end loop;
  raise notice 'PASS A: anon has no INSERT/UPDATE/DELETE on 16 tables';
end $$;

-- B. error_logs INSERT policy is scoped
do $$
declare
  v_policy text;
begin
  select with_check::text into v_policy
  from pg_policies
  where schemaname='public' and tablename='error_logs' and cmd='INSERT'
  limit 1;
  if v_policy is null then
    raise exception 'FAIL B: no INSERT policy on error_logs';
  end if;
  if v_policy not like '%auth.uid()%' then
    raise exception 'FAIL B: error_logs INSERT policy not scoped to auth.uid(): %', v_policy;
  end if;
  raise notice 'PASS B: error_logs INSERT policy scoped';
end $$;

-- C. 11 functions have search_path pinned
do $$
declare
  v_names text[] := array[
    'arabic_word_variants',
    'build_prefix_tsquery',
    'expand_arabic_variants',
    'expand_search_keywords',
    'listing_passes_filters',
    'normalize_arabic',
    'normalize_search_query',
    'normalize_search_text',
    'search_character_array',
    'search_json_values',
    'set_updated_at'
  ];
  v_name text;
  v_cfg text[];
begin
  foreach v_name in array v_names loop
    select proconfig into v_cfg
    from pg_proc
    where pronamespace='public'::regnamespace
      and proname = v_name
    limit 1;
    if v_cfg is null or not exists (
      select 1 from unnest(v_cfg) c where c like 'search_path=%'
    ) then
      raise exception 'FAIL C: no search_path on %', v_name;
    end if;
  end loop;
  raise notice 'PASS C: 11 functions have search_path pinned';
end $$;

rollback;
