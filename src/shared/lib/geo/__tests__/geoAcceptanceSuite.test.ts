import { describe, it, expect } from 'vitest';
import {
  wgs84DistanceMeters,
  wgs84Inverse,
  geodesicDistanceToSegmentMeters,
  geodesicDistanceToSegmentDetailed,
  isPointInGeoPolygon,
  GeoPolygon,
} from '../polygonGeometry';
import { checkMarketBoundary, isValidLatLng, isWithinMarketBounds } from '../marketBounds';
import { resolveGeoLocation } from '../geoResolver';
import { isProviderCountryMatching } from '../providerValidation';
import type { MarketCode, LatLng } from '../geo.types';

describe('FIX H — Independent WGS-84 Reference Vectors & Controlled Fixture Tests', () => {
  describe('A. Independent Published WGS-84 Reference Vectors (NGS / GeographicLib / Karney)', () => {
    // Reference 1: Flinders Peak to Buninyong (classic Vincenty 1975 benchmark vector)
    // Source: Vincenty, T. (1975). "Direct and Inverse Solutions of Geodesics on the Ellipsoid with application of nested equations". Survey Review XXIII.
    // Flinders Peak: (-37.9510334, 144.4248679), Buninyong: (-37.6528211, 143.9264955)
    // Published WGS84 distance: 54,972.271 m
    it('1. matches Vincenty 1975 published benchmark vector (Flinders Peak to Buninyong)', () => {
      const flindersPeak: LatLng = { lat: -37.9510334, lng: 144.4248679 };
      const buninyong: LatLng = { lat: -37.6528211, lng: 143.9264955 };
      const res = wgs84Inverse(flindersPeak, buninyong);
      expect(Math.abs(res.distanceMeters - 54972.271)).toBeLessThan(0.1);
      expect(res.isConverged).toBe(true);
    });

    // Reference 2: Equator 1-degree meridian arc
    // Published WGS-84 distance for 1 degree on Equator: a * pi / 180 = 111,319.49079 m
    it('2. matches published equatorial degree length (111,319.49 m)', () => {
      const p1: LatLng = { lat: 0, lng: 0 };
      const p2: LatLng = { lat: 0, lng: 1 };
      const dist = wgs84DistanceMeters(p1, p2);
      expect(Math.abs(dist - 111319.49)).toBeLessThan(0.1);
    });

    // Reference 3: 1-degree meridian arc from equator (0N to 1N)
    // Published WGS-84 meridian arc: 110,574.388 m
    it('3. matches published 1-degree meridian arc length at Equator (110,574.39 m)', () => {
      const p1: LatLng = { lat: 0, lng: 0 };
      const p2: LatLng = { lat: 1, lng: 0 };
      const dist = wgs84DistanceMeters(p1, p2);
      expect(Math.abs(dist - 110574.39)).toBeLessThan(0.1);
    });

    // Reference 4: High latitude 1-degree meridian arc (88N to 89N)
    // Published WGS-84 meridian arc: 111,693.18 m
    it('4. matches published high-latitude meridian arc length (88N to 89N)', () => {
      const p1: LatLng = { lat: 88, lng: 0 };
      const p2: LatLng = { lat: 89, lng: 0 };
      const dist = wgs84DistanceMeters(p1, p2);
      expect(Math.abs(dist - 111693.18)).toBeLessThan(1.0);
    });

    // Reference 5: Near-antipodal difficult convergence vector (Lambert fallback transparency)
    it('5. handles near-antipodal vector gracefully via Lambert fallback without throwing', () => {
      const p1: LatLng = { lat: 0.1, lng: 0 };
      const p2: LatLng = { lat: -0.1, lng: 179.95 };
      const res = wgs84Inverse(p1, p2);
      expect(Number.isFinite(res.distanceMeters)).toBe(true);
      expect(res.distanceMeters).toBeGreaterThan(19000000);
      expect(res.isConverged).toBe(false); // Explicit non-convergence flag
    });

    // Reference 6: Finite geodesic segment nearest point - interior perpendicular
    it('6. calculates nearest distance on finite geodesic segment interior', () => {
      const a: LatLng = { lat: 0, lng: 0 };
      const b: LatLng = { lat: 0, lng: 2 };
      const p: LatLng = { lat: 0.0180873, lng: 1.0 };
      const d = geodesicDistanceToSegmentMeters(p, a, b);
      expect(Math.abs(d - 2000.0)).toBeLessThan(1.0);
    });

    // Reference 7: Point nearest to first endpoint
    it('7. clamps nearest point to first endpoint when projection falls before start', () => {
      const a: LatLng = { lat: 31.95, lng: 35.91 };
      const b: LatLng = { lat: 32.55, lng: 35.85 };
      const p: LatLng = { lat: 31.50, lng: 35.91 };
      const d = geodesicDistanceToSegmentMeters(p, a, b);
      const expected = wgs84DistanceMeters(p, a);
      expect(Math.abs(d - expected)).toBeLessThan(0.01);
    });

    // Reference 8: Point nearest to second endpoint
    it('8. clamps nearest point to second endpoint when projection falls beyond end', () => {
      const a: LatLng = { lat: 31.95, lng: 35.91 };
      const b: LatLng = { lat: 32.55, lng: 35.85 };
      const p: LatLng = { lat: 33.00, lng: 35.85 };
      const d = geodesicDistanceToSegmentMeters(p, a, b);
      const expected = wgs84DistanceMeters(p, b);
      expect(Math.abs(d - expected)).toBeLessThan(0.01);
    });

    // Reference 9: Degenerate segment
    it('9. handles degenerate segment where endpoints are identical', () => {
      const a: LatLng = { lat: 24.71, lng: 46.67 };
      const p: LatLng = { lat: 25.00, lng: 47.00 };
      const d = geodesicDistanceToSegmentMeters(p, a, a);
      expect(Math.abs(d - wgs84DistanceMeters(p, a))).toBeLessThan(0.001);
    });

    // Reference 10: Symmetry across endpoint ordering
    it('10. guarantees symmetry regardless of endpoint order [a, b] vs [b, a]', () => {
      const a: LatLng = { lat: 33.5, lng: 36.2 };
      const b: LatLng = { lat: 34.0, lng: 36.8 };
      const p: LatLng = { lat: 33.8, lng: 36.3 };
      const d1 = geodesicDistanceToSegmentMeters(p, a, b);
      const d2 = geodesicDistanceToSegmentMeters(p, b, a);
      expect(Math.abs(d1 - d2)).toBeLessThan(0.05);
    });

    // Segment convergence reporting tests (Fix A)
    it('11. verifies convergence reporting and detects insufficient iteration cap vs requested tolerance', () => {
      const a: LatLng = { lat: 0, lng: 0 };
      const b: LatLng = { lat: 0, lng: 10 };
      const p: LatLng = { lat: 1, lng: 5 };

      const convergedRes = geodesicDistanceToSegmentDetailed(p, a, b, 1.0);
      expect(convergedRes.isConverged).toBe(true);

      const unachievedRes = geodesicDistanceToSegmentDetailed(p, a, b, 1e-15);
      expect(unachievedRes.isConverged).toBe(false);

      expect(geodesicDistanceToSegmentDetailed(p, a, b, -1).isConverged).toBe(false);
      expect(geodesicDistanceToSegmentDetailed(p, a, b, NaN).isConverged).toBe(false);
    });
  });

  describe('B. Independent Hardcoded 2,000m Boundary Fixtures for All 6 Markets', () => {
    // Note on Fixtures: These static coordinates are established regression fixtures.
    // They verify that the 2,000-meter uncertainty policy strictly triggers ambiguous status
    // and manual selection at or below 2,000m, and non-ambiguous classification at 2,001m.
    const independentFixtures: Record<MarketCode, {
      p1999Out: LatLng;
      p2000Out: LatLng;
      p2001Out: LatLng;
      p2001In: LatLng;
    }> = {
      JO: {
        p1999Out: { lat: 32.6672094, lng: 35.9818828 },
        p2000Out: { lat: 32.6672179, lng: 35.9818862 },
        p2001Out: { lat: 32.6672265, lng: 35.9818896 },
        p2001In: { lat: 32.6330175, lng: 35.9683077 },
      },
      SA: {
        p1999Out: { lat: 31.6053613, lng: 40.5176965 },
        p2000Out: { lat: 31.6053696, lng: 40.5177007 },
        p2001Out: { lat: 31.6053779, lng: 40.5177049 },
        p2001In: { lat: 31.5722824, lng: 40.5008805 },
      },
      PS: {
        p1999Out: { lat: 32.4906285, lng: 35.1390956 },
        p2000Out: { lat: 32.4906362, lng: 35.1390902 },
        p2001Out: { lat: 32.4906440, lng: 35.1390848 },
        p2001In: { lat: 32.4595346, lng: 35.1606627 },
      },
      LB: {
        p1999Out: { lat: 34.5649708, lng: 35.9624429 },
        p2000Out: { lat: 34.5649782, lng: 35.9624367 },
        p2001Out: { lat: 34.5649857, lng: 35.9624306 },
        p2001In: { lat: 34.5352655, lng: 35.9871463 },
      },
      SY: {
        p1999Out: { lat: 36.1562771, lng: 41.8664022 },
        p2000Out: { lat: 36.1562749, lng: 41.8664130 },
        p2001Out: { lat: 36.1562728, lng: 41.8664238 },
        p2001In: { lat: 36.1649713, lng: 41.8232604 },
      },
      KW: {
        p1999Out: { lat: 30.1196402, lng: 47.3501180 },
        p2000Out: { lat: 30.1196493, lng: 47.3501181 },
        p2001Out: { lat: 30.1196583, lng: 47.3501181 },
        p2001In: { lat: 30.0835574, lng: 47.3498819 },
      },
    };

    (Object.keys(independentFixtures) as MarketCode[]).forEach((market) => {
      it(`evaluates independent hardcoded boundary fixtures for market ${market}`, () => {
        const fix = independentFixtures[market];

        const check1999 = checkMarketBoundary(market, fix.p1999Out);
        const check2000 = checkMarketBoundary(market, fix.p2000Out);
        const check2001Out = checkMarketBoundary(market, fix.p2001Out);
        const check2001In = checkMarketBoundary(market, fix.p2001In);

        // At or below 2,000m outside: must be ambiguous and rejected
        expect(check1999.isAmbiguousBuffer).toBe(true);
        expect(check1999.status).toBe('ambiguous');
        expect(isWithinMarketBounds(market, fix.p1999Out)).toBe(false);

        expect(check2000.isAmbiguousBuffer).toBe(true);
        expect(check2000.status).toBe('ambiguous');
        expect(isWithinMarketBounds(market, fix.p2000Out)).toBe(false);

        // At 2,001m outside: must be 'outside', not ambiguous, rejected from market
        expect(check2001Out.isAmbiguousBuffer).toBe(false);
        expect(check2001Out.status).toBe('outside');
        expect(isWithinMarketBounds(market, fix.p2001Out)).toBe(false);

        // At 2,001m inside: must be 'inside', not ambiguous, accepted into market
        expect(check2001In.isAmbiguousBuffer).toBe(false);
        expect(check2001In.status).toBe('inside');
        expect(isWithinMarketBounds(market, fix.p2001In)).toBe(true);
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
