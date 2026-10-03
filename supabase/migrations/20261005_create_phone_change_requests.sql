-- 20261005_create_phone_change_requests.sql
-- P0-Phone-C: phone change request flow (prevent phone abuse without OTP)

-- 1) Add phone_locked flag to profiles
--    true  = phone confirmed and locked (change requires review)
--    false = phone not yet confirmed (user can set via PhoneCaptureModal)
alter table public.profiles
  add column if not exists phone_locked boolean not null default false;

-- 2) Create phone_change_requests table
create table if not exists public.phone_change_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  current_phone text,
  requested_phone text not null,
  reason text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) Indexes
create index if not exists phone_change_requests_user_idx
  on public.phone_change_requests (user_id);

create index if not exists phone_change_requests_pending_idx
  on public.phone_change_requests (status)
  where status = 'pending';

-- Only one pending request per user (prevents spam submissions)
create unique index if not exists phone_change_requests_one_pending_per_user
  on public.phone_change_requests (user_id)
  where status = 'pending';

-- 4) Row Level Security
alter table public.phone_change_requests enable row level security;

-- Users can read their own requests
create policy "phone_change_requests_read_own"
  on public.phone_change_requests for select
  using (auth.uid() = user_id);

-- Users can insert their own pending requests
create policy "phone_change_requests_insert_own"
  on public.phone_change_requests for insert
  with check (auth.uid() = user_id and status = 'pending');

-- No update/delete policies: only service role (admin via Supabase Dashboard)
-- can approve/reject. Users cannot edit submitted requests.

-- 5) updated_at trigger (reuse existing set_updated_at function)
drop trigger if exists phone_change_requests_set_updated_at
  on public.phone_change_requests;

create trigger phone_change_requests_set_updated_at
  before update on public.phone_change_requests
  for each row execute function public.set_updated_at();
