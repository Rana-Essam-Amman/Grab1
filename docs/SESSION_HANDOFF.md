# Session Handoff — Grab The Deals

## Current State (2026-09-25)
- HEAD: d406b94 (test(infra): add useListings + useChat + useMonetization hook tests (15 tests))
- Branch: main | Remote: new-origin
- Tests: 525 passing | Test files: 65
- Arch violations: 0 | Circular deps: 0
- Security vulnerabilities: 0
- CI Quality: green | E2E: green

## Last task
Hook tests batch 2 (useListings + useChat + useMonetization, 15 tests)

## Next task
Wave 3 — Listing Detail rebuild (v7 system) + Universal Back Arrow audit

## Completed today (2026-09-25)
- Post flow v7 unification (PostAdEntry, ChooseCategory, ChooseSubcategory,
  PhotoUpload, LocationPick, PostDetails, AiReview, AiCapture)
- Extracted PostFlowHeader component (5 screens share it)
- Subcategory-aware fields for all 17 categories (~90 subcategories, ~350 fields)
- Brand catalog: 70 cars (18 Chinese) + 76 tech brands with models
- Combobox (searchable dropdown) for make/model/brand
- Wave B-Master audit (knip, madge, depcheck, coverage, bundle)
- Wave B-Radix: removed 10 unused radix packages + cmdk + CommandPalette
- Wave B-Structural: audited back nav, storage, types, tests coverage
- Hook tests batch 1 (useUI, useAuth, useDraft — 16 tests)
- Hook tests batch 2 (useListings, useChat, useMonetization — 15 tests)
- Bug fixes: useAiReviewAttributes wire, useAiReview Rule 14, bun.lock sync

## Critical Rules (see PROJECT_CONSTITUTION.md for full list)
- Rule 2: NO hardcoded hex — tokens only (Bug #008 open)
- Rule 14: file size limits (Screen<150, Component<120, Hook<100, Helper<80)
- Rule 36: RAW evidence only
- Rule 41: competitor analysis before any logic
- Rule 42: zero-cost auth first (Google/Apple/Email)
- Rule 43: after push succeeds → STOP. No retry. No loop.
- Rule 44: NO git push --force. EVER.
- Rule 45: tokens redacted in all outputs
- Rule 46: subcategory-aware fields required (>1 subcategory → own file)
- Rule 47: AI agent prompt protocol (role + 5-line template)

## Known Issues (deferred)
- Coverage gaps: safeStorage 42%, useListingDetail 44%, LocalStorageDraftAdapter 30%
- 30 hooks still lack co-located tests (batches 3-5 queued)
- 6 usages of `as unknown as` (documented, not removed)
- 14 screens without Empty/Loading/Error states
- ChatListScreen.tsx + CatalogScreen.tsx (possible dead code)
- vendor-radix 371 KB (accepted, deferred to Post-Beta)
- PostDetails Continue button: silent when validation fails (UX fix queued)
- Rule 2 conflict: existing commits f31bec7 + be2c725 use hex (token refactor queued)

## idx Bug Patterns (P0 warnings)
- #005: fake commit hashes (verified 8+ times today)
- #009: used `git push --force` without authorization (destroyed history)
- #010: leaked GitHub PAT in chat output (rotated immediately)
- Fix: always verify via `git ls-remote`, redact tokens, forbid force

## Reference Commands
- State: `git log --oneline -3 && git status --short && git ls-remote new-origin refs/heads/main 2>&1 | sed 's/[A-Za-z0-9_]*@/***@/g'`
- Verify: `npx tsc --noEmit && npm test -- --run && npm run audit:arch`
- E2E single: `npx playwright test e2e/golden-paths/post-ad.spec.ts --reporter=line --workers=1`

## Recent commits (last 8)
d406b94 test(infra): add useListings + useChat + useMonetization hook tests (15 tests)
9793425 test(infra): add useUI + useAuth + useDraft hook tests (16 tests)
f887702 refactor(post): extract PostFlowHeader + add back arrow to PostDetails (Rule 34 + UX fix)
60865b0 chore(deps): sync bun.lock after radix pruning (Rule 38)
b6d565d perf(bundle): remove 10 unused radix packages + cmdk + CommandPalette (target: -250 KB)
d2118b4 fix(arch): extract UseAiReviewReturn type (Rule 14 compliance)
1074364 fix(ai): wire useAiReviewAttributes for brand/model options injection
fc1bc81 feat(ai): pass subcategorySlug through AI pipeline + fix call sites
