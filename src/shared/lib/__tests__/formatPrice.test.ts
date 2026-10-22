import { describe, expect, it } from 'vitest';
import { formatPrice } from '../formatPrice';

describe('formatPrice', () => {
  it('formats numbers with Western commas and localized currency in Arabic and English', () => {
    expect(formatPrice(20000, 'JOD', true)).toBe('20,000 دينار');
    expect(formatPrice(20000, 'JOD', false)).toBe('20,000 JOD');
    expect(formatPrice('20000', 'SAR', true)).toBe('20,000 ريال');
    expect(formatPrice('20000', 'SAR', false)).toBe('20,000 SAR');
  });

  it('formats all supported currencies across markets correctly', () => {
    expect(formatPrice(1000, 'USD', true)).toBe('1,000 دولار');
    expect(formatPrice(1000, 'LBP', true)).toBe('1,000 ليرة لبنانية');
    expect(formatPrice(1000, 'SYP', true)).toBe('1,000 ليرة سورية');
    expect(formatPrice(1000, 'ILS', true)).toBe('1,000 شيكل');
    expect(formatPrice(1000, 'AED', true)).toBe('1,000 درهم');
    expect(formatPrice(1000, 'EGP', true)).toBe('1,000 جنيه');

    expect(formatPrice(1000, 'USD', false)).toBe('1,000 USD');
    expect(formatPrice(1000, 'LBP', false)).toBe('1,000 LBP');
    expect(formatPrice(1000, 'SYP', false)).toBe('1,000 SYP');
    expect(formatPrice(1000, 'ILS', false)).toBe('1,000 ILS');
  });

  it('handles null, undefined, and empty string inputs', () => {
    expect(formatPrice(null, 'JOD', true)).toBe('');
    expect(formatPrice(undefined, 'JOD', true)).toBe('');
    expect(formatPrice('', 'JOD', true)).toBe('');
  });

  it('handles non-numeric string gracefully or unmapped currency fallback', () => {
    expect(formatPrice('contact', 'JOD', true)).toBe('contact دينار');
    expect(formatPrice(500, 'EUR', true)).toBe('500 EUR');
  });
});
