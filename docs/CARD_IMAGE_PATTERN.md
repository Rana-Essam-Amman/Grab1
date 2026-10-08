# Card Image Pattern — FROZEN (v2, verified on production)

> **Status: FROZEN. WORKING ON PRODUCTION (2026-10-08).**
> Do NOT modify without explicit written permission from the founder (Sufyan).
>
> This supersedes the earlier doc. The previous assumptions about EXIF were
> incomplete. This version reflects what actually shipped and verified.
>
> Any change requires: reading this file + written approval from Sufyan.

---

## The two-layer solution

### Layer 1 — URL: preserve EXIF (`optimizedImage.ts`)

**Critical:** Supabase Storage Transform API (`/storage/v1/render/image/...`)
**strips EXIF orientation metadata**. Phone cameras save portrait photos as
landscape pixels + an EXIF "rotate 90°" flag. When the transform strips
that flag, the browser sees the wrong orientation and renders the image
rotated or cropped.

**Therefore:**

- **For cards and thumbnails:** use the **ORIGINAL** Supabase URL
  (`/storage/v1/object/public/...`). EXIF is preserved. Browser auto-rotates.
- **For large hero images (optional future):** if transform is needed,
  the EXIF orientation must be baked into the pixels first (client-side
  `createImageBitmap(file, { imageOrientation: 'from-image' })`).

**Source:** StackOverflow — NuxtImg + Supabase strips EXIF orientation:
https://stackoverflow.com/questions/77402332/

### Layer 2 — Fit: 3-tier adaptive (`imageFit.ts`)

Given a properly-oriented image, choose the fit class from its ratio.

| Ratio (w/h) | Type | Fit | Example |
|-------------|------|-----|---------|
| **>= 1.4** | Wide landscape | `object-cover` | Car 16:9, Villa 16:9 |
| **0.33 → 1.4** | Portrait / square / mild landscape (incl. EXIF-flipped) | `object-contain` | FOX plush, phone portrait |
| **< 0.33** | Extreme portrait | `object-cover` | Screenshot |

**Why 1.4 and not 1.0?** EXIF-flipped portrait photos report ratio ~1.33
after transform (or in some browsers). Threshold 1.4 keeps those contained.
**Do NOT lower to 1.0.**

**Implementation:** `src/shared/lib/imageFit.ts` → `pickImageFitClass()`.

---

## Card frames (locked)

### Horizontal Card (`ListingCardHorizontal.tsx`)
- Frame: **fixed 136×136 px** (never variable)
- Background: `bg-surface` (matches card — no visible box)
- Detection: `imageWidth`/`imageHeight` from DB → fallback to `onLoad`
  `naturalWidth`/`naturalHeight`

### Square Card (`ListingCardImage.tsx` — Grid view)
- Frame: `aspect-square`, `object-cover` (unchanged, industry standard)

### Trending Section (`TrendingSection.tsx`)
- Frame: `h-28 w-full`, `object-cover`
- Unchanged.

---

## Sources (verified)

- **Supabase Transform strips EXIF** — StackOverflow (NuxtImg case):
  https://stackoverflow.com/questions/77402332/
- **Cloudflare Pages stale HTML cache** — official community thread:
  https://community.cloudflare.com/t/pages-deployment-not-invalidating-stale-cache-after-multiple-purges-sortedsites-co/938225
- **Instagram bounded-contain** — Android Blog, 2021 (4:5 portrait max,
  1.91:1 landscape max): https://android-developers.googleblog.com/
- **OLX / Dubizzle / Facebook** — square + cover thumbnails (industry standard).

---

## FORBIDDEN (all tried and failed in Session 3)

- ❌ **Supabase transform for card thumbnails** — strips EXIF, rotates
  portrait photos. THIS WAS THE BUG.
- ❌ `blur backdrop` — felt fake.
- ❌ Variable-width frames based on ratio (Claude pattern) — broke text
  alignment in 20-item lists.
- ❌ `object-contain` for wide landscape — grey bars above/below.
- ❌ `object-cover` for normal portrait — cuts the subject.
- ❌ `object-contain` for extreme portrait — 27px sliver (unreadable).
- ❌ `self-stretch` on image container — caused 400-500px tall cards.
- ❌ `aspect-[4/3]` for horizontal cards — worse than square for portraits.

---

## Hard rules

1. **Frame size stays fixed** (136×136). Never variable per-item.
2. **Text column starts at the same x-coordinate** in every card.
3. **No blur, no black bg** visible to user.
4. **No sliver-wide renders** (image < 40px wide inside card).
5. **No Supabase transform on card thumbnails** — EXIF must survive.
6. **Adaptive fit only** — 3-tier, threshold 1.4 (not 1.0).
7. **Any change requires:** reading this file + written permission from Sufyan.

---

## Locked in

- UI PR: `feat/card-image-final` (3-tier adaptive)
- EXIF fix PR: `fix/exif-preserve-card-images`
- Threshold fix PR: `fix/exif-threshold` (1.4)
- Verified on production: 2026-10-08
- Golden Rule #16 — Card Images Frozen

---

## If you're a future agent reading this

Do NOT "improve" this pattern. Do NOT reintroduce Supabase transform on
card thumbnails (it will strip EXIF and rotate phone portrait photos).
Do NOT try blur. Do NOT try variable widths. Do NOT lower the 1.4 threshold.

The pattern is frozen because it was tested 10+ times and only this works.
Re-read the FORBIDDEN section before touching anything.

If you have a genuinely new idea, write an ADR in `docs/adr/` and get
Sufyan's approval.
