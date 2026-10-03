# Field Expansion — 2026-10-03

## Summary

Expanded listing field schemas across all 20 categories to match/exceed
competitor coverage (OpenSooq, Haraj, Dubizzle, OLX).

## Commits

- `b424ab1` — Split listingFields into 22 files (motors + real-estate + mobiles expanded first)
- `d4e2e28` — Expanded the remaining 17 categories (its commit message was a copy-paste of b424ab1)

## Coverage

Total fields: see `grep -c "key:" src/data/listingFields/*.ts | tail -1`
Total selects (with allowOther): see grep above

## Categories covered

motors, real-estate, mobiles, watches, computers, electronics, furniture,
fashion, beauty, kids, pets, sports, books, home-garden, krakeeb, services,
jobs, cleaning, handymen, projects.

## Notes

- Every select has `allowOther: true` → user can type custom values.
- Custom values flow into postDraft.generated.fields and appear in the
  preview chips.
