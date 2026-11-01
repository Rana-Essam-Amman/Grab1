import type { MarketBounds, MarketCode, LatLng } from './geo.types';

export const MARKET_BOUNDS: Record<MarketCode, MarketBounds> = {
  JO: { minLat: 29.18, maxLat: 33.38, minLng: 34.88, maxLng: 39.31 },
  SA: { minLat: 16.38, maxLat: 32.16, minLng: 34.50, maxLng: 55.67 },
  PS: { minLat: 31.20, maxLat: 32.55, minLng: 34.20, maxLng: 35.58 },
  LB: { minLat: 33.05, maxLat: 34.69, minLng: 35.10, maxLng: 36.62 },
  SY: { minLat: 32.31, maxLat: 37.32, minLng: 35.62, maxLng: 42.38 },
  KW: { minLat: 28.52, maxLat: 30.10, minLng: 46.55, maxLng: 48.43 },
};

export function isWithinMarketBounds(market: MarketCode, coords: LatLng): boolean {
  const b = MARKET_BOUNDS[market];
  if (!b) return false;
  return (
    coords.lat >= b.minLat &&
    coords.lat <= b.maxLat &&
    coords.lng >= b.minLng &&
    coords.lng <= b.maxLng
  );
}

export function detectMarketFromCoords(coords: LatLng): MarketCode | null {
  for (const [m, b] of Object.entries(MARKET_BOUNDS) as [MarketCode, MarketBounds][]) {
    if (
      coords.lat >= b.minLat &&
      coords.lat <= b.maxLat &&
      coords.lng >= b.minLng &&
      coords.lng <= b.maxLng
    ) {
      return m;
    }
  }
  return null;
}
