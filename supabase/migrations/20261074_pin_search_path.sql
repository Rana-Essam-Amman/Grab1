-- 20261074_pin_search_path.sql
-- Pin search_path = public on 11 SECURITY INVOKER functions that
-- currently have proconfig = NULL. Prevents search_path hijacking via
-- a role-controlled schema (defense-in-depth).
--
-- All 11 verified safe:
--   * They operate on text/jsonb/row inputs, or
--   * They call other functions only with explicit public. prefix.
--   * None reference a schema object unqualified.
--
-- Nothing about their behavior changes. Only the search path becomes
-- explicit instead of inherited.

begin;

alter function public.arabic_word_variants(text)
  set search_path = public;
alter function public.build_prefix_tsquery(text)
  set search_path = public;
alter function public.expand_arabic_variants(text)
  set search_path = public;
alter function public.expand_search_keywords(text)
  set search_path = public;
alter function public.listing_passes_filters(
  listings, text, text, numeric, numeric, text, text, jsonb
)
  set search_path = public;
alter function public.normalize_arabic(text)
  set search_path = public;
alter function public.normalize_search_query(text)
  set search_path = public;
alter function public.normalize_search_text(text)
  set search_path = public;
alter function public.search_character_array(text)
  set search_path = public;
alter function public.search_json_values(jsonb)
  set search_path = public;
alter function public.set_updated_at()
  set search_path = public;

commit;
