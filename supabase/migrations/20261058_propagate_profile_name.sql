-- 20261058_propagate_profile_name.sql
-- Session 13 — propagate profiles.first_name/last_name to listings.seller_name.
--
-- Bug: listings.seller_name is a denormalized snapshot taken at listing
-- creation (buildNewListingPayload uses user.firstName + user.lastName).
-- When the user later changes their name, existing listings keep the old
-- name. Reads pull listings.seller_name directly (no JOIN with profiles),
-- so the UI shows the stale name.
--
-- Fix: AFTER UPDATE trigger on profiles. When first_name or last_name
-- changes, update listings.seller_name for rows owned by that profile.
-- The listings search_text + embedding triggers then re-fire on those
-- rows, correctly rebuilding search surface with the new name.
--
-- Uses IS DISTINCT FROM in both the WHEN clause and the UPDATE WHERE to
-- avoid unnecessary writes when nothing changed.

begin;

create or replace function public.propagate_profile_name_to_listings()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_new_name text;
begin
  v_new_name := trim(
    coalesce(new.first_name, '') || ' ' || coalesce(new.last_name, '')
  );

  -- Fall back to a neutral label when both names are empty.
  if v_new_name = '' then
    v_new_name := 'مستخدم معتمد';
  end if;

  update public.listings
  set seller_name = v_new_name
  where user_id = new.id
    and seller_name is distinct from v_new_name;

  return new;
end;
$function$;

comment on function public.propagate_profile_name_to_listings() is
  'AFTER UPDATE trigger on profiles. Syncs listings.seller_name when first_name or last_name change.';

drop trigger if exists profiles_propagate_name on public.profiles;
create trigger profiles_propagate_name
  after update of first_name, last_name on public.profiles
  for each row
  when (
    old.first_name is distinct from new.first_name
    or old.last_name is distinct from new.last_name
  )
  execute function public.propagate_profile_name_to_listings();

commit;
