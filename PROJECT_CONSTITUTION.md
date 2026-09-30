# PROJECT CONSTITUTION — FOX Marketplace

This is the AUTHORITATIVE rulebook for all development. Any AI agent, developer, or contractor MUST read this file and follow it before making any changes.

## Core Philosophy

Every screen, API, table, and copy MUST stay easy to add, change, or DELETE.
If a change needs a rewrite of unrelated screens, the structure is WRONG.
Goal: Add, change, or DELETE any detail in < 30 minutes, without hunting through the app.

## Part I: Architecture Rules (Rules 1-15)

1. **Feature-Based Structure**: Every feature lives in `src/features/<name>/` with its own screens/, components/, hooks/, store/, locales/, and `feature.config.ts`.

2. **Design Tokens Only**: NO hardcoded hex values. NO Tailwind default colors (except justified brand colors like WhatsApp green). Use only tokens from `@theme` in `src/index.css`.

3. **Design System Primitives**: Use primitives from `@/shared/ui/` (Button, Card, Modal, Input, etc.). Do NOT hand-code UI elements.

4. **State Management**: Zustand for client state. React Query for server state. NO React Context for global state.

5. **Type Safety**: Zero `any`. Zod schemas at all data boundaries (localStorage, API, forms).

6. **Visual Control Center**: Colors, icons, animations, category images ALL controlled from `src/config/`. To change a visual element, edit ONE line in ONE file.

7. **RTL/LTR**: UI direction follows user language. UGC (user content) uses `dir="auto"`. Prices/phones use `dir="ltr"`.

8. **Localization**: All user-facing strings in `locales/ar.json` and `locales/en.json` (per feature).

9. **Testing**: Every feature must have tests (Vitest). Target: 70% coverage.
    Infrastructure (hooks/, stores/, adapters/) MUST reach ≥ 60% coverage.
    Critical hooks (useUI, useAuth, useDraft, useListings, useChat) MUST
    have co-located unit tests before any dependant feature ships.

10. **Performance**: Code splitting per screen. Virtualization for lists > 20 items. Memoize expensive computations.

11. **Market Isolation (NON-NEGOTIABLE)**: All cross-market operations MUST go through `src/shared/lib/marketGate.ts`.
    - NEVER filter listings inline (`l.countryCode === market`). Use `filterListingsByMarket`.
    - NEVER allow cross-market interactions. Use `canAccessListing`, `canStartChat`, `canPostIn`.
    - NEVER hardcode a market default. Always pass the effective market explicitly.
    - New localStorage keys MUST use `marketStorage(market)`.
    - In DEV mode, use `assertMarketIsolation()` at any component that renders listings.

12. **Feature Registry Compliance**: Every feature MUST have a `feature.config.ts` at its root:
    - Screens MUST be registered with a proper `component` loader.
    - If a screen uses a NAMED export (not default), map it explicitly:
      `component: () => import('./screens/X').then((m) => ({ default: m.X }))`
    - The Registry's lazy components MUST be memoized once at App level, NOT created in render.
    - When migrating a feature, keep the hardcoded fallback in App.tsx until the feature is fully tested.

13. **Storage Access Discipline (NON-NEGOTIABLE)**:
    - ALL browser storage operations MUST go through `marketStorage(market)`, `globalStorage()`, or `safeStorage`.
    - Direct `localStorage` calls are strictly forbidden across application features, hooks, slices, and UI components.
    - Market-scoped keys MUST use `marketStorage(market)` (`catch_{market}_{key}`).
    - Global app-wide state MUST use `globalStorage()` (`catch_{key}`).
    - All schema validation at storage boundaries MUST use `readValidated` / `writeValidated` from `safeStorage.ts`.

