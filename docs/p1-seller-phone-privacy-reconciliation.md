# P1 Seller Phone Privacy — Production Compatibility Contract

## Verified production behavior

### get_listing_phone(uuid)
- Requires `auth.uid()`. Unauthenticated callers raise `AUTHENTICATION_REQUIRED`.
- Uses `public.is_admin()`.
- Non-admins are limited to 20 successful reveals per rolling 24 hours.
- Admins bypass the rate limit.
- Admins may reveal active demo listing phones.
- Non-admins may not reveal demo listing phones.
- Inactive listings return NULL.
- Successful reveals are logged for both admins and non-admins.
- `authenticated` has EXECUTE; `anon` does not.

### Search / listing RPCs
The following six functions use an explicit 33-column `RETURNS TABLE(...)` contract. Every public result path projects `NULL::text AS seller_phone`:

- `listings_by_seller` (UUID, phone-key, and orphan-phone paths)
- `search_listings` (all fallback paths)
- `search_listings_hybrid` (FTS-only and fused paths)
- `search_listings_v2`
- `search_listings_v2_intent` (delegates to corrected `search_listings_v2`)
- `search_listings_v2_intent_typo` (delegates to corrected `search_listings_v2_intent`)

`search_listings_v4_tiered_v2` retains its distinct 26-column contract (including tier metadata) and is not modified.

### ACLs
- Neither `anon` nor `authenticated` has table-level SELECT on `public.listings`.
- Neither role has direct column SELECT on `seller_phone`.
- Neither role may execute the semantic search RPC.
- Only `authenticated` may execute `get_listing_phone`.

## Migration ordering (06–11)

| Version | Name | Role |
|---------|------|------|
| 20261206 | phone_privacy_column_revoke_and_semantic_restrict | Table/column ACLs + semantic EXECUTE revoke |
| 20261207 | mask_seller_phone_in_definer_rpcs | Initial masking (SETOF + helper) |
| 20261208 | mask_v2_search_seller_phone | Additional SETOF masking |
| 20261209 | mask_tiered_v2_and_require_phone_identity | tiered_v2 (26-col) + get_listing_phone admin exception |
| 20261210 | mask_typo_intent_rpc_production_contract | 33-col contract for v2_intent_typo |
| 20261211 | fix_phone_mask_projection_live_table_contracts | 33-col contracts for the remaining five RPCs |

All six 33-column functions are fully implemented in the migration chain. No CASCADE is used. Dependencies are handled by deliberate DROP order inside the migration transaction.

## Why contracts differ

Most public search/listing RPCs return the full listing row shape (33 columns). `search_listings_v4_tiered_v2` adds tier metadata and therefore has a distinct 26-column contract. Changing one into the other would break callers.

## Running the regression locally

```bash
# Requires a local/loopback DATABASE_URL only
export DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
./test-search-rpc-local.sh
```

The script refuses non-loopback hosts and runs `supabase/tests/phone_privacy_regression.sql` (among others). The test uses synthetic fixtures and ends with `ROLLBACK`.

## Validation status (this change)

Local PostgreSQL / Supabase CLI was not available in the implementation environment. SQL migration tests and the phone privacy regression were **NOT RUN**. Static review of the complete migration chain, all six 33-column projections, the 26-column contract, and the corrected `get_listing_phone` body was performed. Production was not contacted or modified.
