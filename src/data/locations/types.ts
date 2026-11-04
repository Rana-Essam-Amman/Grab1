export interface CountryLocations {
  [city: string]: string[];
}

export interface AllLocations {
  [country: string]: CountryLocations;
  JO: CountryLocations;
  SA: CountryLocations;
  LB: CountryLocations;
  PS: CountryLocations;
  SY: CountryLocations;
  KW: CountryLocations;
}

export interface DefaultCapital {
  cityEn: string;
  cityAr: string;
  neighborhoodEn: string;
  neighborhoodAr: string;
}

export type DefaultRegionalCapitals = DefaultCapital;
export type DefaultCapitals = Record<string, DefaultCapital>;

export interface ReconciledLocation {
  city?: string;
  neighborhood?: string;
  confidence: number;
}

export interface Village {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn: string;
}

export interface RefugeeCamp {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly governorateSlug: string;
}

export interface Landmark {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly citySlug: string;
  readonly type: 'mall' | 'university' | 'hospital' | 'airport' | 'stadium' | 'other';
}

export interface District {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly villages: readonly Village[];
}

export interface Governorate {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly districts: readonly District[];
}

export interface CountryGeo {
  readonly countryCode: 'JO' | 'LB' | 'PS' | 'SY' | 'SA' | 'KW';
  readonly governorates: readonly Governorate[];
  readonly refugeeCamps: readonly RefugeeCamp[];
  readonly landmarks: readonly Landmark[];
}

/**
 * Canonical persisted location identity slots.
 * These MUST remain unchanged; profiles only map presentation to them.
 */
export type CanonicalIdentitySlot = 'city_slug' | 'district_slug' | 'neighborhood_slug';

/**
 * Presentation-only description of one visible location level for a market.
 * Does not encode official administrative relationships or catalog data.
 */
export interface LocationLevelProfile {
  readonly levelIndex: number; // 1-based visible order
  readonly labelEn: string;
  readonly labelAr: string;
  readonly canonicalSlot: CanonicalIdentitySlot;
  readonly optional: boolean;
}

/**
 * Presentation metadata for a market's user-facing location hierarchy.
 * Maps visible levels to existing canonical identity slots.
 * Does not duplicate or replace the location catalog.
 */
export interface MarketProfile {
  readonly marketCode: 'JO' | 'SA' | 'PS' | 'LB' | 'SY' | 'KW';
  readonly visibleLevels: readonly LocationLevelProfile[];
}
