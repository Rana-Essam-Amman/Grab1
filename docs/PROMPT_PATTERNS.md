# Prompt Patterns — Grab The Deals

**Purpose:** Library of prompt patterns for AI agents on this project.
**Audience:** Any AI agent working on this codebase.

## Why This Exists

AI agents respond differently based on prompt structure. These patterns are battle-tested.

## Pattern 1: Atomic Edit (Default)

**When:** Fixing one thing (bug, type, refactor).
**Why it works:** Limits scope → prevents side effects.

**Template:**
```
ROLE: Senior frontend architect at top-tier company.
STRICT RULES:
- Touch ONLY the files listed.
- If task requires touching other files → STOP.
- Tests MUST pass (337). If any fails → revert.
- Paste RAW output.

TASK: <one thing>

STEPS:
1. Show current state (grep/cat)
2. Fix (surgical)
3. Verify (tsc, tests, build, audit)
4. Commit + push
5. Report (RAW)
```

**Real Example (P1-d-1):** Fixed 7 `any` in 4 files. Tests stayed 337.

## Pattern 2: Force Fix (when Idx claims success but nothing changes)

**When:** Idx says "done" but visual check shows no change.
**Why it works:** Bypasses all CSS overrides with inline styles.

**Template:**
```
STOP. Previous attempt failed. Do this EXACTLY.

REPLACE THE ENTIRE FILE with:
<full content using inline styles>

CRITICAL:
- REPLACE entire file.
- Use INLINE STYLES ONLY (style={{...}}).
- No className, no Tailwind.
```

**Real Example (UI-FIX-15):** DemoCountryPicker faded despite multiple fixes. Solution: inline styles.

## Pattern 3: Diagnostic First

**When:** Unknown issue, or Idx fails twice.
**Why it works:** Maps the problem before touching anything.

**Template:**
```
DIAGNOSTIC. READ ONLY. Paste RAW.

Run:
1. <command 1>
2. <command 2>

REPORT:
- A) <what we want to know>
- B) Root cause hypothesis
- C) Fix suggestion

CRITICAL: Do NOT modify anything.
```

**Real Example (Chat crash):** Found `setSelectedThreadId(threadId)` was missing. Fix was 1 line.

## Pattern 4: Force Raw Output

**When:** Idx says "Task complete and verified" without details.
**Why it works:** Forces exact output, no summaries.

**Template:**
```
RAW OUTPUT ONLY. No summaries.

Run and paste each output:

1. git log --oneline -1
2. git ls-remote new-origin refs/heads/main
3. npm test 2>&1 | grep -E "Test Files|Tests"
4. grep -rn "<pattern>" src/ | wc -l

FORMAT:
1. <output>
2. <output>
3. <output>
4. <output>

NO comments. Just the 4 outputs.
```

**Real Example (P1-d-2):** Idx claimed "verified" without numbers. Force pattern → revealed 2 tests failing silently.

## Pattern 5: Session Handoff

**When:** Switching AI agents or new session.
**Template:**
```
تابع من هنا — Agenda v<X>

آخر commit: <hash>
Tests: <n>
Violations: <n>

الحالة: <current task>
الخطوة التالية: <next task>
```

## Pattern 6: Verification After Push

**When:** After every commit + push.

**Template:**
```
Verify push. READ ONLY.

Run:
1. git log --oneline -1
2. git ls-remote new-origin refs/heads/main
3. git status --short

REPORT:
- Local HEAD: <hash>
- Remote HEAD: <hash>
- Match: YES/NO
- Working tree: clean/dirty
```

## Anti-Patterns (NEVER USE)

- ❌ "Fix everything that's broken"
- ❌ "Improve the code" (too vague)
- ❌ Multi-file mega-tasks (>5 files)
- ❌ Prompts without STRICT RULES
- ❌ Prompts without RAW verification

## Best Practices

- ✅ One file per task (max 3)
- ✅ Explicit commands (grep, cat, wc -l)
- ✅ Tests must pass before commit
- ✅ Raw output always
- ✅ Never trust "done" without evidence
- ✅ If Idx fails twice → use Pattern 2 (Force Fix)
