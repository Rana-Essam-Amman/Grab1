// RULE-14-EXCEPTION
import type { LatLng, MarketCode } from './geo.types';
import type { GeoMultiPolygon } from './polygonGeometry';

export {
  isPointInPolygonRing,
  isPointInGeoPolygon,
  isPointInMultiPolygon,
  geodesicDistanceToSegmentMeters,
  wgs84DistanceMeters,
} from './polygonGeometry';
export type { GeoPolygon, GeoMultiPolygon } from './polygonGeometry';

export const BOUNDARY_UNCERTAINTY_METERS = 2000;

/**
 * Authoritative boundaries defined as GeoMultiPolygon structures
 * Supporting exterior rings and interior hole exclusion per GeoJSON topology.
 */
export const MARKET_MULTIPOLYGONS: Record<MarketCode, GeoMultiPolygon> = {
  PS: [
    // Component 1: Gaza Strip
    {
      exterior: [
        { lat: 31.15, lng: 34.15 }, { lat: 31.35, lng: 34.18 },
        { lat: 31.62, lng: 34.58 }, { lat: 31.50, lng: 34.60 },
      ],
      holes: [],
    },
    // Component 2: West Bank
    {
      exterior: [
        { lat: 31.35, lng: 34.90 }, { lat: 31.30, lng: 35.38 },
        { lat: 31.75, lng: 35.50 }, { lat: 32.05, lng: 35.53 },
        { lat: 32.40, lng: 35.55 }, { lat: 32.55, lng: 35.30 },
        { lat: 32.40, lng: 35.00 }, { lat: 31.95, lng: 34.95 },
        { lat: 31.60, lng: 34.95 },
      ],
      holes: [],
    },
  ],
  JO: [
    {
      exterior: [
        { lat: 29.18, lng: 34.95 }, { lat: 30.50, lng: 35.20 },
        { lat: 31.30, lng: 35.50 }, { lat: 32.05, lng: 35.55 },
        { lat: 32.40, lng: 35.56 }, { lat: 32.70, lng: 35.80 },
        { lat: 32.60, lng: 36.15 }, { lat: 32.35, lng: 36.80 },
        { lat: 32.20, lng: 39.31 }, { lat: 31.50, lng: 37.50 },
        { lat: 29.50, lng: 37.00 },
      ],
      holes: [],
    },
  ],
  LB: [
    {
      exterior: [
        { lat: 33.05, lng: 35.10 }, { lat: 33.25, lng: 35.40 },
        { lat: 33.30, lng: 35.65 }, { lat: 33.55, lng: 35.85 },
        { lat: 33.85, lng: 36.00 }, { lat: 34.25, lng: 36.35 },
        { lat: 34.50, lng: 36.45 }, { lat: 34.65, lng: 36.15 },
        { lat: 34.45, lng: 35.80 }, { lat: 33.90, lng: 35.48 },
        { lat: 33.55, lng: 35.35 }, { lat: 33.27, lng: 35.18 },
      ],
      holes: [],
    },
  ],
  SY: [
    {
      exterior: [
        { lat: 32.31, lng: 35.80 }, { lat: 32.60, lng: 35.90 },
        { lat: 33.30, lng: 35.95 }, { lat: 33.57, lng: 36.00 },
        { lat: 33.85, lng: 36.05 }, { lat: 34.30, lng: 36.40 },
        { lat: 34.65, lng: 36.10 }, { lat: 35.00, lng: 35.80 },
        { lat: 35.90, lng: 35.80 }, { lat: 36.70, lng: 37.00 },
        { lat: 37.32, lng: 42.20 }, { lat: 35.00, lng: 41.50 },
        { lat: 32.80, lng: 37.50 },
      ],
      holes: [],
    },
  ],
  KW: [
    {
      exterior: [
        { lat: 28.52, lng: 47.70 }, { lat: 28.90, lng: 48.35 },
        { lat: 29.40, lng: 48.25 }, { lat: 30.10, lng: 48.00 },
        { lat: 30.10, lng: 46.70 }, { lat: 29.20, lng: 46.55 },
      ],
      holes: [],
    },
  ],
  SA: [
    {
      exterior: [
        { lat: 16.38, lng: 42.50 }, { lat: 21.50, lng: 39.10 },
        { lat: 28.30, lng: 34.80 }, { lat: 32.16, lng: 39.00 },
        { lat: 31.00, lng: 42.00 }, { lat: 28.50, lng: 46.50 },
        { lat: 27.00, lng: 49.60 }, { lat: 26.20, lng: 50.20 },
        { lat: 24.00, lng: 51.50 }, { lat: 19.00, lng: 55.00 },
        { lat: 17.50, lng: 44.20 },
      ],
      holes: [],
    },
  ],
};
