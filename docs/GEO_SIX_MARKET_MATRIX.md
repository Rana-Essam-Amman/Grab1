# FOX Geo Platform — Six-Market Architecture & Coverage Matrix

## 1. Architectural Mandate
The FOX Geo Platform is designed from day one to natively support all six launch markets:
**JO (Jordan), SA (Saudi Arabia), PS (Palestine), LB (Lebanon), SY (Syria), KW (Kuwait)**.

Jordan serves exclusively as the pilot vertical slice. Shared resolver logic, data structures, and spatial pipelines must remain market-independent, non-parochial, and free of Jordan-specific assumptions.

---

## 2. Six-Market Administrative Coverage Matrix

| Dimension | JO (Jordan) | SA (Saudi Arabia) | PS (Palestine) | LB (Lebanon) | SY (Syria) | KW (Kuwait) |
|---|---|---|---|---|---|---|
| **Capital City** | Amman (عمّان) | Riyadh (الرياض) | Jerusalem (القدس) | Beirut (بيروت) | Damascus (دمشق) | Kuwait City (مدينة الكويت) |
| **Capital Default Area** | Abdali (العبدلي) | Olaya (العليا) | Al Quds (القدس) | Hamra (الحمرا) | Mezzeh (المزة) | Salmiya (السالمية) |
| **Primary Level (Gov/Region)** | 12 Governorates | 13 Regions | 16 Governorates | 8 Governorates | 14 Governorates | 6 Governorates |
| **Secondary Level (District/Caza)** | 63 Districts | 32 Governorates | 37 Districts | 26 Cazas (قضاء) | 25 Districts (منطقة) | 126 Areas/Districts |
| **Tertiary Level (Village/Town)** | 1,748 Villages | 192 Centers | 205 Villages/Towns | 114 Municipalities | 73 Subdistricts | *None (Sub-areas in flat)* |
| **Refugee Camps Supported** | 0 (Integrated) | 0 (None) | 27 Camps | 5 Camps | 0 (In districts) | 0 (None) |
| **Landmarks Supported** | 0 | 10 Landmarks | 10 Landmarks | 5 Landmarks | 3 Landmarks | 5 Landmarks |
| **Flat Location Dictionary (Cities)** | 13 Cities | 13 Regions | 18 Cities | 14 Cities | 16 Cities | 6 Governorates |
| **GPS Coordinate Anchors** | 13 Anchors | 29 Anchors | 17 Anchors | 13 Anchors | 15 Anchors | 6 Anchors (Added) |
| **Bounding Box [SW, NE]** | [29.18, 34.88] to [33.38, 39.31] | [16.38, 34.50] to [32.16, 55.67] | [31.20, 34.20] to [32.55, 35.58] | [33.05, 35.10] to [34.69, 36.62] | [32.31, 35.62] to [37.32, 42.38] | [28.52, 46.55] to [30.10, 48.43] |

---

## 3. Geographic Data Audit & Data Quality Distinction

