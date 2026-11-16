
-- Block message and conversation writes while account deletion is in progress.
-- Covers direct RLS writes and the SECURITY DEFINER read-receipt RPC.
-- Message triggers execute inside the already-guarded message transaction.

BEGIN;

-- Conversation creation by the buyer.
DROP POLICY IF EXISTS "conversations_insert_as_buyer" ON public.conversations;
CREATE POLICY "conversations_insert_as_buyer"
  ON public.conversations
  FOR INSERT
  WITH CHECK (
    auth.uid() = buyer_id
    AND buyer_id <> seller_id
    AND private.account_user_can_write()
  );

-- Participant updates must also be blocked once either acting participant
-- has started account deletion.
DROP POLICY IF EXISTS "conversations_update_participants" ON public.conversations;
CREATE POLICY "conversations_update_participants"
  ON public.conversations
  FOR UPDATE
  USING (
    (auth.uid() = buyer_id OR auth.uid() = seller_id)
    AND private.account_user_can_write()
  )
  WITH CHECK (
    (auth.uid() = buyer_id OR auth.uid() = seller_id)
    AND private.account_user_can_write()
  );

-- A sender cannot create a message after the deletion lock is acquired.
DROP POLICY IF EXISTS "messages_insert_own" ON public.messages;
CREATE POLICY "messages_insert_own"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND private.account_user_can_write()
    AND EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  );

-- Preserve the existing sender-only soft-delete/update rule, with the lock.
DROP POLICY IF EXISTS "messages_soft_delete_own" ON public.messages;
CREATE POLICY "messages_soft_delete_own"
  ON public.messages
  FOR UPDATE
  USING (
    auth.uid() = sender_id
    AND private.account_user_can_write()
  )
  WITH CHECK (
    auth.uid() = sender_id
    AND private.account_user_can_write()
  );

-- SECURITY DEFINER bypasses RLS. Guard the read-receipt mutation explicitly.
CREATE OR REPLACE FUNCTION public.mark_messages_read(
  p_conversation_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated'
      USING ERRCODE = '42501';
  END IF;

  IF NOT private.account_user_can_write() THEN
    RAISE EXCEPTION 'Account deletion in progress'
      USING ERRCODE = '55000';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = p_conversation_id
      AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'Not a participant of conversation %', p_conversation_id
      USING ERRCODE = '42501';
  END IF;

  UPDATE public.messages
  SET read_at = now()
  WHERE conversation_id = p_conversation_id
    AND sender_id <> auth.uid()
    AND read_at IS NULL;
END;
$function$;

COMMIT;
