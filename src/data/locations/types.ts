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
