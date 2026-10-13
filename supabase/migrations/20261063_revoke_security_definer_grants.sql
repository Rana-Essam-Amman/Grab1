-- 20261063_revoke_security_definer_grants.sql
-- Revoke unintended EXECUTE grants on SECURITY DEFINER functions.
--
-- Root cause: PostgreSQL grants EXECUTE on new functions to PUBLIC by
-- default. Several migrations relied on that default plus Supabase's
-- per-schema default privileges, exposing privileged functions to anon.
--
-- Critical exposures fixed:
--   test_hf_endpoint()           — anon → outbound HTTP via pg_net
--   apply_premium_purchase(uuid) — no internal auth; anon with valid tx_id
--   confirm_orphan_deletion      — anon → delete storage files
--   detect_orphan_images / get_due_orphan_paths — path enumeration
--   expire_premiums / refresh_seller_rating     — forced global recompute
--
-- Classification is verified by a caller audit (grep across src/,
-- scripts/, supabase/functions/, and cron.job). See commit message.

begin;

-- =========================================================================
-- 1. Debug endpoint — DROP entirely (no callers, outbound HTTP risk)
-- =========================================================================
drop function if exists public.test_hf_endpoint();

-- =========================================================================
-- 2. anon + authenticated (guest search uses detect_query_category)
-- =========================================================================
revoke execute on function public.detect_query_category(text)
  from public, anon, authenticated;
grant execute on function public.detect_query_category(text)
  to anon, authenticated;

-- =========================================================================
-- 3. authenticated only (frontend RPCs, internal auth checks verified)
-- =========================================================================
revoke execute on function public.bump_listing(uuid)
  from public, anon, authenticated;
grant execute on function public.bump_listing(uuid)
  to authenticated;

revoke execute on function public.submit_seller_review(uuid, smallint, text)
  from public, anon, authenticated;
grant execute on function public.submit_seller_review(uuid, smallint, text)
  to authenticated;

revoke execute on function public.get_unread_notification_count()
  from public, anon, authenticated;
grant execute on function public.get_unread_notification_count()
  to authenticated;

revoke execute on function public.mark_all_notifications_read()
  from public, anon, authenticated;
grant execute on function public.mark_all_notifications_read()
  to authenticated;

revoke execute on function public.mark_notification_read(uuid)
  from public, anon, authenticated;
grant execute on function public.mark_notification_read(uuid)
  to authenticated;

revoke execute on function public.mark_messages_read(uuid)
  from public, anon, authenticated;
grant execute on function public.mark_messages_read(uuid)
  to authenticated;

-- =========================================================================
-- 4. service_role only (admin/scripts/maintenance)
-- =========================================================================
revoke execute on function public.apply_premium_purchase(uuid)
  from public, anon, authenticated;
grant execute on function public.apply_premium_purchase(uuid)
  to service_role;

revoke execute on function public.detect_orphan_images(integer)
  from public, anon, authenticated;
grant execute on function public.detect_orphan_images(integer)
  to service_role;

revoke execute on function public.get_due_orphan_paths()
  from public, anon, authenticated;
grant execute on function public.get_due_orphan_paths()
  to service_role;

revoke execute on function public.confirm_orphan_deletion(text[])
  from public, anon, authenticated;
grant execute on function public.confirm_orphan_deletion(text[])
  to service_role;

revoke execute on function public.expire_premiums()
  from public, anon, authenticated;
grant execute on function public.expire_premiums()
  to service_role;

revoke execute on function public.fox_enqueue_embedding(text, uuid, text)
  from public, anon, authenticated;
grant execute on function public.fox_enqueue_embedding(text, uuid, text)
  to service_role;

-- =========================================================================
-- 5. postgres only (cron-owned; explicit for ownership-change safety)
-- =========================================================================
revoke execute on function public.dispatch_search_embedding_jobs()
  from public, anon, authenticated;
grant execute on function public.dispatch_search_embedding_jobs()
  to postgres;

revoke execute on function public.recover_stale_embedding_jobs()
  from public, anon, authenticated;
grant execute on function public.recover_stale_embedding_jobs()
  to postgres;

revoke execute on function public.sweep_orphan_listings()
  from public, anon, authenticated;
grant execute on function public.sweep_orphan_listings()
  to postgres;

-- =========================================================================
-- 6. Trigger-only functions — revoke all direct client execution
--    (Triggers fire regardless of EXECUTE grant.)
--    get_user_display_name() is called only from notify_on_new_message.
-- =========================================================================
revoke execute on function public.handle_new_user()
  from public, anon, authenticated, service_role;

revoke execute on function public.notify_on_new_message()
  from public, anon, authenticated, service_role;

revoke execute on function public.notify_on_new_review()
  from public, anon, authenticated, service_role;

revoke execute on function public.set_listings_search_text()
  from public, anon, authenticated, service_role;

revoke execute on function public.touch_conversation_on_new_message()
  from public, anon, authenticated, service_role;

revoke execute on function public.propagate_profile_name_to_listings()
  from public, anon, authenticated, service_role;

revoke execute on function public.check_error_logs_rate_limit()
  from public, anon, authenticated, service_role;

revoke execute on function public.check_listing_rate_limit()
  from public, anon, authenticated, service_role;

revoke execute on function public.get_user_display_name(uuid)
  from public, anon, authenticated, service_role;

revoke execute on function public.refresh_seller_rating()
  from public, anon, authenticated, service_role;

revoke execute on function public.enqueue_listing_embedding()
  from public, anon, authenticated, service_role;

-- =========================================================================
-- 7. Default privileges — global (per-schema cannot revoke global default)
-- =========================================================================
alter default privileges for role postgres
  revoke execute on functions from public, anon, authenticated;

alter default privileges for role supabase_admin
  revoke execute on functions from public, anon, authenticated;

commit;

-- Verification (run separately after apply):
--   select proname, proacl from pg_proc 
--   where pronamespace = 'public'::regnamespace 
--     and proname in ('bump_listing', 'test_hf_endpoint', 'detect_query_category');
