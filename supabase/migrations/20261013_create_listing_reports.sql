-- 20261013_create_listing_reports.sql
-- User-submitted reports for listings (moderation queue).
-- Reporter can be any authenticated user. Guests cannot report.
-- Reads restricted to service_role (admin panel only).

create table if not exists public.listing_reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (char_length(reason) between 3 and 80),
  details text check (details is null or char_length(details) <= 1000),
  status text not null default 'pending'
    check (status in ('pending', 'reviewed', 'dismissed', 'actioned')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null
);

create index if not exists listing_reports_listing_idx
  on public.listing_reports (listing_id);
create index if not exists listing_reports_status_idx
  on public.listing_reports (status, created_at desc);
create index if not exists listing_reports_reporter_idx
  on public.listing_reports (reporter_id);

alter table public.listing_reports enable row level security;

-- Reporter can insert their own report.
drop policy if exists "listing_reports_insert_own" on public.listing_reports;
create policy "listing_reports_insert_own" on public.listing_reports
  for insert to authenticated
  with check (auth.uid() = reporter_id);

-- No select policy: reads happen only via service_role (admin panel).
-- Reporter cannot read others' reports; not even their own (privacy).
