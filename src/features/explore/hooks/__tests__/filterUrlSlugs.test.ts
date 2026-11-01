import { describe, it, expect } from 'vitest';
import { buildFiltersQuery, readDraftsFromUrl, type FilterDrafts } from '../useFiltersUrlSync';

const empty: FilterDrafts = {
  category: null, sub: null, min: null, max: null, neigh: null,
  gov: null, dist: null, neighSlug: null, sort: 'newest', attrs: {},
};

describe('filter url slugs', () => {
  it('round-trips governorate, district, and neighborhood slugs', () => {
    const draft: FilterDrafts = { ...empty, gov: 'amman', dist: 'marka', neighSlug: 'wadi' };
    const query = buildFiltersQuery(draft);
    window.history.replaceState({}, '', `/filters${query}`);
    const restored = readDraftsFromUrl(empty);
    expect(restored.gov).toBe('amman');
    expect(restored.dist).toBe('marka');
    expect(restored.neighSlug).toBe('wadi');
  });
});
