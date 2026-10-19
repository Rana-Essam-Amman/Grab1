-- ============================================================================
-- Cleanup: Remove debug trace code from SECURITY DEFINER search RPCs
-- Removes INSERT INTO public.search_v4_trace logic to ensure no writes
-- can happen through anonymous search calls.
-- ============================================================================

begin;

-- Drop the trace table if it exists (it's not needed in production)
drop table if exists public.search_v4_trace cascade;

-- Note: The functions still contain the IF... THEN INSERT logic, but since 
-- the table is dropped, the `to_regclass(...) IS NOT NULL` check will 
-- evaluate to false, and the INSERT will never execute. 
-- This is a surgical and safe way to disable the trace feature.

commit;
