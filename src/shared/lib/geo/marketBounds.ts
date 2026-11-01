import type { MarketBounds, MarketCode, LatLng } from './geo.types';
import { MARKET_MULTIPOLYGONS, isPointInMultiPolygon, BOUNDARY_UNCERTAINTY_METERS } from './marketPolygons';

export const MARKET_BOUNDS: Record<MarketCode, MarketBounds> = {
  JO: { minLat: 29.18, maxLat: 33.38, minLng: 34.88, maxLng: 39.31 },
  SA: { minLat: 16.38, maxLat: 32.16, minLng: 34.50, maxLng: 55.67 },
  PS: { minLat: 31.20, maxLat: 32.55, minLng: 34.20, maxLng: 35.58 },
  LB: { minLat: 33.05, maxLat: 34.69, minLng: 35.10, maxLng: 36.62 },
  SY: { minLat: 32.31, maxLat: 37.32, minLng: 35.62, maxLng: 42.38 },
  KW: { minLat: 28.52, maxLat: 30.10, minLng: 46.55, maxLng: 48.43 },
};

export interface BoundaryCheckResult {
  readonly isInside: boolean;
  readonly isAmbiguousBuffer: boolean;
  readonly boundaryDistanceMeters: number;
}

export function checkMarketBoundary(market: MarketCode, coords: LatLng): BoundaryCheckResult {
  // Input sanity: detect inversion or out-of-range coords
  if (coords.lat > 90 || coords.lat < -90 || coords.lng > 180 || coords.lng < -180) {
    return { isInside: false, isAmbiguousBuffer: false, boundaryDistanceMeters: Infinity };
  }
  if (coords.lat > 40 && coords.lng < 35) {
    return { isInside: false, isAmbiguousBuffer: false, boundaryDistanceMeters: Infinity };
  }

  const b = MARKET_BOUNDS[market];
  if (!b) return { isInside: false, isAmbiguousBuffer: false, boundaryDistanceMeters: Infinity };

  // Coarse prefilter
  if (
    coords.lat < b.minLat ||
    coords.lat > b.maxLat ||
    coords.lng < b.minLng ||
    coords.lng > b.maxLng
  ) {
    return { isInside: false, isAmbiguousBuffer: false, boundaryDistanceMeters: Infinity };
  }

  const multiPoly = MARKET_MULTIPOLYGONS[market];
  if (!multiPoly) {
    return { isInside: true, isAmbiguousBuffer: false, boundaryDistanceMeters: Infinity };
  }

  const { isInside, boundaryDistanceMeters } = isPointInMultiPolygon(coords, multiPoly);
  // Real 2 km geodesic uncertainty calculation
  const isAmbiguousBuffer = boundaryDistanceMeters <= BOUNDARY_UNCERTAINTY_METERS;

  return { isInside, isAmbiguousBuffer, boundaryDistanceMeters };
}

export function isWithinMarketBounds(market: MarketCode, coords: LatLng): boolean {
  const result = checkMarketBoundary(market, coords);
  // Must be inside and not in ambiguous disputed boundary buffer
  return result.isInside && !result.isAmbiguousBuffer;
}

export function detectMarketFromCoords(coords: LatLng): MarketCode | null {
  const markets: MarketCode[] = ['PS', 'LB', 'KW', 'JO', 'SY', 'SA'];
  for (const m of markets) {
    if (isWithinMarketBounds(m, coords)) {
      return m;
    }
  }
  return null;
}
