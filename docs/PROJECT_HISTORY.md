# Project History — Grab The Deals

Complete timeline of all work.

## Phase 1 — Foundation (Sprint R7)

### R7.1 — Quick Wins (7 files)
- useForgotPassword, useAiAssistant, useAiReview, useListingDetail, phoneValidation, mockListing, ForgotPasswordForm

### R7.2 — Shared Components (6 files)
- LoginForm, AiAssistantBox, AvatarUploader, AiShareDrawer, CountrySheet, ExploreLocationFilterDrawer

### R7.3 — Core UI (6 files)
- BottomNav, ListingCard, ReportModal, LoginScreen, ChatListScreen, SettingsScreen

### R7.4 — Large Screens (6 files)
- SubCategoriesScreen, ThreadScreen, Header, ProfileScreen, ShareModal, WishlistScreen

**Result:** 0 violations, 337 tests.

## Phase 2 — Defense Layers (Sprint R7.0)

- R7.0d — E2E Tests (5/5 Golden Paths, 19 Playwright)
- R7.0e — CI/CD (Vitest + E2E workflows)
- R7.0g — Observability (Sentry scaffolding)

## Phase 3 — Clean Layered Architecture (R7.5)

- 6 domain slices: Chat, Auth, Draft, UI, Listings, Monetization
- 5 repository interfaces + 5 localStorage adapters
- 5 stores refactored
- docs/ARCHITECTURE.md + Rule 39

## Phase 4 — Design System (UI-1)

- 19 libraries installed (Radix, Sonner, Vaul, cmdk, Iconsax)
- OKLCH tokens + Dark Mode
- IBM Plex Arabic + Geist
- Catalog screen
- Motion + Toast + Drawer + Command Palette

## Phase 5 — Cleanup

### P0 — Rule 20 compliance
- Removed react-router-dom, phosphor, neon

### P1-a — Bundle
- 695 → 533 KB (-23%)
- Chunk splitting (vendor-icons, radix, motion, forms)

### P1-b — Hex Reduction
- 91 → 83
- BottomNav + Bookmark + Drawers migrated

### P1-c — localStorage Migration
- 12 → 0 direct usages
- All through safeStorage/globalStorage

### P1-d — Type Safety (any elimination)
- 53 → **0**
- 6 batches (catch blocks, storage, contracts, registry, ui/store, misc)

- DOC-1c: README + CONVENTIONS updated

### Phase 5b — Dead Code Removal
- Removed 7 unused files (usePostWizardForm, HeaderCurrencySelector, paymentGateway, queryKeys, chat.schema, user.schema, seedData)

### Phase 5c — Runtime Safety
- Global Error Boundary integrated into App root.
- "Reset App" recovery action (clear storage + reload).
- Hardened store initialization with error guards.

## Phase 6 — World-Class Verification
- 100% Type Safety (0 any, 0 as unknown as, 0 ts-ignore)
- 100% Architecture Compliance (0 violations, 0 circular deps)
- 100% Security Pass (0 secrets, 0 dangerous patterns)
- Bundle optimized (533KB index, 153KB gzip)
- 337 Tests Passing
- docs/PHASE_6_VERIFICATION.md generated

## Phase 7 — Consistency
- Phase 7a: Reduced `as unknown as` from 12 → 8 (aligned AI env, useUI focus hook, country change handler, quota adapter; commented 4 third-party bypasses; reported 4 domain mismatch smells)
- Phase 7b: Documented Category C debt + reduced hex colors 81 → 27 (replaced with design tokens in nav items, chat list, search screen, filter drawers, and wizard headers; preserved brand colors)
- Phase 7c: Console cleanup — removed 0 debug logs (none present), kept 34 infra & migration warnings/error handlers

## Phase 8 — Clean Types
- Phase 8b: Unified Conversation type (domain as single source of truth, 6 files)
- Phase 8c-1: Domain Listing became single source of truth (UI shape + optional status)
- Phase 8c-2b: Filters + Adapter aligned to UI Listing
- Phase 8c-2c: Fixed adapter tests and listings slice to use UI Listing directly

## Phase UI-3 — UI Enhancements
- UI-3a: Featured Deal Card above categories

