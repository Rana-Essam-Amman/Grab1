import { reverseGeocode } from '../helpers/reverseGeocode';
import { resolveGeoLocation, CanonicalLocation, MarketCode } from '@/shared/lib/geo';
import { findNearestCity, GeoMatch } from '../helpers/geoMatch';

export interface LocationResolutionResult {
  readonly canonicalLocation: CanonicalLocation | null;
  readonly candidates: readonly string[];
  readonly match: GeoMatch | null;
  readonly error: string | null;
}

export async function processLocationCoords(
  latitude: number,
  longitude: number,
  preferredCountry: string,
  isArabic: boolean
): Promise<LocationResolutionResult> {
  const rv = await reverseGeocode(latitude, longitude, isArabic);
  const targetMarket = preferredCountry.toUpperCase() as MarketCode;

  const resolved = resolveGeoLocation({
    targetMarket,
    coordinates: { lat: latitude, lng: longitude },
    externalResult: {
      provider: 'nominatim',
      lat: latitude,
      lng: longitude,
      address: rv.rawAddress,
    },
    isArabic,
  });

  if (resolved.needsManualSelection) {
    return {
      canonicalLocation: resolved,
      candidates: rv.candidates,
      match: null,
      error: 'Location outside supported boundaries or unresolved',
    };
  }

  const found = findNearestCity(latitude, longitude, preferredCountry);
  return {
    canonicalLocation: resolved,
    candidates: rv.candidates,
    match: found,
    error: null,
  };
}
