# FOX Feature Registry

**Purpose:** The contract that prevents silent feature loss.

Every feature in this file is either:
- **Protected** — has an E2E smoke test in `e2e/golden-paths/`
- **Uncovered** — visible gap, must be closed

If a feature is not in this file, it does not exist as far as CI is concerned.
If a PR touches shared files (`src/store/**`, `src/hooks/**`, `src/shared/**`),
the CI Gate runs **every** Protected E2E — not just the ones for that feature.

**Rule:** No feature enters `main` without an E2E entry here.
**Rule:** No PR removes or weakens a Protected E2E without an explicit note in the PR description.

---

## Protected

| Feature | E2E file | Notes |
|---|---|---|
| Filter System | `e2e/golden-paths/filters.spec.ts` | URL sync, category-aware, reset, clear-all, drafts |
| Search (FTS) | `e2e/golden-paths/search.spec.ts` | full word, empty state, clear |
| AI Search | `e2e/golden-paths/ai-search.spec.ts` | AI suggestion flow |
| Notifications | `e2e/golden-paths/notifications.spec.ts` | list, mark-one, mark-all, empty |
| Wishlist | `e2e/golden-paths/wishlist.spec.ts` | add, remove, sync |
| Chat | `e2e/golden-paths/chat.spec.ts` | golden path via mocked Supabase routes |
| Post Ad | `e2e/golden-paths/post-ad.spec.ts` | wizard, category pick, publish |
| Register | `e2e/golden-paths/register.spec.ts` | signup flow |
| App boot | `e2e/smoke.spec.ts` | root renders |
| Production health | `e2e/prod-smoke.spec.ts` | deployed app reachable |
| Multi-Market Isolation | `e2e/golden-paths/multi-market.spec.ts` | default JO scope, switch SA/LB via CountrySheet |

---

## Protected Implementations

Every Protected feature maps to critical source files. Deleting any file
here requires an explicit REGISTRY.md update in the same PR.

| Feature | Critical source files | Migration |
|---|---|---|
| Filter System | `src/features/explore/hooks/useFiltersUrlSync.ts`, `src/shared/router/filtersUrl.ts`, `src/shared/router/filterParams.ts`, `src/features/explore/screens/FiltersScreen.tsx` | — |
| Search (FTS) | `src/features/listings/hooks/useSupabaseListingsSync.ts`, `src/features/listings/services/listingsService.ts`, `src/features/listings/store/listings.slice.pagination.ts` | `supabase/migrations/20261018_search_v3_schema.sql`, `supabase/migrations/20261019_search_v3_trigger.sql`, `supabase/migrations/20261027_search_trigger_security_definer.sql` |
| AI Search | NEEDS CONFIRMATION: ai-search.spec.ts tests only search UI, not AI-specific behavior | — |
| Notifications | `src/features/notifications/hooks/useSupabaseNotificationsSync.ts`, `src/features/notifications/services/notificationsService.ts`, `src/features/notifications/store/notifications.slice.ts` | `supabase/migrations/20261016_create_notifications.sql`, `supabase/migrations/20261017_notifications_triggers.sql` |
| Wishlist | `src/features/listings/hooks/useSupabaseWishlistSync.ts`, `src/features/listings/services/wishlistService.ts` | `supabase/migrations/20261009_create_wishlists.sql` |
| Chat | `src/features/chat/hooks/useSupabaseChatSync.ts`, `src/features/chat/services/chatService.ts`, `src/features/chat/store/chat.slice.ts` | `supabase/migrations/20261006_create_chat_tables.sql` |
| Post Ad | `src/features/post-wizard/hooks/usePostWizard.ts`, `src/features/post-wizard/helpers/buildNewListingPayload.ts`, `src/features/post-wizard/store/draft.slice.ts` | — |
| Register | `src/features/auth/services/authService.ts`, `src/features/auth/hooks/useRegisterStep1.ts`, `src/features/auth/store/auth.slice.ts` | — |
| App boot | `src/App.tsx`, `src/main.tsx` | — |
| Production health | NEEDS CONFIRMATION: prod-smoke.spec.ts not wired into any CI workflow | — |
| Multi-Market Isolation | `src/store/ui.slice.actions.ts`, `src/store/ui.slice.helpers.ts`, `src/features/markets/components/CountrySheet.tsx`, `src/features/listings/hooks/useSupabaseListingsSync.ts`, `src/features/listings/services/listingsService.ts`, `src/features/listings/domain/rules/canViewListing.ts`, `src/shared/lib/marketStorage.ts` | — |

---

## Uncovered — known gaps

These exist in the product but have **no E2E coverage today**.
They are candidates for silent loss.