14. **World-Class Build Discipline (NON-NEGOTIABLE)**:
    Every NEW file MUST comply from the moment it is created. No exceptions.
    ### A) SIZE LIMITS
    | File Type | Max Lines |
    |---|---|
    | Screen (.tsx) | 150 |
    | Component (.tsx) | 120 |
    | Hook (.ts) | 100 |
    | Helper (.ts) | 80 |
    | Slice (.ts) | 120 |
    | Data — locations per-country (.ts) | 150 |
    | Data — seedListings per-country (.ts) | 400 |
    | Data — other (.ts) | 200 |
    | Barrel / index (.ts) | 50 |
    ### B) SEPARATION OF CONCERNS
    Screen files MUST NOT contain:
    - More than 3 useState declarations
    - Business logic (extract to hooks/)
    - Utility functions (extract to helpers/)
    - More than 2 JSX sections
    Components MUST NOT:
    - Fetch data directly (accept via props or hook)
    - Import global stores directly (except "connected" containers)
    - Contain side effects that belong in a hook
    ### C) REFERENCE-FIRST PROTOCOL
    When building ANY new screen/component/hook:
    1. READ docs/REFERENCE_IMPLEMENTATIONS.md first.
    2. Find the closest matching reference.
    3. MIRROR its structure EXACTLY (folder layout, hooks, props, tests).
    4. If no reference exists → follow the Standard Feature Pattern (Section D).
    ### D) STANDARD FEATURE PATTERN
    Every feature MUST follow this structure:
    src/features/<name>/
    ├── screens/         ← Thin routers (<150 lines each)
    ├── components/      ← Presentational (<120 lines each)
    ├── hooks/           ← State + logic (<100 lines each)
    ├── helpers/         ← Pure functions (<80 lines each)
    ├── store/           ← Zustand slices (<120 lines each)
    ├── locales/         ← ar.json + en.json
    ├── __tests__/       ← Tests co-located
    ├── feature.config.ts
    └── index.ts         ← Barrel export
    ### E) COMPLEXITY BUDGET (per Sprint)
    A single Sprint MUST NOT:
    - Add >5 new files without decomposing them.
    - Modify a file >200 lines without first extracting from it.
    - Introduce a new pattern without documenting it here.
    ### F) ENFORCEMENT MECHANISM & DATA FILE EXCEPTIONS
    Run `npm run audit:arch` before every commit.
    
    Data files MAY exceed the general limits ONLY for these specific per-country cases:
    - locations/<COUNTRY>.ts: max 150 lines
    - seedListings/<COUNTRY>.ts: max 400 lines

    All OTHER files MUST comply with Rule 14 limits. No RULE-14-EXCEPTION comments are allowed anywhere in the codebase.
    
    Migration History:
    - Sprint R5.5 (2026-09-15): Removed all RULE-14-EXCEPTION comments from src/data/*. Split locations.ts into src/data/locations/<COUNTRY>.ts. Split seedListings.ts into src/data/seedListings/<COUNTRY>.ts.
    ### G) LIVING REFERENCE REGISTRY
    See docs/REFERENCE_IMPLEMENTATIONS.md. It is updated whenever a new gold-standard file emerges.
    ### H) AI AGENT MANDATE
    When asked to build ANY new file, the AI agent MUST:
    1. Check docs/REFERENCE_IMPLEMENTATIONS.md.
    2. If a reference exists → mirror its structure.
    3. If not → apply Rules A-E from scratch.
    4. After building → run `npm run audit:arch` and report violations.

15. **Location Data Discipline**:
    Every country in `src/data/locations.ts` MUST follow:
    - **Two levels ONLY**: Country → City → Neighborhoods. No sub-regions.
    - **"Other" fallback**: Every country MUST include "Other" / "أخرى" as the LAST city entry.
    - **No duplicates**: No neighborhood string may appear twice within a city.
    - **No self-references**: A city name MUST NOT appear inside its own neighborhoods.
    - **EN/AR parity**: Every city must have the same number of neighborhoods in both languages, in the same order.
    - **Validation**: The `validateLocations()` function MUST return zero issues before any commit.
    
    Run `validateLocations()` after every locations change:
    `npx tsx -e "import {validateLocations} from './src/data/locations.ts'; console.log(validateLocations());"`
    Expected: `[]`

## Part II: Velocity & Change Rules (Rules 16-17)

16. **Velocity Discipline**:
    - Any change touching ≤ 5 files MUST be completed in < 30 minutes.
    - Any new file MUST mirror an existing reference in `docs/REFERENCE_IMPLEMENTATIONS.md`.
    - Every commit MUST be atomic (one logical change per commit).
    - Any change exceeding 2 hours MUST be split into smaller commits.
    - A single Sprint MUST NOT add > 5 new files without decomposing existing ones.

17. **Deletion Discipline**:
    - Dead code MUST be deleted immediately. "Just in case" code is FORBIDDEN.
    - Before ANY deletion: grep all references + run dependency-cruiser.
    - Any deletion MUST update: tests, docs, references, and error log (if applicable).
    - Every deletion MUST be recorded in `docs/REMOVED_FEATURES.md` with reason.
    - Monthly Dead Code Audit is MANDATORY (first Monday of each month).
    - No `// TODO:` comments may remain in main after sprint closure.

## Part III: Reliability & Learning Rules (Rules 18-19)

18. **Error Loop Discipline**:
    - Every bug fix MUST be documented in `docs/ERROR_LOG.md`.
    - Each entry MUST contain: Root Cause + Prevention Rule + Regression Test.
    - If the same bug type repeats 3× → a new architecture rule MUST be added to this Constitution.
    - Post-mortems MUST be blameless (focus on systems, not people).
    - Weekly Error Pattern Review is MANDATORY (every Sunday).

19. **Observability First**:
    - Every feature MUST ship with: telemetry events + error tracking.
    - No feature is considered "done" until it is fully observable.
    - Every user action MUST emit a standardized telemetry event (see Rule 29).
    - Every user flow MUST be end-to-end traceable.
    - Errors MUST be captured at Error Boundaries BEFORE they crash the app.

## Part IV: Enforcement Rules (Rules 20-26, 36, 37, 38, 39)

20. **Rule 20: No Unauthorized Libraries**:
    Only approved libraries may be imported. FORBIDDEN: react-router-dom, react-router, axios, jquery.
    APPROVED: react, react-dom, zustand, immer, @tanstack/react-query, zod, iconsax-react, motion, clsx, tailwind-merge, class-variance-authority.
    Enforced via ESLint no-restricted-imports.

21. **Rule 21: No Circular Dependencies**:
    No module may import from a module that imports it back. Cross-store dependencies MUST use the Registration Pattern.
    Enforced via dependency-cruiser (Sprint R7.0b).

22. **Rule 22: Pre-Commit Hook Required**:
    All commits MUST pass: tsc --noEmit, eslint, npm test, npm run audit:arch.
    Enforced via Husky (Sprint R7.0b).

23. **Rule 23: Boot Smoke Test Required**:
    The Boot Smoke Test must pass before any merge. It verifies that all critical stores, hooks, and feature configs load without errors.
    Location: src/test/smoke/boot.smoke.test.ts.

24. **Rule 24: Every Bug = Documented Lesson**:
    Every fixed bug MUST be documented in docs/ERROR_LOG.md with root cause + rule added + prevention tool.
    Without documentation, the bug is NOT considered fixed.

25. **Rule 25: Error Budget + SLOs**:
    Production target: 99.9% uptime. Error budget: 43 min/month.
    If exceeded: FREEZE features, FOCUS on reliability.

26. **Rule 26: No Empty Stubs**:
    Any function with an empty body `() => {}` or `async () => {}` is FORBIDDEN.
    Exception: `// TODO:` comment on the line above.
    Enforced via ESLint no-empty-function.

36. **Rule 36: Evidence-Based Task Completion (NON-NEGOTIABLE)**:
    Every task completed by any agent or developer MUST end with a VERIFICATION block containing RAW outputs of:
    - `git log --oneline -3` — to prove commit existence
    - `git status --short` — to prove clean working tree
    - `git ls-remote new-origin refs/heads/main` — to prove remote sync
    - Test output (raw tail, with pass/fail counts)
    - Build output (if applicable)

    **Requirements:**
    - No task is considered "COMPLETE" without evidence.
    - Contradictory reports (e.g., "tests failing" AND "5/5 complete" in the same response) MUST trigger an immediate READ-ONLY verification.
    - Evidence must be raw command output, NOT a summary or interpretation.
    - The final report MUST be internally consistent. If it is not, the task is REJECTED.

    **Forbidden:**
    - ❌ Claiming completion without raw evidence
    - ❌ Contradictory reports (PARTIAL + COMPLETE in same response)
    - ❌ Summaries without raw output
    - ❌ "Tests pass" without the actual test tail

    **Enforcement:**
    - Pre-commit hook already runs tests (Rule 22).
    - Human reviewer MUST reject any report lacking raw evidence.
    - Verification prompts use ONLY read-only commands.

### Rule 40: Continuous Documentation Discipline (NON-NEGOTIABLE)

Every commit MUST update relevant documentation files. Documentation is continuous, not one-time.

For every task completed, the following MUST be updated:

1. `docs/PROJECT_HISTORY.md` — Append the task to the current phase section.
2. `docs/SESSION_HANDOFF.md` — Update the "Current State" section (HEAD commit, Last task, Next task).
3. `docs/LESSONS_LEARNED.md` — If a bug or non-obvious decision was made, add it.
4. `docs/PROMPT_PATTERNS.md` — If a new prompt pattern emerged, add it.

REQUIREMENTS:
- Doc updates MUST be in the SAME commit as the code change.
- Doc updates MUST be concise (5-15 lines per task).
- Commit message MUST include "+ docs" suffix: `<type>(<scope>): <desc> + docs`

FORBIDDEN:
- ❌ Code commits without doc updates
- ❌ "Will document later" (never happens)
- ❌ Docs stale by more than 1 commit

Also update Version History:
- **v1.1.5 (2026-09-18)**: Added Rule 40 (Continuous Documentation Discipline).

### Rule 37: Mandatory GitHub Sync (NON-NEGOTIABLE)

EVERY task completed by any agent or developer MUST end with these EXACT steps:

1. `git add .` — stage ALL changes (never selective).
2. `git commit -m "<type>(<scope>): <description>"` — conventional commit.
3. `git push new-origin main` — push to GitHub `main` branch.

REQUIREMENTS:
- No task is "COMPLETE" until the push succeeds.
- Every report MUST include: `git log --oneline -3`, `git status --short`, `git ls-remote new-origin refs/heads/main`.
- If remote `new-origin` is missing → recovery protocol in docs/CONVENTIONS.md.
- Branch MUST be `main`. NEVER `master`.
- If `git status --short` is not empty → task INCOMPLETE.

FORBIDDEN:
- ❌ Selective `git add <file>`
- ❌ Committing to `master`
- ❌ Uncommitted changes at task end
- ❌ Claiming completion without push evidence

### Rule 38: Lockfile Discipline (NON-NEGOTIABLE)

Any change to dependencies MUST update BOTH files together:

1. `package.json` — the manifest.
2. `package-lock.json` — the exact resolved tree.

REQUIREMENTS:
- After ANY `npm install <pkg>` → run `npm install --package-lock-only` to sync lockfile.
- Before ANY commit that changes `package.json` → verify `package-lock.json` is in sync.
- Verification command: `npm ci --dry-run` MUST succeed with no errors.
- Node version in `.github/workflows/*.yml` MUST match local `.nvmrc` (or `package.json` engines).

FORBIDDEN:
- ❌ Committing a modified `package.json` without the corresponding lockfile update.
- ❌ CI workflows pinned to an older Node version than the project requires.
- ❌ Ignoring `npm ci` errors in CI logs.

ENFORCEMENT:
- Pre-commit hook (planned): verifies lockfile sync.
- CI workflow runs `npm ci` — will fail if lockfile is out of sync.
- Monthly audit: `npm audit` + lockfile integrity check.

### Rule 39: Layered Architecture Discipline (NON-NEGOTIABLE)

All features MUST follow Clean Layered Architecture:

1. `domain/` — Pure TypeScript entities and rules (no React, Zustand, or storage).
2. `data/repositories/` — Interface contracts only.
3. `data/adapters/` — Concrete implementations (localStorage, Supabase, etc.).
4. `store/` — Zustand slices using Repositories, never direct storage.
5. `screens/`, `components/` — React UI only.

FORBIDDEN:
- ❌ Domain importing Zustand, React, or storage
- ❌ Store accessing storage directly
- ❌ Business rules living in stores or components

See `docs/ARCHITECTURE.md` for details.

41. **Competitor Analysis Before Logic (NON-NEGOTIABLE)**:
    - Any new user-facing logic (search, filter, post, chat, navigation)
      MUST begin with competitor analysis (OpenSooq, Dubizzle, OLX,
      Facebook Marketplace).
    - Extract the best from each competitor.
    - Deliver a BETTER solution — not a copy.
    - Zero over-engineering. Zero showing off.
    - The final solution MUST be: simplest + cleanest + fastest.
    - Enforced in every logic prompt: start with
      "Why is this better than OpenSooq / Dubizzle / OLX?"

42. **Zero-Cost Auth First (NON-NEGOTIABLE)**:
    - Every auth provider MUST prefer free providers: Google, Apple, Email.
    - Paid providers (WhatsApp OTP, SMS OTP) = LAST resort, only when
      a phone number is genuinely needed (contact seller, publish).
    - NO SMS OTP during signup.
    - Phone number is requested AT THE ACTION (publish / chat), not at signup.
    - WhatsApp OTP > SMS OTP (60x cheaper, higher trust in MENA).
    - Target: $0 auth cost for 90%+ of users.

43. **Rule 43: Post-Commit Stop Discipline (NON-NEGOTIABLE)**:
    After `git push new-origin main` succeeds → task is COMPLETE.
    - STOP. No retry. No re-verify. No loop.
    - Do NOT run `git log` again expecting different output.
    - Do NOT interpret cached output as failure.
    - Do NOT attempt a second commit for the same change.
    - `git status --short` empty = success. Report and exit.
    Violations: multiple commits, "nothing to commit" misread as failure, stale cache misread as state.
    Prevention: verification runs BEFORE commit. Final report ends with RAW of the successful push.
    Enforcement: pre-commit runs once. Contradictory success+failure in same response = REJECTED (Rule 36).
    Scope Lock: idx MUST NOT add fixes, refactors, or improvements outside
    the explicit scope of the prompt. If a change seems beneficial but wasn't
    requested → STOP + RAW with suggestion. Wait for authorization.

44. **Rule 44: No Force Push (NON-NEGOTIABLE)**:
    - `git push --force` and `git push -f` are FORBIDDEN in ALL contexts.
    - If a normal push fails → STOP + RAW. Do NOT escalate to force push.
    - Rationale: force push destroyed remote history on 2026-09-25 (Bug #009).
    - Enforcement: pre-commit hook + human review.

45. **Rule 45: Secret & Token Redaction (NON-NEGOTIABLE)**:
    - Any command that may print a credential MUST pipe output through:
        `sed 's/[A-Za-z0-9_]*@/***@/g'`
    - Applies to: git ls-remote, git remote -v, env dumps, log outputs.
    - Rationale: GitHub PAT leaked in output on 2026-09-25 (Bug #010).
    - Enforcement: any reported raw output containing `token=`, `pat_`,
      `ghp_`, or `@github.com` MUST trigger immediate rotation.

46. **Rule 46: Subcategory-Aware Data Architecture (NON-NEGOTIABLE)**:
    - Any category with >1 subcategory MUST have its own
      `src/data/subcategoryFields/<category>.ts` file.
    - `getFieldsForListing(categorySlug, subcategorySlug)` is the ONLY
      public accessor for listing fields.
    - Fallback to `categoryFields.ts` is allowed ONLY when no override
      exists for the subcategory.
    - Rationale: proven competitive advantage — 17 categories × ~90
      subcategories with tailored fields.
    - Enforcement: audit script checks each category has subcategoryFields.

47. **Rule 47: AI Agent Prompt Protocol (NON-NEGOTIABLE)**:
    - Every prompt to an AI executor (idx or equivalent) MUST:
      1. Open with role: "You are a Senior [Role] specializing in [Domain]..."
      2. Include a 5-line context block:
         🎯 Differentiator vs competitors
         🌍 World-class step
         💡 User benefit
         ⚙️ Applicable (yes/no + reason)
         💰 Cost (zero / minimal / expensive)
      3. Define SCOPE LOCKED (exact files touched)
      4. Define FORBIDDEN actions (force push, --no-verify, out-of-scope edits)
      5. Require RAW report at end
    - Rationale: prompt structure materially affects AI output quality.
    - Enforcement: prompt templates in docs/PROMPT_PATTERNS.md.


## Part V: Quality & Future Rules (Rules 27-31)

27. **Backend Data Access Discipline**:
    - All server interaction and persistent DB calls (Firebase/Firestore) MUST go through feature services or store slices.
    - NEVER write raw Firestore calls inside UI components or screens.
    - Keep API keys server-side. Proxy via `/api/*` where appropriate.
    - Maintain strict Firestore security rules and offline fallback mechanisms.

28. **Accessibility Requirements (WCAG AA)**:
    - All interactive elements MUST have accessible labels (aria-label, alt text).
    - Color contrast MUST meet WCAG AA (4.5:1 text, 3:1 UI components).
    - All features MUST be operable via keyboard navigation.
    - Focus states MUST be visible on all interactive elements.
    - Screen reader compatibility is MANDATORY for all user flows.

29. **Analytics & Telemetry Discipline**:
    - All core user events (search, listing view, favorite, chat start, ad post) MUST trigger standardized telemetry events.
    - Event payload schema MUST be typed and validated before emission.
    - NO Personally Identifiable Information (PII) or secrets in event logs.
    - Every event MUST include: event_name, timestamp, market, user_id (hashed).

30. **Performance Budget (Measurable Thresholds)**:
    - Initial JS bundle size MUST NOT exceed 500KB gzipped.
    - Largest Contentful Paint (LCP) MUST be < 2.5s on 3G mobile networks.
    - Screen render time MUST remain < 100ms for user interactions.
    - List views with > 20 items MUST use virtualization.
    - Every animation MUST maintain 60fps (no jank).

31. **No Hardcoded Strings (Progressive Enforcement)**:
    - All NEW user-facing strings MUST be stored in `locales/ar.json` and `locales/en.json`.
    - Existing hardcoded strings are exempt until a dedicated refactoring sprint.
    - Enforcement applies to files created after v1.1 (2026-09-16).
    - Migration deadline: before Beta Launch (2026-10-29).
    - Direct hardcoded user text in JSX is FORBIDDEN (except dynamic UGC).

## Part VI: Learning System

This section defines HOW the Constitution evolves. It transforms mistakes into permanent safeguards.

### A) Error Journal (`docs/ERROR_LOG.md`)
- Every bug = one entry.
- Format: Bug → Root Cause → Prevention Rule → Regression Test → Date.
- Reviewed weekly by the project lead.

### B) Weekly Retrospective (Sunday)
- Review the week's commits, bugs, and learnings.
- Identify patterns (repeated issues, recurring friction).
- Propose Constitution amendments if a pattern repeats 3×.

### C) Blameless Post-Mortems
- Triggered by: any production incident, any data loss, any security event.
- Format: Timeline → Impact → Root Cause → Prevention → Owner.
- Never blame individuals. Blame systems.

### D) Dead Code Audit (Monthly)
- First Monday of every month.
- Identify unused files, functions, dependencies.
- Delete immediately after verification.

### E) Constitution Amendment Process
- Proposal: any team member can propose a change.
- Review: 24-hour review window.
- Approval: project lead approves.
- Apply: incremented version + changelog entry.
- Enforcement: automated where possible (ESLint, audit scripts).

### F) Reference-First Protocol (reinforced)
- Before ANY new file: read `docs/REFERENCE_IMPLEMENTATIONS.md`.
- If a reference exists → mirror it exactly.
- If not → build, then register the new file as a reference.

## Part VII: Constitution Version History

- **v1.0 (2026-09-01)**: Baseline Constitution (Rules 1-15, 20-26). Migrated from Dart/Flutter.
- **v1.2 (2026-09-30)**: Rebranded to "FOX Marketplace". Header redesign with fox mascot, favicon, and app-wide brand update. Home grid curation (Projects/Handymen/Cleaning featured). Direct publish from details screen (removed redundant AI review step).
- **v1.1 (2026-09-16)**: MASTERPIECE EDITION. Initial rebrand. Filled Rules 16-19 gaps (Velocity, Deletion, Error Loop, Observability). Added Rules 27-31 (Backend, Accessibility, Analytics, Performance, Hardcoded Strings). Introduced Part VI Learning System. Reorganized Enforcement Rules into Part IV. Updated Forbidden Practices. Amended with Part VIII Build Discipline (Rules 32-35: Pre-Creation Checklist, File Placement & Naming, Anti-Duplication, Scaffolding).
- **v1.1.1 (2026-09-16)**: Added Rule 36 (Evidence-Based Task Completion) after Bug #002 (Idx contradictory reports). Rule emphasizes raw command output as mandatory evidence.
- **v1.1.2 (2026-09-16)**: Added Rule 37 (Mandatory GitHub Sync).
- **v1.1.3 (2026-09-16)**: Added Rule 38 (Lockfile Discipline) after Bug #003 (CI failure due to lockfile + node version mismatch).
- **v1.1.4 (2026-09-16)**: Added Rule 39 (Layered Architecture Discipline).
- **v1.1.5 (2026-09-18)**: Added Rule 40 (Continuous Documentation Discipline).
- **v1.1.6 (2026-09-22)**: Added Rule 41 (Competitor Analysis Before Logic).
- **v1.1.7 (2026-09-22)**: Added Rule 42 (Zero-Cost Auth First).
- **v1.1.8 (2026-09-23)**: Added Rule 43 (Post-Commit Stop Discipline). Triggered by 3 idx retry loops (2026-09-23) burning ~45% of session context.
- **v1.1.9 (2026-09-25)**: Added Rule 44 (No Force Push) after Bug #009, Rule 45 (Secret Redaction) after Bug #010, Rule 46 (Subcategory-Aware Data), Rule 47 (AI Agent Prompt Protocol). Updated Rule 9 (infra coverage ≥ 60%) and Rule 43 (scope lock discipline).
- **v1.2 (Planned)**: Rule 36+ for CI-enforced rules (test coverage gate, mutation testing, SLO enforcement). Learning System automation.
- **v1.3 (2026-09-30)**: Added Rule 48 (Fullscreen Overlays — Portal-based) + Rule 48.1 (Layered Debug Protocol). Triggered by Lightbox session where 4 sequential code fixes failed because root cause was architectural (flex + fixed on mobile). Established the mandatory debug order: cache → prop threading → architectural constraint → industry pattern → publish verification. Details in `docs/LESSONS_LEARNED.md`.

## Part VIII: Build Discipline

Philosophy: "No new file is created without 7 checks. No logic is duplicated. No structural chaos is allowed."

### Rule 32: Pre-Creation Checklist (MANDATORY)
Before creating ANY new file, the agent/developer MUST run ALL 7 checks:
1. SEARCH: Is there an existing file that does this?
   - grep -r "<keyword>" src/
   - find src -name "*<keyword>*"
2. REFERENCE: Does a reference exist in docs/REFERENCE_IMPLEMENTATIONS.md?
   - If YES → mirror its structure EXACTLY.
   - If NO → build from Standard Feature Pattern (Rule 14-D).
3. PLACEMENT: Does the file belong in the correct folder?
   - See File Placement Matrix (Rule 33). Wrong folder = REJECT.
4. NAMING: Does the name follow conventions?
   - See Naming Rules (Rule 33). Wrong name = REJECT.
5. LINE LIMIT: Will the file respect Rule 14-A limits?
   - If likely > limit → decompose first, then create.
6. DUPLICATION: Will this duplicate existing logic?
   - If YES → reuse existing (import, don't copy).
7. TESTS: Does this file require a co-located test?
   - Screens/Components/Hooks/Helpers → YES.
   - Configs/Constants → NO.
If ANY check fails → STOP. Do not create the file.

### Rule 33: File Placement Matrix + Naming Rules

**File Placement Matrix:**

| File Type | Location | Example |
|-----------|----------|---------|
| Screens | features/<name>/screens/ | LoginScreen.tsx |
| Feature Components | features/<name>/components/ | LoginForm.tsx |
| Shared Components | shared/components/ | BottomNav.tsx |
| UI Primitives | shared/ui/ | Button.tsx |
| Feature Hooks | features/<name>/hooks/ | useForgotPassword.ts |
| Feature Helpers | features/<name>/helpers/ | phoneValidation.ts |
| Store Slices | features/<name>/store/ | auth.slice.ts |
| Types/Contracts | contracts/ | listings.contract.ts |
| Tests | co-located __tests__/ | LoginForm.test.tsx |
| Config | config/ | animations.config.ts |
| Data/Seed | data/ | seedListings/JO.ts |
| Constants | config/ or co-located .constants.ts | phone.constants.ts |

**Naming Rules:**

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase.tsx | LoginForm.tsx |
| Screens | PascalCaseScreen.tsx | LoginScreen.tsx |
| Hooks | useCamelCase.ts | useForgotPassword.ts |
| Helpers | camelCase.ts | phoneValidation.ts |
| Slices | name.slice.ts | auth.slice.ts |
| Constants | name.constants.ts | phone.constants.ts |
| Tests | *.test.ts(x) | phoneValidation.test.ts |
| Types | name.types.ts | auth.types.ts |

**FORBIDDEN Names:**
- utils.ts, helpers.ts, misc.ts, common.ts (too generic)
- newFile.ts, temp.ts, test2.ts
- v2.ts, old.ts, backup.ts
- functions.ts, logic.ts (vague)

### Rule 34: Anti-Duplication & Anti-Proliferation

**Anti-Duplication:**
- Every piece of logic MUST exist in EXACTLY ONE place.
- Before creating a helper: search src/**/helpers/ and src/shared/lib/.
- Before creating a component: search src/**/components/ and src/shared/ui/.
- Before creating a hook: search src/**/hooks/.
- Duplication = REJECT the change.
- Detect via jscpd (copy-paste detector) — run monthly.

