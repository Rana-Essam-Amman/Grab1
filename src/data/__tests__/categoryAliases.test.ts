import { describe, it, expect } from 'vitest';
import { searchCategories } from '../categoryAliases';

describe('categoryAliases searchCategories', () => {
  it('empty query returns empty array', () => {
    expect(searchCategories('')).toEqual([]);
    expect(searchCategories('   ')).toEqual([]);
  });

  it('searches for كامري and includes motors', () => {
    const results = searchCategories('كامري');
    expect(results.some((c) => c.slug === 'motors')).toBe(true);
  });

  it('searches for ايفون and includes mobiles', () => {
    const results = searchCategories('ايفون');
    expect(results.some((c) => c.slug === 'mobiles')).toBe(true);
  });

  it('searches for شقة and includes real-estate', () => {
    const results = searchCategories('شقة');
    expect(results.some((c) => c.slug === 'real-estate')).toBe(true);
  });

  it('searches for shoes and includes fashion', () => {
    const results = searchCategories('shoes');
    expect(results.some((c) => c.slug === 'fashion')).toBe(true);
  });

  it('returns empty array for non-matching query xyzzy123', () => {
    expect(searchCategories('xyzzy123')).toEqual([]);
  });
});
