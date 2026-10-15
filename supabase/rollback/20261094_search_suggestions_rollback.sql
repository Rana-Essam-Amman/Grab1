-- Rollback for 20261094_search_suggestions.sql
-- Idempotent.

DROP FUNCTION IF EXISTS public.search_suggestions(text, integer);
