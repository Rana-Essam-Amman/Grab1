# Lessons Learned — Grab The Deals

**Purpose:** Every bug documented. Institutional memory.
**Audience:** Any AI agent or developer joining the project.

### Dead Code
- Kept contracts/ even if 'unused' — architectural pattern
- Kept CommandPalette.tsx — planned UI component
- Kept marketAssertions.ts — Rule 11 critical

## Bugs

### Bug #001 — Massive Untracked Files (2026-09-16)

**Severity:** P0 (Critical) — Data Loss Risk
**Symptom:** Only 59 of 386 files tracked in git (15.3%).
**Root Cause:** AI agent used `git add <specific-file>` instead of `git add .` after multi-file refactors.
**Fix:** Emergency commit 4145691 — full codebase sync (513 files).
**Prevention:** Rule 37 (Mandatory GitHub Sync) + scripts/git-health-check.mjs.

### Bug #002 — Idx Contradictory Reports

**Severity:** P1 — Trust Risk
**Symptom:** Idx produced two contradictory reports in one response.
**Root Cause:** Idx concatenated outputs from multiple internal loops.
**Fix:** Rule 36 (Evidence-Based Task Completion).

### Bug #003 — CI Failure (Lockfile)

**Symptom:** CI failed twice. `npm ci` refused to install.
**Root Cause:** package-lock.json out of sync + Node version mismatch (20 vs 22).
**Fix:** `npm install --package-lock-only` + bump CI Node to 22.
**Prevention:** Rule 38 (Lockfile Discipline).

### Bug #004 — Idx Stale Reports

**Symptom:** Idx returned cached reports from previous tasks.
**Root Cause:** Google AI Studio per-session rate limits.
**Prevention:** Short prompts (≤20 lines), RAW verification.

### Bug #005 — Idx Claimed False Commit

**Symptom:** Idx reported "commit df6294d done" but commit never existed.
**Root Cause:** Idx hallucinated the commit hash.
**Prevention:** Force raw output pattern.

### Bug #006 — Idx Hallucinated Test Count (591 vs 337)

**Symptom:** Idx reported 591 tests passing. Actual: 337.
**Root Cause:** Idx hallucinated numbers.
**Prevention:** Force `npm test 2>&1 | grep -E "Test Files|Tests"` in every report.

### Bug #007 — Chat Messages Not Appearing

**Severity:** P1 — Feature Broken
**Symptom:** User sends message → message doesn't appear in UI.
**Root Cause:** `immer` middleware + spread operator interaction broke tracking.
**Fix:** Removed immer from chat.slice.ts. Used plain Zustand updates.
**Prevention:** No spread on immer drafts.

## UI Issues

### Issue #1 — Body CSS Override Blocking Tokens

**Symptom:** Background always grey despite OKLCH tokens.
**Root Cause:** `body { background-color: #E5E7EB; }` in index.css.
**Fix:** Changed to `var(--color-canvas)` and `var(--color-ink)`.

### Issue #2 — h1-h6 !important Override

**Symptom:** Wizard titles invisible (text-white didn't work).
**Root Cause:** Global `h1-h6 { font-size: 18.5px !important; }`.
**Fix:** Removed entire block.

### Issue #3 — DemoCountryPicker Faded

**Symptom:** Modal appeared blurry/transparent.
**Root Cause:** Tailwind classes overridden by CSS.
**Fix:** Inline styles.

### Issue #4 — Chat Drawer Text Faint

**Symptom:** Drawer text not visible.
**Root Cause:** Used `text-ink-muted` on grey background.
**Fix:** Changed to `text-ink`.

### Issue #5 — Post Ad Button Color

**Symptom:** FAB showed gradient instead of solid.
**Fix:** Removed gradient, applied solid bg.

### Issue #6 — Header Dropdown Transparent

**Symptom:** Dropdown showed page content through it.
**Fix:** `bg-white` + `shadow-2xl` + `z-[60]` + backdrop.

### Issue #7 — Categories Images Not Circular

**Fix:** Changed `rounded-xl` → `rounded-full`.

### Issue #8 — Chat Crash on Open

**Symptom:** Clicking "Chat" on listing crashed app.
**Root Cause:** `setSelectedThreadId(threadId)` was NOT called before navigation.
**Fix:** Added the missing line.

### Issue #9 — Iconsax + CSS Variables
Cause: Iconsax color prop doesn't support 'var(--color-*)'
Fix: Use hex values directly (or currentColor + Tailwind text-*)

### Issue #10 — Iconsax + var() Global
Iconsax color prop doesn't support CSS variables.
Always use HEX values directly (or #E57E25 as accent gold).

## Lessons by Category

### Git & Version Control
- ALWAYS use `git add .`
- VERIFY push with `git ls-remote`
- NEVER trust AI reports of "pushed"

### State Management (Zustand)
- NO immer + spread combination
- Prefer plain updates
- useChat selectors NOT whole store

### Styling
- NO global `!important` on h1-h6
- Body must use tokens
- Fallback to inline styles for critical UI

### AI Agent Management
- Trust only RAW output
- Force pattern when claims without evidence
- Split tasks: 1 file per prompt

### Testing
- Tests catch real bugs
- Never weaken assertions
- Revert if any test fails

### Type Safety (2026-09-18)
- Eliminated all 52 `any` types
- Pattern: `unknown` + type narrowing > `any`
- Files: contracts, stores, hooks, adapters

## Architectural Debt (Phase 8 Backlog)

### Conversation Unification (RESOLVED in Phase 8b)
- Before: duplicate types in domain + @/types
- After: domain is single source, @/types re-exports
- Pattern: domain → re-export, not duplicate

### Unsafe Auth Storage Deserialization

**Files:**
- src/features/auth/store/auth.slice.helpers.ts:21, 31

**Issue:** `JSON.parse(localStorage)` without Zod schema validation.

**Recommended Fix (Phase 8):**
- Define Zod schemas for StoredUser + UserProfile
- Use `readValidated` from safeStorage

