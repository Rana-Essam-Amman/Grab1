import { describe, it, expect, beforeAll } from 'vitest';
import { searchLocationsHierarchical, getCountryGeo } from '../registry';
import '@/data/locations';

const MARKETS = ['JO', 'SA', 'LB', 'PS', 'SY', 'KW'] as const;

describe('searchLocationsHierarchical', () => {
  beforeAll(() => {
    MARKETS.forEach((m) => {
      expect(getCountryGeo(m), `${m} registered`).not.toBeNull();
    });
  });

  it('returns Arabic and English matches for all six markets', () => {
    MARKETS.forEach((code) => {
      const geo = getCountryGeo(code)!;
      const gov = geo.governorates[0];
      const arHits = searchLocationsHierarchical(code, gov.nameAr);
      const enHits = searchLocationsHierarchical(code, gov.nameEn);
      expect(arHits.length, `${code} Arabic "${gov.nameAr}"`).toBeGreaterThan(0);
      expect(enHits.length, `${code} English "${gov.nameEn}"`).toBeGreaterThan(0);
      expect(arHits.some((h) => h.slug === gov.slug)).toBe(true);
      expect(enHits.some((h) => h.slug === gov.slug)).toBe(true);
    });
  });

  it('returns full parent paths for every result', () => {
    MARKETS.forEach((code) => {
      const geo = getCountryGeo(code)!;
      const gov = geo.governorates[0];
      const hits = searchLocationsHierarchical(code, gov.nameEn);
      hits.forEach((h) => {
        expect(h.parentPathEn.length, `${h.id} pathEn`).toBeGreaterThan(0);
        expect(h.parentPathAr.length, `${h.id} pathAr`).toBeGreaterThan(0);
        expect(h.parentPathEn[h.parentPathEn.length - 1]).toBe(h.nameEn);
        expect(h.parentPathAr[h.parentPathAr.length - 1]).toBe(h.nameAr);
      });
    });
  });

  it('uses hierarchy-qualified stable IDs so duplicate village names stay distinct', () => {
    const jo = getCountryGeo('JO')!;
    const nameCounts = new Map<string, string[]>();
    for (const gov of jo.governorates) {
      for (const d of gov.districts) {
        for (const v of d.villages) {
          const key = v.nameEn.toLowerCase();
          const list = nameCounts.get(key) ?? [];
          list.push(`${gov.slug}/${d.slug}/${v.slug}`);
          nameCounts.set(key, list);
        }
      }
    }
    const dup = [...nameCounts.entries()].find(([, ids]) => ids.length > 1);
    if (dup) {
      const [name] = dup;
      const hits = searchLocationsHierarchical('JO', name);
      const ids = hits.map((h) => h.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
      expect(hits.length).toBeGreaterThan(1);
    } else {
      const hits = searchLocationsHierarchical('JO', 'Amman');
      const ids = hits.map((h) => h.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('returns Kuwait terminal residential areas (districts with empty villages)', () => {
    const kw = getCountryGeo('KW')!;
    const terminal = kw.governorates.flatMap((g) => g.districts.filter((d) => d.villages.length === 0));
    expect(terminal.length).toBeGreaterThan(0);
    const sample = terminal[0];
    const hits = searchLocationsHierarchical('KW', sample.nameEn);
    expect(hits.some((h) => h.kind === 'district' && h.slug === sample.slug)).toBe(true);
    const hit = hits.find((h) => h.slug === sample.slug)!;
    expect(hit.parentPathEn.length).toBeGreaterThanOrEqual(2);
  });

  it('normalizes Arabic diacritics and hamza variants', () => {
    const jo = getCountryGeo('JO')!;
    const amman = jo.governorates.find((g) => g.slug === 'amman') ?? jo.governorates[0];
    const withDiacritics = amman.nameAr.replace('ا', 'أ');
    const hits = searchLocationsHierarchical('JO', withDiacritics);
    expect(hits.some((h) => h.slug === amman.slug)).toBe(true);
  });

  it('returns empty array for blank query', () => {
    expect(searchLocationsHierarchical('JO', '')).toEqual([]);
    expect(searchLocationsHierarchical('JO', '   ')).toEqual([]);
  });

  it('includes camps and landmarks when present', () => {
    MARKETS.forEach((code) => {
      const geo = getCountryGeo(code)!;
      if (geo.refugeeCamps.length > 0) {
        const camp = geo.refugeeCamps[0];
        const hits = searchLocationsHierarchical(code, camp.nameEn);
        expect(hits.some((h) => h.kind === 'camp' && h.slug === camp.slug), `${code} camp`).toBe(true);
      }
      if (geo.landmarks.length > 0) {
        const lm = geo.landmarks[0];
        const hits = searchLocationsHierarchical(code, lm.nameEn);
        expect(hits.some((h) => h.kind === 'landmark' && h.slug === lm.slug), `${code} landmark`).toBe(true);
      }
    });
  });
});
