# FOX Geo Platform — Six-Market Matrix & Data Provenance

Authoritative geographic documentation, provenance audit, and boundary quality disclosure across all six FOX markets (`JO`, `SA`, `PS`, `LB`, `SY`, `KW`).

---

## 1. Six-Market Geographic Coverage & Topology Matrix

| Market | ISO | Administrative Divisions (Gov / Dist) | Point Anchor Coords (`coords.ts`) | MultiPolygon Components | Exterior Rings | Exterior Vertex Count | Modeled Interior Holes | Synthetic Hole Test Coverage | Boundary Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Jordan** | `JO` | 12 Governorates / 52 Districts | 12 Gov Centers | 1 | 1 | 11 vertices | Zero interior holes modeled (`holes: []`) | Verified via Engine Test Suite | **APPROXIMATE / NOT CADASTRAL** |
| **Saudi Arabia** | `SA` | 13 Regions / 136 Governorates | 13 Region Centers | 1 | 1 | 11 vertices | Zero interior holes modeled (`holes: []`) | Verified via Engine Test Suite | **APPROXIMATE / NOT CADASTRAL** |
| **Palestine** | `PS` | 16 Governorates (West Bank + Gaza) | 16 Gov Centers | 2 (Gaza + West Bank) | 2 | 4 (Gaza) + 9 (WB) | Zero interior holes modeled (`holes: []`) | Verified via Engine Test Suite | **APPROXIMATE / NOT CADASTRAL** |
| **Lebanon** | `LB` | 8 Governorates / 25 Districts | 8 Gov Centers | 1 | 1 | 12 vertices | Zero interior holes modeled (`holes: []`) | Verified via Engine Test Suite | **APPROXIMATE / NOT CADASTRAL** |
| **Syria** | `SY` | 14 Governorates / 65 Districts | 14 Gov Centers | 1 | 1 | 13 vertices | Zero interior holes modeled (`holes: []`) | Verified via Engine Test Suite | **APPROXIMATE / NOT CADASTRAL** |
| **Kuwait** | `KW` | 6 Governorates / Flat Localities | 6 Gov Centers | 1 | 1 | 6 vertices | Zero interior holes modeled (`holes: []`) | Verified via Engine Test Suite | **APPROXIMATE / NOT CADASTRAL** |

*Note on Production Geometry*: Zero interior holes are modeled in the current production geometry for all six markets. While the schema and geometry engine fully support interior hole exclusion (`GeoPolygon.holes`), none of the six national sovereign boundaries contain verified enclave holes requiring exclusion. Synthetic hole tests are retained in the test suite as explicit engine proof.

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
- **Verified Official Institution**: Jordan Department of Statistics (DOS).
- **Verified Exact Dataset Title**: Administrative Division Code Directory.
- **Direct Dataset Download URL**: **NOT VERIFIED**.
- **Verified Version / Publication Date**: **NOT VERIFIED**.
- **Verified Retrieval Date**: **NOT VERIFIED**.
- **Verified License / Usage Terms**: **NOT VERIFIED**.
- **Coordinate Reference System**: WGS 84 (EPSG:4326).
- **Geometry Transformation / Generalization**: Manually generalized 11-vertex outer polygon enclosing sovereign territory.
- **Modeled Interior Holes**: Zero interior holes modeled (`holes: []`).
- **Known Limitations & Confidence Level**: Approximate bounding polygon for client-side pre-filtering; high-density Amman neighborhoods resolved via text taxonomy.

### B. Saudi Arabia (`SA`)
- **Verified Official Institution**: General Authority for Statistics (GASTAT).
- **Verified Exact Dataset Title**: Statistical Guide for Localities and Administrative Regions.
- **Direct Dataset Download URL**: **NOT VERIFIED**.
- **Verified Version / Publication Date**: **NOT VERIFIED**.
- **Verified Retrieval Date**: **NOT VERIFIED**.
- **Verified License / Usage Terms**: **NOT VERIFIED**.
- **Coordinate Reference System**: WGS 84 (EPSG:4326).
- **Geometry Transformation / Generalization**: Manually generalized 11-vertex outer polygon.
- **Modeled Interior Holes**: Zero interior holes modeled (`holes: []`).
- **Known Limitations & Confidence Level**: Approximate outer boundary; interior desert boundaries are coarse bounding segments.