### JO (Jordan)
- **Verified Administrative Locations**: 12 Governorates, 63 Districts, 1,748 Villages fully mapped in `src/data/locations/JO.geo.ts`.
- **Known Localities & Neighborhoods**: Curated list in `src/data/locations/JO.ts` (13 cities, all major neighborhoods).
- **Camps & Landmarks**: No dedicated camp entities (camps such as Baqa'a, Wehdat are classified under municipal village/district records); 0 landmarks.
- **Coordinate Centers**: 13 city-center coordinate centroids in `src/data/locations/coords.ts` (approximate centroids, +/-1 km).

### SA (Saudi Arabia)
- **Verified Administrative Locations**: 13 Regions/Emirates, 32 Governorates in `src/data/locations/SA.geo.ts`.
- **Known Localities & Neighborhoods**: 192 Centers/Villages, 13 regional centers in `src/data/locations/SA.ts`.
- **Camps & Landmarks**: 0 refugee camps; 10 verified landmarks (e.g., Kingdom Centre, Al Faisaliah, Masmak Fortress).
- **Coordinate Centers**: 29 city centroids in `src/data/locations/coords.ts`. Region-level alias anchors (Qassim, Asir, Hail, Jazan, Eastern Province) mapped to regional capitals.

### PS (Palestine)
- **Verified Administrative Locations**: 16 Governorates, 37 Districts in `src/data/locations/PS.geo.ts`.
- **Known Localities & Neighborhoods**: 205 Towns and Villages across West Bank & Gaza; 18 cities in `src/data/locations/PS.ts`.
- **Camps & Landmarks**: 27 official UNRWA/Palestinian refugee camps; 10 religious and historical landmarks.
- **Coordinate Centers**: 17 city centroids in `src/data/locations/coords.ts` (approximate centroids).

### LB (Lebanon)
- **Verified Administrative Locations**: 8 Governorates (Mohafazat), 26 Cazas (Districts) in `src/data/locations/LB.geo.ts`.
- **Known Localities & Neighborhoods**: 114 Municipalities/Towns; 14 cities in `src/data/locations/LB.ts`.
- **Camps & Landmarks**: 5 registered Palestinian refugee camps (e.g., Bourj Al-Barajneh, Shatila, Ain al-Hilweh); 5 landmarks (e.g. Pigeon Rocks, Baalbek Temples).
- **Coordinate Centers**: 13 district-center centroids in `src/data/locations/coords.ts`.

### SY (Syria)
- **Verified Administrative Locations**: 14 Governorates, 25 Districts (Mantiqah) in `src/data/locations/SY.geo.ts`.
- **Known Localities & Neighborhoods**: 73 Subdistricts (Nawahi); 16 cities in `src/data/locations/SY.ts`.
- **Camps & Landmarks**: 0 camps in geo file (modeled under districts); 3 landmarks (Umayyad Mosque, Citadel of Aleppo, Palmyra).
- **Coordinate Centers**: 15 city centroids in `src/data/locations/coords.ts`.

### KW (Kuwait)
- **Verified Administrative Locations**: 6 Governorates in `src/data/locations/KW.geo.ts`.
- **Known Localities & Neighborhoods**: 126 Areas/Districts (Mantiqah) mapped under governorates; 6 governorate entries in `src/data/locations/KW.ts`.
- **Camps & Landmarks**: 0 refugee camps; 5 verified national landmarks (Kuwait Towers, Avenues Mall, 360 Mall, Airport, Kuwait University).
- **Coordinate Centers**: 6 governorate centroids added to `src/data/locations/coords.ts`.

---

## 4. Architectural Invariants & Safety
1. **Zero Provider Coupling**: Geocoding inputs from Google, Nominatim, or Apple Maps are normalized through the canonical contract.
2. **Strict Country Isolation**: Coordinates or queries evaluated for market M cannot resolve into entities belonging to market M' != M.
3. **Safe Manual Fallback**: When an external result is ambiguous, out of bounds, or unrecognized, the resolver outputs `needsManualSelection: true` and falls back safely to the market's catalog selection UI.
4. **Independent Market Testability**: Each market has a dedicated acceptance suite validating its hierarchy, bilingual normalization, boundaries, and manual fallback handling.

---

## 5. End-to-End Integration Audit & Data Flow Trace (FIX 4)

### Complete Location Lifecycle Trace
1. **GPS / External Provider Ingestion**:
   - `useGeoLocation` hook in `src/features/post-wizard/hooks/useGeoLocation.ts` queries browser geolocation (`navigator.geolocation.getCurrentPosition`).
   - Reverse-geocodes via `reverseGeocode` in `src/features/post-wizard/helpers/reverseGeocode.ts` (Nominatim / OSM) or Google Places.
2. **Geo Resolver & Country Adapter Normalization**:
   - Provider payload and raw coordinates are passed to `resolveGeoLocation({ targetMarket, coordinates, externalResult })`.
   - The market-specific adapter (`joAdapter`, `saAdapter`, etc.) verifies country polygon containment, matches administrative hierarchy tokens, and extracts validated slugs.
   - Outputs canonical contract: `CanonicalLocation` (`citySlug`, `districtSlug`, `neighborhoodSlug`, display labels, `confidence`, `needsManualSelection`).
3. **Post Wizard & Publishing Draft**:
   - `useLocationPick` in `src/features/post-wizard/hooks/useLocationPick.ts` receives canonical slugs:
     - If `needsManualSelection === true`, the user is prompted to select/confirm city & neighborhood from the hierarchical dropdowns (`LocationFields.tsx`).
     - `updatePostDraft({ city, neighborhood, citySlug, districtSlug, neighborhoodSlug })` persists into `LocalStorageDraftAdapter.ts`.
4. **Listing Payload Construction**:
   - `buildNewListingPayload.ts` in `src/features/post-wizard/helpers/` packages the draft into the API payload:
     `{ country_code, city, neighborhood, city_slug, district_slug, neighborhood_slug, ... }`.
5. **Supabase Database Persistence**:
   - `listingsService.ts` executes `supabase.from('listings').insert(...)` / `.update(...)`.
   - **DATABASE SCHEMA TRACE & AUDIT**:
     - Columns present in PostgreSQL `public.listings` (via migration `20261204_location_slugs.sql`):
       - `country_code` (text, not null)
       - `city` (text, not null)
       - `neighborhood` (text, nullable)
       - `city_slug` (text, nullable)
       - `district_slug` (text, nullable)
       - `neighborhood_slug` (text, nullable)
     - **CRITICAL AUDIT FINDING — LATITUDE & LONGITUDE**:
       - The PostgreSQL `public.listings` schema **DOES NOT** have `latitude` or `longitude` columns.
       - Latitude/longitude coordinates are used strictly at client-side runtime for nearest-city resolution and provider reverse geocoding.
       - **Coordinates are NOT persisted to the database and are NOT exposed in public listing payloads**, protecting seller privacy. No database migrations were added or applied.
6. **Listing Mapper & Domain Layer**:
   - `src/features/listings/services/listingsMapper.ts` maps database rows to frontend `Listing` objects:
     - `citySlug: row.city_slug ?? undefined`
     - `districtSlug: row.district_slug ?? undefined`
     - `neighborhoodSlug: row.neighborhood_slug ?? undefined`
7. **Search Helpers & RPC Layer**:
   - `searchListingsV4` and `searchListingsHybrid` invoke RPC functions `search_listings_v4_tiered` and `search_listings_v4_exact` passing `p_city_slug`, `p_district_slug`, and `p_neighborhood_slug`.
   - PostgreSQL function `listing_matches_slugs` evaluates slug equality before pagination.
8. **Explore Filters**:
   - `useLocationHierarchyFilter.ts` loads market governorates and districts from the geo registry, binding active filter state to URL search params (`citySlug`, `districtSlug`, `neighborhoodSlug`) and synchronizing with store state via `hydrateStoreFromUrl.ts`.

---

## 6. Authoritative Data Provenance & Confidence Levels (FIX 5)

| Market | Authoritative Agency / Source Reference | Exact Dataset / Source URL | Coordinate Reference System | Confidence Level & Scope |
|---|---|---|---|---|
| **JO** | Department of Statistics (DOS) & Ministry of Interior | https://dosweb.dos.gov.jo/ (Administrative Gazette & Population Census) | EPSG:4326 (WGS84) | **High**: 12 Govs, 63 Districts, 1,748 Villages verified against official census gazette. Centroids are municipal center approximations (+-1 km). |
| **SA** | General Authority for Statistics (GASTAT) | https://www.stats.gov.sa/ (National Administrative Boundaries Classification) | EPSG:4326 (WGS84) | **Medium-High**: 13 Regions, 32 Primary Governorates verified against GASTAT administrative guide. Rural centers/markaz are generalized. |
| **PS** | Palestinian Central Bureau of Statistics (PCBS) & UNRWA | https://www.pcbs.gov.ps/ & https://www.unrwa.org/where-we-work/gaza-strip | EPSG:4326 (WGS84) | **High**: 16 Governorates, 37 Districts, 27 official UNRWA Refugee Camps verified. West Bank & Gaza represented via separate MultiPolygon components. |
| **LB** | Central Administration of Statistics (CAS) & UNRWA | http://www.cas.gov.lb/ & https://www.unrwa.org/where-we-work/lebanon | EPSG:4326 (WGS84) | **Medium-High**: 8 Mohafazat, 26 Cazas (Districts), 5 UNRWA registered camps verified against CAS spatial guidelines. |
| **SY** | Central Bureau of Statistics (CBS) | http://cbssyr.sy/ (Administrative Divisions of Syrian Arab Republic) | EPSG:4326 (WGS84) | **Medium**: 14 Governorates, 25 Major Districts verified. Subdistricts partially surveyed due to regional reporting disparities. |
| **KW** | Public Authority for Civil Information (PACI) | https://www.paci.gov.kw/ (Kuwait Finder GIS / Administrative Directory) | EPSG:4326 (WGS84) | **High**: 6 Governorates, 126 Areas (Mantiqah) verified against PACI Kuwait Finder spatial directory. Centroids approximate area centers. |

### Spatial Geometry Limitations & Disputed Areas
1. **Palestine (West Bank & Gaza)**: Modeled as a two-component MultiPolygon. Green Line and maritime borders are generalized approximations for app navigation; no sovereignty or legal boundaries are asserted.
2. **Anti-Lebanon Mountain Range (Lebanon / Syria)**: Bounded using a generalized ridgeline meridian. Border coordinates within +/-2 km of the border will trigger safe manual selection (`needsManualSelection: true`) to avoid misclassification.
3. **Dead Sea & Jordan Valley (Jordan / Palestine)**: Bounded at the water center-line (~35.53°E - 35.55°E). Ambiguous GPS readings along the valley trigger manual market confirmation.
