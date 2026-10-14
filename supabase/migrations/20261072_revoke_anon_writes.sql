-- 20261072_revoke_anon_writes.sql
-- Revoke INSERT/UPDATE/DELETE from anon on every public table where
-- RLS already blocks it. Same pattern as C1/C2 but for the anon role.
--
-- Live evidence (Session 16 batch 2 pre-flight):
--   anon has table-level INSERT/UPDATE/DELETE on 15 public tables.
--   No frontend code path writes to these tables as anon (all write
--   flows require auth: error_logs, listing_reports, conversations,
--   wishlists, etc.).
--   SELECT grants are preserved — public reads stay.
--
-- Defense-in-depth: if any future migration loosens an RLS policy,
-- anon cannot write. Also removes DELETE (present at table level on
-- several tables, no column-level DELETE exists).
--
-- Tables targeted (from A1 pre-flight):
--   conversations, error_logs, listing_reports, messages, notifications,
--   phone_change_requests, premium_transactions, search_category_labels,
--   search_intent_categories, search_intent_markers, search_stopwords,
--   search_subcategory_labels, search_synonyms, seller_reviews, wishlists
--
-- listings: already handled by C2 (anon INSERT/UPDATE revoked; only
-- SELECT + DELETE remained table-level). Revoke DELETE here too.
--
-- Function-driven reads: search_listings etc. run SECURITY DEFINER as
-- postgres → unaffected by anon grant removal.

begin;

revoke insert, update, delete on table
  public.conversations,
  public.error_logs,
  public.listing_reports,
  public.listings,
  public.messages,
  public.notifications,
  public.phone_change_requests,
  public.premium_transactions,
  public.search_category_labels,
  public.search_intent_categories,
  public.search_intent_markers,
  public.search_stopwords,
  public.search_subcategory_labels,
  public.search_synonyms,
  public.seller_reviews,
  public.wishlists
from anon;

commit;
