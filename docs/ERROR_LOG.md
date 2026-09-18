# Error Log

Every bug fix MUST be documented here with: Root Cause + Prevention Rule + Regression Test.

---

## Bug #001 — Massive Untracked Files (2026-09-16)

**Severity:** P0 (Critical) — Data Loss Risk

**Symptom:** Only 59 of 386 files tracked in git (15.3%).

**Root Cause:** AI agent used `git add <specific-file>` for each task instead of `git add .` after multi-file refactors. Cumulative effect: 327 files (including src/data/, src/ai/, src/contracts/, docs/, scripts/, templates/) were NOT on GitHub for 8+ hours.

**Detection:** Discovered during Playwright setup when package.json reported as untracked.

**Impact:** Project at risk of 84.7% data loss on container reset.

**Resolution:** Emergency commit `4145691` — full codebase sync (513 files now tracked).

**Prevention:**
1. Rule 36 (pending): Git Discipline — mandatory `git add .` for commits.
2. `scripts/git-health-check.mjs` — automated pre-commit checker.
3. Husky pre-commit hook enhanced to run health check.
4. Prompt templates updated: every prompt MUST end with `git add .` instruction.

**Regression Test:** `git-health-check` must pass before every commit (fails if < 95%).

**Lesson:** Automated guardrails > documentation. Selective git add is forbidden for multi-file changes.

---

## Bug #002 — Idx Contradictory Self-Reports (2026-09-16)

**Severity:** P1 (High) — Trust & Verification Risk

**Symptom:** After completing R7.0d.9 (Wishlist tests), Idx produced a single response containing TWO contradictory reports:
- Report A: "R7.0d.9: PARTIAL, 2 tests FAILING, push FAILED"
- Report B (in the same message): "R7.0d.9: COMPLETE, 5/5 Golden Paths, push SUCCESS"

**Root Cause:** Idx's reporting layer concatenates outputs from multiple internal retry loops without resolving which attempt's results are authoritative. The final summary was hardcoded optimistic, while the raw run logs showed failures.

**Detection:** Caught during human review of the Idx response before accepting the task as complete.

**Impact:** 
- Risk of accepting incomplete work as done.
- Trust erosion in AI agent output.
- Potential silent regressions shipped to remote.

**Resolution:**
- Triggered a RE-READ (READ-ONLY) verification task.
- Idx re-ran the wishlist tests on demand → 3/3 passed.
- Final commit `1f44eb0` verified on remote with matching HEAD.
- Bug resolved by requiring ADE (Automated Documentation of Evidence).

**Prevention:**
1. Rule 36 (added below): Every task MUST end with a VERIFICATION block containing raw command output.
2. No task considered "COMPLETE" without raw evidence (git log, test tail, ls output).
3. Contradictory reports MUST trigger an immediate READ-ONLY verification task.
4. Update prompt templates: every prompt MUST include a mandatory "Evidence Required" section.

**Regression Test:** Every prompt's final report MUST include raw outputs from `git log --oneline -3`, `git status --short`, and `git ls-remote new-origin refs/heads/main`. If any of these are missing OR contradictory, the task is REJECTED.

**Lesson:** AI agents can produce internally-contradictory reports. Human verification is NOT optional. Automate evidence collection in every prompt.

---

## Bug #003 — CI Failure: Lockfile Out-of-Sync + Node Version Mismatch (2026-09-16)

**Severity:** P1 (High) — Blocks All CI

**Symptom:** GitHub Actions CI failed on both commits (0f34e25, 8fa4ccb) in ~20 seconds. `npm ci` refused to install:
- `Missing: @playwright/test@1.63.0 from lock file`
- `Missing: playwright@1.63.0 from lock file`

Additionally, Node version mismatch:
- CI used Node 20
- Project requires Node 22+ (per vitest@5, wat-something packages)

**Root Cause:**
1. When Playwright was installed (`npm install -D @playwright/test`), `package.json` was updated but `package-lock.json` was NOT regenerated. The lockfile drifted from the manifest.
2. CI workflow was authored with `node-version: '20'`, but local dev runs Node 22. Version mismatch caused engine warnings and potential downstream failures.

**Detection:** Caught when first CI run triggered red X on GitHub. Diagnosis via GitHub Actions log showed `npm ci` failure and Node engine mismatch.

**Impact:**
- CI blocked for 2 commits (0f34e25, 8fa4ccb).
- No automatic verification of pushes.
- Potential silent regressions.

**Resolution:**
- Ran `npm install --package-lock-only` locally to regenerate lockfile.
- Updated `.github/workflows/ci.yml`: `node-version: '20'` → `'22'`.
- Commit 2fe56b8 fixed both issues. CI turned green.

**Prevention:**
1. Rule 38 (added below): Lockfile Discipline — every dependency change MUST regen lockfile.
2. Pre-commit hook enhancement (planned): verify `package-lock.json` is in sync with `package.json`.
3. CI workflow template: always use same Node version as local dev (.nvmrc file recommended).

**Regression Test:** Running `npm ci` MUST succeed after `npm install --package-lock-only`.

**Lesson:** Two simple config drifts blocked CI. Always treat `package.json` + `package-lock.json` + `.github/workflows/` as ONE unit when changing deps.

---

## Bug #004 — Idx Stale Reports + Rate Limits (2026-09-16)

**Severity:** P2 (Medium) — Process

**Symptom:** During UI-1/UI-2 tasks, Idx occasionally:
- Returned stale/cached reports from previous tasks.
- Hit "retryable error" limits after 3-4 prompts.

**Root Cause:** Google AI Studio per-session rate limits + agent context caching.

**Impact:** Slow iteration, occasional confusion about task state.

**Resolution:** 
- Shortened prompts to ≤ 15 lines.
- Added RAW verification before accepting completion.
- Split large tasks into single-file steps.

**Prevention:**
1. All prompts MUST be ≤ 15 lines.
2. Every task ends with RAW git log + test output.
3. Waited 1-2h between heavy session bursts.



