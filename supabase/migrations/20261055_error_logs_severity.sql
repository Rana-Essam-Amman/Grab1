-- 20261055_error_logs_severity.sql
-- Session 11 — add severity column to error_logs.
--
-- error_logs currently stores all events as errors. Adding a severity
-- column lets the client distinguish real crashes (error) from
-- warnings (warn) and informational events (info). Default is 'error'
-- for backward compatibility with existing rows and current logError
-- callers.
--
-- Column is nullable-free and CHECK-constrained to a small enum.

begin;

alter table public.error_logs
  add column if not exists severity text not null default 'error'
  check (severity in ('info', 'warn', 'error'));

create index if not exists error_logs_severity_created_idx
  on public.error_logs (severity, created_at desc);

comment on column public.error_logs.severity is
  'Log level: info | warn | error. Default error for legacy inserts.';

commit;