## Phase Icon Migration
- Batch 2a: ListingCard.tsx migrated (REFERENCE pattern)
- Batch 2b: Remaining Shared UI & Components migrated (10 files: EmptyState, Modal, Sheet, Spinner, HeaderDropdownMenu, ListingCardHorizontal, ReportModal, ShareModalGrid, ShareModalHeader, useShareItems)

## Bugs Documented

- Bug #001 — Massive Untracked Files
- Bug #002 — Idx Contradictory Reports
- Bug #003 — Lockfile Drift
- Bug #004 — Idx Stale Reports
- Bug #005 — Idx False Commit Claim
- Bug #006 — Idx Hallucinated Test Count (591 vs 337)
- Bug #007 — Chat Messages Not Appearing (immer)

## UI Issues Fixed

- #1 Body CSS Override
- #2 h1-h6 !important
- #3 DemoCountryPicker Faded
- #4 Chat Drawer Text Faint
- #5 Post Ad Button Gradient
- #6 Header Dropdown Transparent
- #7 Categories Not Circular
- #8 Chat Crash on Open

## Phase 6 — Iconsax Migration
- Batch 1 & 2 (Shared UI & Components): 11 files migrated ✅
- Batch 4 (Auth Feature Components & Screens): 12 files migrated (LoginForm, LoginGateway, RegisterFormFields, RegisterStep2Form, CountrySelector, GuestCountrySelect, AuthTopBar, AuthToastBanner, ForgotPasswordForm, ForgotPasswordHeader, ConfirmScreen, TermsScreen) ✅
- Batch 5: Profile + Chat migrated ✅
- Batch 6: Explore migrated ✅
- Batch 7: Categories + Post-Wizard + Markets + My-Ads migrated ✅
- Batch 8: Listings + Wishlist + Config (icons.config.ts) migrated & lucide-react uninstalled (0 usages, vendor-icons bundle reduced) ✅

## Phase 7 — UI Improvements
- UI-3b: Trust Signal added ✅
- UI-3c: Trending Section added ✅
- UI-3d: Filter Chips polish added ✅
- UI-3e: Home Screen final polish (Crush Sprint Day 1) added ✅
- UI-3f: Listing Detail spacing polished ✅

## Constitution Evolution

- v1.0: Baseline (Rules 1-15, 20-26)
- v1.1: Added Rules 16-31 (5 parts)
- v1.1.2: Rule 37 (Mandatory GitHub Sync)
- v1.1.3: Rule 38 (Lockfile Discipline)
- v1.1.4: Rule 39 (Layered Architecture)

## Test & Quality Metrics

- Tests: 0 → 337
- E2E: 0 → 19
- Violations: 25 → 0
- any: 53 → 0
- Constitution: 39 rules
- Bundle (gzip): 153 KB

## Phase UX-Crush — Intent Detection

### B1 — intentClassifier Refactor (2026-09-19)
- Fixed 2 bugs: 'بدي' priority inversion + ambiguous matching
- Algorithm: binary keyword match → count-based weighted scoring
- Exports: SELL_KEYWORDS, BUY_KEYWORDS (readonly, extensible)
- Rule 14: 74 → 47 lines
- Tests: 337 passing (unchanged)

### B2 — intentScoring Helper (2026-09-19)
- Created pure helper for PUBLISH-intent confidence scoring
- 3-tier model: explicit (0.75) + weak (0.35) + bonuses (price/condition/detailed)
- Threshold: INTENT_CONFIDENCE_THRESHOLD = 0.75
- API: scoreIntent(text) → { confidence, signals }
- Rule 14: 69 lines (limit 80)
- Zero AI cost — deterministic keyword + regex
- Tests: 337 passing (unchanged)

### B3 — Test Suite (2026-09-19)
- Created: intentClassifier.test.ts + intentScoring.test.ts
- 26 isolated tests via it.each() parameterized pattern
- All 10 spec cases from B1 verified
- Edge cases: empty, whitespace, bug regressions
- Score scenarios: threshold boundary, capping, signals accuracy
- Location: src/features/explore/helpers/tests/
- Tests: 337 → 363 (+26 passing)

