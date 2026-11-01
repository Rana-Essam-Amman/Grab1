import type { LatLng, MarketCode } from './geo.types';

export function isPointInPolygonRing(point: LatLng, ring: readonly LatLng[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i].lng;
    const yi = ring[i].lat;
    const xj = ring[j].lng;
    const yj = ring[j].lat;

    const intersect =
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function isPointInMultiPolygon(point: LatLng, multiPolygon: readonly (readonly LatLng[])[]): boolean {
  for (const ring of multiPolygon) {
    if (isPointInPolygonRing(point, ring)) {
      return true;
    }
  }
  return false;
}

/**
 * Approximate territorial routing geometry (MultiPolygon).
 * Note: These coordinates are generalized approximation polygons designed solely
 * for coarse client-side market routing and reverse-geocode isolation.
 * They do not constitute official, legal, or definitive national borders.
 */
export const MARKET_MULTIPOLYGONS: Record<MarketCode, readonly (readonly LatLng[])[]> = {
  PS: [
    // Component 1: Gaza Strip
    [
      { lat: 31.20, lng: 34.20 },
      { lat: 31.33, lng: 34.23 },
      { lat: 31.60, lng: 34.57 },
      { lat: 31.52, lng: 34.55 },
    ],
    // Component 2: West Bank
    [
      { lat: 31.35, lng: 34.90 },
      { lat: 31.30, lng: 35.38 },
      { lat: 31.75, lng: 35.50 },
      { lat: 32.05, lng: 35.53 },
      { lat: 32.40, lng: 35.55 },
      { lat: 32.55, lng: 35.30 },
      { lat: 32.40, lng: 35.00 },
      { lat: 31.95, lng: 34.95 },
      { lat: 31.60, lng: 34.95 },
    ],
  ],
  JO: [
    [
      { lat: 29.18, lng: 34.95 },
      { lat: 30.50, lng: 35.20 },
      { lat: 31.30, lng: 35.50 },
      { lat: 32.05, lng: 35.57 },
      { lat: 32.40, lng: 35.58 },
      { lat: 32.70, lng: 35.80 },
      { lat: 32.60, lng: 36.15 },
      { lat: 32.35, lng: 36.80 },
      { lat: 32.20, lng: 39.31 },
      { lat: 31.50, lng: 37.50 },
      { lat: 29.50, lng: 37.00 },
    ],
  ],
  LB: [
    [
      { lat: 33.05, lng: 35.10 },
      { lat: 33.25, lng: 35.40 },
      { lat: 33.30, lng: 35.65 },
      { lat: 33.55, lng: 35.85 },
      { lat: 33.85, lng: 36.00 },
      { lat: 34.25, lng: 36.35 },
      { lat: 34.50, lng: 36.45 },
      { lat: 34.65, lng: 36.15 },
      { lat: 34.45, lng: 35.80 },
      { lat: 33.90, lng: 35.48 },
      { lat: 33.55, lng: 35.35 },
      { lat: 33.27, lng: 35.18 },
    ],
  ],
  SY: [
    [
      { lat: 32.31, lng: 35.80 },
      { lat: 32.60, lng: 35.90 },
      { lat: 33.30, lng: 35.95 },
      { lat: 33.57, lng: 36.00 },
      { lat: 33.85, lng: 36.05 },
      { lat: 34.30, lng: 36.40 },
      { lat: 34.65, lng: 36.10 },
      { lat: 35.00, lng: 35.80 },
      { lat: 35.90, lng: 35.80 },
      { lat: 36.70, lng: 37.00 },
      { lat: 37.32, lng: 42.20 },
      { lat: 35.00, lng: 41.50 },
      { lat: 32.80, lng: 37.50 },
    ],
  ],
  KW: [
    [
      { lat: 28.52, lng: 47.70 },
      { lat: 28.90, lng: 48.35 },
      { lat: 29.40, lng: 48.25 },
      { lat: 30.10, lng: 48.00 },
      { lat: 30.10, lng: 46.70 },
      { lat: 29.20, lng: 46.55 },
    ],
  ],
  SA: [
    [
      { lat: 16.38, lng: 42.50 },
      { lat: 21.50, lng: 39.10 },
      { lat: 28.30, lng: 34.80 },
      { lat: 32.16, lng: 39.00 },
      { lat: 31.00, lng: 42.00 },
      { lat: 28.50, lng: 46.50 },
      { lat: 27.00, lng: 49.60 },
      { lat: 26.20, lng: 50.20 },
      { lat: 24.00, lng: 51.50 },
      { lat: 19.00, lng: 55.00 },
      { lat: 17.50, lng: 44.20 },
    ],
  ],
};
