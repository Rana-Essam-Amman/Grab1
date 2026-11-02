import type { MarketBounds, MarketCode, LatLng } from './geo.types';
import {
  MARKET_MULTIPOLYGONS,
  isPointInMultiPolygon,
  BOUNDARY_UNCERTAINTY_METERS,
} from './marketPolygons';

export const MARKET_BOUNDS: Record<MarketCode, MarketBounds> = {
  JO: { minLat: 29.18, maxLat: 33.38, minLng: 34.88, maxLng: 39.31 },
  SA: { minLat: 16.38, maxLat: 32.16, minLng: 34.50, maxLng: 55.67 },
  PS: { minLat: 31.20, maxLat: 32.55, minLng: 34.20, maxLng: 35.58 },
  LB: { minLat: 33.05, maxLat: 34.69, minLng: 35.10, maxLng: 36.62 },
  SY: { minLat: 32.31, maxLat: 37.32, minLng: 35.62, maxLng: 42.38 },
  KW: { minLat: 28.52, maxLat: 30.10, minLng: 46.55, maxLng: 48.43 },
};

export type BoundaryStatus = 'inside' | 'outside' | 'ambiguous' | 'invalid';

export interface BoundaryCheckResult {
  readonly status: BoundaryStatus;
  readonly isInside: boolean;
  readonly isAmbiguousBuffer: boolean;
  readonly boundaryDistanceMeters: number;
}

export function isValidLatLng(coords?: LatLng | null): coords is LatLng {
  if (!coords || typeof coords !== 'object') return false;
  const { lat, lng } = coords;
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function isLikelyInvertedForMarket(market: MarketCode, coords: LatLng): boolean {
  if (!isValidLatLng(coords)) return false;
  const b = MARKET_BOUNDS[market];
  if (!b) return false;
  // Swapped lat & lng
  const swappedLat = coords.lng;
  const swappedLng = coords.lat;

  // If original coords are NOT in bounds, but swapped coords ARE in bounds:
  const originalIn = coords.lat >= b.minLat && coords.lat <= b.maxLat &&
                     coords.lng >= b.minLng && coords.lng <= b.maxLng;
  const swappedIn = swappedLat >= b.minLat && swappedLat <= b.maxLat &&
                    swappedLng >= b.minLng && swappedLng <= b.maxLng;

  return !originalIn && swappedIn;
}

export function checkMarketBoundary(market: MarketCode, coords: LatLng): BoundaryCheckResult {
  // 1. Rigorous coordinate sanity & inversion check
  if (!isValidLatLng(coords)) {
    return {
      status: 'invalid',
      isInside: false,
      isAmbiguousBuffer: false,
      boundaryDistanceMeters: Infinity,
    };
  }

  // Detect likely inversion for target market
  if (isLikelyInvertedForMarket(market, coords)) {
    return {
      status: 'invalid',
      isInside: false,
      isAmbiguousBuffer: false,
      boundaryDistanceMeters: Infinity,
    };
  }

  const b = MARKET_BOUNDS[market];
  if (!b) {
    return {
      status: 'invalid',
      isInside: false,
      isAmbiguousBuffer: false,
      boundaryDistanceMeters: Infinity,
    };
  }

  const multiPoly = MARKET_MULTIPOLYGONS[market];
  if (!multiPoly) {
    return {
      status: 'inside',
      isInside: true,
      isAmbiguousBuffer: false,
      boundaryDistanceMeters: Infinity,
    };
  }

  const { isInside, boundaryDistanceMeters } = isPointInMultiPolygon(coords, multiPoly);
  // Real 2,000 meter WGS84 geodesic boundary uncertainty policy
  const isAmbiguousBuffer = boundaryDistanceMeters <= BOUNDARY_UNCERTAINTY_METERS;

  let status: BoundaryStatus;
  if (isAmbiguousBuffer) {
    status = 'ambiguous';
  } else if (isInside) {
    status = 'inside';
  } else {
    status = 'outside';
  }

  return { status, isInside, isAmbiguousBuffer, boundaryDistanceMeters };
}

export function isWithinMarketBounds(market: MarketCode, coords: LatLng): boolean {
  const result = checkMarketBoundary(market, coords);
  // Must be strictly inside and not within the 2,000m ambiguous boundary buffer
  return result.status === 'inside';
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