### C. Palestine (`PS`)
- **Verified Official Institution**: Palestinian Central Bureau of Statistics (PCBS).
- **Verified Exact Dataset Title**: PCBS Administrative Divisions Directory.
- **Direct Dataset Download URL**: **NOT VERIFIED**.
- **Verified Version / Publication Date**: **NOT VERIFIED**.
- **Verified Retrieval Date**: **NOT VERIFIED**.
- **Verified License / Usage Terms**: **NOT VERIFIED**.
- **Coordinate Reference System**: WGS 84 (EPSG:4326).
- **Geometry Transformation / Generalization**: 2 distinct components (Gaza Strip 4 vertices, West Bank 9 vertices) evaluated independently as a MultiPolygon.
- **Modeled Interior Holes**: Zero interior holes modeled (`holes: []`).
- **Known Limitations & Confidence Level**: Generalized bounding components; no internal checkpoints or area categorizations (A/B/C) are modeled.

### D. Lebanon (`LB`)
- **Verified Official Institution**: Central Administration of Statistics (CAS Lebanon).
- **Verified Exact Dataset Title**: CAS Mohafazat & Cazas Classification.
- **Direct Dataset Download URL**: **NOT VERIFIED**.
- **Verified Version / Publication Date**: **NOT VERIFIED**.
- **Verified Retrieval Date**: **NOT VERIFIED**.
- **Verified License / Usage Terms**: **NOT VERIFIED**.
- **Coordinate Reference System**: WGS 84 (EPSG:4326).
- **Geometry Transformation / Generalization**: Manually generalized 12-vertex polygon.
- **Modeled Interior Holes**: Zero interior holes modeled (`holes: []`).
- **Known Limitations & Confidence Level**: Mountain border segments with Syria in Anti-Lebanon range are generalized approximations.

### E. Syria (`SY`)
- **Verified Official Institution**: Central Bureau of Statistics (CBS Syria).
- **Verified Exact Dataset Title**: CBS Administrative Divisions Registry.
- **Direct Dataset Download URL**: **NOT VERIFIED**.
- **Verified Version / Publication Date**: **NOT VERIFIED**.
- **Verified Retrieval Date**: **NOT VERIFIED**.
- **Verified License / Usage Terms**: **NOT VERIFIED**.
- **Coordinate Reference System**: WGS 84 (EPSG:4326).
- **Geometry Transformation / Generalization**: Manually generalized 13-vertex polygon.
- **Modeled Interior Holes**: Zero interior holes modeled (`holes: []`).
- **Known Limitations & Confidence Level**: Remote eastern desert boundaries are generalized approximations.

### F. Kuwait (`KW`)
- **Verified Official Institution**: Central Statistical Bureau (CSB Kuwait) / Public Authority for Civil Information (PACI).
- **Verified Exact Dataset Title**: CSB Administrative Areas Classification.
- **Direct Dataset Download URL**: **NOT VERIFIED**.
- **Verified Version / Publication Date**: **NOT VERIFIED**.
- **Verified Retrieval Date**: **NOT VERIFIED**.
- **Verified License / Usage Terms**: **NOT VERIFIED**.
- **Coordinate Reference System**: WGS 84 (EPSG:4326).
- **Geometry Transformation / Generalization**: Manually generalized 6-vertex terrestrial polygon.
- **Modeled Interior Holes**: Zero interior holes modeled (`holes: []`).
- **Known Limitations & Confidence Level**: Islands (Failaka, Boubyan, Warbah) are generalized within outer coastal limits.

---

## 4. Privacy & Database Persistence Invariants

- **Seller Privacy**: `public.listings` in PostgreSQL strictly stores canonical location slugs (`city_slug`, `district_slug`, `neighborhood_slug`).
- **No Device GPS Persistence**: Device latitude and longitude coordinates are NEVER persisted to database columns or listing payloads.
- **Fallback Rule**: Default capital fallbacks always set `needsManualSelection: true` and are never persisted as verified user GPS fixes.
- **2,000m Uncertainty Buffer**: Geodesic boundary distance $\le 2,000$ m always returns `status: 'ambiguous'`, triggering mandatory manual selection.
