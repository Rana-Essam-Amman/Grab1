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

---

## Protected Implementations

Every Protected feature maps to critical source files. Deleting any file
here requires an explicit REGISTRY.md update in the same PR.

| Feature | Critical source files | Migration |
|---|---|---|
| Filter System | `src/features/explore/hooks/useFiltersUrlSync.ts`, `src/shared/router/filtersUrl.ts`, `src/shared/router/filterParams.ts`, `src/features/explore/screens/FiltersScreen.tsx` | — |
| Search (FTS) | `src/features/listings/hooks/useSupabaseListingsSync.ts`, `src/features/listings/services/listingsService.ts`, `src/features/listings/store/listings.slice.pagination.ts` | `supabase/migrations/20261018_search_v3_schema.sql`, `supabase/migrations/20261019_search_v3_trigger.sql` |
| AI Search | NEEDS CONFIRMATION: ai-search.spec.ts tests only search UI, not AI-specific behavior | — |
| Notifications | `src/features/notifications/hooks/useSupabaseNotificationsSync.ts`, `src/features/notifications/services/notificationsService.ts`, `src/features/notifications/store/notifications.slice.ts` | `supabase/migrations/20261016_create_notifications.sql`, `supabase/migrations/20261017_notifications_triggers.sql` |
| Wishlist | `src/features/listings/hooks/useSupabaseWishlistSync.ts`, `src/features/listings/services/wishlistService.ts` | `supabase/migrations/20261009_create_wishlists.sql` |
| Chat | `src/features/chat/hooks/useSupabaseChatSync.ts`, `src/features/chat/services/chatService.ts`, `src/features/chat/store/chat.slice.ts` | `supabase/migrations/20261006_create_chat_tables.sql` |
| Post Ad | `src/features/post-wizard/hooks/usePostWizard.ts`, `src/features/post-wizard/helpers/buildNewListingPayload.ts`, `src/features/post-wizard/store/draft.slice.ts` | — |
| Register | `src/features/auth/services/authService.ts`, `src/features/auth/hooks/useRegisterStep1.ts`, `src/features/auth/store/auth.slice.ts` | — |
| App boot | `src/App.tsx`, `src/main.tsx` | — |
| Production health | NEEDS CONFIRMATION: prod-smoke.spec.ts not wired into any CI workflow | — |

---

## Uncovered — known gaps

These exist in the product but have **no E2E coverage today**.
They are candidates for silent loss.

| Feature | Risk | Priority |
|---|---|---|
| Bumps | Listing bump counter + auto-bump | Medium |
| Premium / Paid-until | Premium flag + expiry rendering | High |
| Reviews | Seller review submit + rating display | High |
| Phone Verify | OTP flow + trust badge | Medium |
| Monetization / Quota | Free listing quota + paywall modal | High |
| Multi-Market Isolation | Cross-market listing filter | High |
| RLS Security | Row-level access on listings/profiles | Critical |

---

## How to close a gap

1. Write `e2e/golden-paths/<feature>.spec.ts` with 1–3 assertions that prove the feature exists.
2. Move its row from **Uncovered** to **Protected** in this file.
3. Add its critical files under **Protected Implementations**.
4. Open a PR with all changes.

That's it.

---

## Changelog

- **2026-10-16** — Initial registry. Search promoted to Protected (PRs #233–#237).
- **2026-10-10** — Added Protected Implementations layer.
