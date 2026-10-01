## Phase UX-Crush — Intent Detection

### Unified Navy Headers (2026-09-22)
- 8 screens unified: auth gateway, settings, notifications, edit-profile, wishlist, subcategories, thread, search-results
- Categories + Messages kept as tab-screens
- Login screen untouched (welcome, no top bar)

### Specs Instead of Views/Date (2026-09-22)
- New: pickSpecs helper — top N attribute values
- ListingMainInfo: location + 3 specs (was views + date)
- ListingCard / ListingCardHorizontal: 2 spec chips (was Eye+views)

### AI Review Refinements (2026-09-20)
- Price regex matches multi-digit "15 ألف"
- Fields wrapped in surface-raised boxes with pencil affordance
- Location city/area are clickable pickers (CountrySheet + Location drawer)
- Photo empty state clearer with dashed border

### Audit A — Critical Bug Fixes (2026-09-20)
- Bug: "كامري للبيع" — silent no-op → Search always runs, Suggestion added on top
- Bug: query cleared without result → clears only after action
- Bug: quota consumed on Search → only consumed on suggestion accept
- useAiAssistant.ts: unified handleSend (SEARCH + PUBLISH share search path)
- useAiSuggestion.ts: removed threshold gate (intent gate handles it)
- AiAssistantBox.tsx: deductCredit moved to onSuggestionAccept
- Tests: removed obsolete threshold test; 374 tests passing

### B4g-2d — Remove Debug Card + Query Cleanup (2026-09-20)
- Deleted: AiResponseCard.tsx (debug component, dead code — Rule 17)
- useAiAssistant.ts: 93 → 88 lines; aiResponse/clearResponse removed
- Query clears after send (both SEARCH and PUBLISH branches)
- AiAssistantContent.tsx: 104 → 97
- AiAssistantBox.tsx: 86 → 85
- TSC clean, 375 tests passing

### Audit B1 — Filter Consolidation + Hook Size Fixes (2026-09-20)
- Single source of truth: ui.slice store owns all filters
- Added: minPriceFilter + setMinPriceFilter to store
- useAiAssistant.ts: 103 → 88 lines (extracted applySearchResult helper)
- useExploreListings.ts: 113 → 99 lines; types extracted to .types.ts
- E2E: removed obsolete AiResponseCard selector check
- 374 tests, 0 violations, CI green

### Audit B2 — Search Chip + Smart Empty State (2026-09-20)
- New search chip in ExploreFilterChipsBar (visible when activeSearchText)
- ExploreEmptyFeedState: context-aware (search vs filters vs neutral)
- Search context offers "Post it" CTA → prefills Post Wizard noteText
- Files: FilterChipsBar, FilterBar, EmptyFeedState, ListingFeed, ExploreScreen

### Audit B3 — Greeting & Invalid Input Handling (2026-09-20)
- classifyUserIntent: added IGNORE for empty/short/greeting inputs
- useAiAssistant: sets auto-clearing hint (3s) on IGNORE
- AiAssistantContent: renders hint above input
- 6 new IGNORE test cases
- Files: intentClassifier, useAiAssistant, AiAssistantContent, AiAssistantBox

### Inline AI Box (2026-09-20)
- Deleted: AiAssistantOverlay.tsx
- Removed full-screen backdrop; AI Box stays inline on Home
- Header + BottomNav remain visible on AI focus

### AI Publish — Single Page Review (2026-09-20)
- useAiPublishFlow: no placeholder image; city fallback = browseCityAr
- listingCopyAgent.extractFacts: year separated from price; km requires كم/km/كيلو
- AiReviewScreen: single-page review (photos + title + price + city + neighborhood + description + publish)
- New: AiReviewBody.tsx
- Deleted: ReviewFormFields.tsx, ReviewPublishButton.tsx
- Emoji cleanup: 7 production files → iconsax icons

### AI Review — Layer 1 (2026-09-20)
- SYSTEM_PROMPT rebuilt: category-aware structure (motors / real-estate / generic)
- buildHumanTitle + buildHumanBody: concise, no filler
- Deleted unused prettyNumber helper
- Files: aiGatewayClient.ts, listingCopyAgent.ts

### Shell Fixes (2026-09-21)
- CountrySheet: added trigger buttons in HeaderDropdownMenu (country + city)
- BottomNav: Post Ad text moved inside clickable button
- Header: ☰ → HambergerMenu icon, logo 42→32px, px-4.5→px-4
- CountrySheet: ✕ → CloseCircle icon

