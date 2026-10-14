BEGIN;

DO $$
DECLARE
  v_type oid;
  v_not_null boolean;
  v_default text;
  v_marked bigint;
  v_target_exists boolean;
  v_production_like boolean;
BEGIN
  SELECT
    a.atttypid,
    a.attnotnull,
    pg_get_expr(d.adbin, d.adrelid)
  INTO v_type, v_not_null, v_default
  FROM pg_attribute a
  LEFT JOIN pg_attrdef d
    ON d.adrelid = a.attrelid
   AND d.adnum = a.attnum
  WHERE a.attrelid = 'public.listings'::regclass
    AND a.attname = 'is_demo'
    AND a.attnum > 0
    AND NOT a.attisdropped;

  IF NOT FOUND
     OR v_type <> 'boolean'::regtype
     OR v_not_null IS DISTINCT FROM true
     OR v_default IS DISTINCT FROM 'false'
  THEN
    RAISE EXCEPTION
      'FAIL: is_demo must be boolean NOT NULL DEFAULT false';
  END IF;

  SELECT count(*) INTO v_marked
  FROM public.listings
  WHERE is_demo IS TRUE;

  SELECT EXISTS (
    SELECT 1
    FROM public.listings
    WHERE id = ANY(ARRAY[
      '93ef8daa-2cd7-455f-b41a-1185220d8155'::uuid,
      '0de7b0a6-67b6-44f4-b8f0-db40780ca443'::uuid,
      '4a681f0d-4e0e-4466-916a-602c3ea32836'::uuid,
      'ef44ca01-0055-4e4a-b776-51e0d5558de9'::uuid,
      '1e71ace8-4dba-4b74-945c-20fa6fc12d4e'::uuid
    ])
  ) INTO v_target_exists;

  v_production_like := v_marked > 0 OR v_target_exists;

  IF NOT v_production_like THEN
    RAISE NOTICE
      'schema_demo_marker: clean local mode; schema verified, data counts skipped';
    RETURN;
  END IF;

  IF v_marked <> 80 THEN
    RAISE EXCEPTION
      'FAIL: production-like DB has % is_demo=true rows; expected 80',
      v_marked;
  END IF;

  IF (SELECT count(*) FROM public.listings WHERE is_demo IS FALSE) <> 3 THEN
    RAISE EXCEPTION
      'FAIL: production-like DB must have exactly 3 is_demo=false rows';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.listings
    WHERE id = '6005a510-ef1b-4fcf-bf3c-e70d33dc58bb'::uuid
      AND is_demo IS FALSE
  ) THEN
    RAISE EXCEPTION 'FAIL: Ommmmmmm must remain is_demo=false';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.listings
    WHERE id = '6d9627bf-2063-4145-be16-496785d6eee9'::uuid
      AND is_demo IS FALSE
  ) THEN
    RAISE EXCEPTION 'FAIL: Toyota Camry must remain is_demo=false';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.listings
    WHERE id = '96ccbe26-b889-47db-8f50-be556fbbe713'::uuid
      AND is_demo IS FALSE
  ) THEN
    RAISE EXCEPTION 'FAIL: jeans listing must remain is_demo=false';
  END IF;

  RAISE NOTICE
    'schema_demo_marker: production-like mode; all marker assertions passed';
END
$$;

ROLLBACK;
