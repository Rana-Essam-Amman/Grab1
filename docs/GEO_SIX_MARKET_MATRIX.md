# FOX Geo Platform — Six-Market Matrix & Data Provenance

Authoritative geographic documentation, provenance audit, and boundary quality disclosure across all six FOX markets (`JO`, `SA`, `PS`, `LB`, `SY`, `KW`).

---

## 1. Six-Market Geographic Coverage & Topology Matrix

| Market | ISO | Administrative Divisions (Gov / Dist) | Point Anchor Coords (`coords.ts`) | MultiPolygon Components | Exterior Rings | Actual Production Holes | Synthetic Hole Test Coverage | Boundary Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Jordan** | `JO` | 12 Governorates / 52 Districts | 12 Gov Centers | 1 | 1 (11 vertices) | 0 (`holes: []`) | Verified via Engine Test Suite | **APPROXIMATE / NOT CADASTRAL** |
| **Saudi Arabia** | `SA` | 13 Regions / 136 Governorates | 13 Region Centers | 1 | 1 (11 vertices) | 0 (`holes: []`) | Verified via Engine Test Suite | **APPROXIMATE / NOT CADASTRAL** |
| **Palestine** | `PS` | 16 Governorates (West Bank + Gaza) | 16 Gov Centers | 2 (Gaza + West Bank) | 2 (4 + 9 vertices) | 0 (`holes: []`) | Verified via Engine Test Suite | **APPROXIMATE / NOT CADASTRAL** |
| **Lebanon** | `LB` | 8 Governorates / 25 Districts | 8 Gov Centers | 1 | 1 (12 vertices) | 0 (`holes: []`) | Verified via Engine Test Suite | **APPROXIMATE / NOT CADASTRAL** |
| **Syria** | `SY` | 14 Governorates / 65 Districts | 14 Gov Centers | 1 | 1 (13 vertices) | 0 (`holes: []`) | Verified via Engine Test Suite | **APPROXIMATE / NOT CADASTRAL** |
| **Kuwait** | `KW` | 6 Governorates / Flat Localities | 6 Gov Centers | 1 | 1 (6 vertices) | 0 (`holes: []`) | Verified via Engine Test Suite | **APPROXIMATE / NOT CADASTRAL** |

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
   - Status: **Approximate Generalized Outer Bounding Envelopes (NOT Cadastral or Survey-Grade Lines)**.
   - Boundaries are designed for coarse client-side market confinement and cross-border rejection, not legal territory delineation.

4. **GPS Resolution Coverage**:
   - Geodesic point-in-polygon resolution combined with 2,000 m boundary uncertainty band.
   - Coords within 2,000 m of any boundary edge are classified as `ambiguous` and strictly require manual user confirmation (`needsManualSelection: true`).

---

## 3. Data Provenance & Boundary Quality Disclosures

### A. Jordan (`JO`)
- **Publishing Authority**: Jordan Department of Statistics (DOS).
- **Exact Dataset Title**: Administrative Division Code Directory.
- **Direct Dataset Download URL**: **NOT VERIFIED** (Homepage: `http://dosweb.dos.gov.jo`).
- **Dataset Version / Publication Date**: **NOT VERIFIED**.
- **Retrieval Date**: **NOT VERIFIED**.
- **License / Usage Terms**: **NOT VERIFIED**.
- **Coordinate Reference System**: WGS 84 (EPSG:4326).
- **Geometry Transformation / Generalization**: Manually generalized 11-vertex outer polygon enclosing sovereign territory.
- **Actual Production Holes**: 0 (`holes: []`). No sovereign enclave holes exist in national territory.
- **Known Limitations & Confidence Level**: Approximate bounding polygon for client-side pre-filtering; high-density Amman neighborhoods resolved via text taxonomy.

### B. Saudi Arabia (`SA`)
- **Publishing Authority**: General Authority for Statistics (GASTAT).
- **Exact Dataset Title**: Statistical Guide for Localities and Administrative Regions.
- **Direct Dataset Download URL**: **NOT VERIFIED** (Homepage: `https://www.stats.gov.sa`).
- **Dataset Version / Publication Date**: **NOT VERIFIED**.
- **Retrieval Date**: **NOT VERIFIED**.
- **License / Usage Terms**: **NOT VERIFIED**.
- **Coordinate Reference System**: WGS 84 (EPSG:4326).
- **Geometry Transformation / Generalization**: Manually generalized 11-vertex outer polygon.
- **Actual Production Holes**: 0 (`holes: []`). No interior national enclave holes.
- **Known Limitations & Confidence Level**: Approximate outer boundary; interior desert boundaries are coarse bounding segments.