### Search in Home (2026-09-21)
- Removed AiAssistantBox from ExploreScreen
- New SearchBar component (src/shared/components/SearchBar.tsx)
- Search submit → setSearchQuery + navigateTo('search-results')
- SearchResultsScreen: basic wiring (back button, searchQuery filter)

### Post Ad Entry (2026-09-21)
- New screen: PostAdEntryScreen (AI vs Traditional)
- Routes: post-ad-entry, post-ai-capture (placeholder)
- All "نشر إعلان" buttons now navigate to post-ad-entry

### AI Capture Screen (2026-09-21)
- New: useAiCapture hook (photos + text + voice → generate)
- New: AiCaptureScreen (photos required, text optional)
- Route post-ai-capture now functional (was placeholder)
- Flow: photos + text → "أنشئ" → processPublishFlow → post-ai-review

### Search UX Fixes (2026-09-21)
- SearchResultsScreen: back button resets query + filters, returns to clean Home
- SearchBar: onFocus prevents browser auto-scroll (Home stays visible)
- SearchBar: sticky at top of ExploreScreen

### Search Focus Mode (2026-09-21)
- Added isSearchFocused to ui.slice
- BottomNav hides when search input focused
- ExploreTopSections hides when focused (Header + SearchBar + Chips + Feed remain)
- Fixes keyboard layout squeeze on mobile

### Chips Reorder (2026-09-21)
- Home: chips moved directly under SearchBar (sticky)
- SearchResults: SearchBar + chips at top (sticky)

### AI Format — 5 Detailed Examples (2026-09-21)
- SYSTEM_PROMPT rebuilt with 5 few-shot examples (cars/real-estate/mobiles/furniture/electronics)
- AI now returns fields[] array (dynamic per category)
- GeneratedListing type extended with fields

### AI Review Body Rebuild (2026-09-21)
- AiReviewBody: dynamic fields from AI (attributes array)
- Map iframe embedded below location rows
- useAiReview: attributes + setAttributeValue
- Fields editable inline; empty ones shown as "أضف..."

### Rule 14 + Rule 5 Fixes (2026-09-21)
- SearchResultsScreen: 163 → ≤150 (extracted SearchResultsEmpty)
- AiReviewScreen: removed `as any` cast
### AI Fallback Fixes (2026-09-21)
- extractFacts: km extracted BEFORE price (fixes "150 الف" misread as price)
- generateListing fallback now includes fields[] (attributes no longer empty)
- buildHumanTitle: year + km in title for motors
- AiReviewHeader: removed fake "Step 6 of 6"
- AiCapture: "وصف السلعة" now clearly required

### E2E Tests Update (2026-09-21)
- ai-search.spec.ts: rewrote for SearchBar → SearchResults flow
- post-ad.spec.ts: added PostAdEntry step before traditional wizard

### E2E Data-Testid (2026-09-21)
- PostAdEntryScreen: added data-testid to AI/traditional cards
- BottomNavItems: added data-testid to Post Ad FAB
- post-ad.spec.ts: selector uses data-testid instead of text filter

### Drawer Rebuild (2026-09-21)
- Drawer: solid white bg, sits above bottom nav (bottom-[80px])
- CountrySheet + ExploreLocationFilterDrawer: dark X button + pill grid
- Cities as 2-column rounded-full pills with location icon + arrow

### Neighborhood Drawer + Map Fix (2026-09-21)
- ExploreLocationFilterDrawer: initialCityForNeighs prop → opens on neighborhoods directly
- AiReviewScreen: passes current city to drawer
- AiReviewBody: iframe key={mapQuery} → map reloads on location change

### Neighborhoods Fix (2026-09-21)
- AiReviewScreen: passes locationsAr when isArabic (was always EN)
- Neighborhoods now appear for all 5 markets in correct language

### Required Fields — All Categories (2026-09-21)
- buildFieldsFromFacts: covers all 17 categories with required/optional flags
- SYSTEM_PROMPT: REQUIRED FIELDS PER CATEGORY block
- useAiReview: missingRequiredLabels blocks publish
- AiReviewBody: red border on empty required + list above publish
- AI path only — Traditional wizard untouched

### Gemini Direct API (2026-09-22)
- aiGatewayClient: calls Gemini 2.5 Flash directly via VITE_GEMINI_API_KEY
- 15s timeout; on failure → falls back to writeListingCopy (unchanged)
- .env.local added to .gitignore

### AI Review Polish (2026-09-22)
- AiReviewHeader: AI badge + subtitle
- AiReviewBody: section titles + brand-tinted price + gradient publish
- Preserved all overflow fixes (min-w-0)