**Anti-Proliferation:**
- A single Sprint MUST NOT add > 5 new files without decomposing old ones.
- If a feature folder has > 15 files → split into subfolders.
- If a folder has > 8 subfolders → rethink structure.
- No empty folders (delete immediately).
- No unused files (delete immediately).

### Rule 35: Scaffolding & Templates
- New features MUST be created via scripts/new-feature.mjs.
- Manual folder creation is FORBIDDEN for feature folders.
- Every new file MUST start from a template in templates/:
  - template.screen.tsx
  - template.component.tsx
  - template.hook.ts
  - template.helper.ts
  - template.slice.ts
  - template.test.ts
- After creating a feature, run npm run audit:arch to verify compliance.
- Register the feature in src/config/features.config.ts (if applicable).

### Canonical Project Tree

The following is the OFFICIAL project tree. Any new file MUST belong to one of these branches:

```
fox-marketplace/
├── assets/                  # Static assets
│   ├── avatars/
│   ├── categories/
│   ├── flags/
│   ├── icons/
│   ├── listings/
│   └── share/
├── docs/
│   ├── ERROR_LOG.md
│   ├── REFACTORING_ROADMAP.md
│   ├── REFERENCE_IMPLEMENTATIONS.md
│   ├── REMOVED_FEATURES.md
│   └── CONVENTIONS.md
├── scripts/
│   ├── audit-architecture.mjs
│   └── new-feature.mjs
├── templates/
│   ├── template.screen.tsx
│   ├── template.component.tsx
│   ├── template.hook.ts
│   ├── template.helper.ts
│   ├── template.slice.ts
│   └── template.test.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types.ts
│   ├── ai/                  # AI Gateway & Agents
│   │   ├── aiGatewayClient.ts
│   │   ├── categoryMatch.ts
│   │   ├── listingCopyAgent.ts
│   │   └── searchQueryParser.ts
│   ├── api/                 # Data layer
│   │   ├── queryClient.ts
│   │   └── queryKeys.ts
│   ├── config/              # Visual Control Center
│   │   ├── animations.config.ts
│   │   ├── categories.config.ts
│   │   └── icons.config.ts
│   ├── contracts/           # Type contracts
│   │   ├── auth.contract.ts
│   │   ├── chat.contract.ts
│   │   ├── draft.contract.ts
│   │   ├── listings.contract.ts
│   │   ├── monetization.contract.ts
│   │   └── ui.contract.ts
│   ├── data/                # Static seed data
│   │   ├── locations/
│   │   │   ├── JO.ts, SA.ts, PS.ts, LB.ts, SY.ts
│   │   │   └── validator/
│   │   └── seedListings/
│   │       ├── JO.ts, SA.ts, PS.ts, LB.ts, SY.ts
│   ├── features/            # Vertical slices
│   │   ├── auth/
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── helpers/
│   │   │   ├── store/
│   │   │   ├── locales/
│   │   │   ├── __tests__/
│   │   │   ├── feature.config.ts
│   │   │   └── index.ts
│   │   ├── explore/
│   │   ├── listings/
│   │   ├── post-wizard/
│   │   ├── chat/
│   │   ├── profile/
│   │   ├── categories/
│   │   ├── markets/
│   │   └── settings/
│   ├── shared/              # Cross-feature reusable
│   │   ├── components/
│   │   ├── ui/
│   │   ├── lib/
│   │   └── i18n/
│   ├── store/               # App-level state
│   │   └── ui.slice.ts
│   ├── schemas/             # Zod schemas
│   └── test/                # Test infrastructure
│       ├── helpers/
│       ├── integration/
│       ├── smoke/
│       └── msw-server.ts
├── PROJECT_CONSTITUTION.md
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .dependency-cruiser.js
```

