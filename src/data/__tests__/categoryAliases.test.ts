import { describe, it, expect } from 'vitest';
import { searchCategories } from '../categoryAliases';

describe('categoryAliases search', () => {
  it('returns empty array for empty query', () => {
    expect(searchCategories('')).toEqual([]);
    expect(searchCategories('   ')).toEqual([]);
  });

  it("finds motors category for 'كامري'", () => {
    const results = searchCategories('كامري');
    expect(results.some((c) => c.slug === 'motors')).toBe(true);
  });

  it("finds mobiles category for 'ايفون'", () => {
    const results = searchCategories('ايفون');
    expect(results.some((c) => c.slug === 'mobiles')).toBe(true);
  });

  it("finds real-estate category for 'شقة'", () => {
    const results = searchCategories('شقة');
    expect(results.some((c) => c.slug === 'real-estate')).toBe(true);
  });

  it("finds fashion category for 'shoes'", () => {
    const results = searchCategories('shoes');
    expect(results.some((c) => c.slug === 'fashion')).toBe(true);
  });

  it("returns empty array for non-matching query 'xyzzy123'", () => {
    expect(searchCategories('xyzzy123')).toEqual([]);
  });
});
