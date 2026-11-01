import type { LatLng } from './geo.types';

export function distanceToSegmentMeters(p: LatLng, a: LatLng, b: LatLng): number {
  const cosLat = Math.cos((a.lat * Math.PI) / 180);
  const bx = (b.lng - a.lng) * 111320 * cosLat;
  const by = (b.lat - a.lat) * 110540;
  const px = (p.lng - a.lng) * 111320 * cosLat;
  const py = (p.lat - a.lat) * 110540;

  const segLenSq = bx * bx + by * by;
  if (segLenSq === 0) return Math.hypot(px, py);

  const t = Math.max(0, Math.min(1, (px * bx + py * by) / segLenSq));
  const projX = t * bx;
  const projY = t * by;
  return Math.hypot(px - projX, py - projY);
}

export function distanceToPolygonBoundaryMeters(point: LatLng, ring: readonly LatLng[]): number {
  let minDistance = Infinity;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const d = distanceToSegmentMeters(point, ring[i], ring[j]);
    if (d < minDistance) minDistance = d;
  }
  return minDistance;
}

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

export function isPointInMultiPolygon(
  point: LatLng,
  multiPolygon: readonly (readonly LatLng[])[]
): { isInside: boolean; boundaryDistanceMeters: number } {
  let isInside = false;
  let minBoundaryDist = Infinity;

  for (const ring of multiPolygon) {
    if (isPointInPolygonRing(point, ring)) isInside = true;
    const dist = distanceToPolygonBoundaryMeters(point, ring);
    if (dist < minBoundaryDist) minBoundaryDist = dist;
  }

  return { isInside, boundaryDistanceMeters: minBoundaryDist };
}