**Rules for using this tree:**
- Any new file MUST belong to one of the listed branches.
- Creating a NEW top-level folder requires Constitution amendment.
- Creating a NEW subfolder inside a feature requires justification.
- The tree is versioned with the Constitution.

## File Organization

- `src/app/` — App shell, router, providers
- `src/config/` — Visual Control Center (icons, animations, categories)
- `src/shared/` — Reusable primitives, lib, i18n
- `src/features/` — All features (vertical slices)
- `src/store/` — Only app-level state
- `src/schemas/` — Zod schemas
- `src/data/` — Static seed data

## Forbidden Practices

- ❌ Hardcoded hex colors in components
- ❌ `any` types
- ❌ React Context for global state
- ❌ Inline arrow functions in JSX (use useCallback)
- ❌ Direct localStorage access (use safeStorage)
- ❌ Modifying files outside the current feature's scope
- ❌ Adding dependencies without architecture review
- ❌ Dead code left in the repository
- ❌ `// TODO:` comments in main after sprint closure
- ❌ Hardcoded NEW user-facing strings (use locales)
- ❌ Features shipped without observability
- ❌ Deletions without updating tests and references

## AI Agent Instructions

When working on this project:
1. READ this file first.
2. FOLLOW the rules above without exception.
3. If a rule seems to conflict with a request, ASK before proceeding.
4. Provide BEFORE/AFTER evidence for every change.
5. Never assume — verify with code snippets.