### Traditional Post Flow (2026-09-22)
- Added `src/data/categoryFields.ts`: Complete schema for all 17 categories with options and required flags (e.g. required colors where appropriate). Options end with "أخرى" (Other) selection capability.
- Added `src/features/post-wizard/screens/PostDetailsScreen.tsx`: Complete step 5 of 6 screen for the traditional post flow with Title, Price, Description, and dynamic category-specific fields including custom selection fallback inputs.
- Registered `'post-details'` in `src/store/ui.slice.types.ts` ScreenType.
- Integrated `'post-details'` route inside `src/features/post-wizard/feature.config.ts`.
- Wired lazy-loaded `PostDetailsScreen` within `src/App.tsx`.
- Updated `useLocationPick.ts` and `LocationPickScreen.tsx` to transition seamlessly to the details step rather than AI draft.
- Full TypeScript type-safety verified and production compilation succeeded.

### PostDetails Rebuild — Rule 14 Compliance (2026-09-22)
- Rebuilt PostDetailsScreen.tsx from scratch: simplified layout, top-to-bottom flow, no sticky/absolute interactive elements.
- Extracted business logic to usePostDetails.ts hook (Rule 14-B compliance).
- Standardized UI using shared/ui primitives (Button, Input, Textarea, Card) and semantic design tokens (Rule 2 & 3).
- Deleted rogue test file tmp/walk.spec.ts causing build failure.
- Verified with audit:arch (0 violations) and full vitest suite (379 passed).

### Unified Drawer Design (2026-09-22)
- New: docs/DESIGN_SYSTEM.md — hex reference with 3 patterns
- 4 home drawers rebuilt: Category (A), Price (C), Location (B), Country (B)
- Icons preserved: CloseCircle, TickCircle, Location, category images
- Drawer base: solid white, navy X, orange accent
- Files modified: Drawer.tsx, CountrySheet.tsx, CountrySheetCities.tsx, ExploreCategoryFilterDrawer.tsx, ExplorePriceFilterDrawer.tsx, ExploreLocationFilterDrawer.tsx, ExploreLocationCityView.tsx, ExploreLocationCityList.tsx, ExploreLocationNeighbourhoodView.tsx, CountrySelectorTabs.tsx, ExplorePriceQuickPresets.tsx
- TSC clean, 379 tests passed, 0 architecture violations.

### Critical Rule — Logic Before Code (2026-09-22)
- Rule added: NO logic before analyzing competitors
- Reason: Search scope bug proved we need this discipline
- Enforced in every logic prompt going forward

### Rule 42 — Zero-Cost Auth First (2026-09-22)
- Rule added after Auth flow study (Google/Apple/Email/WhatsApp).
- Decision: WhatsApp OTP > SMS OTP (60x cheaper).
- Phone requested at action (publish/chat), not at signup.
- Quick Demo hidden in production.
- Target: $0 auth cost for 90%+ of users.

## Phase UX-Crush — Auth + Carousel + CI Recovery (2026-09-23)

Featured Deals Carousel (2026-09-23)
- New: FeaturedDealsCarousel.tsx — full-width single-card swipe
- Dots indicator (active: #E57E25, inactive: #E2E8F0)
- Replaces FeaturedDealCard in ExploreTopSections
- Commit 1e89781 (initial) + f31bec7 (dot color fix)

Auth Multi-Provider Scaffold (2026-09-23)
- domain/entities/AuthProvider.ts — provider types
- domain/rules/authProviders.ts — 6 providers (google/apple/email/whatsapp/sms/guest)
- hooks/useAuthProviders.ts — platform detection (web/ios/android)
- Commit 2041585

Login Gateway Provider Buttons (2026-09-23)
- New: ProviderLogos.tsx — official SVG logos (Google 4-color, Apple, WhatsApp)
- New: AuthProviderButton.tsx — branded pill button
- LoginGateway: providers row + "or" divider + production gate
- Commit be2c725

CI Recovery + Rule 43 (2026-09-23)
- Fix arch violation: useExploreListings 103→74 lines (extract helpers)
- Fix E2E: gate Quick Demo via VITE_ALLOW_QUICK_DEMO env var
- Add Rule 43: Post-Commit Stop Discipline (idx retry loops)
- Backfill ERROR_LOG bugs #005–#008
- Commits 12c30f6, c454b29, 6d7c7b7, f315b93

### AI Prompt Refinement & Remote Token Sync (2026-10-01)
- Refined AI prompt examples and field extraction rules in `src/ai/aiGatewayClient.ts`
- Configured and validated remote repository access with the updated fine-grained PAT
- Verified build and executed architecture audit and core unit tests cleanly