| Feature | Risk | Priority | Verification status |
|---|---|---|---|
| Bumps | Listing bump counter + auto-bump | Medium | Not verified |
| Premium / Paid-until | Premium flag + expiry rendering | High | Not verified |
| Reviews | Seller review submit + rating display | High | Not verified |
| Phone Verify | OTP flow + trust badge | Medium | Not verified |
| Monetization / Quota | Free listing quota + paywall modal | High | Not verified |
| RLS Security | Row-level access on listings/profiles | Critical | 23 CI-blocking assertions across 5 suites: 4 anon REST (`rls-check.yml`), 8 anon SQL (`rls_security.sql`), 3 authenticated SQL (`rls_security_authenticated.sql`), 4 profiles.phone SQL (`rls_security_profiles.sql`), 4 RPC SQL (`rls_security_rpc.sql`). Profiles.phone closure complete (Phase A RPC + Phase B frontend split + Phase C column grants). Playwright RLS E2E **deferred** — Quick Demo login is client-side only. Authenticated REST tests remain the next step; require an isolated test project. |

---

## How to close a gap

1. Write `e2e/golden-paths/<feature>.spec.ts` with 1–3 assertions that prove the feature exists.
2. Move its row from **Uncovered** to **Protected** in this file.
3. Add its critical files under **Protected Implementations**.
4. Open a PR with all changes.

That's it.

---

## Changelog

- **2026-10-14 (Session 15)** — RLS + Storage + RPC security hardened end-to-end. **Storage**: fixed `listing-images` bucket (dropped 3 misconfigured policies allowing anon upload + cross-user upload; added proper DELETE + UPDATE with foldername check). **Functions**: revoked unintended EXECUTE on ~28 SECURITY DEFINER functions (audit found `test_hf_endpoint()` callable by anon → outbound HTTP via pg_net, plus `apply_premium_purchase(uuid)` with no internal auth check); dropped the debug endpoint. **Privileges**: revoked TRUNCATE/TRIGGER/REFERENCES from anon+authenticated on all public tables; fixed per-schema default privileges for postgres on public (functions, tables, sequences) — the earlier global fix didn't cover these. **RLS**: enabled RLS on `search_intent_markers` (was missed). **profiles.phone closure (Phase A/B/C)**: added `get_own_phone()` RPC (authenticated-only, uses `auth.uid()`); split frontend service into `fetchPublicProfile` / `fetchOwnProfile`; revoked table- and column-level SELECT on `phone` from anon + authenticated while preserving INSERT/UPDATE for the owner (RLS-scoped). Verified in production: anon + authenticated both get `42501` on direct `phone` SELECT; `get_own_phone()` returns own phone and `NULL` for other users; RLS blocks cross-user phone UPDATE (0 rows). CI wired via `test-search-rpc-local.sh` — 23 assertions across anon REST, anon SQL, auth SQL, profiles SQL, RPC SQL. Also shipped: D9.1 URL sync fix, D11 email read-only, frontend rate limit (30 req/min), demo mode flag (`?demo=1` / `VITE_DEMO_MODE`), Modal portal fix (`createPortal` to document.body — fixes cut-off ShareModal/ReportModal), chat button silent failure fix (now shows toast; disabled for seed listings without seller UUID). 5 new migrations (20261062–20261066).
- **2026-10-12 (Session 9)** — Multi-Market Isolation promoted to Protected. E2E (`e2e/golden-paths/multi-market.spec.ts`) verifies default browse scopes to JO and switching SA/LB via CountrySheet produces requests with matching `country_code` filter. 3 tests, all green. Complements `supabase/tests/rls_security.sql` (DB-level) with UI-level coverage. RLS Security entry updated: CI wiring now in place via `rls-check.yml`. Only Playwright E2E for RLS remains open.
- **2026-10-12 (Session 8 cont.)** — Regression: revoke on `search_keywords` broke listing inserts via trigger `set_listings_search_text()`. Fixed in `20261027_search_trigger_security_definer.sql` (SECURITY DEFINER). Test 8 added to `supabase/tests/rls_security.sql` — proves authenticated inserts succeed post-revoke. **Lesson:** any revoke on internal tables requires auditing every trigger/function that reads them; tests must cover insert paths, not only reads.
- **2026-10-11 (Session 8)** — RLS policies live (listings active-only, profiles self-or-active-sellers, 5 search tables revoked+RLS). Multi-Market Isolation implementation verified end-to-end (domain rules, store, RPC, RLS). Neither has E2E yet — both remain Uncovered with verification noted.
- **2026-10-16** — Initial registry. Search promoted to Protected (PRs #233–#237).
- **2026-10-10** — Added Protected Implementations layer.