## Part IX: Fullscreen UI Rules

### Rule 48 — Fullscreen Overlays (NON-NEGOTIABLE)

Fullscreen modals, lightboxes, and image viewers MUST follow:

1. **Render via Portal:** `createPortal(node, document.body)` — never render inside the parent tree.
2. **Container styling:** `position: fixed; inset: 0; z-index: 9999` — inline styles preferred.
3. **Image styling:** `position: absolute; inset: 0; object-fit: contain` — inline styles, NOT Tailwind.
4. **No flex on fixed container** — this breaks on mobile.
5. **Explicit `zIndex: 10`** on all interactive elements inside.
6. **No Tailwind `object-contain`/`object-cover`** on fullscreen images — mobile Safari/Chrome render inconsistently.

**Rationale:** Verified via Lightbox session (2026-09-30) — 4 code fixes failed because root cause was architectural. See `docs/LESSONS_LEARNED.md` for the full story.

**Related rules:** Rule 41 (Competitor Analysis), Rule 48.1 (below).

### Rule 48.1 — Layered Debug Protocol

When a fix appears to fail despite verified code (tsc pass, eslint pass, CI green), check in this exact order — do NOT guess:

1. **Cache/Environment** — test in Incognito before concluding "fix failed."
2. **Prop threading** — grep every parent level after adding props to interfaces.
3. **Architectural constraint** — check mobile quirks (flex+fixed, stacking contexts, Tailwind reliability).
4. **Industry pattern** — study how competitors solved it (Facebook, OpenSooq, Dubizzle).
5. **Verify publish** — check GitHub commit hash; don't trust idx's "successfully pushed."
