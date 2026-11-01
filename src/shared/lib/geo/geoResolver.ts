import { getGeoAdapter } from './adapters';
import { isWithinMarketBounds, detectMarketFromCoords } from './marketBounds';
import type {
  CanonicalLocation,
  ResolveGeoOptions,
  ProviderGeocodeResult,
  LatLng,
} from './geo.types';

function extractTokensFromProvider(providerResult: ProviderGeocodeResult): string[] {
  const tokens: string[] = [];
  const addr = providerResult.address;
  if (addr) {
    if (addr.village) tokens.push(String(addr.village));
    if (addr.hamlet) tokens.push(String(addr.hamlet));
    if (addr.neighbourhood) tokens.push(String(addr.neighbourhood));
    if (addr.suburb) tokens.push(String(addr.suburb));
    if (addr.quarter) tokens.push(String(addr.quarter));
    if (addr.district) tokens.push(String(addr.district));
    if (addr.town) tokens.push(String(addr.town));
    if (addr.city) tokens.push(String(addr.city));
    if (addr.county) tokens.push(String(addr.county));
    if (addr.state) tokens.push(String(addr.state));
    if (addr.province) tokens.push(String(addr.province));
    if (addr.formatted_address) {
      tokens.push(String(addr.formatted_address));
      tokens.push(...String(addr.formatted_address).split(/[,،]+/));
    }
  }
  if (providerResult.rawQuery) {
    tokens.push(providerResult.rawQuery);
    tokens.push(...providerResult.rawQuery.split(/[,،\s]+/));
  }
  return tokens.map((t) => t.trim()).filter(Boolean);
}

function buildFallback(
  options: ResolveGeoOptions,
  reason: 'out_of_bounds' | 'unresolved' | 'unsupported_country'
): CanonicalLocation {
  const adapter = getGeoAdapter(options.targetMarket);
  const capital = adapter.getDefaultCapital();
  return {
    countryCode: options.targetMarket,
    governorateSlug: capital.slug,
    governorateEn: capital.cityEn,
    governorateAr: capital.cityAr,
    districtSlug: null,
    districtEn: null,
    districtAr: null,
    neighborhoodSlug: null,
    neighborhoodEn: capital.neighborhoodEn,
    neighborhoodAr: capital.neighborhoodAr,
    site: options.textQuery || null,
    coordinates: options.coordinates || null,
    confidence: reason === 'out_of_bounds' ? 'unresolved' : 'fallback',
    resolutionSource: 'manual',
    needsManualSelection: true,
  };
}

export function resolveGeoLocation(options: ResolveGeoOptions): CanonicalLocation {
  const { targetMarket, coordinates, textQuery, externalResult } = options;
  const adapter = getGeoAdapter(targetMarket);

  let coords: LatLng | undefined = coordinates;
  if (!coords && externalResult?.lat && externalResult?.lng) {
    coords = { lat: externalResult.lat, lng: externalResult.lng };
  }

  // 1. Boundary & Cross-Market Validation
  if (coords) {
    if (!isWithinMarketBounds(targetMarket, coords)) {
      const detectedMarket = detectMarketFromCoords(coords);
      if (detectedMarket && detectedMarket !== targetMarket) {
        return buildFallback(options, 'out_of_bounds');
      }
      return buildFallback(options, 'out_of_bounds');
    }
  }

  // 2. Token gathering
  const candidateTokens: string[] = [];
  if (externalResult) {
    candidateTokens.push(...extractTokensFromProvider(externalResult));
  }
  if (textQuery) {
    candidateTokens.push(textQuery);
    candidateTokens.push(...textQuery.split(/[,،]+/));
    candidateTokens.push(...textQuery.split(/[,،\s]+/));
  }

  // 3. Hierarchy Matching via Target Market Adapter
  if (candidateTokens.length > 0) {
    const matched = adapter.resolveHierarchy(candidateTokens, coords);
    if (matched) {
      return {
        countryCode: targetMarket,
        ...matched,
        site: textQuery || undefined,
      };
    }
  }

  // 4. GPS Nearest City fallback within country boundary
  if (coords && isWithinMarketBounds(targetMarket, coords)) {
    const nearest = adapter.getNearestCity(coords);
    if (nearest) {
      return {
        countryCode: targetMarket,
        governorateSlug: nearest.slug,
        governorateEn: nearest.cityEn,
        governorateAr: nearest.cityAr,
        districtSlug: null,
        districtEn: null,
        districtAr: null,
        neighborhoodSlug: null,
        neighborhoodEn: null,
        neighborhoodAr: null,
        coordinates: coords,
        confidence: 'approximate',
        resolutionSource: 'gps',
        needsManualSelection: false,
      };
    }
  }

  // 5. Unresolved fallback to manual selection
  return buildFallback(options, 'unresolved');
}
