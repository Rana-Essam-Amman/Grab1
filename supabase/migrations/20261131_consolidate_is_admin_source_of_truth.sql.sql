-- Fix F1.1: consolidate public.is_admin() source of truth to public.admins table
-- Prevents schema drift: repo previously defined is_admin() with a hard-coded
-- email, while the deployed DB uses a table lookup. On fresh `db push` the
-- hard-coded version would silently override the deployed one, breaking the
-- F1 trigger's admin bypass.
begin;

create table if not exists public.admins (
  email text primary key
);

alter table public.admins enable row level security;

insert into public.admins (email)
values ('sufyanyounis83@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = 'public'
as $$
  select exists (
    select 1
    from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

comment on function public.is_admin() is
  'F1.1: single source of truth = public.admins. Overrides 20261104 hard-coded email to prevent drift.';

commit;
