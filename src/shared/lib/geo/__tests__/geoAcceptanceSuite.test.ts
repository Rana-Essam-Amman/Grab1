import { describe, it, expect } from 'vitest';
import {
  wgs84DistanceMeters,
  wgs84Inverse,
  geodesicDistanceToSegmentMeters,
  isPointInGeoPolygon,
  wgs84Direct,
  GeoPolygon,
} from '../polygonGeometry';
import { checkMarketBoundary, isValidLatLng, isWithinMarketBounds } from '../marketBounds';
import { resolveGeoLocation } from '../geoResolver';
import { isProviderCountryMatching } from '../providerValidation';
import { MARKET_MULTIPOLYGONS } from '../marketPolygons';
import type { MarketCode, LatLng } from '../geo.types';

describe('FIX H — Independent WGS-84 Reference Vectors & Controlled Fixture Tests', () => {
  describe('A. Independent Published WGS-84 Reference Vectors (NGS / GeographicLib / Karney)', () => {
    it('1. matches Vincenty 1975 published benchmark vector (Flinders Peak to Buninyong)', () => {
      const flindersPeak: LatLng = { lat: -37.9510334, lng: 144.4248679 };
      const buninyong: LatLng = { lat: -37.6528211, lng: 143.9264955 };
      const res = wgs84Inverse(flindersPeak, buninyong);
      expect(Math.abs(res.distanceMeters - 54972.271)).toBeLessThan(0.1);
      expect(res.isConverged).toBe(true);
    });

    it('2. matches published equatorial degree length (111,319.49 m)', () => {
      const p1: LatLng = { lat: 0, lng: 0 };
      const p2: LatLng = { lat: 0, lng: 1 };
      const dist = wgs84DistanceMeters(p1, p2);
      expect(Math.abs(dist - 111319.49)).toBeLessThan(0.1);
    });

    it('3. matches published 1-degree meridian arc length at Equator (110,574.39 m)', () => {
      const p1: LatLng = { lat: 0, lng: 0 };
      const p2: LatLng = { lat: 1, lng: 0 };
      const dist = wgs84DistanceMeters(p1, p2);
      expect(Math.abs(dist - 110574.39)).toBeLessThan(0.1);
    });

    it('4. matches published high-latitude meridian arc length (88N to 89N)', () => {
      const p1: LatLng = { lat: 88, lng: 0 };
      const p2: LatLng = { lat: 89, lng: 0 };
      const dist = wgs84DistanceMeters(p1, p2);
      expect(Math.abs(dist - 111693.18)).toBeLessThan(1.0);
    });

    it('5. handles near-antipodal vector gracefully via Lambert fallback without throwing', () => {
      const p1: LatLng = { lat: 0.1, lng: 0 };
      const p2: LatLng = { lat: -0.1, lng: 179.95 };
      const res = wgs84Inverse(p1, p2);
      expect(Number.isFinite(res.distanceMeters)).toBe(true);
      expect(res.distanceMeters).toBeGreaterThan(19000000);
    });

    it('6. calculates nearest distance on finite geodesic segment interior', () => {
      const a: LatLng = { lat: 0, lng: 0 };
      const b: LatLng = { lat: 0, lng: 2 };
      const p: LatLng = { lat: 0.0180873, lng: 1.0 };
      const d = geodesicDistanceToSegmentMeters(p, a, b);
      expect(Math.abs(d - 2000.0)).toBeLessThan(1.0);
    });

    it('7. clamps nearest point to first endpoint when projection falls before start', () => {
      const a: LatLng = { lat: 31.95, lng: 35.91 };
      const b: LatLng = { lat: 32.55, lng: 35.85 };
      const p: LatLng = { lat: 31.50, lng: 35.91 };
      const d = geodesicDistanceToSegmentMeters(p, a, b);
      const expected = wgs84DistanceMeters(p, a);
      expect(Math.abs(d - expected)).toBeLessThan(0.01);
    });

    it('8. clamps nearest point to second endpoint when projection falls beyond end', () => {
      const a: LatLng = { lat: 31.95, lng: 35.91 };
      const b: LatLng = { lat: 32.55, lng: 35.85 };
      const p: LatLng = { lat: 33.00, lng: 35.85 };
      const d = geodesicDistanceToSegmentMeters(p, a, b);
      const expected = wgs84DistanceMeters(p, b);
      expect(Math.abs(d - expected)).toBeLessThan(0.01);
    });

    it('9. handles degenerate segment where endpoints are identical', () => {
      const a: LatLng = { lat: 24.71, lng: 46.67 };
      const p: LatLng = { lat: 25.00, lng: 47.00 };
      const d = geodesicDistanceToSegmentMeters(p, a, a);
      expect(Math.abs(d - wgs84DistanceMeters(p, a))).toBeLessThan(0.001);
    });

    it('10. guarantees symmetry regardless of endpoint order [a, b] vs [b, a]', () => {
      const a: LatLng = { lat: 33.5, lng: 36.2 };
      const b: LatLng = { lat: 34.0, lng: 36.8 };
      const p: LatLng = { lat: 33.8, lng: 36.3 };
      const d1 = geodesicDistanceToSegmentMeters(p, a, b);
      const d2 = geodesicDistanceToSegmentMeters(p, b, a);
      expect(Math.abs(d1 - d2)).toBeLessThan(0.05);
    });
  });

  describe('B. Controlled Fixture 2,000m Boundary Uncertainty Tests for All 6 Markets', () => {
    const markets: MarketCode[] = ['JO', 'SA', 'PS', 'LB', 'SY', 'KW'];

    // Select for each market an isolated segment of its bounding envelope
    // so perpendicular outward displacement does not intersect another corner of the polygon
    const marketSegmentIndex: Record<MarketCode, number> = {
      JO: 0,
      SA: 3, // between (32.16, 39.00) and (31.00, 42.00) - northern straight border
      PS: 3, // between (31.50, 34.60) and (31.15, 34.15) on Gaza
      LB: 0,
      SY: 0,
      KW: 0,
    };

    markets.forEach((market) => {
      it(`evaluates 1,999m, 2,000m, and 2,001m boundary fixtures for market ${market}`, () => {
        const poly = MARKET_MULTIPOLYGONS[market];
        expect(poly).toBeDefined();
        const comp = poly[0];
        const exterior = 'exterior' in comp ? comp.exterior : (comp as unknown as readonly LatLng[]);
        const segIdx = marketSegmentIndex[market];
        const v1 = exterior[segIdx];
        const v2 = exterior[(segIdx + 1) % exterior.length];

        // Midpoint of segment (v1, v2)
        const inv = wgs84Inverse(v1, v2);
        const midDist = inv.distanceMeters / 2;
        const midPoint = wgs84Direct(v1, midDist, inv.initialAzimuthRad);

        // Find inward and outward perpendicular azimuths
        const perpAzimuth1 = (inv.initialAzimuthRad + Math.PI / 2) % (2 * Math.PI);
        const perpAzimuth2 = (inv.initialAzimuthRad - Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);

        // Displace by 10km along both normals to find which side is inside vs outside
        const t1 = wgs84Direct(midPoint, 10000, perpAzimuth1);
        const isInside1 = checkMarketBoundary(market, t1).isInside;
        const outwardAzimuth = !isInside1 ? perpAzimuth1 : perpAzimuth2;
        const inwardAzimuth = isInside1 ? perpAzimuth1 : perpAzimuth2;

        // Controlled points outside at 1,999m, 2,000m, and 2,001m
        const p1999Out = wgs84Direct(midPoint, 1999, outwardAzimuth);
        const p2000Out = wgs84Direct(midPoint, 2000, outwardAzimuth);
        const p2001Out = wgs84Direct(midPoint, 2001, outwardAzimuth);

        const check1999 = checkMarketBoundary(market, p1999Out);
        const check2000 = checkMarketBoundary(market, p2000Out);
        const check2001 = checkMarketBoundary(market, p2001Out);

        // At or below 2,000m must be ambiguous and rejected from isWithinMarketBounds
        expect(check1999.isAmbiguousBuffer).toBe(true);
        expect(check1999.status).toBe('ambiguous');
        expect(isWithinMarketBounds(market, p1999Out)).toBe(false);

        expect(check2000.isAmbiguousBuffer).toBe(true);
        expect(check2000.status).toBe('ambiguous');
        expect(isWithinMarketBounds(market, p2000Out)).toBe(false);

        // At 2,001m outside must not be ambiguous (it is outside)
        expect(check2001.isAmbiguousBuffer).toBe(false);
        expect(isWithinMarketBounds(market, p2001Out)).toBe(false);

        // If inward displacement is within the polygon, verify inward 2,001m point
        const testInward = wgs84Direct(midPoint, 2001, inwardAzimuth);
        if (checkMarketBoundary(market, testInward).isInside) {
          const check2001In = checkMarketBoundary(market, testInward);
          expect(check2001In.isAmbiguousBuffer).toBe(false);
          expect(check2001In.status).toBe('inside');
          expect(isWithinMarketBounds(market, testInward)).toBe(true);
        }
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
