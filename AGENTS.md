# AGENTS.md

Repository-wide instructions for agents working in FOX Marketplace (Grab1).

## Replica Skills

Skills are located under `.agents/skills/`.

Agents must read the relevant skill's `SKILL.md` before performing a task covered by that skill. Do not assume every agent automatically discovers or loads these skills. If an agent environment does not support automatic skill discovery, explicitly read the relevant `SKILL.md` and the templates or scripts it references.

Do not claim that Grok automatically loads these files. Grok must be given repository access and instructed to read them.

### When to use each skill

#### replica-recon

Use when inspecting a reference product, mapping screens, documenting flows, identifying components, inferring data models, and building a feature matrix. Do not invent observations. Separate observed facts from assumptions.

Path: `.agents/skills/replica-recon/SKILL.md`

#### replica-test

Use when testing application flows, preparing regression plans, writing Playwright tests, and documenting reproduced bugs. Test the FOX clone, not third-party production servers. Do not claim a bug is reproduced without evidence.

Path: `.agents/skills/replica-test/SKILL.md`

The file `e2e.example.spec.ts` is a template. Adapt it to FOX before execution. Do not run it against production as-is.

#### replica-diff

Use when comparing feature parity or screenshots/layouts between FOX and a reference product. Distinguish feature parity from visual similarity. Do not fabricate parity scores.

Path: `.agents/skills/replica-diff/SKILL.md`

#### replica-entrepreneur

Use when analyzing real user feedback, reviews, complaints, and feature requests. Preserve source URLs and exact review evidence. Never fabricate reviews, quotations, or sample sizes.

Path: `.agents/skills/replica-entrepreneur/SKILL.md`

### FOX-specific engineering constraints

- React + TypeScript + Vite + Tailwind + Zustand + Supabase + Cloudflare Pages.
- Markets: JO, SA, PS, LB, SY, KW.
- Do not perform broad rewrites when a surgical change is sufficient.
- No `as any`, `@ts-ignore`, or `@ts-expect-error`.
- Follow the repository's Rule 14 file-size limits:
  - Screens ≤150 lines
  - Components ≤120 lines
  - Hooks ≤100 lines
  - Helpers ≤80 lines
  - Slices ≤120 lines
  - Services ≤150 lines
- Verify current GitHub `main` and CI evidence before proposing or making changes.
- Never claim a deployment, merge, migration, or database change succeeded without direct evidence.
- Do not apply Supabase production migrations or modify production data as part of skill-installation work.
- Do not create paid Supabase branches or paid resources.
