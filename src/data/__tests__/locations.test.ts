import { describe, it, expect } from 'vitest';
import {
  locations,
  locationsAr,
  DEFAULT_REGIONAL_CAPITALS,
  validateRegionalSanity,
  getSanitizedRegionalLocation,
  calculateGeoSimilarity,
  reconcileLocation,
} from '../locations';

describe('Data Layer - Locations & Geographic Integrity', () => {
  it('locations and locationsAr have entries for all 5 countries (JO, LB, PS, SY, SA)', () => {
    const expectedCountries = ['JO', 'LB', 'PS', 'SY', 'SA'];
    expectedCountries.forEach((country) => {
      expect(locations[country]).toBeDefined();
      expect(locationsAr[country]).toBeDefined();
      expect(Object.keys(locations[country]).length).toBeGreaterThan(0);
      expect(Object.keys(locationsAr[country]).length).toBeGreaterThan(0);
    });
  });

  it('DEFAULT_REGIONAL_CAPITALS defines canonical capital cities for all 5 markets', () => {
    expect(DEFAULT_REGIONAL_CAPITALS.JO.cityEn).toBe('Amman');
    expect(DEFAULT_REGIONAL_CAPITALS.JO.cityAr).toBe('عمّان');
    expect(DEFAULT_REGIONAL_CAPITALS.LB.cityEn).toBe('Beirut');
    expect(DEFAULT_REGIONAL_CAPITALS.LB.cityAr).toBe('بيروت');
    expect(DEFAULT_REGIONAL_CAPITALS.PS.cityEn).toBe('Ramallah and Al-Bireh');
    expect(DEFAULT_REGIONAL_CAPITALS.SY.cityEn).toBe('Damascus');
    expect(DEFAULT_REGIONAL_CAPITALS.SA.cityEn).toBe('Riyadh');
  });

  it('validateRegionalSanity returns true for valid city and neighborhood', () => {
    expect(validateRegionalSanity('JO', 'Amman', 'Abdoun')).toBe(true);
    expect(validateRegionalSanity('JO', 'عمّان', 'عبدون')).toBe(true);
    expect(validateRegionalSanity('SA', 'Riyadh', 'Olaya')).toBe(true);
    expect(validateRegionalSanity('LB', 'Beirut', 'Hamra')).toBe(true);
  });

  it('validateRegionalSanity returns false for invalid city or mismatching country', () => {
    // City belongs to Lebanon, not Jordan
    expect(validateRegionalSanity('JO', 'Beirut')).toBe(false);
    // Neighborhood does not belong to Irbid
    expect(validateRegionalSanity('JO', 'Irbid', 'Abdoun')).toBe(false);
    // Invalid country code
    expect(validateRegionalSanity('INVALID', 'Amman')).toBe(false);
    // Empty city
    expect(validateRegionalSanity('JO', '')).toBe(false);
  });

  it('getSanitizedRegionalLocation returns sanitized values with fallback', () => {
    const valid = getSanitizedRegionalLocation('JO', 'Amman', 'Abdoun', 'en');
    expect(valid.city).toBe('Amman');
    expect(valid.neighborhood).toBe('Abdoun');

    const invalid = getSanitizedRegionalLocation('JO', 'Paris', 'InvalidDistrict', 'en');
    expect(invalid.city).toBe(DEFAULT_REGIONAL_CAPITALS.JO.cityEn);
    expect(invalid.neighborhood).toBe(DEFAULT_REGIONAL_CAPITALS.JO.neighborhoodEn);
  });

  it('calculateGeoSimilarity correctly identifies identical and fuzzy strings', () => {
    expect(calculateGeoSimilarity('Amman', 'Amman')).toBe(1.0);
    expect(calculateGeoSimilarity('عمّان', 'عمان')).toBe(1.0);
    expect(calculateGeoSimilarity('الرياض', 'رياض')).toBeGreaterThanOrEqual(0.65);
    expect(calculateGeoSimilarity('Paris', 'Tokyo')).toBeLessThan(0.3);
  });

  it('reconcileLocation resolves spelling variants with high confidence', () => {
    const match = reconcileLocation('JO', 'عمان', 'عبدون');
    expect(match.city).toBe('عمّان');
    expect(match.neighborhood).toBe('عبدون');
    expect(match.confidence).toBeGreaterThanOrEqual(0.8);

    const nonMatch = reconcileLocation('JO', 'CompleteNonsenseCity');
    expect(nonMatch.city).toBeUndefined();
  });
});
