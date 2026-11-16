-- Prevent comment and like writes while an account deletion is in progress.
-- Protects both direct table writes (RLS) and SECURITY DEFINER RPC paths.
-- This is one stage of the account-deletion write-path audit; other write paths
-- must be reviewed separately before the deletion workflow is considered complete.

BEGIN;

-- Direct client INSERTs into comments must be blocked for locked accounts.
DROP POLICY IF EXISTS "users_insert_own_comments" ON public.post_comments;

CREATE POLICY "users_insert_own_comments"
  ON public.post_comments
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND private.account_user_can_write()
  );


-- Direct client writes to likes must be blocked while deletion is pending.
-- The separate public SELECT policy remains unchanged.
DROP POLICY IF EXISTS "users_manage_own_likes" ON public.post_likes;

CREATE POLICY "users_manage_own_likes"
  ON public.post_likes
  FOR ALL
  USING (
    auth.uid() = user_id
    AND private.account_user_can_write()
  )
  WITH CHECK (
    auth.uid() = user_id
    AND private.account_user_can_write()
  );


-- SECURITY DEFINER bypasses RLS, so the RPC must enforce the lock itself.
CREATE OR REPLACE FUNCTION public.add_post_comment(
  p_listing_id uuid,
  p_content text,
  p_parent_id uuid DEFAULT NULL::uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid;
  v_trimmed text;
  v_id uuid;
BEGIN
  v_uid := auth.uid();

  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT private.account_user_can_write() THEN
    RAISE EXCEPTION 'Account deletion in progress'
      USING ERRCODE = '55000';
  END IF;

  v_trimmed := trim(p_content);

  IF length(v_trimmed) < 1 OR length(v_trimmed) > 1000 THEN
    RAISE EXCEPTION 'Invalid length';
  END IF;

  INSERT INTO public.post_comments (
    listing_id,
    user_id,
    content,
    parent_comment_id
  )
  VALUES (
    p_listing_id,
    v_uid,
    v_trimmed,
    p_parent_id
  )
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('id', v_id, 'success', true);
END;
$function$;


-- SECURITY DEFINER bypasses RLS, so guard both the like and unlike paths.
CREATE OR REPLACE FUNCTION public.toggle_post_like(p_listing_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid;
  v_existing uuid;
  v_count bigint;
BEGIN
  v_uid := auth.uid();

  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT private.account_user_can_write() THEN
    RAISE EXCEPTION 'Account deletion in progress'
      USING ERRCODE = '55000';
  END IF;

  SELECT id
    INTO v_existing
    FROM public.post_likes
    WHERE listing_id = p_listing_id
      AND user_id = v_uid;

  IF v_existing IS NOT NULL THEN
    DELETE FROM public.post_likes
      WHERE id = v_existing;
  ELSE
    INSERT INTO public.post_likes (listing_id, user_id)
      VALUES (p_listing_id, v_uid);
  END IF;

  SELECT count(*)
    INTO v_count
    FROM public.post_likes
    WHERE listing_id = p_listing_id;

  RETURN jsonb_build_object(
    'liked', v_existing IS NULL,
    'like_count', v_count
  );
END;
$function$;

COMMIT;
