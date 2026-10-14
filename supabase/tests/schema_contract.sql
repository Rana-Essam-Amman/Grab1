BEGIN;

-- Wave 4 schema contract.
-- Read-only assertions: no fixtures and no data changes.

DO $$
BEGIN
  IF to_regclass('public.profiles') IS NULL THEN
    RAISE EXCEPTION 'FAIL: public.profiles table does not exist';
  END IF;

  RAISE NOTICE 'PASS: public.profiles exists';
END;
$$;

DO $$
DECLARE
  v_column record;
  v_actual_type text;
  v_actual_nullable boolean;
  v_actual_default text;
  v_expected_default text;
BEGIN
  FOR v_column IN
    SELECT *
    FROM (VALUES
      ('feed_layout', 'text', false, '''list'''),
      ('browse_market', 'text', true, NULL::text),
      ('vip_store', 'boolean', false, 'false'),
      ('vip_store_expires_at', 'timestamp with time zone', true, NULL::text),
      ('rating_avg', 'numeric', false, '0'),
      ('rating_count', 'integer', false, '0')
    ) AS expected(column_name, data_type, is_nullable, expected_default)
  LOOP
    SELECT
      format_type(a.atttypid, a.atttypmod),
      NOT a.attnotnull,
      pg_get_expr(d.adbin, d.adrelid)
    INTO
      v_actual_type,
      v_actual_nullable,
      v_actual_default
    FROM pg_attribute a
    LEFT JOIN pg_attrdef d
      ON d.adrelid = a.attrelid
     AND d.adnum = a.attnum
    WHERE a.attrelid = 'public.profiles'::regclass
      AND a.attname = v_column.column_name
      AND a.attnum > 0
      AND NOT a.attisdropped;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'FAIL: profiles.% is missing', v_column.column_name;
    END IF;

    IF v_actual_type IS DISTINCT FROM v_column.data_type THEN
      RAISE EXCEPTION
        'FAIL: profiles.% type %, expected %',
        v_column.column_name, v_actual_type, v_column.data_type;
    END IF;

    IF v_actual_nullable IS DISTINCT FROM v_column.is_nullable THEN
      RAISE EXCEPTION
        'FAIL: profiles.% nullable %, expected %',
        v_column.column_name, v_actual_nullable, v_column.is_nullable;
    END IF;

    IF v_column.column_name = 'browse_market' THEN
      IF v_actual_default IS NOT NULL
         AND lower(regexp_replace(v_actual_default, '\s+', '', 'g'))
             NOT IN ('null', 'null::text') THEN
        RAISE EXCEPTION
          'FAIL: profiles.browse_market default %, expected NULL',
          v_actual_default;
      END IF;
    ELSE
      v_expected_default := v_column.expected_default;

      IF regexp_replace(
           coalesce(v_actual_default, ''),
           '::(text|numeric|boolean)$',
           '',
           'g'
         ) IS DISTINCT FROM v_expected_default THEN
        RAISE EXCEPTION
          'FAIL: profiles.% default %, expected %',
          v_column.column_name, v_actual_default, v_expected_default;
      END IF;
    END IF;

    RAISE NOTICE 'PASS: profiles.% type/nullability/default',
      v_column.column_name;
  END LOOP;
END;
$$;

DO $$
DECLARE
  v_def text;
  v_normalized text;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND conname = 'profiles_feed_layout_check'
      AND contype = 'c'
      AND convalidated
  ) THEN
    RAISE EXCEPTION 'FAIL: profiles_feed_layout_check missing or invalid';
  END IF;

  SELECT pg_get_constraintdef(oid)
  INTO v_def
  FROM pg_constraint
  WHERE conrelid = 'public.profiles'::regclass
    AND conname = 'profiles_feed_layout_check';

  v_normalized := lower(regexp_replace(v_def, '\s+', '', 'g'));

  IF position('feed_layout' IN v_normalized) = 0
     OR position('list' IN v_normalized) = 0
     OR position('grid' IN v_normalized) = 0 THEN
    RAISE EXCEPTION 'FAIL: unexpected feed_layout CHECK definition: %', v_def;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND conname = 'profiles_browse_market_check'
      AND contype = 'c'
      AND convalidated
  ) THEN
    RAISE EXCEPTION 'FAIL: profiles_browse_market_check missing or invalid';
  END IF;

  SELECT pg_get_constraintdef(oid)
  INTO v_def
  FROM pg_constraint
  WHERE conrelid = 'public.profiles'::regclass
    AND conname = 'profiles_browse_market_check';

  v_normalized := lower(regexp_replace(v_def, '\s+', '', 'g'));

  IF position('browse_market' IN v_normalized) = 0
     OR position('isnull' IN v_normalized) = 0
     OR position('jo' IN v_normalized) = 0
     OR position('sa' IN v_normalized) = 0
     OR position('lb' IN v_normalized) = 0
     OR position('ps' IN v_normalized) = 0
     OR position('sy' IN v_normalized) = 0 THEN
    RAISE EXCEPTION 'FAIL: unexpected browse_market CHECK definition: %', v_def;
  END IF;

  RAISE NOTICE 'PASS: both profile CHECK constraints exist and are validated';
END;
$$;


DO $$
DECLARE
  v_type text;
  v_nullable boolean;
  v_default text;
