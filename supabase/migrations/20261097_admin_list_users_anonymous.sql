-- 20261097_admin_list_users_anonymous.sql
-- Adds is_anonymous field to admin_list_users so the UI can distinguish
-- real users from guests in the admin "users" tab.

begin;

create or replace function public.admin_list_users(p_country_code text)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_uid uuid;
  v_email text;
  v_res jsonb;
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

  select coalesce(jsonb_agg(row_to_json(sub)::jsonb),'[]'::jsonb) into v_res
  from (
    select
      p.id,
      p.first_name,
      p.last_name,
      p.phone,
      p.country_code,
      p.banned,
      p.banned_reason,
      p.created_at,
      coalesce(u.is_anonymous, false) as is_anonymous
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.country_code = p_country_code
    order by p.created_at desc
    limit 50
  ) sub;

  return v_res;
end;
$function$;

commit;
