# FOX Geo Platform — Six-Market Matrix & Data Provenance

Authoritative geographic documentation and architecture audit across all six FOX markets (`JO`, `SA`, `PS`, `LB`, `SY`, `KW`).

---

## 1. Six-Market Geographic Coverage Matrix

| Market | ISO | Administrative Divisions (Gov / Dist) | Point Anchor Coords (`coords.ts`) | Boundary Geometry Type | Boundary Uncertainty Policy | Statistical Agency / Provenance |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Jordan** | `JO` | 12 Governorates / 52 Districts | 12 Gov Centers | GeoPolygon (WGS84) | 2,000m Geodesic Buffer | Jordan Department of Statistics (DOS) |
| **Saudi Arabia** | `SA` | 13 Regions / 136 Governorates | 13 Region Centers | GeoPolygon (WGS84) | 2,000m Geodesic Buffer | General Authority for Statistics (GASTAT) |
| **Palestine** | `PS` | 16 Governorates (West Bank + Gaza) | 16 Gov Centers | GeoMultiPolygon (2 Components) | 2,000m Geodesic Buffer | Palestinian Central Bureau of Statistics (PCBS) |
| **Lebanon** | `LB` | 8 Governorates / 25 Districts | 8 Gov Centers | GeoPolygon (WGS84) | 2,000m Geodesic Buffer | Central Administration of Statistics (CAS) |
| **Syria** | `SY` | 14 Governorates / 65 Districts | 14 Gov Centers | GeoPolygon (WGS84) | 2,000m Geodesic Buffer | Central Bureau of Statistics (CBS Syria) |
| **Kuwait** | `KW` | 6 Governorates / Flat Localities | 6 Gov Centers | GeoPolygon (WGS84) | 2,000m Geodesic Buffer | Central Statistical Bureau (CSB Kuwait) |

---

## 2. Separation of Geographic Dimensions

To ensure data integrity, the FOX Geo Platform strictly distinguishes between four independent dimensions:

1. **Administrative Location Coverage**:
   - Source data stored in `src/data/locations/<COUNTRY>.geo.ts` and `<COUNTRY>.ts`.
   - Represents official administrative hierarchies (Governorates, Districts, Neighborhoods).
   - Slugs are canonical and permanent.

2. **Point / Anchor Coordinate Coverage**:
   - Defined in `src/data/locations/coords.ts`.
   - Represents geographic centroids for governorates and major cities.
   - Used for distance-based nearest-city heuristics when text matching is absent.

3. **Country Boundary Geometry Coverage**:
   - Defined in `src/shared/lib/geo/marketPolygons.ts` as `GeoMultiPolygon` with WGS84 geodesic coordinates.
   - Status: **Generalized Boundaries (NOT Official Survey Cadastral Lines)**.
   - Boundaries are designed for coarse client-side market confinement and cross-border rejection, not legal territory delineation.

4. **GPS Resolution Coverage**:
   - Geodesic point-in-polygon resolution combined with 2,000 m boundary uncertainty band.
   - Coords within 2,000 m of any boundary edge are classified as `ambiguous` and strictly require manual user confirmation (`needsManualSelection: true`).

---

## 3. Data Provenance & Boundary Status by Market

### Jordan (`JO`)
- **Source Organization**: Department of Statistics (DOS) / Royal Jordanian Geographic Centre (RJGC).
- **Dataset**: Administrative Boundaries of Jordan (Governorates & Liwas).
- **Hierarchy**: 12 Governorates -> Districts (Alwiyah) -> Neighborhoods / Sub-districts.
- **Boundary Status**: Generalized polygon enclosing sovereign territory.
- **Known Gaps**: High-density urban neighborhood boundaries in Greater Amman are resolved via text/slug taxonomy, not polygonal boundary tiles.

### Saudi Arabia (`SA`)
- **Source Organization**: General Authority for Statistics (GASTAT) & National Geospatial-Information Authority.
- **Dataset**: Administrative Regions of the Kingdom of Saudi Arabia.
- **Hierarchy**: 13 Administrative Regions (Mantaqah) -> Governorates (Muhafazat) -> Centers / Localities.
- **Boundary Status**: Generalized outer envelope polygon.
- **Known Gaps**: Empty Quarter interior desert boundaries are approximate bounding segments.

### Palestine (`PS`)
- **Source Organization**: Palestinian Central Bureau of Statistics (PCBS) / Ministry of Local Government (MoLG).
- **Dataset**: PCBS Administrative Divisions (West Bank & Gaza Strip).
- **Hierarchy**: 16 Governorates (11 West Bank, 5 Gaza Strip) -> Municipalities / Village Councils / Refugee Camps.
- **Boundary Status**: MultiPolygon with two distinct geographic components (Gaza Component + West Bank Component).
- **Known Gaps**: Boundary geometry is generalized; no internal checkpoints or area categorizations (A/B/C) are modeled.

### Lebanon (`LB`)
- **Source Organization**: Central Administration of Statistics (CAS Lebanon).
- **Dataset**: Lebanese Administrative Subdivisions (Mohafazat & Cazas).
- **Hierarchy**: 8 Governorates (Mohafazat) -> Districts (Cazas) -> Municipalities.
- **Boundary Status**: Generalized coastal and mountain boundary polygon.
- **Known Gaps**: Mountain border segments with Syria in the Anti-Lebanon range are generalized.

### Syria (`SY`)
- **Source Organization**: Central Bureau of Statistics (CBS Syria).
- **Dataset**: Syrian Administrative Divisions (Muhafazat & Manatiq).
- **Hierarchy**: 14 Governorates (Muhafazat) -> Districts (Manatiq) -> Sub-districts (Nawahi).
- **Boundary Status**: Generalized national boundary polygon.
- **Known Gaps**: Remote northeastern desert boundaries are generalized approximations.

### Kuwait (`KW`)
- **Source Organization**: Central Statistical Bureau (CSB Kuwait) / PACI (Public Authority for Civil Information).
- **Dataset**: Kuwait Governorate Administrative Boundaries.
- **Hierarchy**: 6 Governorates -> Areas / Blocks (flat locality taxonomy).
- **Boundary Status**: Generalized terrestrial boundary polygon.
- **Known Gaps**: Off-shore islands (Failaka, Boubyan, Warbah) are generalized within outer coastal limits.

---

## 4. Privacy & Database Persistence Invariants

- **Seller Privacy**: `public.listings` in PostgreSQL strictly stores canonical location slugs (`city_slug`, `district_slug`, `neighborhood_slug`).
- **No Device GPS Persistence**: Device latitude and longitude coordinates are NEVER persisted to database columns or listing payloads.
- **Fallback Rule**: Default capital fallbacks always set `needsManualSelection: true` and are never persisted as verified user GPS fixes.
