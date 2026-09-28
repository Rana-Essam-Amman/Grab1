import { describe, it, expect } from 'vitest';
import { normalizeArabic } from '../arabicNormalize';
import { searchCategories } from '../searchIndex';

describe('normalizeArabic', () => {
  it('normalizes hamzas: إيفون -> ايفون', () => {
    expect(normalizeArabic('إيفون')).toBe('ايفون');
  });

  it('normalizes taa marbuta and diacritics: سيّارة -> سياره', () => {
    expect(normalizeArabic('سيّارة')).toBe('سياره');
  });

  it('normalizes alif maqsura: مصطفى -> مصطفي', () => {
    expect(normalizeArabic('مصطفى')).toBe('مصطفي');
  });
});

describe('searchCategories', () => {
  it('returns empty array for empty query', () => {
    expect(searchCategories('')).toEqual([]);
  });

  it('finds motors by exact term: كامري', () => {
    const results = searchCategories('كامري');
    expect(results.some(r => r.slug === 'motors')).toBe(true);
  });

  it('finds motors by typo/normalized term: كامرى', () => {
    const results = searchCategories('كامرى');
    expect(results.some(r => r.slug === 'motors')).toBe(true);
  });

  it('finds mobiles by hamza term: إيفون', () => {
    const results = searchCategories('إيفون');
    expect(results.some(r => r.slug === 'mobiles')).toBe(true);
  });

  it('finds mobiles by normalized term: ايفون', () => {
    const results = searchCategories('ايفون');
    expect(results.some(r => r.slug === 'mobiles')).toBe(true);
  });

  it('finds mobiles by english term: iphone', () => {
    const results = searchCategories('iphone');
    expect(results.some(r => r.slug === 'mobiles')).toBe(true);
  });

  it('finds real-estate by term: شقة', () => {
    const results = searchCategories('شقة');
    expect(results.some(r => r.slug === 'real-estate')).toBe(true);
  });

  it('finds motors by dialect term: موتر', () => {
    const results = searchCategories('موتر');
    expect(results.some(r => r.slug === 'motors')).toBe(true);
  });

  it('returns empty for unknown terms: xyzzy123', () => {
    expect(searchCategories('xyzzy123')).toEqual([]);
  });
});
