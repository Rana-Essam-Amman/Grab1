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
  v_sigs text[] := array[
    'arabic_word_variants(text)',
    'build_prefix_tsquery(text)',
    'expand_arabic_variants(text)',
    'expand_search_keywords(text)',
    'listing_passes_filters(listings, text, text, numeric, numeric, text, text, jsonb)',
    'normalize_arabic(text)',
    'normalize_search_query(text)',
    'normalize_search_text(text)',
    'search_character_array(text)',
    'search_json_values(jsonb)',
    'set_updated_at()'
  ];
  v_sig text;
  v_cfg text[];
begin
  foreach v_sig in array v_sigs loop
    select proconfig into v_cfg
    from pg_proc
    where pronamespace='public'::regnamespace
      and format('%s(%s)', proname, pg_get_function_identity_arguments(oid)) = format('%s', v_sig)
    limit 1;
    if v_cfg is null or not exists (
      select 1 from unnest(v_cfg) c where c like 'search_path=%'
    ) then
      raise exception 'FAIL C: no search_path on %', v_sig;
    end if;
  end loop;
  raise notice 'PASS C: 11 functions have search_path pinned';
end $$;

rollback;
