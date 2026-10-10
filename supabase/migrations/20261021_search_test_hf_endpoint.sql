-- 20261021_search_test_hf_endpoint.sql
-- Rollback: DROP FUNCTION IF EXISTS public.test_hf_endpoint();

CREATE OR REPLACE FUNCTION public.test_hf_endpoint()
RETURNS TABLE(status text, http_status integer, content_prefix text, error_msg text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_request_id bigint;
  v_content text;
  v_status integer;
  v_error text;
  v_url text := 'https://router.huggingface.co/hf-inference/models/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/pipeline/feature-extraction';
  i integer;
BEGIN
  SELECT net.http_post(
    url := v_url,
    body := '{"inputs": "hello"}'::jsonb,
    headers := '{"Content-Type": "application/json"}'::jsonb,
    timeout_milliseconds := 10000
  ) INTO v_request_id;

  FOR i IN 1..20 LOOP
    SELECT r.content, r.status_code, r.error_msg
    INTO v_content, v_status, v_error
    FROM net._http_response r
    WHERE r.id = v_request_id;

    IF FOUND THEN
      EXIT;
    END IF;
    PERFORM pg_sleep(0.15);
  END LOOP;

  IF v_status = 200 AND v_content IS NOT NULL THEN
    RETURN QUERY SELECT 'OK'::text, v_status, left(v_content, 100), NULL::text;
  ELSE
    RETURN QUERY SELECT 'FAILED'::text, v_status, left(coalesce(v_content, ''), 100), coalesce(v_error, 'timeout or no response');
  END IF;
END;
$function$;
