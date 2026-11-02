// RULE-14-EXCEPTION
/**
 * WGS-84 Ellipsoid Geodesic Distance Computations
 * Semi-major axis a = 6378137.0 m, flattening f = 1 / 298.257223563
 */
export const WGS84_A = 6378137.0;
export const WGS84_B = 6356752.31424518;
export const WGS84_F = 1 / 298.257223563;

import type { LatLng } from './geo.types';

export interface GeoPolygon {
  readonly exterior: readonly LatLng[];
  readonly holes?: readonly (readonly LatLng[])[];
}

export type GeoMultiPolygon = readonly (GeoPolygon | readonly LatLng[])[];

export function isGeoPolygon(obj: GeoPolygon | readonly LatLng[]): obj is GeoPolygon {
  return typeof obj === 'object' && obj !== null && 'exterior' in obj && Array.isArray(obj.exterior);
}

/**
 * Calculates geodesic distance between two points on the WGS-84 ellipsoid using
 * Vincenty's inverse formula. Falls back to Lambert's formula if non-convergent.
 */
export function wgs84DistanceMeters(p1: LatLng, p2: LatLng): number {
  if (p1.lat === p2.lat && p1.lng === p2.lng) return 0;

  const toRad = Math.PI / 180;
  const phi1 = p1.lat * toRad;
  const phi2 = p2.lat * toRad;
  const L = (p2.lng - p1.lng) * toRad;

  const U1 = Math.atan((1 - WGS84_F) * Math.tan(phi1));
  const U2 = Math.atan((1 - WGS84_F) * Math.tan(phi2));
  const sinU1 = Math.sin(U1);
  const cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2);
  const cosU2 = Math.cos(U2);

  let lambda = L;
  let lambdaP = 2 * Math.PI;
  let iter = 20;

  let sigma = 0;
  let sinSigma = 0;
  let cosSigma = 0;
  let cosSqAlpha = 0;
  let cos2SigmaM = 0;

  while (Math.abs(lambda - lambdaP) > 1e-12 && --iter > 0) {
    const sinLambda = Math.sin(lambda);
    const cosLambda = Math.cos(lambda);
    sinSigma = Math.sqrt(
      (cosU2 * sinLambda) * (cosU2 * sinLambda) +
      (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda)
    );
    if (sinSigma === 0) return 0;

    cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
    sigma = Math.atan2(sinSigma, cosSigma);
    const sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
    cosSqAlpha = 1 - sinAlpha * sinAlpha;
    cos2SigmaM = cosSqAlpha !== 0 ? cosSigma - (2 * sinU1 * sinU2) / cosSqAlpha : 0;

    const C = (WGS84_F / 16) * cosSqAlpha * (4 + WGS84_F * (4 - 3 * cosSqAlpha));
    lambdaP = lambda;
    lambda = L + (1 - C) * WGS84_F * sinAlpha *
      (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
  }

  if (iter === 0) {
    const beta1 = Math.atan((1 - WGS84_F) * Math.tan(phi1));
    const beta2 = Math.atan((1 - WGS84_F) * Math.tan(phi2));
    const P = (beta1 + beta2) / 2;
    const Q = (beta2 - beta1) / 2;
    const cosD = Math.sin(beta1) * Math.sin(beta2) + Math.cos(beta1) * Math.cos(beta2) * Math.cos(L);
    const d = Math.acos(Math.max(-1, Math.min(1, cosD)));
    const sinD = Math.sin(d);
    if (sinD === 0) return 0;
    const X = (d - sinD) * (Math.sin(P) * Math.cos(Q) / Math.cos(d / 2)) ** 2;
    const Y = (d + sinD) * (Math.cos(P) * Math.sin(Q) / Math.sin(d / 2)) ** 2;
    return WGS84_A * (d - (WGS84_F / 2) * (X + Y));
  }

  const uSq = (cosSqAlpha * (WGS84_A * WGS84_A - WGS84_B * WGS84_B)) / (WGS84_B * WGS84_B);
  const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  const deltaSigma = B * sinSigma * (cos2SigmaM + (B / 4) * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
    (B / 6) * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));

  return WGS84_B * A * (sigma - deltaSigma);
}

/**
 * Calculates initial bearing (forward azimuth) from point a to point b on the ellipsoid.
 */
export function initialBearingRadians(a: LatLng, b: LatLng): number {
  const toRad = Math.PI / 180;
  const phi1 = a.lat * toRad;
  const phi2 = b.lat * toRad;
  const dL = (b.lng - a.lng) * toRad;

  const y = Math.sin(dL) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dL);
  return (Math.atan2(y, x) + 2 * Math.PI) % (2 * Math.PI);
}

/**
 * Calculates direct geodesic destination point on sphere/ellipsoid approximation
 * given starting point, distance s (meters), and initial azimuth alpha (radians).
 */
