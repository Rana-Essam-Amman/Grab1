-- 20261017_notifications_triggers.sql
-- Notifications PR 2: DB triggers that create notifications on real events.
--
-- Design (Facebook/Etsy pattern):
--   - DB-level triggers > client-side creation. Cannot be forgotten, cannot be forged.
--   - SECURITY DEFINER bypasses notifications RLS (no INSERT policy needed).
--   - Recipients computed server-side from source rows; never trust client.

-- Helper: display name fallback chain (nickname → first_name → 'User').
create or replace function public.get_user_display_name(p_user_id uuid)
returns text
language sql
security definer
set search_path to 'public'
as $$
  select coalesce(
    nullif(trim(coalesce(nickname, '')), ''),
    nullif(trim(coalesce(first_name, '')), ''),
    'User'
  )
  from public.profiles
  where id = p_user_id
  limit 1;
$$;

-- Trigger function: message → notify the other party in the conversation.
create or replace function public.notify_on_new_message()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_buyer uuid;
  v_seller uuid;
  v_recipient uuid;
  v_sender_name text;
  v_preview text;
begin
  select buyer_id, seller_id
    into v_buyer, v_seller
    from public.conversations
    where id = new.conversation_id;

  if v_buyer is null or v_seller is null then
    return new;
  end if;

  if new.sender_id = v_buyer then
    v_recipient := v_seller;
  elsif new.sender_id = v_seller then
    v_recipient := v_buyer;
  else
    return new;
  end if;

  if v_recipient is null then
    return new;
  end if;

  v_sender_name := public.get_user_display_name(new.sender_id);
  v_preview := left(coalesce(new.text, ''), 100);

  insert into public.notifications (user_id, type, payload)
  values (
    v_recipient,
    'message',
    jsonb_build_object(
      'conversationId', new.conversation_id,
      'senderId', new.sender_id,
      'senderName', v_sender_name,
      'preview', v_preview
    )
  );

  return new;
end;
$$;

drop trigger if exists messages_notify_recipient on public.messages;
create trigger messages_notify_recipient
  after insert on public.messages
  for each row execute function public.notify_on_new_message();

-- Trigger function: seller_review → notify the seller.
create or replace function public.notify_on_new_review()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_reviewer_name text;
begin
  if new.seller_id is null or new.reviewer_id is null then
    return new;
  end if;

  if new.seller_id = new.reviewer_id then
    return new;
  end if;

  v_reviewer_name := public.get_user_display_name(new.reviewer_id);

  insert into public.notifications (user_id, type, payload)
  values (
    new.seller_id,
    'review',
    jsonb_build_object(
      'listingId', new.listing_id,
      'rating', new.rating,
      'reviewerName', v_reviewer_name
    )
  );

  return new;
end;
$$;

drop trigger if exists seller_reviews_notify_seller on public.seller_reviews;
create trigger seller_reviews_notify_seller
  after insert on public.seller_reviews
  for each row execute function public.notify_on_new_review();
