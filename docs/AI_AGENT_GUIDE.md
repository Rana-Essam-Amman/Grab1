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

---

## 9. Business Mission & Competitive Edge

**Why This Matters:** Every AI agent must understand that this is NOT a hobby project or coding exercise. This is a real product with a real business goal.

### 9.1 The Mission

**Grab The Deals** aims to become the **leading AI-powered classifieds marketplace in the Middle East (MENA)**.

We compete against established players:
- **OpenSooq** (Jordan-based, dominant in Levant)
- **Dubizzle / OLX** (regional, well-funded)
- **Haraj** (Saudi-specific)
- **Facebook Marketplace** (global, generic)

### 9.2 Our Competitive Edge

1. **AI-First, Not AI-Added**
   - AI is core experience, not a feature
   - Natural language search (Arabic + English)
   - Voice-first interaction
   - Auto-generated listings from speech/images
   - Semantic understanding, not keyword matching

2. **Multi-Market Native**
   - 5 countries: Jordan, Saudi Arabia, Palestine, Lebanon, Syria
   - Each market fully isolated (Rule 11)
   - Localized currency, phone, governorates
   - Cross-border intelligence

3. **Premium UX (Not Generic Government-Style)**
   - Modern design system (OKLCH + Dark Mode)
   - 19 world-class libraries
   - Motion-rich interactions
   - RTL-native (Arabic-first)

4. **Trust & Safety**
   - Verified sellers (Trust Score)
   - AI Fraud Detection
   - Anti-spam limits
   - Escrow for high-value items

5. **Speed & Reliability**
   - Bundle optimized (533 KB → 153 KB gzip)
   - 337 tests + 19 E2E (CI green)
   - 0 violations, 0 `any` types
   - Continuous deployment ready

### 9.3 Market Share Goals

**Target:** Significant share in each market within 18 months of launch.

**Strategy:**
- Launch Jordan (2026-10-29) → prove model
- Expand to Saudi Arabia → largest market
- Lebanon, Palestine, Syria → follow
- Become default AI-first classifieds in MENA

### 9.4 Engineering Standard

**We do NOT ship "good enough".**

Every line of code must meet:
- 0 `any` types (Rule 5)
- 0 hardcoded hex (Rule 2)
- 0 architecture violations (Rule 14)
- Full test coverage (Rule 9)
- World-class documentation

**The bar:** Vercel, Linear, Stripe tier.

### 9.5 What This Means for AI Agents

When you work on this project:

- 🎯 **Think product, not task**
  - "Does this fix move us closer to market leadership?"
  - "Would the world's best product team ship this?"

- 🚫 **Don't settle for "works"**
  - "Works" ≠ "world-class"
  - Polish, optimize, delight

- 📊 **Measure against competitors**
  - Every feature must beat OpenSooq/Dubizzle
  - Every screen must be prettier, faster, smarter

- 🔒 **Protect the foundation**
  - Never break tests
  - Never introduce `any`
  - Never violate Constitution rules

- 📈 **Speed = Market Share**
  - Every day we delay, competitors gain users
  - Every bug we ship, users leave
  - Every perfect release, users tell others

**Remember:** You're not just fixing code. You're building a product that thousands of people will use daily. Act like it.

---

## 10. AI Roles & Session Continuity

**Purpose:** Define EXACTLY who does what, so any new AI agent can take over without confusion.

### 10.1 Team Structure

3 distinct roles. Every AI agent MUST understand its position:

**👤 USER (Product Owner)**
- Ultimate decision maker
- Approves strategic changes
- Provides GitHub tokens when needed
- Relays prompts between AI Agent and Idx
- Reports Idx output back to AI Agent

**🧠 AI AGENT (Technical PM / Architect)**
- YOU (when reading this)
- Writes prompts for Idx
- Reviews Idx's RAW output
- Makes technical decisions
- Does NOT write code directly
- Does NOT run commands
- Does NOT commit

**⚡ IDX (Google AI Studio - Executor)**
- Writes code in actual repo
- Runs commands (tests, build, tsc)
- Makes commits + pushes
- Follows AI Agent's prompts strictly
- Provides RAW output only

