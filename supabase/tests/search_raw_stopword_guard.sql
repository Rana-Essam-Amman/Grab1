-- search_raw_stopword_guard.sql
-- Verifies P6 (typo fallback) + P3 (stopword bypass) fixes.
-- Runs only on disposable CI database. All changes rolled back.

BEGIN;

DO $test$
DECLARE
  v_count integer;
  v_meaningful boolean;
  v_stopword_exists boolean;
BEGIN
  -- ============================================================
  -- T1: Raw stopwords recognized before normalization
  -- ============================================================
  SELECT public.query_has_meaningful_tokens('على عن')
  INTO v_meaningful;
  IF v_meaningful IS DISTINCT FROM FALSE THEN
    RAISE EXCEPTION 'T1 FAIL: على عن returned % (expected false)', v_meaningful;
  END IF;
  RAISE NOTICE 'PASS T1: على عن has no meaningful tokens';

  -- ============================================================
  -- T2: Name علي remains meaningful
  -- ============================================================
  SELECT public.query_has_meaningful_tokens('علي')
  INTO v_meaningful;
  IF v_meaningful IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'T2 FAIL: علي returned % (expected true)', v_meaningful;
  END IF;
  RAISE NOTICE 'PASS T2: علي remains meaningful';

  -- ============================================================
  -- T3: Mixed stopword + meaningful
  -- ============================================================
  SELECT public.query_has_meaningful_tokens('على كامري')
  INTO v_meaningful;
  IF v_meaningful IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'T3 FAIL: على كامري must remain meaningful';
  END IF;
  RAISE NOTICE 'PASS T3';

  -- ============================================================
  -- T4: Stopword data integrity
  -- ============================================================
  SELECT EXISTS (
    SELECT 1 FROM public.search_stopwords WHERE word = 'على'
  ) INTO v_stopword_exists;
  IF NOT v_stopword_exists THEN
    RAISE EXCEPTION 'T4 FAIL: raw stopword على missing';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.search_stopwords WHERE word = 'علي'
  ) THEN
    RAISE EXCEPTION 'T4 FAIL: علي must NEVER be a stopword';
  END IF;
  RAISE NOTICE 'PASS T4: stopword data integrity';

  -- ============================================================
  -- T5: Stopword-only query returns 0 from tiered v2
  -- ============================================================
  SELECT count(*)
  INTO v_count
  FROM public.search_listings_v4_tiered_v2('على عن', 'JO', 100, 0);
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'T5 FAIL: على عن returned % rows (expected 0)', v_count;
  END IF;
  RAISE NOTICE 'PASS T5';

  -- ============================================================
  -- T6: Typo false positives eliminated in fallback
  -- ============================================================
  SELECT count(*)
  INTO v_count
  FROM public.search_listings_v2_intent_typo('تسله', 'JO', 100, 0)
  WHERE title ILIKE '%كيا%' OR title ILIKE '%kia%'
     OR title ILIKE '%هيونداي%' OR title ILIKE '%hyundai%'
     OR title ILIKE '%حشائش%' OR title ILIKE '%lawn%';
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'T6 FAIL: تسله returned % unrelated rows', v_count;
  END IF;
  RAISE NOTICE 'PASS T6: تسله excludes Kia/Hyundai/Lawn';

  -- ============================================================
  -- T7: Real typos still work
  -- ============================================================
  SELECT count(*)
  INTO v_count
  FROM public.search_listings_v2_intent_typo('كمری', 'JO', 100, 0)
  WHERE title ILIKE '%كامري%' OR title ILIKE '%camry%';
  IF v_count < 1 THEN
    RAISE EXCEPTION 'T7 FAIL: كمری did not find Camry listings';
  END IF;
  RAISE NOTICE 'PASS T7: كمری finds Camry';

  -- ============================================================
  -- T8: Exact match unaffected
  -- ============================================================
  SELECT count(*)
  INTO v_count
  FROM public.search_listings_v4_tiered_v2('تويوتا كامري', 'JO', 100, 0);
  IF v_count < 1 THEN
    RAISE EXCEPTION 'T8 FAIL: exact Toyota Camry query returned 0';
  END IF;
  RAISE NOTICE 'PASS T8: exact match still works';

  RAISE NOTICE 'ALL RAW STOPWORD GUARD TESTS PASSED';
END
$test$;

ROLLBACK;
