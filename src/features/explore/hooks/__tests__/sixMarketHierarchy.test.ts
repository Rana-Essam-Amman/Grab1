import { describe, it, expect } from 'vitest';
import { getAllGovernorates, getAllDistricts } from '@/data/locations/registry';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';
import { buildFiltersQuery, readDraftsFromUrl, type FilterDrafts } from '../useFiltersUrlSync';

const MARKETS = ['JO', 'SA', 'LB', 'PS', 'SY', 'KW'] as const;
const empty: FilterDrafts = {
  category: null, sub: null, min: null, max: null, neigh: null,
  gov: null, dist: null, neighSlug: null, sort: 'newest', attrs: {},
};

describe('six-market hierarchy', () => {
  it.each(MARKETS)('%s has governorates and consistent parent-child slugs', (market) => {
    const govs = getAllGovernorates(market);
    expect(govs.length).toBeGreaterThan(0);
    const slugs = new Set(govs.map((g) => g.slug));
    expect(slugs.size).toBe(govs.length);
    let districts = 0;
    let villages = 0;
    for (const gov of govs) {
      for (const dist of getAllDistricts(market, gov.slug)) {
        districts += 1;
        villages += dist.villages?.length ?? 0;
        expect(dist.slug).toBeTruthy();
        expect(normalizeArabic(gov.nameAr).length).toBeGreaterThan(0);
      }
    }
    expect(districts).toBeGreaterThan(0);
  });

  it('serializes and parses a full hierarchy without losing unrelated params', () => {
    const draft: FilterDrafts = { ...empty, category: 'furniture', gov: 'amman', dist: 'marka', neighSlug: 'wadi' };
    const query = buildFiltersQuery(draft);
    expect(query).toContain('cat=furniture');
    expect(query).toContain('gov=amman');
    window.history.replaceState({}, '', `/filters${query}&min=10`);
    const restored = readDraftsFromUrl(empty);
    expect(restored.gov).toBe('amman');
    expect(restored.dist).toBe('marka');
    expect(restored.neighSlug).toBe('wadi');
    expect(restored.category).toBe('furniture');
  });
});
