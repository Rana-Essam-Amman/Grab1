-- 20261100_simplify_premium_to_featured_only.sql
-- Restricts premium product to 'featured' only (14 days fixed).
-- Adds fairness cap: max 3 active featured listings per non-admin user.
-- Admin (Sufyanyounis83@gmail.com) exempt from fairness cap.
-- Cleans up unused variables in admin_record_payment.
-- Does NOT touch the 13 grandfathered admin premium listings (null expiry).

begin;

-- Guard: table must be empty or only contain featured transactions
do $$ 
begin
  if exists (select 1 from public.premium_transactions where product <> 'featured') then
    raise exception 'Cannot restrict: non-featured transactions exist';
  end if;
end $$;

-- 1. Restrict product CHECK to 'featured' only
alter table public.premium_transactions 
  drop constraint if exists premium_transactions_product_check;
alter table public.premium_transactions
  add constraint premium_transactions_product_check 
  check (product = 'featured');

-- 2. Simplify apply_premium_purchase — featured only + fairness + 14 days
create or replace function public.apply_premium_purchase(p_transaction_id uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_tx public.premium_transactions%rowtype;
  v_listing_owner uuid;
  v_active_count int;
  v_admin_email constant text := 'sufyanyounis83@gmail.com';
  v_user_email text;
  v_new_expiry timestamptz;
  v_fairness_cap constant int := 3;
begin
  select * into v_tx from public.premium_transactions
    where id = p_transaction_id for update;

  if v_tx.id is null then raise exception 'transaction not found'; end if;
  if v_tx.status <> 'paid' then raise exception 'transaction not paid (status=%)', v_tx.status; end if;
  if v_tx.applied_at is not null then return; end if;
  if v_tx.product <> 'featured' then raise exception 'only featured product supported'; end if;
  if v_tx.listing_id is null then raise exception 'listing required for featured'; end if;

  -- Verify listing ownership
  select user_id into v_listing_owner from public.listings where id = v_tx.listing_id;
  if v_listing_owner is null then raise exception 'listing not found'; end if;
  if v_listing_owner <> v_tx.user_id then raise exception 'listing ownership mismatch'; end if;

  -- Fairness check (admin exempt)
  select email into v_user_email from auth.users where id = v_tx.user_id;
  if v_user_email is null or lower(v_user_email) <> lower(v_admin_email) then
    -- Lock user's profile row to serialize concurrent premium operations
    perform 1 from public.profiles where id = v_tx.user_id for update;

    select count(*) into v_active_count
    from public.listings
    where user_id = v_tx.user_id
      and is_premium = true
      and (premium_expires_at is null or premium_expires_at > now())
      and id <> v_tx.listing_id;

    if v_active_count >= v_fairness_cap then
      raise exception 'MAX_FEATURED_REACHED: max % active featured listings per user', v_fairness_cap
        using errcode = '23514';
    end if;
  end if;

  -- Apply: 14 days (extend if still active, else from now)
  select greatest(coalesce(premium_expires_at, now()), now()) + interval '14 days'
    into v_new_expiry
    from public.listings where id = v_tx.listing_id;

  update public.listings
    set is_premium = true, premium_expires_at = v_new_expiry
    where id = v_tx.listing_id;

  update public.premium_transactions set applied_at = now() where id = p_transaction_id;
end;
$function$;

-- 3. Simplify admin_record_payment — featured only + 14 days + ownership check
create or replace function public.admin_record_payment(
  p_user_id uuid,
  p_listing_id uuid,
  p_product text,
  p_amount_cents integer,
  p_currency text
)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_duration constant int := 14;
  v_tx_id uuid;
begin
  if v_uid is null then raise exception 'Unauthorized' using errcode = '42501'; end if;
  v_email := (select email from auth.users where id = v_uid);
  if v_email is null or lower(v_email) <> lower('Sufyanyounis83@gmail.com') then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  if p_product <> 'featured' then
    raise exception 'only featured product supported' using errcode = '22023';
  end if;
  if p_amount_cents is null or p_amount_cents <= 0 then
    raise exception 'Invalid amount' using errcode = '22023';
  end if;
  if p_currency not in ('JOD','SAR','USD','ILS','SYP') then
    raise exception 'Invalid currency' using errcode = '22023';
  end if;

  if not exists (select 1 from public.profiles where id = p_user_id) then
    raise exception 'User not found' using errcode = '22023';
  end if;
  if p_listing_id is null then
    raise exception 'Listing required for featured' using errcode = '22023';
  end if;
  if not exists (select 1 from public.listings where id = p_listing_id and user_id = p_user_id) then
    raise exception 'Listing not found or does not belong to user' using errcode = '22023';
  end if;

  insert into public.premium_transactions
    (user_id, listing_id, product, provider, amount_cents, currency, duration_days, status, paid_at)
  values
    (p_user_id, p_listing_id, p_product, 'manual', p_amount_cents, p_currency, v_duration, 'paid', now())
  returning id into v_tx_id;

  perform public.apply_premium_purchase(v_tx_id);

  return jsonb_build_object('success', true, 'transaction_id', v_tx_id, 'applied', true);
end;
$function$;

commit;
