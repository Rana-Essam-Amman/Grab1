# Grab The Deals

> AI-powered classifieds marketplace for the Middle East.

## 📦 Project Info

| Field | Value |
|-------|-------|
| Official Name | Grab The Deals |
| Repo | Grab1 |
| Default Branch | `main` |
| GitHub | https://github.com/Rana-Essam-Amman/Grab1 |
| Stack | React 18 + TypeScript + Vite + Tailwind v4 |
| Backend | Firebase (pending) |
| AI | Gemini 2.5 Flash |

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
| PROJECT_CONSTITUTION.md | 39 architectural rules |
| `docs/ARCHITECTURE.md` | Layered architecture pattern |
| docs/CONVENTIONS.md | Naming, branches, tokens |
| docs/ERROR_LOG.md | Bug history |
| docs/REFERENCE_IMPLEMENTATIONS.md | Gold-standard files |

## 🏛️ Architecture

Grab The Deals uses **Clean Layered Architecture**:

- **Domain** — Pure TypeScript business rules
- **Data** — Repository interfaces + Adapters (localStorage today, Supabase next)
- **Store** — Zustand slices using Repositories
- **UI** — React components

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full pattern.

Governed by [`PROJECT_CONSTITUTION.md`](PROJECT_CONSTITUTION.md) — 39 non-negotiable rules.

## 🛡️ Quality Gates

Every push to `main` MUST pass:
- TypeScript (tsc --noEmit)
- ESLint
- Vitest (337 tests)
- Architecture audit (0 violations)
- Git health check (100%)

## 📅 Status

- ✅ Sprint R7 (25 files refactored, 0 violations)
- ✅ Constitution v1.1.4 (39 rules)
- ✅ 5/5 Golden Paths (19 E2E tests)
- ✅ 337 Vitest tests passing
- ✅ CI/CD on GitHub Actions (green)
- ✅ Clean Layered Architecture (R7.5)
- 🟢 UI Polish (in progress)
- ⏳ Supabase Backend
- ⏳ Beta Launch (target: 2026-10-29)
