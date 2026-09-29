import { locations, locationsAr } from './data';
import type { AllLocations, CountryLocations } from './types';

export const OTHER_AR = 'أخرى';
export const OTHER_EN = 'Other';
export const ALL_MARKETS_LOC = ['JO', 'LB', 'PS', 'SY', 'SA'] as const;

export function isOtherValue(v: string | undefined | null): boolean {
  if (!v) return false;
  return v === OTHER_AR || v === OTHER_EN;
}

function augmentOne(record: CountryLocations | undefined, otherLabel: string): CountryLocations {
  const out: CountryLocations = {};
  const src = record || {};
  for (const [city, hoods] of Object.entries(src)) {
    const arr = Array.isArray(hoods) ? hoods : [];
    out[city] = arr.includes(otherLabel) ? [...arr] : [...arr, otherLabel];
  }
  if (!out[otherLabel]) out[otherLabel] = [otherLabel];
  return out;
}

function augmentAll(all: AllLocations, otherLabel: string): AllLocations {
  const out: AllLocations = { JO: {}, SA: {}, LB: {}, PS: {}, SY: {} };
  for (const code of ALL_MARKETS_LOC) {
    out[code] = augmentOne(all[code], otherLabel);
  }
  return out;
}

export const locationsWithOther: AllLocations = augmentAll(locations, OTHER_EN);
export const locationsArWithOther: AllLocations = augmentAll(locationsAr, OTHER_AR);