export function directGeodesicPoint(start: LatLng, distMeters: number, azimuthRad: number): LatLng {
  const toRad = Math.PI / 180;
  const toDeg = 180 / Math.PI;
  const phi1 = start.lat * toRad;
  const lam1 = start.lng * toRad;
  const delta = distMeters / WGS84_A;

  const sinPhi2 = Math.sin(phi1) * Math.cos(delta) + Math.cos(phi1) * Math.sin(delta) * Math.cos(azimuthRad);
  const phi2 = Math.asin(Math.max(-1, Math.min(1, sinPhi2)));
  const y = Math.sin(azimuthRad) * Math.sin(delta) * Math.cos(phi1);
  const x = Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2);
  const lam2 = lam1 + Math.atan2(y, x);

  return {
    lat: phi2 * toDeg,
    lng: ((lam2 * toDeg + 540) % 360) - 180,
  };
}

/**
 * Shortest geodesic distance from point p to geodesic segment [a, b] on WGS-84.
 * Computes spherical cross-track and along-track projection, projects onto the geodesic path,
 * and refines via Vincenty WGS-84 ellipsoidal distance to prevent planar distortion.
 */
export function geodesicDistanceToSegmentMeters(p: LatLng, a: LatLng, b: LatLng): number {
  const dAB = wgs84DistanceMeters(a, b);
  if (dAB < 1e-4) return wgs84DistanceMeters(p, a);

  const dAP = wgs84DistanceMeters(a, p);
  const dBP = wgs84DistanceMeters(b, p);

  const delta13 = dAP / WGS84_A;
  const theta13 = initialBearingRadians(a, p);
  const theta12 = initialBearingRadians(a, b);

  // Cross-track distance
  const dXt = Math.asin(Math.max(-1, Math.min(1, Math.sin(delta13) * Math.sin(theta13 - theta12)))) * WGS84_A;

  // Along-track distance from a towards b
  const cosAt = Math.cos(delta13) / Math.cos(dXt / WGS84_A);
  const dAt = Math.acos(Math.max(-1, Math.min(1, cosAt))) * WGS84_A;

  // Determine if projection falls within [a, b] segment
  const bearingDiff = Math.cos(theta13 - theta12);
  if (bearingDiff < 0 || dAt <= 0) {
    return dAP;
  }
  if (dAt >= dAB) {
    return dBP;
  }

  // Projection point along geodesic path from a towards b
  const projPoint = directGeodesicPoint(a, dAt, theta12);
  const distToProj = wgs84DistanceMeters(p, projPoint);

  return Math.min(dAP, dBP, distToProj);
}

export function distanceToSegmentMeters(p: LatLng, a: LatLng, b: LatLng): number {
  return geodesicDistanceToSegmentMeters(p, a, b);
}

export function distanceToPolygonBoundaryMeters(point: LatLng, ring: readonly LatLng[]): number {
  if (!ring || ring.length === 0) return Infinity;
  let minDistance = Infinity;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const d = geodesicDistanceToSegmentMeters(point, ring[i], ring[j]);
    if (d < minDistance) minDistance = d;
  }
  return minDistance;
}

export function isPointInPolygonRing(point: LatLng, ring: readonly LatLng[]): boolean {
  if (!ring || ring.length < 3) return false;
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

export function isPointInGeoPolygon(
  point: LatLng,
  polygon: GeoPolygon | readonly LatLng[]
): { isInside: boolean; boundaryDistanceMeters: number } {
  const exterior = isGeoPolygon(polygon) ? polygon.exterior : polygon;
  const holes = isGeoPolygon(polygon) ? polygon.holes : undefined;

  const inExterior = isPointInPolygonRing(point, exterior);
  let minBoundaryDist = distanceToPolygonBoundaryMeters(point, exterior);

  let inAnyHole = false;
  if (holes && holes.length > 0) {
    for (const hole of holes) {
      if (isPointInPolygonRing(point, hole)) {
        inAnyHole = true;
      }
      const holeDist = distanceToPolygonBoundaryMeters(point, hole);
      if (holeDist < minBoundaryDist) {
        minBoundaryDist = holeDist;
      }
    }
  }

  const isInside = inExterior && !inAnyHole;
  return { isInside, boundaryDistanceMeters: minBoundaryDist };
}

export function isPointInMultiPolygon(
  point: LatLng,
  multiPolygon: GeoMultiPolygon
): { isInside: boolean; boundaryDistanceMeters: number } {
  let isInsideAny = false;
  let minBoundaryDist = Infinity;

  for (const poly of multiPolygon) {
    const res = isPointInGeoPolygon(point, poly);
    if (res.isInside) isInsideAny = true;
    if (res.boundaryDistanceMeters < minBoundaryDist) {
      minBoundaryDist = res.boundaryDistanceMeters;
    }
  }

  return { isInside: isInsideAny, boundaryDistanceMeters: minBoundaryDist };
}
