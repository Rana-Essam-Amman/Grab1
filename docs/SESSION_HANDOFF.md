# Session Handoff — Grab The Deals

## Current State (2026-09-23)
- HEAD: f315b93 (docs(errors): backfill bugs 005-008)
- Branch: main | Remote: new-origin
- Tests: 379 passing | Arch violations: 0
- CI Quality: green | E2E: green

## Last task
Docs sync (Rule 43 + Bug #005-008 backfill + this handoff)

## Next task
Login Gateway visual review — screenshot provider buttons
on mobile (Google/Apple/WhatsApp with brand logos + "or" divider)

## Critical Rules (see PROJECT_CONSTITUTION.md for full list)
- Rule 2: NO hardcoded hex — tokens only (Bug #008)
- Rule 14: file size limits (Screen<150, Component<120, Hook<100, Helper<80)
- Rule 36: RAW evidence only
- Rule 41: competitor analysis before any logic
- Rule 42: zero-cost auth first (Google/Apple/Email)
- Rule 43: after push succeeds → STOP. No retry. No loop.

## Known Issues
- Bug #005 reoccurred 2026-09-23: idx reports wrong commit hash
  (2841cf6 vs actual f315b93). Pattern: idx caches pre-push hash.
- Commits f31bec7 + be2c725 use hardcoded hex (Bug #008).
  Fix deferred to token-refactor sprint.

## Recent commits (last 7)
f315b93 docs(errors): backfill bugs 005-008
6d7c7b7 docs(constitution): add Rule 43
c454b29 fix(e2e): gate Quick Demo via VITE_ALLOW_QUICK_DEMO
12c30f6 fix(arch): extract useExploreListings helpers (Rule 14)
be2c725 feat(auth): branded provider buttons
2041585 feat(auth): multi-provider scaffold
1e89781 feat(home): featured deals carousel
