begin;

drop policy if exists error_logs_insert_any on public.error_logs;

create policy error_logs_insert_own on public.error_logs
  for insert
  to authenticated
  with check (user_id is null or user_id = auth.uid());

commit;
