import { describe, it, expect } from 'vitest';
import { buildCategoryPath, parseCategoryPath } from '../categoryPaths';

describe('buildCategoryPath', () => {
  it('builds /{market}/{category} lowercase', () => {
    expect(buildCategoryPath('JO', 'motors')).toBe('/jo/motors');
    expect(buildCategoryPath('SA', 'real-estate')).toBe('/sa/real-estate');
  });

  it('defaults to JO/motors when inputs empty', () => {
    expect(buildCategoryPath('', '')).toBe('/jo/motors');
  });
});

describe('parseCategoryPath', () => {
  it('parses valid market + category', () => {
    expect(parseCategoryPath('/jo/motors')).toEqual({ market: 'JO', category: 'motors' });
    expect(parseCategoryPath('/SA/Real-Estate')).toEqual({ market: 'SA', category: 'real-estate' });
  });

  it('returns null on 1 or 3 segments', () => {
    expect(parseCategoryPath('/jo')).toBeNull();
    expect(parseCategoryPath('/jo/motors/toyota-abc')).toBeNull();
  });

  it('returns null on invalid market', () => {
    expect(parseCategoryPath('/xx/motors')).toBeNull();
    expect(parseCategoryPath('/post-ad/photos')).toBeNull();
    expect(parseCategoryPath('/profile/edit')).toBeNull();
    expect(parseCategoryPath('/listing/abc')).toBeNull();
  });

  it('returns null on unknown category slug', () => {
    expect(parseCategoryPath('/jo/foobar')).toBeNull();
  });
});
