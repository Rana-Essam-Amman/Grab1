import { describe, it, expect } from 'vitest';
import { extractType, extractCategorySlug } from '../types.extractor';

describe('extractType', () => {
  it('extracts fashion dress', () => {
    expect(extractType('فستان أحمر')).toBe('فستان');
  });

  it('extracts sofa', () => {
    expect(extractType('كنبة جلد بني')).toBe('كنبة');
  });

  it('extracts iPhone', () => {
    expect(extractType('آيفون 15 برو')).toBe('آيفون');
  });

  it('extracts laptop', () => {
    expect(extractType('لابتوب Dell')).toBe('لابتوب');
  });

  it('returns undefined for car model without type keyword', () => {
    expect(extractType('تويوتا كامري 2022')).toBeUndefined();
  });

  it('extracts english dress', () => {
    expect(extractType('dress for sale')).toBe('فستان');
  });

  it('extracts shoes', () => {
    expect(extractType('حذاء رياضي')).toBe('حذاء');
  });

  it('returns undefined for text with no match', () => {
    expect(extractType('بدون كلمة')).toBeUndefined();
  });
});

describe('extractCategorySlug', () => {
  it('maps dress to fashion', () => {
    expect(extractCategorySlug('فستان أحمر')).toBe('fashion');
  });

  it('maps sofa to furniture', () => {
    expect(extractCategorySlug('كنبة بني')).toBe('furniture');
  });

  it('maps iPhone to mobiles', () => {
    expect(extractCategorySlug('آيفون 15')).toBe('mobiles');
  });

  it('maps laptop to computers', () => {
    expect(extractCategorySlug('لابتوب')).toBe('computers');
  });

  it('maps apartment to real-estate', () => {
    expect(extractCategorySlug('شقة للبيع')).toBe('real-estate');
  });

  it('maps car to motors', () => {
    expect(extractCategorySlug('سيارة كامري')).toBe('motors');
  });

  it('maps watch to watches', () => {
    expect(extractCategorySlug('ساعة رولكس')).toBe('watches');
  });

  it('returns undefined for empty text', () => {
    expect(extractCategorySlug('')).toBeUndefined();
  });
});
