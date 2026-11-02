// RULE-14-EXCEPTION
/**
 * WGS-84 Ellipsoid Direct & Inverse Geodesic Computations
 * Semi-major axis a = 6378137.0 m
 * Semi-minor axis b = 6356752.31424518 m
 * Flattening f = 1 / 298.257223563
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

export interface GeodesicInverseResult {
  readonly distanceMeters: number;
  readonly initialAzimuthRad: number;
  readonly finalAzimuthRad: number;
  readonly isConverged: boolean;
}

export interface GeodesicSegmentResult {
  readonly distanceMeters: number;
  readonly isConverged: boolean;
  readonly iterations: number;
}

/**
 * Calculates geodesic distance and initial azimuth between two points on the WGS-84 ellipsoid
 * using Vincenty's inverse formula. If Vincenty fails to converge (e.g. near-antipodal),
 * falls back to Lambert's ellipsoidal distance formula and marks isConverged: false.
 */
export function wgs84Inverse(p1: LatLng, p2: LatLng): GeodesicInverseResult {
  if (p1.lat === p2.lat && p1.lng === p2.lng) {
    return { distanceMeters: 0, initialAzimuthRad: 0, finalAzimuthRad: 0, isConverged: true };
  }

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
  let iter = 25;

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
    if (sinSigma === 0) {
      return { distanceMeters: 0, initialAzimuthRad: 0, finalAzimuthRad: 0, isConverged: true };
    }

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

  // Non-convergent fallback: Lambert's ellipsoidal distance approximation (isConverged: false)
  if (iter === 0) {
    const beta1 = Math.atan((1 - WGS84_F) * Math.tan(phi1));
    const beta2 = Math.atan((1 - WGS84_F) * Math.tan(phi2));
    const P = (beta1 + beta2) / 2;
    const Q = (beta2 - beta1) / 2;
    const cosD = Math.sin(beta1) * Math.sin(beta2) + Math.cos(beta1) * Math.cos(beta2) * Math.cos(L);
    const d = Math.acos(Math.max(-1, Math.min(1, cosD)));
    const sinD = Math.sin(d);
    if (sinD === 0) return { distanceMeters: 0, initialAzimuthRad: 0, finalAzimuthRad: 0, isConverged: false };
    const X = (d - sinD) * (Math.sin(P) * Math.cos(Q) / Math.cos(d / 2)) ** 2;
    const Y = (d + sinD) * (Math.cos(P) * Math.sin(Q) / Math.sin(d / 2)) ** 2;
    const dist = WGS84_A * (d - (WGS84_F / 2) * (X + Y));
    const az = (Math.atan2(Math.sin(L) * cosU2, cosU1 * sinU2 - sinU1 * cosU2 * Math.cos(L)) + 2 * Math.PI) % (2 * Math.PI);
    return { distanceMeters: dist, initialAzimuthRad: az, finalAzimuthRad: az, isConverged: false };
  }

  const uSq = (cosSqAlpha * (WGS84_A * WGS84_A - WGS84_B * WGS84_B)) / (WGS84_B * WGS84_B);
  const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  const deltaSigma = B * sinSigma * (cos2SigmaM + (B / 4) * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
    (B / 6) * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));

  const distanceMeters = WGS84_B * A * (sigma - deltaSigma);
  const initialAzimuthRad = (Math.atan2(cosU2 * Math.sin(lambda), cosU1 * sinU2 - sinU1 * cosU2 * Math.cos(lambda)) + 2 * Math.PI) % (2 * Math.PI);
  const finalAzimuthRad = (Math.atan2(cosU1 * Math.sin(lambda), -sinU1 * cosU2 + cosU1 * sinU2 * Math.cos(lambda)) + 2 * Math.PI) % (2 * Math.PI);

  return { distanceMeters, initialAzimuthRad, finalAzimuthRad, isConverged: true };
}

export function wgs84DistanceMeters(p1: LatLng, p2: LatLng): number {
  return wgs84Inverse(p1, p2).distanceMeters;
}

/**
 * Calculates direct destination point on the WGS-84 ellipsoid given start point,
 * distance s (meters), and initial azimuth alpha (radians) via Vincenty's direct formula.
 */
