-- 20261085_add_is_demo.sql
-- Wave 2A: schema only. No policy, search, or feed behavior changes.

BEGIN;

SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '15s';

DO $preflight$
BEGIN
  IF to_regclass('public.listings') IS NULL THEN
    RAISE EXCEPTION
      'Wave 2A abort: public.listings does not exist';
  END IF;
END
$preflight$;

LOCK TABLE public.listings IN ACCESS EXCLUSIVE MODE;

DO $column_guard$
DECLARE
  v_type_oid oid;
  v_not_null boolean;
  v_default text;
BEGIN
  SELECT
    a.atttypid,
    a.attnotnull,
    pg_get_expr(d.adbin, d.adrelid)
  INTO v_type_oid, v_not_null, v_default
  FROM pg_attribute AS a
  LEFT JOIN pg_attrdef AS d
    ON d.adrelid = a.attrelid
   AND d.adnum = a.attnum
  WHERE a.attrelid = 'public.listings'::regclass
    AND a.attname = 'is_demo'
    AND a.attnum > 0
    AND NOT a.attisdropped;

  IF NOT FOUND THEN
    ALTER TABLE public.listings
      ADD COLUMN is_demo boolean NOT NULL DEFAULT false;
  ELSE
    IF v_type_oid <> 'boolean'::regtype THEN
      RAISE EXCEPTION
        'Wave 2A abort: listings.is_demo exists with type %, expected boolean',
        format_type(v_type_oid, NULL);
    END IF;
    IF v_not_null IS DISTINCT FROM true THEN
      RAISE EXCEPTION
        'Wave 2A abort: listings.is_demo exists but is nullable';
    END IF;
    IF v_default IS DISTINCT FROM 'false' THEN
      RAISE EXCEPTION
        'Wave 2A abort: listings.is_demo default is %, expected false',
        coalesce(v_default, '<no default>');
    END IF;
  END IF;
END
$column_guard$;

DO $postcondition$
DECLARE
  v_type_oid oid;
  v_not_null boolean;
  v_default text;
BEGIN
  SELECT
    a.atttypid,
    a.attnotnull,
    pg_get_expr(d.adbin, d.adrelid)
  INTO v_type_oid, v_not_null, v_default
  FROM pg_attribute AS a
  LEFT JOIN pg_attrdef AS d
    ON d.adrelid = a.attrelid
   AND d.adnum = a.attnum
  WHERE a.attrelid = 'public.listings'::regclass
    AND a.attname = 'is_demo'
    AND a.attnum > 0
    AND NOT a.attisdropped;

  IF NOT FOUND
     OR v_type_oid <> 'boolean'::regtype
     OR v_not_null IS DISTINCT FROM true
     OR v_default IS DISTINCT FROM 'false'
  THEN
    RAISE EXCEPTION
      'Wave 2A abort: is_demo definition is not boolean NOT NULL DEFAULT false';
  END IF;
END
$postcondition$;

COMMIT;
