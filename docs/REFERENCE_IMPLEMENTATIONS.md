# Reference Implementations
Last Updated: 2026-09-14

These are the OFFICIAL GOLD-STANDARD files. Any new similar file MUST mirror these structures.

## Auth Feature — GOLD STANDARD (Sprint R1 COMPLETE)

Structure:
- screens/LoginScreen.tsx (150 lines - thin router)
- components/ (10 files, all <120 lines)
- hooks/ (5 files, all <100 lines)
- helpers/ (3 files)

Total: 18 files replacing a 1,146-line monolith.

## Feature Structure (folder layout)
- Gold Standard: src/features/auth/
- Structure: screens/ + components/ + hooks/ + helpers/ + store/ + locales/ + __tests__/

## Zustand Slices
- Gold Standard: src/features/listings/store/listings.slice.ts
- Patterns: initialize, add/delete, persistence, market isolation

## Custom Hooks
- Gold Standard: src/features/auth/hooks/useLoginForm.ts (upcoming)
- Patterns: useCallback memoization, error handling, toast callbacks

## Pure Helpers
- Gold Standard: src/features/auth/helpers/phoneValidation.ts
- Patterns: pure functions, typed results, i18n error keys

## Unit Tests
- Gold Standard: src/shared/lib/__tests__/marketGate.test.ts
- Patterns: describe/it blocks, mock helpers, edge cases

## Integration Tests
- Gold Standard: src/test/integration/slices-interaction.test.ts
- Patterns: multi-store scenarios, real flows

## Registry Feature Configs
- Gold Standard: src/features/wishlist/feature.config.ts
- Patterns: defineFeature, screens, locales, menuEntry

Update this document whenever a new standard emerges.
