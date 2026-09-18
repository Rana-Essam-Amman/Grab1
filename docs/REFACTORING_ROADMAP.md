# Refactoring Roadmap

## Sprint R1 — COMPLETE ✅
- LoginScreen.tsx: 1,146 → 150 lines (-87%)
- Files created: 17 (all Rule 14 compliant except 3 noted below)
- Verified with wc -l at every step.

Remaining R1 violations (deferred to Sprint R7):
- useForgotPassword.ts: 102 → target <100
- useAuthFlow.ts: does not exist (was hallucinated in earlier report — REMOVED)

Note: Earlier reports claimed LoginScreen = 102 lines. This was FALSE. Verified actual: 150 lines.

## Sprint R2 — COMPLETE ✅
- AiAssistantBox.tsx: 953 → 134 lines (-86%)
- Files created: 11
- Remaining violations:
  * useAiAssistant.ts: 106 → target <100 (Sprint R7)
  * AiAssistantBox.tsx: 134 → target <120 (Sprint R7)

## Phase 8 — Architectural Debt

- [ ] Unify Conversation type (domain vs UI)
- [ ] Unify Listing type (domain vs UI)
- [ ] Add Zod schemas for auth storage
- [ ] Reduce remaining 8 `as unknown as` (Category B) if possible

