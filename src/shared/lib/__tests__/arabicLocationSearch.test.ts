import { describe, it, expect } from 'vitest';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';

describe('location search normalization', () => {
  it('folds diacritics, tatweel, and alef variants', () => {
    expect(normalizeArabic('مَارْكَا')).toBe(normalizeArabic('ماركا'));
    expect(normalizeArabic('مـاركا')).toBe(normalizeArabic('ماركا'));
    expect(normalizeArabic('العاصِمَة')).toContain('العاصمه');
    expect(normalizeArabic('AMMAN').toLowerCase()).toBe('amman');
    expect(normalizeArabic('')).toBe('');
  });
});
