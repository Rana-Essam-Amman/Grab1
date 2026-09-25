# Design System — Drawers

## Colors (hex only)
- Navy: #1a2238
- Orange: #E57E25
- White: #FFFFFF
- Card gray: #DDE3EC
- Text dark: #0F172A
- Text muted: #64748B
- Border light: #E2E8F0
- Danger: #DC2626

## Radius
- Drawer top: 24px
- Pills/cards: 9999px (rounded-full)
- Inputs: 12px (rounded-xl)

## Drawer Base (VaulDrawer)
- Overlay: bg-black/40 z-[60]
- Content: bg-white rounded-t-3xl z-[65] bottom-0 max-h-[90vh] border-t border-[#E2E8F0]
- Handle: w-12 h-1.5 rounded-full bg-[#CBD5E1] mx-auto my-3 opacity-60

## Drawer Inner Structure
  <div className="p-4 flex flex-col gap-3 font-cairo">
    1. Close button (top-start)
    2. Content (Pattern A, B, or C)

## Close Button (MANDATORY)
  <button
    onClick={onClose}
    aria-label="Close"
    className="w-10 h-10 rounded-full bg-[#1a2238] text-white flex items-center justify-center shadow-md active:scale-95"
  >
    <CloseCircle size={18} variant="Bold" color="#FFFFFF" />
  </button>

## Primary Pill (section header / "all" option)
  <button className="w-full h-14 rounded-full bg-[#1a2238] text-white flex items-center justify-between px-4 font-bold">
    <span className="w-6 h-6 rounded-full bg-[#E57E25] flex items-center justify-center">
      <TickCircle size={14} variant="Bold" color="#FFFFFF" />
    </span>
    <span className="text-sm">جميع الأقسام</span>
  </button>

## PATTERN A — Grid with images (ExploreCategoryFilterDrawer ONLY)
  <button className="h-16 rounded-full bg-[#DDE3EC] flex items-center justify-between px-4 gap-2 active:scale-[0.98]">
    <span className="text-sm font-bold text-[#0F172A] truncate">{name}</span>
    <img src={image} className="w-10 h-10 rounded-full object-cover shrink-0" />
  </button>

## PATTERN B — Grid text-only with Location icon (CountrySheet, LocationDrawer)
  <button className="h-14 rounded-full bg-[#DDE3EC] flex items-center justify-between px-4 gap-2 active:scale-[0.98]">
    <span className="text-sm font-bold text-[#0F172A] truncate">{name}</span>
    <Location size={14} variant="Linear" color="#E57E25" className="shrink-0" />
  </button>

  Selected variant:
    className="h-14 rounded-full bg-[#1a2238] text-white flex items-center justify-between px-4 gap-2"
    <span className="text-sm font-bold truncate">{name}</span>
    <TickCircle size={16} variant="Bold" color="#E57E25" className="shrink-0" />

## PATTERN C — Inputs + chips (ExplorePriceFilterDrawer)
  Input:
    className="w-full h-12 px-4 rounded-xl bg-white border-2 border-[#E2E8F0] text-sm text-[#0F172A] outline-none focus:border-[#E57E25]"
  Chip:
    className="h-10 px-4 rounded-full bg-[#DDE3EC] text-sm font-bold text-[#0F172A]"
  Active chip:
    className="h-10 px-4 rounded-full bg-[#1a2238] text-white text-sm font-bold"
  Apply button:
    className="w-full h-14 rounded-full bg-[#1a2238] text-white font-bold"

## Rules
- Solid white drawer bg. Hex colors only. No tokens.
- Every card must keep its icon (Location / TickCircle / image).
- No borders on cards. No shadows on cards.
- Active state: scale 0.98

## Icon Color Palette (use MEANING, not all gray)

| Meaning | Hex | Usage |
|---|---|---|
| Brand Orange | #E57E25 | Location, Camera, Crown, Premium, Stars |
| Navy | #1a2238 | Back arrow, Call, Main actions, Chat bubble in nav |
| Blue | #3B82F6 | Share, Send, Info |
| Green | #10B981 | Chat, Message, Success, WhatsApp (alt) |
| Red | #DC2626 | Report, Warning, Delete, Danger actions |
| Amber | #F59E0B | Notifications bell, Trending, Star |
| Purple | #8B5CF6 | User, Profile, Edit |
| Heart Red | #EF4444 | Favorite (heart), Wishlist badge |
| Neutral | #64748B | Settings, Filters, Neutral meta |

Rule: Do NOT paint every icon #64748B. Pick the color that matches the icon's meaning.

---

## v7 System (2026-09-25) — Post Flow + AI Review

### Screen Header
- Navy solid: `bg-[#1a2238]`
- Back button: circular 40px, `bg-white/15 text-white hover:bg-white/25`
- Title: white, bold, `text-lg`
- Subtitle above: `text-xs font-semibold text-white/70`
- Pattern: shared `PostFlowHeader` component (5 Post screens)

### Section Card
- Header: `bg-[#E57E25]` solid, white text, `text-[14px] font-bold`
- Body: `bg-white px-4 py-4`
- Wrapper: `rounded-2xl overflow-hidden border border-line shadow-sm`
- Pattern: `AiReviewSectionCard` + `PostFlowHeader`

### Chips (specs + location)
- Shape: `rounded-2xl` (not full circle)
- Background: white + `border border-line`
- Icon: Fluent Emoji 3D (`@iconify/react`)
- Location pin (content): `noto:round-pushpin`
- Location pin (UI menus): Iconsax `Location` (unchanged)
- Empty state: dashed border + icon `opacity-50` + red dot if required
- Filled state: colored icon + label + `·` + value

### Motion (CSS keyframes)
- `fade-up`: section mount (300ms, 60ms stagger)
- `halo-pulse`: enabled CTAs (2s infinite)
- `underline-draw`: inline edit (200ms)
- `chip-pop`: chip fill (250ms)

### Colors (hex explicit only)
| Token | Hex | Use |
|---|---|---|
| Brand | #E57E25 | Headers, CTAs, chips |
| Navy | #1a2238 | Screen headers, primary text |
| Success | #10B981 | Validation, confirmation |
| Danger | #EF4444 / #DC2626 | Errors, destructive |
| Border | #E2E8F0 | Dividers, card borders |
| Text | #0F172A | Primary text |
| Muted | #64748B | Secondary text |

### Do NOT use
- Generic `bg-brand` when it renders navy (use explicit `bg-[#E57E25]`)
- Tailwind tokens for hex-critical surfaces (causes Bug #008 ambiguity)
- 3D emoji for UI controls (arrows, X, trash — keep Iconsax)
- Fonts > 16px except Price display (2xl max in Listing Detail)

### Reference implementations
- Post flow: `src/features/post-wizard/screens/*`
- AI Review: `src/features/post-wizard/components/AiReview*`
- Cards: `src/shared/components/ListingCard.tsx`