### C. Palestine (`PS`)
- **Publishing Authority**: Palestinian Central Bureau of Statistics (PCBS).
- **Exact Dataset Title**: PCBS Administrative Divisions Directory.
- **Direct Dataset Download URL**: **NOT VERIFIED** (Homepage: `https://www.pcbs.gov.ps`).
- **Dataset Version / Publication Date**: **NOT VERIFIED**.
- **Retrieval Date**: **NOT VERIFIED**.
- **License / Usage Terms**: **NOT VERIFIED**.
- **Coordinate Reference System**: WGS 84 (EPSG:4326).
- **Geometry Transformation / Generalization**: 2 distinct components (Gaza Strip 4 vertices, West Bank 9 vertices) evaluated independently as a MultiPolygon.
- **Actual Production Holes**: 0 (`holes: []`). No interior holes modeled.
- **Known Limitations & Confidence Level**: Generalized bounding components; no internal checkpoints or area categorizations (A/B/C) are modeled.

### D. Lebanon (`LB`)
- **Publishing Authority**: Central Administration of Statistics (CAS Lebanon).
- **Exact Dataset Title**: CAS Mohafazat & Cazas Classification.
- **Direct Dataset Download URL**: **NOT VERIFIED** (Homepage: `http://www.cas.gov.lb`).
- **Dataset Version / Publication Date**: **NOT VERIFIED**.
- **Retrieval Date**: **NOT VERIFIED**.
- **License / Usage Terms**: **NOT VERIFIED**.
- **Coordinate Reference System**: WGS 84 (EPSG:4326).
- **Geometry Transformation / Generalization**: Manually generalized 12-vertex polygon.
- **Actual Production Holes**: 0 (`holes: []`). No interior enclave holes exist.
- **Known Limitations & Confidence Level**: Mountain border segments with Syria in Anti-Lebanon range are generalized approximations.

### E. Syria (`SY`)
- **Publishing Authority**: Central Bureau of Statistics (CBS Syria).
- **Exact Dataset Title**: CBS Administrative Divisions Registry.
- **Direct Dataset Download URL**: **NOT VERIFIED** (Homepage: `http://cbssyr.sy`).
- **Dataset Version / Publication Date**: **NOT VERIFIED**.
- **Retrieval Date**: **NOT VERIFIED**.
- **License / Usage Terms**: **NOT VERIFIED**.
- **Coordinate Reference System**: WGS 84 (EPSG:4326).
- **Geometry Transformation / Generalization**: Manually generalized 13-vertex polygon.
- **Actual Production Holes**: 0 (`holes: []`). No interior enclave holes exist.
- **Known Limitations & Confidence Level**: Remote eastern desert boundaries are generalized approximations.

### F. Kuwait (`KW`)
- **Publishing Authority**: Central Statistical Bureau (CSB Kuwait) / PACI.
- **Exact Dataset Title**: CSB Administrative Areas Classification.
- **Direct Dataset Download URL**: **NOT VERIFIED** (Homepage: `https://www.csb.gov.kw`).
- **Dataset Version / Publication Date**: **NOT VERIFIED**.
- **Retrieval Date**: **NOT VERIFIED**.
- **License / Usage Terms**: **NOT VERIFIED**.
- **Coordinate Reference System**: WGS 84 (EPSG:4326).
- **Geometry Transformation / Generalization**: Manually generalized 6-vertex terrestrial polygon.
- **Actual Production Holes**: 0 (`holes: []`). No interior enclave holes exist.
- **Known Limitations & Confidence Level**: Islands (Failaka, Boubyan, Warbah) are generalized within outer coastal limits.

---

## 4. Privacy & Database Persistence Invariants

- **Seller Privacy**: `public.listings` in PostgreSQL strictly stores canonical location slugs (`city_slug`, `district_slug`, `neighborhood_slug`).
- **No Device GPS Persistence**: Device latitude and longitude coordinates are NEVER persisted to database columns or listing payloads.
- **Fallback Rule**: Default capital fallbacks always set `needsManualSelection: true` and are never persisted as verified user GPS fixes.
- **2,000m Uncertainty Buffer**: Geodesic boundary distance $\le 2,000$ m always returns `status: 'ambiguous'`, triggering mandatory manual selection.
