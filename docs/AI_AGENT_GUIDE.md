# AI Agent Guide — Grab The Deals

**Purpose:** HOW any AI agent should work on this project.
**Audience:** Any AI (Idx, Cursor, Grok, Claude) working on this codebase.

## 1. Role Definition

Adopt this role:
> "Senior frontend architect at a top-tier company. Fix precisely ONE thing without breaking anything else."

## 2. Mandatory Prompt Structure

Every task prompt MUST follow:

```
ROLE: Senior frontend architect at top-tier company.
STRICT RULES:
- Touch ONLY the files listed. Nothing else.
- If task requires touching other files → STOP and report.
- Tests MUST all pass (337). If any fails → revert and report.
- Paste RAW output. No summaries.

TASK: <specific task>

STEPS:
1. Show current state (grep/cat commands)
2. Fix (surgical edits)
3. Verify (tsc, tests, build, audit)
4. Commit + push
5. Report (RAW output only)
```

## 3. Golden Rules

### Rule A — Atomic Edits
- ONE file per task (max 2-3)
- Never modify files outside scope
- Verify with `git status --short` before commit

### Rule B — RAW Evidence
- After EVERY command, paste RAW output
- Never say "success" without showing:
  - `git log --oneline -1`
  - `git ls-remote new-origin refs/heads/main`
  - `npm test 2>&1 | grep -E "Test Files|Tests"`
  - Count of the issue you fixed

### Rule C — Tests Are Sacred
- If any test fails → REVERT immediately
- Never weaken test assertions
- If a test caught a real bug → fix the source

### Rule D — No Silent Breaking
- If a fix might affect other files → STOP and report
- Ask before architectural changes
- Never invent commits or hashes

### Rule E — Verification Pattern
After every commit:
```
git log --oneline -1
git ls-remote new-origin refs/heads/main
npm test 2>&1 | grep -E "Test Files|Tests"
```
Local HEAD MUST equal Remote HEAD.

## 4. Common Pitfalls

### Pitfall 1 — Immer + Zustand
- NEVER use `{...state.x}` spread inside immer set()
- Use direct mutation OR remove immer
- See: Bug #007

### Pitfall 2 — Global CSS Overrides
- NEVER add `h1-h6 { color: ... !important }`
- Use tokens per-element via Tailwind
- See: Issue #2

### Pitfall 3 — Selective git add
- ALWAYS use `git add .` NOT `git add <file>`
- See: Bug #001

### Pitfall 4 — Lockfile drift
- ALWAYS run `npm install --package-lock-only` after adding packages
- See: Bug #003

### Pitfall 5 — Forbidden libraries
- NEVER import: react-router-dom, react-router, axios, jquery
- See: Constitution Rule 20

## 5. Stack Reference

- Framework: React 18 + TypeScript + Vite
- Styling: Tailwind CSS v4 + OKLCH tokens
- State: Zustand (NO immer for chat)
- Testing: Vitest (337) + Playwright (19)
- Icons: Iconsax
- Components: Radix UI + custom primitives
- Animations: Motion
- Toasts: Sonner
- Drawers: Vaul
- Command Palette: cmdk

## 6. Repository Structure

```
src/features/<name>/
├── domain/                    # Pure TypeScript entities + rules
├── data/repositories/         # Interfaces
├── data/adapters/             # Implementations (localStorage → Supabase)
├── store/                     # Zustand slices
├── screens/                   # React screens
├── components/                # React components
└── __tests__/                 # Co-located tests

src/shared/ui/                 # Design system primitives
src/styles/tokens.css          # Design tokens
```

## 7. What NOT to Do

- ❌ Don't invent commits or hashes
- ❌ Don't modify files outside task scope
- ❌ Don't skip tests verification
- ❌ Don't use `as any` in new code
- ❌ Don't add console.log in production
- ❌ Don't remove existing tests
- ❌ Don't add libraries without approval
- ❌ Don't use react-router-dom

## 8. Session Start Checklist

Every new AI agent must read:
1. This file (AI_AGENT_GUIDE.md)
2. PROJECT_CONSTITUTION.md
3. docs/LESSONS_LEARNED.md
4. docs/PROMPT_PATTERNS.md
5. docs/PROJECT_HISTORY.md
6. docs/SESSION_HANDOFF.md

Then continue from "Next task".
