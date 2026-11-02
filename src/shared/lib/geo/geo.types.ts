export type MarketCode = 'JO' | 'SA' | 'LB' | 'PS' | 'SY' | 'KW';

export interface LatLng {
  readonly lat: number;
  readonly lng: number;
}

export interface MarketBounds {
  readonly minLat: number;
  readonly maxLat: number;
  readonly minLng: number;
  readonly maxLng: number;
}

export interface CanonicalLocation {
  readonly countryCode: MarketCode;
  readonly governorateSlug: string | null;
  readonly governorateEn: string | null;
  readonly governorateAr: string | null;
  readonly districtSlug: string | null;
  readonly districtEn: string | null;
  readonly districtAr: string | null;
  readonly neighborhoodSlug: string | null;
  readonly neighborhoodEn: string | null;
  readonly neighborhoodAr: string | null;
  readonly site?: string | null;
  readonly coordinates?: LatLng | null;
  readonly confidence: 'exact' | 'high' | 'approximate' | 'fallback' | 'unresolved';
  readonly resolutionSource: 'slug' | 'canonical_match' | 'gps' | 'external_provider' | 'manual';
  readonly needsManualSelection: boolean;
}

export interface ProviderAddressPayload {
  readonly country?: string;
  readonly country_code?: string;
  readonly state?: string;
  readonly province?: string;
  readonly city?: string;
  readonly town?: string;
  readonly county?: string;
  readonly district?: string;
  readonly suburb?: string;
  readonly neighbourhood?: string;
  readonly quarter?: string;
  readonly village?: string;
  readonly hamlet?: string;
  readonly road?: string;
  readonly formatted_address?: string;
  readonly [key: string]: unknown;
}

export interface ProviderGeocodeResult {
  readonly provider: 'google' | 'nominatim' | 'apple' | 'generic';
  readonly lat?: number;
  readonly lng?: number;
  readonly address?: ProviderAddressPayload;
  readonly rawQuery?: string;
}

export interface ResolveGeoOptions {
  readonly targetMarket: MarketCode;
  readonly textQuery?: string;
  readonly coordinates?: LatLng;
  readonly externalResult?: ProviderGeocodeResult;
  readonly isArabic?: boolean;
}

export interface MarketGeoAdapter {
  readonly marketCode: MarketCode;
  readonly bounds: MarketBounds;
  isWithinBounds(coords: LatLng): boolean;
  resolveHierarchy(
    tokens: readonly string[],
    coords?: LatLng
  ): Omit<CanonicalLocation, 'countryCode'> | null;
  getNearestCity(coords: LatLng): {
    cityEn: string;
    cityAr: string;
    slug: string;
    distanceKm: number;
  } | null;
  getDefaultCapital(): {
    cityEn: string;
    cityAr: string;
    neighborhoodEn: string;
    neighborhoodAr: string;
    slug: string;
  };
}
