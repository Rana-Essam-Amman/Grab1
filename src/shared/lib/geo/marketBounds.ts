import type { MarketBounds, MarketCode, LatLng } from './geo.types';
import { MARKET_POLYGONS, isPointInPolygon } from './marketPolygons';

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
 * Employs polygon containment and strict boundary discrimination to resolve
 * geographic overlap zones (e.g. Jordan River / Dead Sea between PS & JO,
 * and Anti-Lebanon mountain range between LB & SY).
 */
export function isWithinMarketBounds(market: MarketCode, coords: LatLng): boolean {
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
    // Palestine West Bank & Gaza lies west of 35.55°E in the 31.2-32.55°N latitude band
    if (coords.lat >= 31.20 && coords.lat <= 32.55 && coords.lng < 35.53) {
      return false;
    }
  }

  if (market === 'PS') {
    // Jordan lies east of 35.55°E
    if (coords.lng > 35.55) {
      return false;
    }
  }

  // Check LB vs SY along the Anti-Lebanon / Beqaa border line
  if (market === 'LB') {
    // Damascus and Syrian Anti-Lebanon lie east of 36.05°E in 33.2-34.1°N band
    if (coords.lat >= 33.20 && coords.lat <= 34.10 && coords.lng > 36.05) {
      return false;
    }
  }

  if (market === 'SY') {
    // Lebanese territory lies west of 36.00°E in the central latitude band
    if (coords.lat >= 33.30 && coords.lat <= 34.40 && coords.lng < 35.95) {
      return false;
    }
  }

  const polygon = MARKET_POLYGONS[market];
  if (polygon) {
    return isPointInPolygon(coords, polygon);
  }

  return true;
}

export function detectMarketFromCoords(coords: LatLng): MarketCode | null {
  // Check in strict priority order with overlap protection
  const markets: MarketCode[] = ['PS', 'LB', 'KW', 'JO', 'SY', 'SA'];
  for (const m of markets) {
    if (isWithinMarketBounds(m, coords)) {
      return m;
    }
  }
  return null;
}
