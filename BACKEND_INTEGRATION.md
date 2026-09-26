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
