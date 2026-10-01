create table if not exists public.error_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  message text not null,
  stack text,
  component_stack text,
  url text,
  user_agent text,
  build_version text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists error_logs_created_idx on public.error_logs (created_at desc);
create index if not exists error_logs_user_idx on public.error_logs (user_id);

alter table public.error_logs enable row level security;

-- Anyone authenticated can insert an error log (their own)
drop policy if exists "error_logs_insert_any" on public.error_logs;
create policy "error_logs_insert_any" on public.error_logs
  for insert to authenticated
  with check (true);

-- Only the user can read their own logs (admin reads via service_role)
drop policy if exists "error_logs_read_own" on public.error_logs;
create policy "error_logs_read_own" on public.error_logs
  for select to authenticated
  using (auth.uid() = user_id);
