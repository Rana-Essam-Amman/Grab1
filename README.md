# FOX Marketplace

> AI-powered classifieds marketplace for the Middle East.

## 📦 Project Info

| Field | Value |
|-------|-------|
| Official Name | FOX Marketplace |
| Repo | Grab1 |
| Default Branch | `main` |
| GitHub | https://github.com/Rana-Essam-Amman/Grab1 |
| Stack | React 18 + TypeScript + Vite + Tailwind v4 |
| Backend | Firebase (pending) |
| AI | Gemini 2.5 Flash |

## 🛠️ Stack

- Framework: React 18 + TypeScript + Vite
- Styling: Tailwind CSS v4 + OKLCH tokens
- State: Zustand + Repository Pattern
- Testing: Vitest (337) + Playwright (19)
- Design System: Radix UI + Iconsax + 16 more
- Backend (pending): Supabase

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🧪 Tests

```bash
npm test              # Vitest
npx playwright test   # E2E
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| PROJECT_CONSTITUTION.md | 40 architectural rules |
| docs/AI_AGENT_GUIDE.md | How AI agents work on this project |
| docs/PROMPT_PATTERNS.md | Battle-tested prompt patterns |
| docs/LESSONS_LEARNED.md | Bugs, issues, and lessons |
| docs/PROJECT_HISTORY.md | Complete timeline |
| docs/SESSION_HANDOFF.md | Session continuity template |
| docs/ARCHITECTURE.md | Layered architecture pattern |
| docs/ERROR_LOG.md | Bug tracking |
| docs/CONVENTIONS.md | Repo conventions |

## 🏛️ Architecture

FOX Marketplace uses **Clean Layered Architecture**:

- **Domain** — Pure TypeScript business rules
- **Data** — Repository interfaces + Adapters (localStorage today, Supabase next)
- **Store** — Zustand slices using Repositories
- **UI** — React components

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full pattern.

Governed by [`PROJECT_CONSTITUTION.md`](PROJECT_CONSTITUTION.md) — 40 non-negotiable rules.

## 🛡️ Quality Gates

Every push to `main` MUST pass:
- `tsc --noEmit` (0 errors)
- `eslint src/` (0 errors)
- `npm test` (337 tests)
- `npm run audit:arch` (0 violations)
- `npm run health:git` (100% ratio)

## 📅 Status

- ✅ Sprint R7 (Cleanup) — 25 files refactored, 0 violations
- ✅ Sprint R7.5 (Clean Layered Architecture)
- ✅ Design System (UI-1) — 19 modern libraries
- ✅ Constitution v1.1.5 (40 rules)
- ✅ 5/5 Golden Paths (19 E2E tests)
- ✅ 337 Vitest tests passing
- ✅ CI/CD on GitHub Actions (green)
- ✅ 0 `any` types (fully type-safe)
- ✅ 0 architecture violations
- ✅ 0 direct localStorage (all via safeStorage)
- ✅ Bundle optimized (533 KB → 153 KB gzip)
- ✅ 9 documentation files in docs/
- 🟢 UI-3: Home Redesign (next)
- ⏳ Supabase Backend
- ⏳ Beta Launch (target: 2026-10-29)
