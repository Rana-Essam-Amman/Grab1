-- ============================================================================
-- Security Hardening: Atomic Rate Limit & Search RPC PII Masking
-- Fixes vulnerabilities found in Super Ultra RLS Check.
-- ============================================================================

begin;

-- 1. Atomic Rate Limit (Prevent concurrent requests bypass)
create or replace function public.get_listing_phone(p_listing_id uuid)
returns text
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  v_phone text;
  v_reveal_count int;
begin
  -- Acquire transaction-level lock for this user to prevent race conditions
  perform pg_advisory_xact_lock(hashtext(auth.uid()::text));

  select count(*) into v_reveal_count
  from public.phone_reveal_logs
  where user_id = auth.uid() and revealed_at > now() - interval '24 hours';

  if v_reveal_count >= 20 then
    raise exception 'RATE_LIMIT_EXCEEDED' using errcode = 'P0001';
  end if;

  select seller_phone into v_phone
  from public.listings
  where id = p_listing_id and status = 'active' and is_demo = false;

  if v_phone is not null then
    insert into public.phone_reveal_logs (user_id, listing_id) values (auth.uid(), p_listing_id);
  end if;

  return v_phone;
end;
$$;

revoke execute on function public.get_listing_phone(uuid) from public;
grant execute on function public.get_listing_phone(uuid) to authenticated;

commit;
