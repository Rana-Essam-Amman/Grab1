import { describe, it, expect } from 'vitest';
import {
  countries,
  countryByCode,
  getSanitizedCurrency,
  ALLOWED_CURRENCIES,
} from '../countries';

describe('Data Layer - Countries & Currencies', () => {
  it('countries array contains exactly the 5 supported regional markets (JO, LB, PS, SY, SA)', () => {
    expect(countries).toHaveLength(5);
    const codes = countries.map((c) => c.code);
    expect(codes).toEqual(['JO', 'LB', 'PS', 'SY', 'SA']);
  });

  it('getSanitizedCurrency("JO", "JOD") returns "JOD"', () => {
    expect(getSanitizedCurrency('JO', 'JOD')).toBe('JOD');
  });

  it('getSanitizedCurrency("JO", "USD") falls back to "JOD" because USD is not permitted in JO', () => {
    expect(getSanitizedCurrency('JO', 'USD')).toBe('JOD');
  });

  it('getSanitizedCurrency("SY", "USD") returns "USD" because USD is permitted in SY', () => {
    expect(getSanitizedCurrency('SY', 'USD')).toBe('USD');
  });

  it('getSanitizedCurrency("SY", "JOD") falls back to "SYP" (first allowed currency in SY)', () => {
    expect(getSanitizedCurrency('SY', 'JOD')).toBe('SYP');
  });

  it('getSanitizedCurrency with invalid country code falls back to JO defaults', () => {
    expect(getSanitizedCurrency('INVALID_CODE', 'JOD')).toBe('JOD');
  });

  it('getSanitizedCurrency with undefined currency returns the primary currency for the country', () => {
    expect(getSanitizedCurrency('JO', undefined)).toBe('JOD');
    expect(getSanitizedCurrency('SA', undefined)).toBe('SAR');
    expect(getSanitizedCurrency('LB', undefined)).toBe('USD');
  });

  it('countryByCode returns the exact country definition for valid code', () => {
    const jordan = countryByCode('JO');
    expect(jordan.nameEn).toBe('Jordan');
    expect(jordan.nameAr).toBe('الأردن');

    const saudi = countryByCode('SA');
    expect(saudi.nameEn).toBe('Saudi Arabia');
    expect(saudi.nameAr).toBe('السعودية');
  });

  it('countryByCode falls back to Jordan (JO) for unknown codes', () => {
    const fallback = countryByCode('XYZ');
    expect(fallback.code).toBe('JO');
    expect(fallback.nameEn).toBe('Jordan');
  });

  it('ALLOWED_CURRENCIES mapping accurately matches regional specifications', () => {
    expect(ALLOWED_CURRENCIES.JO).toEqual(['JOD']);
    expect(ALLOWED_CURRENCIES.LB).toEqual(['USD', 'LBP']);
    expect(ALLOWED_CURRENCIES.PS).toEqual(['ILS', 'JOD', 'USD']);
    expect(ALLOWED_CURRENCIES.SY).toEqual(['SYP', 'USD']);
    expect(ALLOWED_CURRENCIES.SA).toEqual(['SAR']);
  });
});
