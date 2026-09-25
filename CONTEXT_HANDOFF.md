# CONTEXT HANDOFF — Catch The Deals
Last Updated: 2026-09-14

## Project
Classifieds marketplace for 5 markets: JO, LB, PS, SY, SA.
Stack: React 18 + TypeScript + Vite + Tailwind v4 + Zustand + React Query + Zod.

## Status: ~98% complete

## Completed Sprints
- Sprint R1 (LoginScreen): 1,146 → 150 (-87%) ✅
- Sprint R2 (AiAssistantBox): 953 → 134 (-86%) ✅

## In Progress
- Sprint R3: ListingDetailScreen (507 lines) — next

## Pending (Sprint R7 cleanup)
- useForgotPassword.ts: 102 → <100
- useAuthFlow.ts: remove if exists (was hallucinated)
- useAiAssistant.ts: 106 → <100
- AiAssistantBox.tsx: 134 → <120
- phoneValidation.ts: 104 → <80
- mockListing.ts: 91 → <80
- ForgotPasswordForm.tsx: 124 → <120
- LoginForm.tsx: 132 → <120

## Pending Major Milestones (priority order)
1. **Testing** (Vitest + Testing Library) — Next
2. **Neon DB integration** — After testing
3. **Real AI integration** (Gemini/LLM) — After DB
4. **Capacitor** (Android + iOS) — After AI
5. **Store launch** — Final

## Architecture
src/
├── app/           App.tsx router (reads from Registry)
├── config/        icons, animations, categories (Visual Control Center)
├── store/         ui.slice.ts (global only)
├── shared/
│   ├── ui/        14 primitives
│   ├── lib/       marketGate, marketStorage, imageUtils, safeStorage, cn
│   ├── registry/  Feature Registry (types, discover, provider)
│   ├── i18n/      Translation system
│   └── components/ Header, BottomNav, ListingCard, Modals, ErrorBoundary
├── features/      12 features (each with feature.config.ts, store/, locales/)
├── schemas/       Zod schemas
├── data/          Seed data (80 listings, 5 countries)
└── services/      Service layer

## Strict Rules (from PROJECT_CONSTITUTION.md)
1. Read PROJECT_CONSTITUTION.md before any change.
2. Never trust "it works" — always request evidence (grep + build output).
3. Never click the "Fix" button.
4. Rule 11: Market isolation via marketGate.ts ONLY.
5. Rule 12: Feature Registry compliance.
6. Respond in a SINGLE Markdown code block.

## Architecture Governance

- Rule 14 in Constitution enforces build discipline.
- `npm run audit:arch` detects violations.
- `docs/REFERENCE_IMPLEMENTATIONS.md` is the source of truth for patterns.
- `templates/` contains boilerplate for new files.
- Before every commit: run `npm run audit:arch` — must pass.

## How to Add a New Feature
npm run feature:new <name>
# Restart dev server — Registry auto-discovers it.

## How to Continue in a New Session
Send this first message:
"I am the owner of Catch The Deals. Read PROJECT_CONSTITUTION.md and CONTEXT_HANDOFF.md. We completed Feature Registry M14.1-M14.6. Next step: Testing sprint."
