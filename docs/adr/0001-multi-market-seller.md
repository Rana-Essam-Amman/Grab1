# ADR 0001 — Multi-Market Seller

- **Status:** Proposed
- **Date:** 2026-10-08
- **Deciders:** Sufyan (founder), Session 3 engineering
- **Supersedes:** none

## Context

FOX serves 5 markets (JO, SA, LB, PS, SY). Currently each user has ONE
`profiles.country_code` and can only publish listings in that market
(RLS-enforced since PR #89). They can browse and contact any market,
but not publish in a second one.

Real users cross markets:
- Jordanians working in Saudi Arabia (millions)
- Lebanese in UAE / Syrians in Jordan / Palestinians abroad
- Anyone who relocates between markets

Today's behavior: a user who changes their account market to SA loses
the ability to publish in JO (their old market). Their existing JO
listings stay, but new ones can't be created. This is a known
limitation of the single-market model.

## Decision

Follow the **eBay / Amazon model**: allow one account to publish in
multiple markets, with **per-market phone verification** (KYC).

Concretely:

1. New table `user_verified_markets (user_id, market_code, verified_at,
   phone_number, verification_method)`.
2. Per-market phone OTP before first publish in that market.
3. `listings_insert_own` RLS extended: allow INSERT if
   `country_code` is in the user's verified markets.
4. `user.countryCode` stays as the "primary market" (default lens).
5. `browseCountryCode` unchanged (independent lens).
6. Post wizard shows market selector (only verified markets).

## Consequences

**Positive:**
- FOX is the only MENA marketplace where a cross-market seller can
  publish in multiple countries from one account.
- No delete-and-repost (unlike OLX/Dubizzle).
- eBay/Amazon precedent: proven model.

**Negative:**
- ~3-4 PRs + phone OTP flow per market.
- RLS becomes more complex (market list from a join).
- Per-market VAT / tax implications (already delegated via MoR).

**Neutral:**
- Currency stays the listing's market currency.

## Alternatives considered

- **A. Status quo (single market).** Rejected — abandons cross-market
  sellers, who are the majority in MENA.
- **B. Delete-and-repost (OLX model).** Rejected — hostile UX, loses
  conversations, disappoints users.
- **C. Auto-migrate all listings on market change.** Rejected —
  breaks currency, city, neighborhood, reviews, conversations.

## Implementation plan

- **Wave 4 PR 1:** `user_verified_markets` migration + RLS update.
- **Wave 4 PR 2:** Per-market phone OTP flow.
- **Wave 4 PR 3:** Post wizard market selector.
- **Wave 4 PR 4:** Settings UI (manage verified markets).

Interim (before Wave 4): honest copy on Change Market modal.

## References

- eBay Mag — multi-market from one account:
  https://www.ebay.com/sellercenter/growth/ebay-mag
- Amazon Global Selling — unified account, per-market KYC:
  https://sell.amazon.com/global-selling
- OLX City policy (rejected):
  https://help.olx.com/
