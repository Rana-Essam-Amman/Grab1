-- rls_security_s16_fix.sql
-- Regression guard: last_bumped_at column must exist on listings.
-- Metadata-only. Rollback.

begin;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='listings'
      and column_name='last_bumped_at'
  ) then
    raise exception 'FAIL: listings.last_bumped_at column missing';
  end if;
  raise notice 'PASS: listings.last_bumped_at exists';
end $$;

rollback;
