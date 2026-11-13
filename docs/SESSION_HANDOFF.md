# Session Handoff — FOX Marketplace

## Current State (2026-10-01)
- HEAD: 69dd805 (feat(monitoring): Supabase-backed error logging (boundary + global handlers))
- Branch: main | Remote: new-origin
- Tests: 525 passing | Test files: 65
- Arch violations: 0 | Circular deps: 0
- Security vulnerabilities: 0
- CI Quality: green | E2E: green

## Last task
AI system prompt examples refinement and GitHub remote token update

## Next task
Wave 3 — Listing Detail rebuild (v7 system) + Universal Back Arrow audit

## Completed today (2026-10-01)
- Refined AI prompt examples and category-specific structured field parsing in `src/ai/aiGatewayClient.ts`
- Authenticated and updated `new-origin` remote repository with user's fine-grained personal access token (PAT)
- Ran complete build, lint check, architecture audit, and core unit test runs successfully


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

## Current State (2026-11-01)
- **Last task**: Completed PR #428 surgical remediation across all 4 verified defects: provider exact validation (no USA substring), canonical default capital slugs (Kuwait City -> al-asimah), MultiPolygon boundary safety, and publish flow integration. Full test suite: 140 files passed, 1,116 passed tests, 0 failed.
- **Next task**: Await review and approval of PR #428.

## Recent commits (last 8)
d406b94 test(infra): add useListings + useChat + useMonetization hook tests (15 tests)
9793425 test(infra): add useUI + useAuth + useDraft hook tests (16 tests)
f887702 refactor(post): extract PostFlowHeader + add back arrow to PostDetails (Rule 34 + UX fix)
60865b0 chore(deps): sync bun.lock after radix pruning (Rule 38)
b6d565d perf(bundle): remove 10 unused radix packages + cmdk + CommandPalette (target: -250 KB)
d2118b4 fix(arch): extract UseAiReviewReturn type (Rule 14 compliance)
1074364 fix(ai): wire useAiReviewAttributes for brand/model options injection
fc1bc81 feat(ai): pass subcategorySlug through AI pipeline + fix call sites

## Current State (2026-11-12 correction)
- Branch: amend-constitution-2 (PR #441)
- Last task: Corrected Environmental Exception wording and evidence
  requirements; updated Rule 22/36 clarifications; added + docs.
- Next: Await CI on the new HEAD SHA, then human approval.
- Note: Local toolchain unavailable in this sandbox; verification
  is CI-only against the exact PR HEAD.

## Current State (2026-11-12 Wave 1 HIGH-1 final)
- Branch: fix/wave1-trust-and-sample-photo-guards-final
- Last task: Removed false verified-seller claim (HIGH-1) with same-commit docs.
- Next: HIGH-2 sample-photo production guard.
- Note: Clean reapply from main. Subject ends exactly with "+ docs".

## Current State (2026-11-12 Wave 1 HIGH-2 final)
- Branch: fix/wave1-trust-and-sample-photo-guards-final
- Last task: Production sample-photo guard (HIGH-2) with same-commit docs.
- Next: E2E real-photo upload path.

## Current State (2026-11-12 Wave 1 E2E final)
- Branch: fix/wave1-trust-and-sample-photo-guards-final
- Last task: E2E real-photo upload path with same-commit docs.
- Next: Push branch. No PR until verification complete. No merge.
- Note: Local toolchain unavailable; CI is the substitute verifier.

## Current State (2026-11-12 Wave 1 test structure correction)
- Branch: fix/wave1-trust-and-sample-photo-guards-final
- Last task: Corrected usePhotoUpload.test.ts so all four tests are nested inside the describe block. Same-commit docs.
- Next: Await CI on this exact SHA. No PR yet. No merge.
- Note: Local toolchain unavailable. Original three commits preserved.

## Current State (2026-11-12 Wave 1 PR #443 open)
- Branch: fix/wave1-trust-and-sample-photo-guards-final
- PR: https://github.com/Rana-Essam-Amman/Grab1/pull/443 (OPEN, not merged)
- Base: 42ac404cf0b78e16561242b7393bac48e2f99833
- Last task: Rule 8 localization of seller fallback + corrected stale handoff that said "No PR yet".
- Prior HEAD 53295951e5dedcf3967740602cb78e02694a0cb0 had all four required workflows green (Quality, E2E, RLS, Search RPC SQL).
- Next: Await CI on this exact new HEAD. Do not merge until green. PR #442 remains historical and open.
- Note: Local toolchain unavailable; CI is the substitute verifier (Environmental Exception).

## Current State (2026-11-12 Wave 3 Phase 1)
- Branch: fix/listing-detail-loading-not-found
- Base: d7e36a3f2d0a3987ce80e50462ab8d5a2831ee5f
- Last task: Fixed premature ListingNotFound during remote lookup. Explicit loading / found / not_found / error states.
- Next: Await CI on the PR HEAD. Do not merge until green. Universal Back Arrow is a separate task.
- Verification (local): focused tests 13 passed (9 new + 4 existing), tsc exit 0, eslint 0 errors, build exit 0, audit:arch 0 violations.

## Current State (2026-11-13 PostDetails validation feedback)
- Branch: fix/post-details-validation-feedback
- Base: bb90008ed0d83940d09790265dc08ee466543a07
- Last task: Surfaced missing title, price, and required attributes on PostDetails via MissingFieldsNotice. Validation rules unchanged.
- Next: Await CI on the PR HEAD. Do not merge until green.
- Note: Local toolchain unavailable in this sandbox; CI is the substitute verifier (Environmental Exception).

## Current State (2026-11-13 PostDetails validation remediation)
- Branch: fix/post-details-validation-feedback
- Base: bb90008ed0d83940d09790265dc08ee466543a07
- Last task: Rule 8 localization of missing title/price labels; original validation semantics restored exactly. Hook tests added.
- Next: Await review. Do not create or merge PR until authorized.
- Note: Local toolchain unavailable; CI is NOT RUN (no PR-triggered workflow yet).
