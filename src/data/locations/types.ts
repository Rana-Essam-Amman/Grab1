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
