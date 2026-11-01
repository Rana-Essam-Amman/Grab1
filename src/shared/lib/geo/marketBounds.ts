import type { MarketBounds, MarketCode, LatLng } from './geo.types';
import { MARKET_MULTIPOLYGONS, isPointInMultiPolygon } from './marketPolygons';

export const MARKET_BOUNDS: Record<MarketCode, MarketBounds> = {
  JO: { minLat: 29.18, maxLat: 33.38, minLng: 34.88, maxLng: 39.31 },
  SA: { minLat: 16.38, maxLat: 32.16, minLng: 34.50, maxLng: 55.67 },
  PS: { minLat: 31.20, maxLat: 32.55, minLng: 34.20, maxLng: 35.58 },
  LB: { minLat: 33.05, maxLat: 34.69, minLng: 35.10, maxLng: 36.62 },
  SY: { minLat: 32.31, maxLat: 37.32, minLng: 35.62, maxLng: 42.38 },
  KW: { minLat: 28.52, maxLat: 30.10, minLng: 46.55, maxLng: 48.43 },
};

/**
 * Checks if coordinates are authoritatively inside the market.
 * Employs MultiPolygon containment and strict boundary discrimination to resolve
 * geographic overlap zones.
 */
export function isWithinMarketBounds(market: MarketCode, coords: LatLng): boolean {
  // Input sanity check: detect latitude/longitude inversion
  if (coords.lat > 90 || coords.lat < -90 || coords.lng > 180 || coords.lng < -180) {
    return false;
  }
  // Detect swapped lat/long for Middle East region (Middle East lats are ~16-37, lngs are ~34-56)
  if (coords.lat > 40 && coords.lng < 35) {
    return false; // Inverted coordinates
  }

  const b = MARKET_BOUNDS[market];
  if (!b) return false;

  // 1. Coarse prefilter
  if (
    coords.lat < b.minLat ||
    coords.lat > b.maxLat ||
    coords.lng < b.minLng ||
    coords.lng > b.maxLng
  ) {
    return false;
  }

  // 2. Authoritative overlap resolution
  // Check PS vs JO along the Jordan River / Dead Sea meridian
  if (market === 'JO') {
    if (coords.lat >= 31.20 && coords.lat <= 32.55 && coords.lng < 35.53) {
      return false;
    }
  }

  if (market === 'PS') {
    if (coords.lng > 35.55) {
      return false;
    }
  }

  // Check LB vs SY along the Anti-Lebanon / Beqaa border line
  if (market === 'LB') {
    if (coords.lat >= 33.20 && coords.lat <= 34.10 && coords.lng > 36.05) {
      return false;
    }
  }

  if (market === 'SY') {
    if (coords.lat >= 33.30 && coords.lat <= 34.40 && coords.lng < 35.95) {
      return false;
    }
  }

  const multiPoly = MARKET_MULTIPOLYGONS[market];
  if (multiPoly) {
    return isPointInMultiPolygon(coords, multiPoly);
  }

  return true;
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
