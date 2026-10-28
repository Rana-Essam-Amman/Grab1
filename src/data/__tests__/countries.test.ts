import { describe, it, expect } from 'vitest';
import { countries, ALLOWED_CURRENCIES, getSanitizedCurrency, countryByCode } from '../countries';

describe('Data Layer - Countries & Currencies', () => {
  it('countries array contains exactly the 6 supported regional markets (JO, LB, PS, SY, SA, KW)', () => {
    expect(countries).toHaveLength(6);
    const codes = countries.map((c) => c.code);
    expect(codes).toEqual(['JO', 'LB', 'PS', 'SY', 'SA', 'KW']);
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
    expect(getSanitizedCurrency('XX', 'USD')).toBe('JOD');
  });

  it('getSanitizedCurrency with undefined currency returns the primary currency for the country', () => {
    expect(getSanitizedCurrency('SA')).toBe('SAR');
  });

  it('countryByCode returns the exact country definition for valid code', () => {
    const jo = countryByCode('JO');
    expect(jo.code).toBe('JO');
    expect(jo.nameAr).toBe('الأردن');
    expect(jo.currencies[0].code).toBe('JOD');

    const sa = countryByCode('SA');
    expect(sa.code).toBe('SA');
    expect(sa.nameAr).toBe('السعودية');

    const lb = countryByCode('LB');
    expect(lb.code).toBe('LB');
    expect(lb.nameAr).toBe('لبنان');

    const ps = countryByCode('PS');
    expect(ps.code).toBe('PS');
    expect(ps.nameAr).toBe('فلسطين');

    const sy = countryByCode('SY');
    expect(sy.code).toBe('SY');
    expect(sy.nameAr).toBe('سوريا');

    const kw = countryByCode('KW');
    expect(kw.code).toBe('KW');
    expect(kw.nameAr).toBe('الكويت');
    expect(kw.currencies[0].code).toBe('KWD');
  });

  it('countryByCode falls back to Jordan (JO) for unknown codes', () => {
    const fallback = countryByCode('XX');
    expect(fallback.code).toBe('JO');
  });

  it('ALLOWED_CURRENCIES mapping accurately matches regional specifications', () => {
    expect(ALLOWED_CURRENCIES.JO).toEqual(['JOD']);
    expect(ALLOWED_CURRENCIES.LB).toEqual(['USD', 'LBP']);
    expect(ALLOWED_CURRENCIES.PS).toEqual(['ILS', 'JOD', 'USD']);
    expect(ALLOWED_CURRENCIES.SY).toEqual(['SYP', 'USD']);
    expect(ALLOWED_CURRENCIES.SA).toEqual(['SAR']);
    expect(ALLOWED_CURRENCIES.KW).toEqual(['KWD']);
  });
});