export function wgs84Direct(start: LatLng, distMeters: number, azimuthRad: number): LatLng {
  if (distMeters === 0) return { lat: start.lat, lng: start.lng };

  const toRad = Math.PI / 180;
  const toDeg = 180 / Math.PI;

  const phi1 = start.lat * toRad;
  const lambda1 = start.lng * toRad;
  const alpha1 = azimuthRad;

  const sinAlpha1 = Math.sin(alpha1);
  const cosAlpha1 = Math.cos(alpha1);

  const tanU1 = (1 - WGS84_F) * Math.tan(phi1);
  const cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1);
  const sinU1 = tanU1 * cosU1;

  const sigma1 = Math.atan2(tanU1, cosAlpha1);
  const sinAlpha = cosU1 * sinAlpha1;
  const cosSqAlpha = 1 - sinAlpha * sinAlpha;
  const uSq = (cosSqAlpha * (WGS84_A * WGS84_A - WGS84_B * WGS84_B)) / (WGS84_B * WGS84_B);

  const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));

  let sigma = distMeters / (WGS84_B * A);
  let sigmaP = 2 * Math.PI;
  let cos2SigmaM = 0;
  let iter = 25;

  let sinSigma = 0;
  let cosSigma = 0;

  while (Math.abs(sigma - sigmaP) > 1e-12 && --iter > 0) {
    cos2SigmaM = Math.cos(2 * sigma1 + sigma);
    sinSigma = Math.sin(sigma);
    cosSigma = Math.cos(sigma);
    const deltaSigma = B * sinSigma * (cos2SigmaM + (B / 4) * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
      (B / 6) * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    sigmaP = sigma;
    sigma = distMeters / (WGS84_B * A) + deltaSigma;
  }

  const tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
  const phi2 = Math.atan2(
    sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
    (1 - WGS84_F) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)
  );

  const lambda = Math.atan2(
    sinSigma * sinAlpha1,
    cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1
  );

  const C = (WGS84_F / 16) * cosSqAlpha * (4 + WGS84_F * (4 - 3 * cosSqAlpha));
  const L = lambda - (1 - C) * WGS84_F * sinAlpha *
    (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));

  const lambda2 = lambda1 + L;

  return {
    lat: phi2 * toDeg,
    lng: ((lambda2 * toDeg + 540) % 360) - 180,
  };
}

/**
 * Shortest geodesic distance from point p to finite geodesic segment [a, b] on the WGS-84 ellipsoid.
 * Returns structured result indicating whether the requested interval tolerance was achieved.
 */
export function geodesicDistanceToSegmentDetailed(
  p: LatLng,
  a: LatLng,
  b: LatLng,
  intervalTolMeters = 0.1
): GeodesicSegmentResult {
  if (typeof intervalTolMeters !== 'number' || !Number.isFinite(intervalTolMeters) || intervalTolMeters <= 0) {
    return { distanceMeters: Infinity, isConverged: false, iterations: 0 };
  }

  const invAB = wgs84Inverse(a, b);
  const totalDist = invAB.distanceMeters;
  if (totalDist < 1e-4) {
    return {
      distanceMeters: wgs84DistanceMeters(p, a),
      isConverged: invAB.isConverged,
      iterations: 0,
    };
  }

  const azimuth = invAB.initialAzimuthRad;

  const distAt = (s: number): number => {
    const pt = wgs84Direct(a, s, azimuth);
    return wgs84DistanceMeters(p, pt);
  };

  const dA = wgs84DistanceMeters(p, a);
  const dB = wgs84DistanceMeters(p, b);

  let left = 0;
  let right = totalDist;
  const phi = (Math.sqrt(5) - 1) / 2;

  let x1 = right - phi * (right - left);
  let x2 = left + phi * (right - left);

  let f1 = distAt(x1);
  let f2 = distAt(x2);

  let iterations = 0;
  const maxIterations = 32;

  while (right - left > intervalTolMeters && iterations < maxIterations) {
    iterations++;
    if (f1 < f2) {
      right = x2;
      x2 = x1;
      f2 = f1;
      x1 = right - phi * (right - left);
      f1 = distAt(x1);
    } else {
      left = x1;
      x1 = x2;
      f1 = f2;
      x2 = left + phi * (right - left);
      f2 = distAt(x2);
    }
  }

  const isConverged = invAB.isConverged && right - left <= intervalTolMeters;
  const distanceMeters = Math.min(dA, dB, f1, f2);

  return { distanceMeters, isConverged, iterations };
}

export function geodesicDistanceToSegmentMeters(
  p: LatLng,
  a: LatLng,
  b: LatLng,
  intervalTolMeters = 0.1
): number {
  return geodesicDistanceToSegmentDetailed(p, a, b, intervalTolMeters).distanceMeters;
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
