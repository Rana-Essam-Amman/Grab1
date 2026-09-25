# Project Conventions — Grab The Deals

**Source of truth for project-level decisions.**

## 🌳 Repository

| Field | Value |
|-------|-------|
| Official Name | Grab The Deals |
| Repo Name | `Grab1` |
| Default Branch | `main` (NEVER `master`) |
| Remote Name | `new-origin` |
| Repo URL | https://github.com/Rana-Essam-Amman/Grab1 |

## 📌 Mandatory Workflow (Rule 37)

Every task ends with:
```bash
git add .
git commit -m "<type>(<scope>): <description>"
git push new-origin main
```

Verification (required in every report):
```bash
git log --oneline -3
git status --short
git ls-remote new-origin refs/heads/main
```

## 🔑 Token Management

| Item | Value |
|------|-------|
| Type | Fine-grained PAT |
| Scope | Grab1 only |
| Permissions | Contents: Read & Write |
| Rotation | Every 90 days |
| Current Expiry | ~2026-12-15 |

Token Storage:
- ✅ Password Manager (user device, backup)
- ✅ GitHub Actions Secrets (for CI)
- ❌ NEVER in chat/repo/files

## 🚨 Recovery Protocol (Sandbox Reset)

If `new-origin` missing:
```bash
git remote add new-origin "https://<TOKEN>@github.com/Rana-Essam-Amman/Grab1.git"
git fetch new-origin main
git reset --soft new-origin/main
git add .
git commit -m "recovery: sync after sandbox reset"
git push new-origin main
```

## 📝 Commit Format

Conventional Commits: `<type>(<scope>): <description>`
Types: feat, fix, docs, test, refactor, chore, ci, recovery.

## AI Agent Onboarding

Any new AI agent working on this project MUST:
1. Read `docs/AI_AGENT_GUIDE.md` first
2. Read `PROJECT_CONSTITUTION.md`
3. Read `docs/PROMPT_PATTERNS.md`
4. Read `docs/LESSONS_LEARNED.md`
5. Read `docs/SESSION_HANDOFF.md` for current state

Then act as **Technical PM / Architect** — write prompts for Idx (the executor).

See `docs/AI_AGENT_GUIDE.md` section 10 for full role definition.

## 📅 History

- 2026-09-16: Initial version.
