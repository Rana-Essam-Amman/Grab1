import { describe, it, expect } from 'vitest';
import {
  wgs84DistanceMeters,
  geodesicDistanceToSegmentMeters,
  isPointInGeoPolygon,
  isPointInMultiPolygon,
  GeoPolygon,
  GeoMultiPolygon,
} from '../polygonGeometry';
import { checkMarketBoundary, isValidLatLng, isLikelyInvertedForMarket } from '../marketBounds';
import { resolveGeoLocation } from '../geoResolver';
import { isProviderCountryMatching } from '../providerValidation';
import type { MarketCode, LatLng } from '../geo.types';

describe('FIX H — Acceptance Tests Suite', () => {
  describe('A. Geodesic Distance & WGS-84 Calculations', () => {
    it('accurately calculates known WGS-84 reference distances', () => {
      // Amman (31.95, 35.91) to Damascus (33.51, 36.29) ~ 177-178 km
      const pAmman: LatLng = { lat: 31.9539, lng: 35.9106 };
      const pDamascus: LatLng = { lat: 33.5138, lng: 36.2765 };
      const dist = wgs84DistanceMeters(pAmman, pDamascus);
      expect(dist).toBeGreaterThan(170000);
      expect(dist).toBeLessThan(180000);

      // Same point distance is exactly 0
      expect(wgs84DistanceMeters(pAmman, pAmman)).toBe(0);
    });

    it('calculates point to segment geodesic distance with projection', () => {
      const a: LatLng = { lat: 31.0, lng: 35.0 };
      const b: LatLng = { lat: 31.0, lng: 36.0 };
      const p: LatLng = { lat: 31.01, lng: 35.5 }; // ~1.1 km north of midpoint
      const d = geodesicDistanceToSegmentMeters(p, a, b);
      expect(d).toBeGreaterThan(1000);
      expect(d).toBeLessThan(1200);
    });

    it('enforces 2,000m boundary uncertainty classification', () => {
      // Coords very near border return ambiguous
      const borderPoint: LatLng = { lat: 29.19, lng: 34.96 };
      const res = checkMarketBoundary('JO', borderPoint);
      expect(res.status === 'ambiguous' || res.isAmbiguousBuffer).toBe(true);
    });
  });

  describe('B. Polygon Topology with Holes & MultiPolygons', () => {
    it('excludes points located inside interior holes', () => {
      const polygonWithHole: GeoPolygon = {
        // Outer box: lat 30 to 32, lng 35 to 37
        exterior: [
          { lat: 30, lng: 35 },
          { lat: 30, lng: 37 },
          { lat: 32, lng: 37 },
          { lat: 32, lng: 35 },
        ],
        // Interior hole: lat 30.5 to 31.5, lng 35.5 to 36.5
        holes: [
          [
            { lat: 30.5, lng: 35.5 },
            { lat: 30.5, lng: 36.5 },
            { lat: 31.5, lng: 36.5 },
            { lat: 31.5, lng: 35.5 },
          ],
        ],
      };

      // Point in exterior, outside hole
      const pointInSolid: LatLng = { lat: 30.2, lng: 35.2 };
      expect(isPointInGeoPolygon(pointInSolid, polygonWithHole).isInside).toBe(true);

      // Point inside the hole must NOT be inside the polygon
      const pointInHole: LatLng = { lat: 31.0, lng: 36.0 };
      expect(isPointInGeoPolygon(pointInHole, polygonWithHole).isInside).toBe(false);
    });

    it('evaluates MultiPolygon components independently (Gaza vs West Bank)', () => {
      const gazaCoords: LatLng = { lat: 31.45, lng: 34.38 };
      const westBankCoords: LatLng = { lat: 31.90, lng: 35.20 };
      const outsideCoords: LatLng = { lat: 31.40, lng: 34.70 }; // Between the two

      expect(checkMarketBoundary('PS', gazaCoords).isInside).toBe(true);
      expect(checkMarketBoundary('PS', westBankCoords).isInside).toBe(true);
      expect(checkMarketBoundary('PS', outsideCoords).isInside).toBe(false);
    });
  });

  describe('C. Six-Market Coordinate Validation & Inversion Safety', () => {
    const markets: MarketCode[] = ['JO', 'SA', 'PS', 'LB', 'SY', 'KW'];

    it('rejects invalid, NaN, Infinity, and out-of-range coordinates', () => {
      expect(isValidLatLng(null)).toBe(false);
      expect(isValidLatLng({ lat: NaN, lng: 35 })).toBe(false);
      expect(isValidLatLng({ lat: 32, lng: Infinity })).toBe(false);
      expect(isValidLatLng({ lat: 95, lng: 35 })).toBe(false);
      expect(isValidLatLng({ lat: 32, lng: 190 })).toBe(false);
    });

    it('detects inverted coordinates across all 6 markets without silent mutation', () => {
      markets.forEach((m) => {
        // Swap lat and lng of a typical coordinate in that market
        let sampleCoords: LatLng;
        if (m === 'JO') sampleCoords = { lat: 31.95, lng: 35.91 };
        else if (m === 'SA') sampleCoords = { lat: 24.71, lng: 46.67 };
        else if (m === 'PS') sampleCoords = { lat: 31.90, lng: 35.20 };
        else if (m === 'LB') sampleCoords = { lat: 33.89, lng: 35.50 };
        else if (m === 'SY') sampleCoords = { lat: 33.51, lng: 36.27 };
        else sampleCoords = { lat: 29.37, lng: 47.97 };

        const invertedCoords: LatLng = { lat: sampleCoords.lng, lng: sampleCoords.lat };
        const check = checkMarketBoundary(m, invertedCoords);
        expect(check.status).toBe('invalid');
      });
    });
  });

  describe('D. Provider Validation & Metadata Edge Cases', () => {
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

      const missingRes = isProviderCountryMatching('SA', {
        provider: 'nominatim',
        address: { city: 'Riyadh' },
      });
      expect(missingRes.matches).toBe(false);
      expect(missingRes.isVerified).toBe(false);
      expect(missingRes.hasMetadata).toBe(false);
    });
  });

  describe('F. Fallback Safety & Manual Selection Invariants', () => {
    it('ensures fallback capital always requires manual selection and is never high-confidence GPS', () => {
      const res = resolveGeoLocation({
        targetMarket: 'KW',
        coordinates: { lat: 50.0, lng: 10.0 }, // Far outside
      });
      expect(res.needsManualSelection).toBe(true);
      expect(res.resolutionSource).toBe('manual');
      expect(res.confidence).toBe('unresolved');
    });
  });
});
