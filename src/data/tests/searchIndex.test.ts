import { describe, it, expect } from 'vitest';
import { searchCategories } from '../searchIndex';

describe('searchCategories (token index & synonyms)', () => {
  it('returns empty array for empty string', () => {
    expect(searchCategories('')).toEqual([]);
  });

  it('returns empty array for whitespace query', () => {
    expect(searchCategories('   ')).toEqual([]);
  });

  it('returns empty array for unrecognized term', () => {
    expect(searchCategories('xyzzy123')).toEqual([]);
  });

  it('finds real-estate for شقق', () => {
    const res = searchCategories('شقق');
    expect(res.some((c) => c.slug === 'real-estate')).toBe(true);
  });

  it('finds real-estate for شقة', () => {
    const res = searchCategories('شقة');
    expect(res.some((c) => c.slug === 'real-estate')).toBe(true);
  });

  it('finds real-estate for بيوت', () => {
    const res = searchCategories('بيوت');
    expect(res.some((c) => c.slug === 'real-estate')).toBe(true);
  });

  it('finds motors for كامري', () => {
    const res = searchCategories('كامري');
    expect(res.some((c) => c.slug === 'motors')).toBe(true);
  });

  it('finds motors for تويوتا', () => {
    const res = searchCategories('تويوتا');
    expect(res.some((c) => c.slug === 'motors')).toBe(true);
  });

  it('finds real-estate for 3 غرف نوم', () => {
    const res = searchCategories('3 غرف نوم');
    expect(res.some((c) => c.slug === 'real-estate')).toBe(true);
  });

  it('finds motors for 6 سلندر', () => {
    const res = searchCategories('6 سلندر');
    expect(res.some((c) => c.slug === 'motors')).toBe(true);
  });

  it('finds fashion for قياس', () => {
    const res = searchCategories('قياس');
    expect(res.some((c) => c.slug === 'fashion')).toBe(true);
  });

  it('finds computers for لابتوب', () => {
    const res = searchCategories('لابتوب');
    expect(res.some((c) => c.slug === 'computers')).toBe(true);
  });

  it('finds mobiles for ايفون', () => {
    const res = searchCategories('ايفون');
    expect(res.some((c) => c.slug === 'mobiles')).toBe(true);
  });

  it('finds watches for رولكس', () => {
    const res = searchCategories('رولكس');
    expect(res.some((c) => c.slug === 'watches')).toBe(true);
  });

  it('finds fashion for ملابس', () => {
    const res = searchCategories('ملابس');
    expect(res.some((c) => c.slug === 'fashion')).toBe(true);
  });
});
