# FOX Geo Platform — Six-Market Matrix & Data Provenance

Authoritative geographic documentation, provenance audit, and boundary quality disclosure across all six FOX markets (`JO`, `SA`, `PS`, `LB`, `SY`, `KW`).

---

## 1. Six-Market Geographic Coverage & Topology Matrix

| Market | ISO | Administrative Divisions (Gov / Dist) | Point Anchor Coords (`coords.ts`) | Boundary Geometry Type | Topology & Interior Rings | Boundary Status & Verification |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Jordan** | `JO` | 12 Governorates / 52 Districts | 12 Gov Centers | `GeoMultiPolygon` (1 Component) | Exterior Ring, `holes: []` (no internal enclave holes) | **Approximate Generalized Outer Envelope** (NOT Cadastral) |
| **Saudi Arabia** | `SA` | 13 Regions / 136 Governorates | 13 Region Centers | `GeoMultiPolygon` (1 Component) | Exterior Ring, `holes: []` (no internal enclave holes) | **Approximate Generalized Outer Envelope** (NOT Cadastral) |
| **Palestine** | `PS` | 16 Governorates (West Bank + Gaza) | 16 Gov Centers | `GeoMultiPolygon` (2 Components) | Component 1: Gaza Strip<br>Component 2: West Bank | **Approximate Generalized Outer Envelope** (NOT Cadastral) |
| **Lebanon** | `LB` | 8 Governorates / 25 Districts | 8 Gov Centers | `GeoMultiPolygon` (1 Component) | Exterior Ring, `holes: []` (no internal enclave holes) | **Approximate Generalized Outer Envelope** (NOT Cadastral) |
| **Syria** | `SY` | 14 Governorates / 65 Districts | 14 Gov Centers | `GeoMultiPolygon` (1 Component) | Exterior Ring, `holes: []` (no internal enclave holes) | **Approximate Generalized Outer Envelope** (NOT Cadastral) |
| **Kuwait** | `KW` | 6 Governorates / Flat Localities | 6 Gov Centers | `GeoMultiPolygon` (1 Component) | Exterior Ring, `holes: []` (no internal enclave holes) | **Approximate Generalized Outer Envelope** (NOT Cadastral) |

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
   - Status: **Approximate Generalized Polygons (NOT Official Survey Cadastral Lines)**.
   - Boundaries are designed for coarse client-side market confinement and cross-border rejection, not legal territory delineation.

4. **GPS Resolution Coverage**:
   - Geodesic point-in-polygon resolution combined with 2,000 m boundary uncertainty band.
   - Coords within 2,000 m of any boundary edge are classified as `ambiguous` and strictly require manual user confirmation (`needsManualSelection: true`).

---

## 3. Data Provenance & Boundary Quality Disclosures

### A. Jordan (`JO`)
- **Source Administrative Agency**: Jordan Department of Statistics (DOS) & Royal Jordanian Geographic Centre (RJGC).
- **Dataset**: DOS Administrative Division Code Directory.
- **Reference URL**: `http://dosweb.dos.gov.jo`
- **CRS**: WGS 84 (EPSG:4326).
- **Topology & Holes**: The sovereign national territory of Jordan contains no recognized sovereign enclave interior holes. The boundary geometry in `marketPolygons.ts` is an approximate 11-vertex bounding polygon.
- **Verification Status**: **APPROXIMATE / NOT CADASTRAL**. The polygon is generalized for client-side pre-filtering. High-density urban neighborhood boundaries in Greater Amman are resolved via text/slug taxonomy, not polygonal boundary tiles.

### B. Saudi Arabia (`SA`)
- **Source Administrative Agency**: General Authority for Statistics (GASTAT) & National Geospatial-Information Authority.
- **Dataset**: GASTAT Statistical Guide for Localities and Administrative Regions.
- **Reference URL**: `https://www.stats.gov.sa`
- **CRS**: WGS 84 (EPSG:4326).
- **Topology & Holes**: Outer envelope contains no interior national enclave holes. Represented as an 11-vertex generalized boundary.
- **Verification Status**: **APPROXIMATE / NOT CADASTRAL**. Empty Quarter desert boundaries are approximate bounding segments.

### C. Palestine (`PS`)
- **Source Administrative Agency**: Palestinian Central Bureau of Statistics (PCBS) & Ministry of Local Government (MoLG).
- **Dataset**: PCBS Administrative Divisions Directory (West Bank & Gaza Strip).
- **Reference URL**: `https://www.pcbs.gov.ps`
- **CRS**: WGS 84 (EPSG:4326).
- **Topology & Holes**: Explicit `GeoMultiPolygon` with two separate, non-contiguous components:
  1. Component 1: Gaza Strip (4 vertices).
  2. Component 2: West Bank (9 vertices).
- **Verification Status**: **APPROXIMATE / NOT CADASTRAL**. MultiPolygon containment evaluates points inside either Gaza or the West Bank independently without ring flattening. No internal checkpoints or area categorizations (A/B/C) are modeled.

### D. Lebanon (`LB`)
- **Source Administrative Agency**: Central Administration of Statistics (CAS Lebanon).
- **Dataset**: CAS Mohafazat & Cazas Classification.
- **Reference URL**: `http://www.cas.gov.lb`
- **CRS**: WGS 84 (EPSG:4326).
- **Topology & Holes**: Exterior ring with 12 vertices. No interior enclave holes exist in national territory.
- **Verification Status**: **APPROXIMATE / NOT CADASTRAL**. Mountain border segments with Syria in the Anti-Lebanon range are generalized approximations.

### E. Syria (`SY`)
- **Source Administrative Agency**: Central Bureau of Statistics (CBS Syria).
- **Dataset**: CBS Administrative Divisions Registry.
- **Reference URL**: `http://cbssyr.sy`
- **CRS**: WGS 84 (EPSG:4326).
- **Topology & Holes**: Exterior ring with 13 vertices. No interior enclave holes exist in national territory.
- **Verification Status**: **APPROXIMATE / NOT CADASTRAL**. Remote eastern desert boundaries are generalized approximations.

### F. Kuwait (`KW`)
- **Source Administrative Agency**: Central Statistical Bureau (CSB Kuwait) & Public Authority for Civil Information (PACI).
- **Dataset**: CSB Administrative Areas Classification.
- **Reference URL**: `https://www.csb.gov.kw`
- **CRS**: WGS 84 (EPSG:4326).
- **Topology & Holes**: Terrestrial envelope with 6 vertices. No interior enclave holes exist.
- **Verification Status**: **APPROXIMATE / NOT CADASTRAL**. Off-shore islands (Failaka, Boubyan, Warbah) are generalized within outer coastal limits.

---

## 4. Privacy & Database Persistence Invariants

- **Seller Privacy**: `public.listings` in PostgreSQL strictly stores canonical location slugs (`city_slug`, `district_slug`, `neighborhood_slug`).
- **No Device GPS Persistence**: Device latitude and longitude coordinates are NEVER persisted to database columns or listing payloads.
- **Fallback Rule**: Default capital fallbacks always set `needsManualSelection: true` and are never persisted as verified user GPS fixes.
- **2,000m Uncertainty Buffer**: Geodesic boundary distance $\le 2,000$ m always returns `status: 'ambiguous'`, triggering mandatory manual selection.
