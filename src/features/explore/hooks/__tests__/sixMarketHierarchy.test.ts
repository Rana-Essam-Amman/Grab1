import { describe, it, expect } from 'vitest';
import { getAllGovernorates, getAllDistricts } from '@/data/locations/registry';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';
import { buildFiltersQuery, readDraftsFromUrl, type FilterDrafts } from '../useFiltersUrlSync';

const MARKETS = ['JO', 'SA', 'LB', 'PS', 'SY', 'KW'] as const;
const empty: FilterDrafts = {
  category: null, sub: null, min: null, max: null, neigh: null,
  gov: null, dist: null, neighSlug: null, sort: 'newest', attrs: {},
};

const EXPECTED: Record<string, { gov: number; dist: number; villages: number }> = {
  JO: { gov: 12, dist: 63, villages: 1748 },
  SA: { gov: 13, dist: 32, villages: 192 },
  LB: { gov: 8, dist: 26, villages: 114 },
  PS: { gov: 16, dist: 37, villages: 205 },
  SY: { gov: 14, dist: 25, villages: 73 },
  KW: { gov: 6, dist: 126, villages: 0 },
};

describe('six-market hierarchy', () => {
  it.each(MARKETS)('%s hierarchy is complete and unique within parents', (market) => {
    const govs = getAllGovernorates(market);
    const expected = EXPECTED[market];
    expect(govs.length).toBe(expected.gov);
    const govSlugs = new Set(govs.map((g) => g.slug));
    expect(govSlugs.size).toBe(govs.length);
    let districts = 0;
    let villages = 0;
    for (const gov of govs) {
      expect(gov.slug).toBeTruthy();
      const distSlugs = new Set<string>();
      for (const dist of getAllDistricts(market, gov.slug)) {
        expect(dist.slug).toBeTruthy();
        expect(distSlugs.has(dist.slug)).toBe(false);
        distSlugs.add(dist.slug);
        districts += 1;
        const villageSlugs = new Set<string>();
        for (const village of dist.villages ?? []) {
          expect(village.slug).toBeTruthy();
          expect(villageSlugs.has(village.slug)).toBe(false);
          villageSlugs.add(village.slug);
          villages += 1;
        }
      }
    }
    expect(districts).toBe(expected.dist);
    expect(villages).toBe(expected.villages);
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