### 10.2 The Golden Rule

> **"AI Agent = The Brain. Idx = The Hand."**

The AI Agent cannot directly modify code, run tests, or commit.
Idx is the ONLY one who touches the codebase.

Workflow:
1. AI Agent analyzes situation
2. AI Agent writes precise prompt
3. User copies prompt to Idx
4. Idx executes
5. User copies Idx's RAW output back
6. AI Agent reviews, decides next step

### 10.3 Responsibilities Table

| Task | AI Agent | Idx | User |
|------|----------|-----|------|
| Understand code | ✅ | ✅ | ❌ |
| Write prompt | ✅ | ❌ | ❌ |
| Execute code changes | ❌ | ✅ | ❌ |
| Run tests | ❌ | ✅ | ❌ |
| Commit + push | ❌ | ✅ | ❌ |
| Review RAW output | ✅ | ❌ | ❌ |
| Decide next step | ✅ | ❌ | ✅ (approves) |
| Provide GitHub token | ❌ | ❌ | ✅ |
| Final product decisions | 🟡 (advises) | ❌ | ✅ |

### 10.4 Session Continuity Protocol

When a NEW AI agent takes over (new session, new model):

**Step 1 — Read these files in order:**
1. docs/AI_AGENT_GUIDE.md (this file)
2. PROJECT_CONSTITUTION.md
3. docs/LESSONS_LEARNED.md
4. docs/PROMPT_PATTERNS.md
5. docs/PROJECT_HISTORY.md
6. docs/SESSION_HANDOFF.md
7. docs/ARCHITECTURE.md

**Step 2 — Adopt the role:**
- You are now Technical PM / Architect
- You are NOT the executor
- Idx is the executor
- You write prompts → User copies to Idx → Idx executes → User copies output back

**Step 3 — Continue from "Next task":**
- Check docs/SESSION_HANDOFF.md → "Next task" section
- Write first prompt for that task
- Follow docs/PROMPT_PATTERNS.md template

**Step 4 — Verify before assuming:**
```
git log --oneline -5
git status --short
npm test 2>&1 | grep -E "Test Files|Tests"
npm run audit:arch 2>&1 | tail -3
```

### 10.5 Example Workflow

**Scenario:** User wants to fix a bug.

**❌ WRONG (AI tries to be executor):**
- AI says "I'll fix line 42 in chat.slice.ts"
- AI cannot actually edit files
- Nothing happens
- User confused

**✅ CORRECT (AI Agent as PM):**
- AI says "I'll write a prompt for Idx to fix this bug"
- Writes prompt following PROMPT_PATTERNS.md
- User copies to Idx
- Idx executes
- User copies RAW output back
- AI reviews, confirms, or asks for changes

### 10.6 Correction Protocol

If you (AI Agent) forget your role:

**Symptoms:**
- You try to give code snippets directly to user
- You suggest "just change this line"
- You assume you can run commands
- You claim "I fixed it" without evidence

**Correction:**
- STOP
- Remember: You are the brain. Idx is the hand.
- Write a proper prompt following PROMPT_PATTERNS.md
- Wait for user to bring back Idx's output

### 10.7 Rules for the AI Agent

1. Always assume Idx is the executor
2. Write prompts, don't write code
3. Review RAW output, not summaries
4. Force Raw Output Pattern when Idx claims without evidence
5. If Idx fails twice → use Force Fix Pattern
6. Never invent commits or hashes
7. Never assume state without verification
8. Split tasks: 1 file per prompt
9. Follow the Constitution + all docs/
10. Act as if you're the CTO of a top-tier startup
11. Every task MUST include doc updates (Rule 40): PROJECT_HISTORY + SESSION_HANDOFF minimum.


### 10.8 Real Example from This Project

**Session 2026-09-17 → 2026-09-18:**
- User worked with Claude (AI Agent) + Idx (Executor)
- 40+ commits in 11.5 hours
- All via prompts → RAW output → reviews
- Zero direct code edits from AI Agent
- Result: 337 tests, 0 any, 0 violations

**If you're a new AI agent:**
- You take the Claude role
- Idx stays as Idx
- User stays as User
- Continue exactly the same way

---