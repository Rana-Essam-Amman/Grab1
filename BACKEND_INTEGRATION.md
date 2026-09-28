# Backend Integration Guide

## Contract
Every feature has a Repository interface + Adapter implementation.
To connect a backend: write a new Adapter, keep the interface. Zero UI changes.

## Adapters to replace

| Feature | Interface | Current Adapter | Replace with |
|---|---|---|---|
| auth | AuthRepository | LocalStorageAuthAdapter | SupabaseAuthAdapter |
| listings | ListingsRepository | LocalStorageListingsAdapter | SupabaseListingsAdapter |
| chat | ChatRepository | LocalStorageChatAdapter | SupabaseChatAdapter |
| monetization | MonetizationRepository | LocalStorageMonetizationAdapter | SupabaseMonetizationAdapter |
| post-wizard | DraftRepository | LocalStorageDraftAdapter | SupabaseDraftAdapter |

## Storage keys + market policy

- Market-scoped (via `marketStorage(countryCode)`): listings_v1, chat_conversations_v1, monetization_*, draft
- Global (via `globalStorage()`): theme
- Auth (via `safeStorage` RAW localStorage): auth_session_v1, auth_users_v1
  - Rule 11 EXCEPTION documented in src/shared/lib/safeStorage.ts

## Validation
Every adapter read uses Zod `safeParse` (via safeStorage or inline).
API responses MUST also pass these schemas.

## Pre-connection checklist
- [ ] Supabase project created
- [ ] Tables: users, listings, conversations, messages, promotions
- [ ] RLS policies per table
- [ ] Auth: replace LocalStorageAuthAdapter
- [ ] Storage: user avatar + listing photos upload
- [ ] Migration script for existing localStorage data

## Interface contracts (source of truth)
- src/features/*/data/repositories/*Repository.ts

## Storage Layer — As-Built vs Intended

**Intended (design):**
- Market-scoped data uses `marketStorage(country)` → key `catch_JO_listings`
- Global data uses `globalStorage()`

**As-built (current):**
- `marketStorage()` has ZERO consumers
- All data uses `safeStorage`/`globalStorage` with manual keys
- Market isolation is enforced at READ time via `filterListingsByMarket`
  (filters on `listing.countryCode` field)
- Wishlists use manual suffix keys: `catch_wishlist_JO`, `catch_wishlist_LB`

**Why it works:**
- Data is stored globally with `countryCode` field
- Filtering excludes cross-market items on read
- Market Lock (authenticated users) prevents switching entirely

**Migration to Supabase:**
- RLS policies per market will replace read-time filtering
- No code changes needed in UI layer — Repository pattern abstracts it
