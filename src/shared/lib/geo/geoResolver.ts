import { getGeoAdapter } from './adapters';
import { isWithinMarketBounds } from './marketBounds';
import { isProviderCountryMatching, extractTokensFromProvider } from './providerValidation';
import type {
  CanonicalLocation,
  ResolveGeoOptions,
  LatLng,
} from './geo.types';

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

  // 1. Strict Provider Country Metadata Validation (FIX 1 & 2)
  if (externalResult) {
    const { matches, hasMetadata } = isProviderCountryMatching(targetMarket, externalResult);
    // If metadata was provided and contradicts targetMarket -> immediate rejection
    if (hasMetadata && !matches) {
      return buildFallback(options, 'unsupported_country');
    }
  }

  // 2. Authoritative Boundary & Cross-Market Validation
  if (coords && !isWithinMarketBounds(targetMarket, coords)) {
    return buildFallback(options, 'out_of_bounds');
  }

  // 3. Token gathering
  const candidateTokens: string[] = [];
  if (externalResult) {
    candidateTokens.push(...extractTokensFromProvider(externalResult));
  }
  if (textQuery) {
    candidateTokens.push(textQuery);
    candidateTokens.push(...textQuery.split(/[,،]+/));
    candidateTokens.push(...textQuery.split(/[,،\s]+/));
  }

  // 4. Hierarchy Matching via Target Market Adapter
  if (candidateTokens.length > 0) {
    const matched = adapter.resolveHierarchy(candidateTokens, coords);
    if (matched) {
      // If external result lacked country metadata and coordinates, confidence is approximate
      const { hasMetadata } = isProviderCountryMatching(targetMarket, externalResult);
      const confidence = (!hasMetadata && externalResult && !coords) ? 'approximate' : matched.confidence;

      return {
        countryCode: targetMarket,
        ...matched,
        confidence,
        site: textQuery || undefined,
      };
    }
  }

  // 5. GPS Nearest City fallback within country boundary
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

  // 6. Unresolved fallback to manual selection
  return buildFallback(options, 'unresolved');
}
