
import { describe, it, expect } from 'vitest';
import {
  locations,
  locationsAr,
  DEFAULT_REGIONAL_CAPITALS,
  validateRegionalSanity,
  getSanitizedRegionalLocation,
  calculateGeoSimilarity,
  reconcileLocation,
  getCountryGeo,
} from '../locations';

const EXPECTED_COUNTRIES = ['JO', 'SA', 'LB', 'PS', 'SY', 'KW'] as const;

describe('Data Layer - Locations & Geographic Integrity', () => {
  it('legacy location datasets contain all 6 supported markets', () => {
    EXPECTED_COUNTRIES.forEach((country) => {
      expect(locations[country], `${country} English locations`).toBeDefined();
      expect(locationsAr[country], `${country} Arabic locations`).toBeDefined();
      expect(Object.keys(locations[country]).length).toBeGreaterThan(0);
      expect(Object.keys(locationsAr[country]).length).toBeGreaterThan(0);
    });
  });

  it('geographic registry contains all 6 supported markets', () => {
    EXPECTED_COUNTRIES.forEach((country) => {
      const geo = getCountryGeo(country);

      expect(geo, `${country} registry entry`).not.toBeNull();
      expect(geo?.countryCode).toBe(country);
      expect(geo?.governorates.length).toBeGreaterThan(0);
    });
  });

  it('DEFAULT_REGIONAL_CAPITALS defines canonical capital cities for all 6 markets', () => {
    EXPECTED_COUNTRIES.forEach((country) => {
      expect(DEFAULT_REGIONAL_CAPITALS[country]).toBeDefined();
      expect(DEFAULT_REGIONAL_CAPITALS[country].cityEn.trim().length).toBeGreaterThan(0);
      expect(DEFAULT_REGIONAL_CAPITALS[country].cityAr.trim().length).toBeGreaterThan(0);
    });

    expect(DEFAULT_REGIONAL_CAPITALS.JO.cityEn).toBe('Amman');
    expect(DEFAULT_REGIONAL_CAPITALS.JO.cityAr).toBe('عمّان');
    expect(DEFAULT_REGIONAL_CAPITALS.LB.cityEn).toBe('Beirut');
    expect(DEFAULT_REGIONAL_CAPITALS.LB.cityAr).toBe('بيروت');
    expect(DEFAULT_REGIONAL_CAPITALS.PS.cityEn).toBe('Jerusalem');
    expect(DEFAULT_REGIONAL_CAPITALS.SY.cityEn).toBe('Damascus');
    expect(DEFAULT_REGIONAL_CAPITALS.SA.cityEn).toBe('Riyadh');
    expect(DEFAULT_REGIONAL_CAPITALS.KW.cityEn).toBe('Kuwait City');
    expect(DEFAULT_REGIONAL_CAPITALS.KW.cityAr).toBe('مدينة الكويت');
  });

  it('DEFAULT_REGIONAL_CAPITALS defines neighborhoods and all city fields for every market', () => {
    expect(DEFAULT_REGIONAL_CAPITALS.JO.neighborhoodEn).toBe('Abdali');
    expect(DEFAULT_REGIONAL_CAPITALS.JO.neighborhoodAr).toBe('العبدلي');

    expect(DEFAULT_REGIONAL_CAPITALS.LB.neighborhoodEn).toBe('Hamra');
    expect(DEFAULT_REGIONAL_CAPITALS.LB.neighborhoodAr).toBe('الحمرا');

    expect(DEFAULT_REGIONAL_CAPITALS.PS.cityAr).toBe('القدس');
    expect(DEFAULT_REGIONAL_CAPITALS.PS.neighborhoodEn).toBe('Al Quds');
    expect(DEFAULT_REGIONAL_CAPITALS.PS.neighborhoodAr).toBe('القدس');

    expect(DEFAULT_REGIONAL_CAPITALS.SY.cityAr).toBe('دمشق');
    expect(DEFAULT_REGIONAL_CAPITALS.SY.neighborhoodEn).toBe('Mezzeh');
    expect(DEFAULT_REGIONAL_CAPITALS.SY.neighborhoodAr).toBe('المزة');

    expect(DEFAULT_REGIONAL_CAPITALS.SA.cityAr).toBe('الرياض');
    expect(DEFAULT_REGIONAL_CAPITALS.SA.neighborhoodEn).toBe('Olaya');
    expect(DEFAULT_REGIONAL_CAPITALS.SA.neighborhoodAr).toBe('العليا');

    expect(DEFAULT_REGIONAL_CAPITALS.KW.cityEn).toBe('Kuwait City');
    expect(DEFAULT_REGIONAL_CAPITALS.KW.cityAr).toBe('مدينة الكويت');
    expect(DEFAULT_REGIONAL_CAPITALS.KW.neighborhoodEn).toBe('Salmiya');
    expect(DEFAULT_REGIONAL_CAPITALS.KW.neighborhoodAr).toBe('السالمية');
  });

  it('validateRegionalSanity returns true for valid city and neighborhood', () => {
    expect(validateRegionalSanity('JO', 'Amman', 'Abdoun')).toBe(true);
    expect(validateRegionalSanity('JO', 'عمّان', 'عبدون')).toBe(true);
    expect(validateRegionalSanity('SA', 'Riyadh', 'Al-Olaya')).toBe(true);
    expect(validateRegionalSanity('LB', 'Beirut', 'Hamra')).toBe(true);
  });

  it('validateRegionalSanity returns false for invalid city or mismatching country', () => {
    expect(validateRegionalSanity('JO', 'Beirut')).toBe(false);
    expect(validateRegionalSanity('JO', 'Irbid', 'Abdoun')).toBe(false);
    expect(validateRegionalSanity('INVALID', 'Amman')).toBe(false);
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