BEGIN
  IF to_regclass('public.listings') IS NULL THEN
    RAISE EXCEPTION 'FAIL: public.listings table does not exist';
  END IF;

  SELECT
    format_type(a.atttypid, a.atttypmod),
    NOT a.attnotnull,
    pg_get_expr(d.adbin, d.adrelid)
  INTO v_type, v_nullable, v_default
  FROM pg_attribute a
  LEFT JOIN pg_attrdef d
    ON d.adrelid = a.attrelid
   AND d.adnum = a.attnum
  WHERE a.attrelid = 'public.listings'::regclass
    AND a.attname = 'is_demo'
    AND a.attnum > 0
    AND NOT a.attisdropped;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'FAIL: listings.is_demo is missing';
  END IF;

  IF v_type IS DISTINCT FROM 'boolean'
     OR v_nullable IS DISTINCT FROM false
     OR regexp_replace(coalesce(v_default, ''), '::boolean$', '', 'g')
        IS DISTINCT FROM 'false' THEN
    RAISE EXCEPTION
      'FAIL: listings.is_demo definition mismatch: type %, nullable %, default %',
      v_type, v_nullable, v_default;
  END IF;

  RAISE NOTICE 'PASS: listings.is_demo is boolean NOT NULL DEFAULT false';
END;
$$;

DO $$
DECLARE
  v_fn record;
  v_oid oid;
  v_result text;
BEGIN
  FOR v_fn IN
    SELECT *
    FROM (VALUES
      ('search_listings',
       'p_query text, p_market text, p_limit integer, p_offset integer, p_category_slug text, p_subcategory_slug text, p_min_price numeric, p_max_price numeric, p_city text, p_neighborhood text, p_attrs jsonb',
       'SETOF listings'),
      ('search_listings_v2',
       'p_query text, p_market text, p_limit integer, p_offset integer, p_category_slug text, p_subcategory_slug text, p_min_price numeric, p_max_price numeric, p_city text, p_neighborhood text, p_attrs jsonb',
       'SETOF listings'),
      ('search_listings_v2_intent',
       'p_query text, p_market text, p_limit integer, p_offset integer, p_category_slug text, p_subcategory_slug text, p_min_price numeric, p_max_price numeric, p_city text, p_neighborhood text, p_attrs jsonb',
       'SETOF listings'),
      ('search_listings_v2_intent_typo',
       'p_query text, p_market text, p_limit integer, p_offset integer, p_category_slug text, p_subcategory_slug text, p_min_price numeric, p_max_price numeric, p_city text, p_neighborhood text, p_attrs jsonb',
       'SETOF listings')
    ) AS expected(function_name, identity_args, result_type)
  LOOP
    SELECT p.oid, pg_get_function_result(p.oid)
    INTO v_oid, v_result
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = v_fn.function_name
      AND pg_get_function_identity_arguments(p.oid) = v_fn.identity_args;

    IF NOT FOUND THEN
      RAISE EXCEPTION
        'FAIL: public.% with expected signature is missing',
        v_fn.function_name;
    END IF;

    IF v_result IS DISTINCT FROM v_fn.result_type THEN
      RAISE EXCEPTION
        'FAIL: public.% returns %, expected %',
        v_fn.function_name, v_result, v_fn.result_type;
    END IF;

    RAISE NOTICE 'PASS: public.% signature and return type',
      v_fn.function_name;
  END LOOP;
END;
$$;

DO $$
DECLARE
  v_fn record;
  v_oid oid;
  v_result text;
BEGIN
  FOR v_fn IN
    SELECT *
    FROM (VALUES
      ('search_listings_hybrid',
       'p_query text, p_query_vector vector, p_market text, p_limit integer, p_offset integer, p_max_distance double precision, p_category_hint text, p_category_slug text, p_subcategory_slug text, p_min_price numeric, p_max_price numeric, p_city text, p_neighborhood text, p_attrs jsonb',
       'SETOF listings'),
      ('search_listings_semantic',
       'p_query_vector vector, p_market text, p_limit integer, p_offset integer, p_max_distance double precision',
       'SETOF listings'),
      ('listings_by_seller',
       'p_seller_key text, p_market text, p_limit integer, p_offset integer',
       'SETOF listings'),
      ('listing_passes_filters',
       'p_row listings, p_category_slug text, p_subcategory_slug text, p_min_price numeric, p_max_price numeric, p_city text, p_neighborhood text, p_attrs jsonb',
       'boolean')
    ) AS expected(function_name, identity_args, result_type)
  LOOP
    SELECT p.oid, pg_get_function_result(p.oid)
    INTO v_oid, v_result
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = v_fn.function_name
      AND pg_get_function_identity_arguments(p.oid) = v_fn.identity_args;

    IF NOT FOUND THEN
      RAISE EXCEPTION
        'FAIL: public.% with expected signature is missing',
        v_fn.function_name;
    END IF;

    IF v_result IS DISTINCT FROM v_fn.result_type THEN
      RAISE EXCEPTION
        'FAIL: public.% returns %, expected %',
        v_fn.function_name, v_result, v_fn.result_type;
    END IF;

    RAISE NOTICE 'PASS: public.% signature and return type',
      v_fn.function_name;
  END LOOP;
END;
$$;

ROLLBACK;
