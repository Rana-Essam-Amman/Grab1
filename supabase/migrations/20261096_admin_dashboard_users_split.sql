-- 20261096_admin_dashboard_users_split.sql
-- Splits the dashboard "users" metric into real users vs anonymous guests.
-- Before: users = all non-banned profiles in the market (includes guests).
-- After:  users  = real users (is_anonymous = false)
--         guests = anonymous guests (is_anonymous = true)

begin;

create or replace function public.admin_get_dashboard(p_country_code text)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_uid uuid;
  v_email text;
  v_currency text;
  v_users bigint;
  v_guests bigint;
  v_listings bigint;
  v_reports bigint;
  v_revenue bigint;
  v_recent jsonb;
  v_res jsonb;
  v_listing_id uuid;
  v_owner uuid;
  v_duration int;
  v_tx_id uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then raise exception 'Unauthorized' using errcode = '42501'; end if;
  v_email := (select email from auth.users where id = v_uid);
  if v_email is null or lower(v_email) <> lower('Sufyanyounis83@gmail.com') then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;
  if p_country_code not in ('JO','SA','LB','PS','SY') then
    raise exception 'Invalid country code';
  end if;
  v_currency := case p_country_code when 'JO' then 'JOD' when 'SA' then 'SAR' when 'LB' then 'USD' when 'PS' then 'ILS' when 'SY' then 'SYP' end;

  -- CHANGED: users = real only (is_anonymous = false)
  select count(*) into v_users
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.country_code = p_country_code
    and p.banned = false
    and u.is_anonymous = false;

  -- NEW: guests = anonymous only (is_anonymous = true)
  select count(*) into v_guests
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.country_code = p_country_code
    and p.banned = false
    and u.is_anonymous = true;

  select count(*) into v_listings from public.listings where country_code = p_country_code and status = 'active';
  select count(*) into v_reports from public.listing_reports r join public.listings l on l.id = r.listing_id where l.country_code = p_country_code and r.status = 'pending';
  select coalesce(sum(pt.amount_cents),0) into v_revenue from public.premium_transactions pt left join public.listings l on l.id = pt.listing_id left join public.profiles p on p.id = pt.user_id where pt.status = 'paid' and coalesce(l.country_code,p.country_code) = p_country_code;
  select coalesce(jsonb_agg(row_to_json(sub)::jsonb),'[]'::jsonb) into v_recent from (select r.id,r.listing_id,l.title as listing_title,l.country_code as listing_country_code,r.reporter_id,trim(concat_ws(' ',rep.first_name,rep.last_name)) as reporter_name,r.reason,r.details,r.status,r.action_taken,r.created_at,r.reviewed_at from public.listing_reports r join public.listings l on l.id=r.listing_id left join public.profiles rep on rep.id=r.reporter_id where l.country_code=p_country_code and r.status='pending' order by r.created_at desc limit 5) sub;

  return jsonb_build_object(
    'metrics',
    jsonb_build_object(
      'users', v_users,
      'guests', v_guests,
      'listings', v_listings,
      'reports', v_reports,
      'revenue_cents', v_revenue,
      'currency', v_currency
    ),
    'recent_reports', v_recent
  );
end;
$function$;

commit;
