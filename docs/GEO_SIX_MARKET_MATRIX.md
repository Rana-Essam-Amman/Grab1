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
| **GPS Coordinate Anchors** | 13 Anchors | 24 Anchors | 17 Anchors | 13 Anchors | 15 Anchors | 6 Anchors (Added) |
| **Bounding Box [SW, NE]** | [29.18, 34.88] to [33.38, 39.31] | [16.38, 34.50] to [32.16, 55.67] | [31.20, 34.20] to [32.55, 35.58] | [33.05, 35.10] to [34.69, 36.62] | [32.31, 35.62] to [37.32, 42.38] | [28.52, 46.55] to [30.10, 48.43] |

---

## 3. Geographic Data Audit & Data Quality Distinction

### JO (Jordan)
- **Verified Administrative Locations**: 12 Governorates, 63 Districts, 1,748 Villages fully mapped in `src/data/locations/JO.geo.ts`.
- **Known Localities & Neighborhoods**: Curated list in `src/data/locations/JO.ts` (13 cities, all major neighborhoods).
- **Camps & Landmarks**: No dedicated camp entities (camps such as Baqa'a, Wehdat are classified under municipal village/district records); 0 landmarks.
- **Coordinate Centers**: 13 city-center coordinate centroids in `src/data/locations/coords.ts`.

### SA (Saudi Arabia)
- **Verified Administrative Locations**: 13 Regions/Emirates, 32 Governorates in `src/data/locations/SA.geo.ts`.
- **Known Localities & Neighborhoods**: 192 Centers/Villages, 13 regional centers in `src/data/locations/SA.ts`.
- **Camps & Landmarks**: 0 refugee camps; 10 verified landmarks (e.g., Kingdom Centre, Al Faisaliah, Masmak Fortress).
- **Coordinate Centers**: 24 city centroids in `src/data/locations/coords.ts`. Region-level alias anchors (Qassim, Asir, Hail, Jazan, Eastern Province) mapped to regional capitals.

### PS (Palestine)
- **Verified Administrative Locations**: 16 Governorates, 37 Districts in `src/data/locations/PS.geo.ts`.
- **Known Localities & Neighborhoods**: 205 Towns and Villages across West Bank & Gaza; 18 cities in `src/data/locations/PS.ts`.
- **Camps & Landmarks**: 27 official UNRWA/Palestinian refugee camps; 10 religious and historical landmarks.
- **Coordinate Centers**: 17 city centroids in `src/data/locations/coords.ts`.

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
