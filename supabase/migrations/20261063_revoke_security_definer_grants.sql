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
-- All REVOKE/GRANT statements are wrapped in DO blocks with
-- to_regprocedure() existence checks. This handles schema drift:
-- several functions (fox_enqueue_embedding, dispatch_search_embedding_jobs,
-- etc.) exist in production but not in the CI migration chain.

begin;

-- =========================================================================
-- 1. Debug endpoint — DROP entirely (no callers, outbound HTTP risk)
-- =========================================================================
drop function if exists public.test_hf_endpoint();

-- =========================================================================
-- 2. Client-facing + cron + admin functions (existence-checked)
-- =========================================================================
do $$
declare
  v_rules text[] := array[
    -- anon + authenticated (guest search uses detect_query_category)
    'public.detect_query_category(text)|anon, authenticated',
    -- authenticated only (frontend RPCs with internal auth checks)
    'public.bump_listing(uuid)|authenticated',
    'public.submit_seller_review(uuid, smallint, text)|authenticated',
    'public.get_unread_notification_count()|authenticated',
    'public.mark_all_notifications_read()|authenticated',
    'public.mark_notification_read(uuid)|authenticated',
    'public.mark_messages_read(uuid)|authenticated',
    -- service_role only (admin/scripts/maintenance)
    'public.apply_premium_purchase(uuid)|service_role',
    'public.detect_orphan_images(integer)|service_role',
    'public.get_due_orphan_paths()|service_role',
    'public.confirm_orphan_deletion(text[])|service_role',
    'public.expire_premiums()|service_role',
    'public.fox_enqueue_embedding(text, uuid, text)|service_role',
    -- postgres only (cron-owned; explicit for ownership-change safety)
    'public.dispatch_search_embedding_jobs()|postgres',
    'public.recover_stale_embedding_jobs()|postgres',
    'public.sweep_orphan_listings()|postgres'
  ];
  v_rule text;
  v_sig text;
  v_grantee text;
begin
  foreach v_rule in array v_rules loop
    v_sig := split_part(v_rule, '|', 1);
    v_grantee := split_part(v_rule, '|', 2);
    if to_regprocedure(v_sig) is not null then
      execute format(
        'revoke execute on function %s from public, anon, authenticated',
        v_sig
      );
      execute format(
        'grant execute on function %s to %s',
        v_sig, v_grantee
      );
      raise notice 'applied grants: % → %', v_sig, v_grantee;
    else
      raise notice 'skipped (not present): %', v_sig;
    end if;
  end loop;
end $$;

-- =========================================================================
-- 3. Trigger-only functions — revoke all direct client execution
--    (Triggers fire regardless of EXECUTE grant.)
--    get_user_display_name() is called only from notify_on_new_message.
-- =========================================================================
do $$
declare
  v_sigs text[] := array[
    'public.handle_new_user()',
    'public.notify_on_new_message()',
    'public.notify_on_new_review()',
    'public.set_listings_search_text()',
    'public.touch_conversation_on_new_message()',
    'public.propagate_profile_name_to_listings()',
    'public.check_error_logs_rate_limit()',
    'public.check_listing_rate_limit()',
    'public.get_user_display_name(uuid)',
    'public.refresh_seller_rating()',
    'public.enqueue_listing_embedding()'
  ];
  v_sig text;
begin
  foreach v_sig in array v_sigs loop
    if to_regprocedure(v_sig) is not null then
      execute format(
        'revoke execute on function %s from public, anon, authenticated, service_role',
        v_sig
      );
      raise notice 'revoked all: %', v_sig;
    else
      raise notice 'skipped (not present): %', v_sig;
    end if;
  end loop;
end $$;

-- =========================================================================
-- 4. Default privileges — global (per-schema cannot revoke global default)
--    supabase_admin intentionally excluded: postgres lacks privileges to
--    alter its defaults; a superuser-level role must do that separately.
-- =========================================================================
alter default privileges for role postgres
  revoke execute on functions from public, anon, authenticated;

commit;
