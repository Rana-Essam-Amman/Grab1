import { CITY_COORDS } from '@/data/locations/coords';

export interface GeoMatch {
  readonly country: string;
  readonly city: string;
  readonly lat: number;
  readonly lng: number;
  readonly distanceKm: number;
}

const MAX_DISTANCE_KM = 100;

export function haversineKm(
  lat1: number, lng1: number, lat2: number, lng2: number
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function findNearestCity(
  lat: number,
  lng: number,
  preferredCountry?: string
): GeoMatch | null {
  const countries = preferredCountry
    ? [preferredCountry, ...Object.keys(CITY_COORDS).filter((c) => c !== preferredCountry)]
    : Object.keys(CITY_COORDS);

  let best: GeoMatch | null = null;
  for (const country of countries) {
    const cities = CITY_COORDS[country];
    if (!cities) continue;
    for (const city of Object.keys(cities)) {
      const c = cities[city];
      const d = haversineKm(lat, lng, c.lat, c.lng);
      if (!best || d < best.distanceKm) {
        best = { country, city, lat: c.lat, lng: c.lng, distanceKm: d };
      }
    }
  }

  if (!best || best.distanceKm > MAX_DISTANCE_KM) return null;
  return best;
}
