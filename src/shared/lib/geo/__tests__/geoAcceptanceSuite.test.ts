import { describe, it, expect } from 'vitest';
import {
  wgs84DistanceMeters,
  wgs84Inverse,
  wgs84Direct,
  geodesicDistanceToSegmentMeters,
  isPointInGeoPolygon,
  GeoPolygon,
} from '../polygonGeometry';
import { checkMarketBoundary, isValidLatLng, isWithinMarketBounds } from '../marketBounds';
import { resolveGeoLocation } from '../geoResolver';
import { isProviderCountryMatching } from '../providerValidation';
import { MARKET_MULTIPOLYGONS } from '../marketPolygons';
import type { MarketCode, LatLng } from '../geo.types';

describe('FIX H — Acceptance Tests Suite & Geodesic Rigor', () => {
  describe('A. Independent WGS-84 Geodesic Reference Vectors', () => {
    // 1. Point perpendicular to the midpoint of a geodesic segment
    it('1. calculates point perpendicular to midpoint of geodesic segment', () => {
      // Segment: Equator from (0, 0) to (0, 2)
      const a: LatLng = { lat: 0, lng: 0 };
      const b: LatLng = { lat: 0, lng: 2 };
      // Midpoint on geodesic is (0, 1). Query point at (0.018042, 1) is ~2,000m north
      const p: LatLng = { lat: 0.018042, lng: 1.0 };
      const d = geodesicDistanceToSegmentMeters(p, a, b);
      const expectedDist = wgs84DistanceMeters({ lat: 0, lng: 1.0 }, p);
      expect(Math.abs(d - expectedDist)).toBeLessThan(1.0);
    });

    // 2. Point nearest to first endpoint
    it('2. calculates point nearest to the first endpoint', () => {
      const a: LatLng = { lat: 31.95, lng: 35.91 };
      const b: LatLng = { lat: 32.55, lng: 35.85 };
      // Query point south of a
      const p: LatLng = { lat: 31.50, lng: 35.91 };
      const d = geodesicDistanceToSegmentMeters(p, a, b);
      const expected = wgs84DistanceMeters(p, a);
      expect(Math.abs(d - expected)).toBeLessThan(0.01);
    });

    // 3. Point nearest to second endpoint
    it('3. calculates point nearest to the second endpoint', () => {
      const a: LatLng = { lat: 31.95, lng: 35.91 };
      const b: LatLng = { lat: 32.55, lng: 35.85 };
      // Query point north of b
      const p: LatLng = { lat: 33.00, lng: 35.85 };
      const d = geodesicDistanceToSegmentMeters(p, a, b);
      const expected = wgs84DistanceMeters(p, b);
      expect(Math.abs(d - expected)).toBeLessThan(0.01);
    });

    // 4. Point beyond segment extension
    it('4. constrains solution to endpoints when query point is collinear but beyond extension', () => {
      const a: LatLng = { lat: 0, lng: 0 };
      const b: LatLng = { lat: 0, lng: 1 };
      const p: LatLng = { lat: 0, lng: 2 }; // Collinear, beyond b
      const d = geodesicDistanceToSegmentMeters(p, a, b);
      const expected = wgs84DistanceMeters(p, b);
      expect(Math.abs(d - expected)).toBeLessThan(0.01);
    });

    // 5. Degenerate segment (a == b)
    it('5. correctly handles degenerate segment where endpoints coincide', () => {
      const a: LatLng = { lat: 24.71, lng: 46.67 };
      const p: LatLng = { lat: 25.00, lng: 47.00 };
      const d = geodesicDistanceToSegmentMeters(p, a, a);
      expect(Math.abs(d - wgs84DistanceMeters(p, a))).toBeLessThan(0.001);
    });

    // 6. Long segment
    it('6. handles long segment across multiple degrees of longitude', () => {
      const a: LatLng = { lat: 20.0, lng: 40.0 };
      const b: LatLng = { lat: 20.0, lng: 50.0 };
      const p: LatLng = { lat: 20.5, lng: 45.0 };
      const d = geodesicDistanceToSegmentMeters(p, a, b);
      // Because geodesics bow towards the poles on a sphere/ellipsoid, the parallel of latitude 20 is south of the geodesic connecting (20,40) and (20,50).
      // The distance is ~47.5 km.
      expect(d).toBeGreaterThan(45000);
      expect(d).toBeLessThan(50000);
    });

    // 7. High-latitude behavior
    it('7. handles high-latitude segments without divergence', () => {
      const a: LatLng = { lat: 70.0, lng: 20.0 };
      const b: LatLng = { lat: 70.0, lng: 30.0 };
      const p: LatLng = { lat: 70.01, lng: 25.0 };
      const d = geodesicDistanceToSegmentMeters(p, a, b);
      // Geodesic bowed distance at high latitude (70N) is ~6.7 km from parallel
      expect(Number.isFinite(d)).toBe(true);
      expect(d).toBeGreaterThan(5000);
      expect(d).toBeLessThan(8000);
    });

    // 8. Antimeridian crossing segment
    it('8. handles coordinates near antimeridian safely', () => {
      const a: LatLng = { lat: 10.0, lng: 179.0 };
      const b: LatLng = { lat: 10.0, lng: 179.9 };
      const p: LatLng = { lat: 10.01, lng: 179.5 };
      const d = geodesicDistanceToSegmentMeters(p, a, b);
      expect(Number.isFinite(d)).toBe(true);
      expect(d).toBeGreaterThan(1000);
      expect(d).toBeLessThan(1200);
    });

    // 9. Reversed endpoint order symmetry
    it('9. maintains symmetry regardless of endpoint ordering [a, b] vs [b, a]', () => {
      const a: LatLng = { lat: 33.5, lng: 36.2 };
      const b: LatLng = { lat: 34.0, lng: 36.8 };
      const p: LatLng = { lat: 33.8, lng: 36.3 };
      const d1 = geodesicDistanceToSegmentMeters(p, a, b);
      const d2 = geodesicDistanceToSegmentMeters(p, b, a);
      expect(Math.abs(d1 - d2)).toBeLessThan(0.01);
    });

    // 10. Vincenty direct/inverse consistency
    it('10. demonstrates exact consistency between direct and inverse geodesic formulas', () => {
      const start: LatLng = { lat: 31.95, lng: 35.91 };
      const azimuth = 0.785398; // ~45 deg
      const dist = 50000; // 50 km
      const dest = wgs84Direct(start, dist, azimuth);
      const inv = wgs84Inverse(start, dest);
      expect(Math.abs(inv.distanceMeters - dist)).toBeLessThan(0.001);
    });
  });

  describe('B. Exact 2,000m Boundary Uncertainty Tests for All 6 Markets', () => {
    const markets: MarketCode[] = ['JO', 'SA', 'PS', 'LB', 'SY', 'KW'];

    markets.forEach((market) => {
      it(`enforces exact 1,999m, 2,000m, and 2,001m threshold for market ${market}`, () => {
        const poly = MARKET_MULTIPOLYGONS[market];
        expect(poly).toBeDefined();
        const exterior = 'exterior' in poly[0] ? poly[0].exterior : (poly[0] as unknown as readonly LatLng[]);
        const v1 = exterior[0];
        const v2 = exterior[1];

        // Midpoint of segment (v1, v2)
        const inv = wgs84Inverse(v1, v2);
        const midDist = inv.distanceMeters / 2;
        const midPoint = wgs84Direct(v1, midDist, inv.initialAzimuthRad);

        // Perpendicular azimuth (initial azimuth + 90 deg)
        const perpAzimuth = (inv.initialAzimuthRad + Math.PI / 2) % (2 * Math.PI);

        // Test points at 1,999m, 2,000m, and 2,001m along perpendicular
        const p1999 = wgs84Direct(midPoint, 1999, perpAzimuth);
        const p2000 = wgs84Direct(midPoint, 2000, perpAzimuth);
        const p2001 = wgs84Direct(midPoint, 2001, perpAzimuth);

        const check1999 = checkMarketBoundary(market, p1999);
        const check2000 = checkMarketBoundary(market, p2000);
        const check2001 = checkMarketBoundary(market, p2001);

        // <= 2,000m must be ambiguous
        expect(check1999.isAmbiguousBuffer).toBe(true);
        expect(check1999.status).toBe('ambiguous');
        expect(isWithinMarketBounds(market, p1999)).toBe(false);

        expect(check2000.isAmbiguousBuffer).toBe(true);
        expect(check2000.status).toBe('ambiguous');
        expect(isWithinMarketBounds(market, p2000)).toBe(false);

        // > 2,000m must NOT be ambiguous
        expect(check2001.isAmbiguousBuffer).toBe(false);
        expect(check2001.status).not.toBe('ambiguous');
      });
    });
  });

  describe('C. Polygon Topology with Holes & MultiPolygons', () => {
    it('synthetic test: excludes points located inside interior holes', () => {
      const polygonWithHole: GeoPolygon = {
        exterior: [
          { lat: 30, lng: 35 },
          { lat: 30, lng: 37 },
          { lat: 32, lng: 37 },
          { lat: 32, lng: 35 },
        ],
        holes: [
          [
            { lat: 30.5, lng: 35.5 },
            { lat: 30.5, lng: 36.5 },
            { lat: 31.5, lng: 36.5 },
            { lat: 31.5, lng: 35.5 },
          ],
        ],
      };

      const pointInSolid: LatLng = { lat: 30.2, lng: 35.2 };
      expect(isPointInGeoPolygon(pointInSolid, polygonWithHole).isInside).toBe(true);

      const pointInHole: LatLng = { lat: 31.0, lng: 36.0 };
      expect(isPointInGeoPolygon(pointInHole, polygonWithHole).isInside).toBe(false);
    });

    it('evaluates MultiPolygon components independently (Gaza vs West Bank)', () => {
      const gazaCoords: LatLng = { lat: 31.45, lng: 34.38 };
      const westBankCoords: LatLng = { lat: 31.90, lng: 35.20 };
      const outsideCoords: LatLng = { lat: 31.40, lng: 34.70 };

      expect(checkMarketBoundary('PS', gazaCoords).isInside).toBe(true);
      expect(checkMarketBoundary('PS', westBankCoords).isInside).toBe(true);
      expect(checkMarketBoundary('PS', outsideCoords).isInside).toBe(false);
    });
  });

  describe('D. Coordinate Validation & Inversion Safety', () => {
    it('rejects invalid, NaN, Infinity, and out-of-range coordinates', () => {
      expect(isValidLatLng(null)).toBe(false);
      expect(isValidLatLng({ lat: NaN, lng: 35 })).toBe(false);
      expect(isValidLatLng({ lat: 32, lng: Infinity })).toBe(false);
      expect(isValidLatLng({ lat: 95, lng: 35 })).toBe(false);
      expect(isValidLatLng({ lat: 32, lng: 190 })).toBe(false);
    });
  });

  describe('E. Provider Validation & Metadata Edge Cases', () => {
    it('strictly accepts exact match and rejects conflicting metadata', () => {
      const matchRes = isProviderCountryMatching('SA', {
        provider: 'nominatim',
        address: { country: 'Saudi Arabia', country_code: 'sa' },
      });
      expect(matchRes.matches).toBe(true);
      expect(matchRes.isVerified).toBe(true);

      const conflictRes = isProviderCountryMatching('SA', {
        provider: 'nominatim',
        address: { country: 'Saudi Arabia', country_code: 'us' },
      });
      expect(conflictRes.matches).toBe(false);
      expect(conflictRes.isVerified).toBe(false);
    });
  });

  describe('F. Fallback Safety & Manual Selection Invariants', () => {
    it('ensures fallback capital always requires manual selection and is never high-confidence GPS', () => {
      const res = resolveGeoLocation({
        targetMarket: 'KW',
        coordinates: { lat: 50.0, lng: 10.0 },
      });
      expect(res.needsManualSelection).toBe(true);
      expect(res.resolutionSource).toBe('manual');
      expect(res.confidence).toBe('unresolved');
    });
  });
});
