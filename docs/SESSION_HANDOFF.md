# Session Handoff Template

Use this template when starting a new session or switching AI agents.

## Current State (Update before ending session)

- **HEAD commit:** 26fa7cb
- **Tests:** 337 passing (42 test files)
- **Violations:** 0
- **Working tree:** clean
- **Last completed task:** Batch 4 (Auth feature icon migration — 12 files)
- **Next task:** Batch 5 (Next feature icon migration)

## Active Sprints

- **P1 Cleanup:** P0 + P1-a + P1-b + P1-c + P1-d (any = 0) ✅
- **DOC-1:** 1a done, 1b in progress, 1c pending
- **Next:** Phase 5-8 (Cleanup → UI-3 → Supabase)

## Blocked Items

None.

## How to Start a New Session

1. Read in order:
   - docs/AI_AGENT_GUIDE.md
   - PROJECT_CONSTITUTION.md
   - docs/LESSONS_LEARNED.md
   - docs/PROMPT_PATTERNS.md
   - docs/ARCHITECTURE.md
   - This file (SESSION_HANDOFF.md)

2. Check git state:
   ```
   git log --oneline -5
   git status --short
   npm test 2>&1 | grep -E "Test Files|Tests"
   npm run audit:arch 2>&1 | tail -3
   ```

3. Continue from "Next task" section above.

## For AI Agents: Doc Discipline (Rule 40)

After EVERY task, you MUST update:
1. docs/PROJECT_HISTORY.md — append task
2. docs/SESSION_HANDOFF.md — update current state
3. docs/LESSONS_LEARNED.md — if bug
4. docs/PROMPT_PATTERNS.md — if new pattern

Same commit as code. Message ends with `+ docs`.


## Session Log

### 2026-09-17 → 2026-09-18 (Night Session)

**Duration:** ~11.5 hours
**Commits:** 40+

**Completed:**
- Chat messages fixed (immer removal)
- Demo flow with Market Picker
- Design System UI-1 complete
- Bundle optimization (-23%)
- localStorage migration (0 direct)
- any elimination (53 → 0)
- Rule 20 compliance
- DOC-1a (PROMPT_PATTERNS + LESSONS_LEARNED)

**Next Session Focus:**
- Finish DOC-1b
- Phase 5: Dead Code cleanup
- Phase 6: Runtime Safety
- Phase 7: Consistency (hex → tokens)
- Phase 8: World-Class Verification

## Working Style

- Idx as executor with ROLE prompts
- Atomic edits: ONE file per task
- RAW output verification required
- Tests MUST pass before commit
- Token passed manually to Idx
- 337 tests, 0 any, 0 violations
