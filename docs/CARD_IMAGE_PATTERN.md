# Card Image Pattern — FROZEN

> **Status: FROZEN.**
> Do NOT modify without explicit written permission from the founder (Sufyan).
>
> This file exists because the pattern was changed 8+ times in Session 3
> (2026-10-07/08) before stabilizing. Every future agent must read this
> before touching card images. Violations = immediate revert.

## The Rule (3-tier adaptive)

Card images in FOX use **adaptive object-fit** based on the image's
natural aspect ratio. This mirrors Instagram's bounded-contain logic
(Instagram Android Blog, 2021) and Apple Photos / WhatsApp.

| Ratio (w/h) | Type | Fit | Example |
|-------------|------|-----|---------|
| **>= 1.4** | Wide landscape | `object-cover` | Car 16:9, Villa 16:9 |
| **0.33 → 1.4** | Portrait, square, mild landscape (incl. EXIF-flipped) | `object-contain` | FOX plush, phone portrait |
| **< 0.33** | Extreme portrait | `object-cover` | Screenshot |

> **EXIF-flip safeguard:** Phone portrait photos are stored as landscape
> pixels + EXIF rotate flag. Supabase Transform strips EXIF, so the
> browser reads ratio ~1.33 on what users consider portrait. Threshold
> 1.4 keeps these contained. Do NOT lower to 1.0.

**Implementation:** `src/shared/lib/imageFit.ts` → `pickImageFitClass()`.

### Horizontal Card (`ListingCardHorizontal.tsx`)
- Frame: **fixed 136×136 px** (never variable)
- Background: `bg-surface` (matches card — no visible box)
- Detection: `imageWidth`/`imageHeight` from DB → fallback to `onLoad`
  `naturalWidth`/`naturalHeight`

### Square Card (`ListingCardImage.tsx` — Grid view)
- Frame: `aspect-square`, `object-cover` (unchanged, industry standard)

### Trending Section (`TrendingSection.tsx`)
- Frame: `h-28 w-full`, `object-cover` (landscape-only data)
- Unchanged.

## Why Adaptive (not one-size-fits-all)

| Image type | object-cover | object-contain | Winner |
|------------|--------------|----------------|--------|
| Portrait (1:2.5) | cuts head/feet | full | **contain** |
| Landscape (16:9) | fills | grey bars | **cover** |
| Extreme portrait (1:5) | shows reasonable crop | 27px sliver | **cover** |
| Square (1:1) | fills | fills | tie |

No single value works for all ratios. Adaptive is the only correct answer.

## FORBIDDEN (all tried and failed in Session 3)

- ❌ `blur backdrop` — felt fake to users
- ❌ Variable-width frames based on ratio (Claude pattern) — broke text alignment in 20-item lists
- ❌ `object-contain` for landscape — grey bars above/below
- ❌ `object-cover` for normal portrait — cuts the subject
- ❌ `object-contain` for extreme portrait — 27px sliver (unreadable)
- ❌ `self-stretch` on image container — caused 400-500px tall cards
- ❌ `aspect-[4/3]` for horizontal cards — worse than square for portraits

## Hard rules

1. **Frame size stays fixed** (136×136). Never variable per-item.
2. **Text column starts at the same x-coordinate** in every card.
3. **No blur, no black bg** visible to user.
4. **No sliver-wide renders** (image < 40px wide inside card).
5. **Adaptive only** — see the 3-tier table above.
6. **Any change requires:** reading this file + written permission from Sufyan.

## Locked in

- PR: `feat/card-image-final` (Session 3, 2026-10-08)
- Golden Rule #16 — Card Images Frozen

## If you're a future agent reading this

Do not "improve" this pattern. Do not try blur. Do not try variable widths.
Do not try aspect-square for landscape. Do not try object-cover for portrait.
The pattern is frozen for a reason. Re-read the "FORBIDDEN" section.

If you have a genuinely new idea, write an ADR in `docs/adr/` and get
Sufyan's approval before touching the code.
