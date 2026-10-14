BEGIN;

SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '15s';

DO $$
BEGIN
  IF to_regclass('public.profiles') IS NULL THEN
    RAISE EXCEPTION
      'Wave 4 schema reconciliation failed: public.profiles does not exist';
  END IF;

  RAISE NOTICE 'PASS: public.profiles exists';
END;
$$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS feed_layout text NOT NULL DEFAULT 'list',
  ADD COLUMN IF NOT EXISTS browse_market text,
  ADD COLUMN IF NOT EXISTS vip_store boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS vip_store_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS rating_avg numeric(3,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_count integer NOT NULL DEFAULT 0;

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
      ('rating_avg', 'numeric(3,2)', false, '0'),
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
      RAISE EXCEPTION
        'Wave 4 schema reconciliation failed: profiles.% is missing',
        v_column.column_name;
    END IF;

    IF v_actual_type IS DISTINCT FROM v_column.data_type THEN
      RAISE EXCEPTION
        'Wave 4 schema reconciliation failed: profiles.% type is %, expected %',
        v_column.column_name, v_actual_type, v_column.data_type;
    END IF;

    IF v_actual_nullable IS DISTINCT FROM v_column.is_nullable THEN
      RAISE EXCEPTION
        'Wave 4 schema reconciliation failed: profiles.% nullable is %, expected %',
        v_column.column_name, v_actual_nullable, v_column.is_nullable;
    END IF;

    IF v_column.expected_default IS NULL THEN
      IF v_actual_default IS NOT NULL
         AND lower(regexp_replace(v_actual_default, '\s+', '', 'g'))
             NOT IN (
               'null',
               'null::text',
               'null::timestampwithtimezone',
               'null::numeric',
               'null::boolean'
             ) THEN
        RAISE EXCEPTION
          'Wave 4 schema reconciliation failed: profiles.% default is %, expected NULL',
          v_column.column_name, v_actual_default;
      END IF;
    ELSE
      v_expected_default := v_column.expected_default;

      IF regexp_replace(
           coalesce(v_actual_default, ''),
           '::(text|numeric|boolean|timestampwithtimezone)$',
           '',
           'g'
         ) IS DISTINCT FROM v_expected_default THEN
        RAISE EXCEPTION
          'Wave 4 schema reconciliation failed: profiles.% default is %, expected %',
          v_column.column_name, v_actual_default, v_expected_default;
      END IF;
    END IF;

    RAISE NOTICE 'PASS: profiles.% definition verified', v_column.column_name;
  END LOOP;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND conname = 'profiles_feed_layout_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_feed_layout_check
      CHECK (feed_layout IN ('list', 'grid'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND conname = 'profiles_browse_market_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_browse_market_check
      CHECK (
        browse_market IS NULL
        OR browse_market IN ('JO', 'SA', 'LB', 'PS', 'SY')
      );
  END IF;

  RAISE NOTICE 'PASS: profile CHECK constraints created or already present';
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
    RAISE EXCEPTION
      'Wave 4 schema reconciliation failed: profiles_feed_layout_check missing, invalid, or not validated';
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
    RAISE EXCEPTION
      'Wave 4 schema reconciliation failed: unexpected feed_layout CHECK definition: %',
      v_def;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND conname = 'profiles_browse_market_check'
      AND contype = 'c'
      AND convalidated
  ) THEN
    RAISE EXCEPTION
      'Wave 4 schema reconciliation failed: profiles_browse_market_check missing, invalid, or not validated';
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
    RAISE EXCEPTION
      'Wave 4 schema reconciliation failed: unexpected browse_market CHECK definition: %',
      v_def;
  END IF;

  RAISE NOTICE 'PASS: both profile CHECK constraints verified';
END;
$$;

COMMIT;
