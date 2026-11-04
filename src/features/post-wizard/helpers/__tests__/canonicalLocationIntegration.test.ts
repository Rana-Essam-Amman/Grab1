import { describe, it, expect, vi } from 'vitest';
import { getAllCamps } from '@/data/locations/registry';
import { resolveLocationCanonical } from '@/shared/lib/geo/locationSearch';
import { resolveAiLocationSlugs, uniqueExactCamp } from '../aiLocationResolver';
import { buildAppliedDraft } from '../../hooks/useAiPublishFlow.helpers';
import { preserveVerifiedJordanSelection, resolveTraditionalLocationSlugs } from '../traditionalLocationResolver';

const { ambiguousCamp } = vi.hoisted(() => ({
  ambiguousCamp: {
    slug: 'al-mansurah-camp',
    nameEn: 'Al Mansurah',
    nameAr: 'المنصورة',
    governorateSlug: 'maan',
  },
}));

vi.mock('@/data/locations/registry', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/data/locations/registry')>();
  return {
    ...actual,
    getAllCamps: (countryCode: string) => {
      const camps = actual.getAllCamps(countryCode);
      return countryCode === 'JO' ? [...camps, ambiguousCamp] : camps;
    },
  };
});

describe('AI flow canonical integration', () => {
  it('city-only AI output does not copy the city into neighborhood', () => {
    const applied = buildAppliedDraft({
      generated: {
        title: 'Desk',
        price: '50',
        description: 'Wood desk',
        categorySlug: 'furniture',
        subcategorySlug: 'desks',
        city: 'Amman',
        missing: [],
      },
      match: {
        chosenCategory: 'furniture',
        chosenSub: 'desks',
        effectiveCategory: 'furniture',
        effectiveSub: 'desks',
        mismatch: false,
      },
      raw: 'desk',
      photos: [],
      isArabic: false,
      browseCityAr: 'عمّان',
      categoryForAI: 'furniture',
      subForAI: 'desks',
      browseCountryCode: 'JO',
    });

    expect(applied.city).toBe('Amman');
    expect(applied.neighborhood).toBe('');
    expect(applied.citySlug).toBe('amman');
    expect(applied.neighborhoodSlug).toBeUndefined();
    expect(applied.districtSlug).toBeUndefined();
  });

  it('valid city plus locality resolves the exact parent path', () => {
    const res = resolveAiLocationSlugs('JO', 'Amman', 'Wadi as Sir');
    expect(res.citySlug).toBe('amman');
    expect(res.districtSlug).toBe('amman-qasabah');
    expect(res.neighborhoodSlug).toBe('wadi-as-sir');
  });

  it('duplicate locality without enough parent context stays unresolved', () => {
    const res = resolveAiLocationSlugs('JO', 'Maan', 'Al Mansurah');
    expect(res.citySlug).toBe('maan');
    expect(res.neighborhoodSlug).toBeUndefined();
  });

  it('conflicting parent context stays unresolved', () => {
    const res = resolveAiLocationSlugs('JO', 'Aqaba', 'Al Mansurah');
    expect(res.citySlug).toBe('aqaba');
    expect(res.neighborhoodSlug).toBeUndefined();
    expect(res.districtSlug).toBeUndefined();
  });

  it('unknown names do not receive fabricated slugs', () => {
    expect(resolveAiLocationSlugs('JO', 'UnknownAtlantisCity')).toEqual({});
    const child = resolveAiLocationSlugs('JO', 'Amman', 'Not A Real Locality');
    expect(child.citySlug).toBe('amman');
    expect(child.neighborhoodSlug).toBeUndefined();
  });


  it('resolves a unique camp under the selected governorate only', () => {
    const unique = resolveAiLocationSlugs('PS', 'Jenin', 'Jenin Camp');
    expect(unique.citySlug).toBe('jenin');
    expect(unique.neighborhoodSlug).toBe('jenin-camp');

    const otherGov = resolveAiLocationSlugs('PS', 'Nablus', 'Jenin Camp');
    expect(otherGov.citySlug).toBe('nablus');
    expect(otherGov.neighborhoodSlug).toBeUndefined();
  });

  it('duplicate camp names under the same governorate stay unresolved', () => {
    const camps = [
      { slug: 'camp-a', nameEn: 'Shared Camp', nameAr: 'مخيم مشترك', governorateSlug: 'jenin' },
      { slug: 'camp-b', nameEn: 'Shared Camp', nameAr: 'مخيم مشترك', governorateSlug: 'jenin' },
      { slug: 'camp-c', nameEn: 'Shared Camp', nameAr: 'مخيم مشترك', governorateSlug: 'nablus' },
    ];
    expect(uniqueExactCamp(camps, 'jenin', 'Shared Camp')).toBeUndefined();
    expect(uniqueExactCamp(camps, 'nablus', 'Shared Camp')).toBe('camp-c');
    expect(uniqueExactCamp(camps, 'jenin', 'Missing Camp')).toBeUndefined();
  });

  it('does not let camp fallback bypass an ambiguous canonical result', () => {
    const canonical = resolveLocationCanonical('JO', 'Al Mansurah', { citySlug: 'maan' });
    expect(canonical.status).toBe('ambiguous');
    expect(canonical.resolved).toBeNull();

    const camps = getAllCamps('JO').filter((camp) => camp.governorateSlug === 'maan');
    expect(camps.some((camp) => camp.slug === ambiguousCamp.slug && camp.nameEn === 'Al Mansurah')).toBe(true);
    expect(uniqueExactCamp(camps, 'maan', 'Al Mansurah')).toBe(ambiguousCamp.slug);

    const resolved = resolveAiLocationSlugs('JO', 'Maan', 'Al Mansurah');
    expect(resolved.citySlug).toBe('maan');
    expect(resolved.neighborhoodSlug).toBeUndefined();
    expect(resolved.districtSlug).toBeUndefined();
  });
  it('Kuwait never receives a fabricated neighborhood slug', () => {
    const res = resolveAiLocationSlugs('KW', 'Hawalli', 'Salmiya');
    expect(res.citySlug).toBe('hawalli');
    expect(res.districtSlug).toBe('salmiya');
    expect(res.neighborhoodSlug).toBeUndefined();
  });
});

describe('Traditional flow canonical integration', () => {
  it('resolves a non-Jordan locality through the shared resolver', () => {
    const res = resolveTraditionalLocationSlugs('SA', 'Riyadh', 'Al-Olaya');
    expect(res.citySlug).toBe('riyadh-region');
    expect(res.districtSlug).toBe('riyadh-city');
    expect(res.neighborhoodSlug).toBe('al-olaya');
  });

  it('does not resolve a locality under a conflicting selected city', () => {
    const res = resolveTraditionalLocationSlugs('JO', 'Aqaba', 'Wadi as Sir');
    expect(res.citySlug).toBe('aqaba');
    expect(res.neighborhoodSlug).toBeUndefined();
  });

  it('custom unrecognized text does not inherit descendant slugs', () => {
    const res = resolveTraditionalLocationSlugs('JO', 'Amman', 'totally custom text');
    expect(res.citySlug).toBe('amman');
    expect(res.districtSlug).toBeUndefined();
    expect(res.neighborhoodSlug).toBeUndefined();
  });

  it('Kuwait remains two-level', () => {
    const res = resolveTraditionalLocationSlugs('KW', 'Hawalli', 'Salmiya');
    expect(res.citySlug).toBe('hawalli');
    expect(res.districtSlug).toBe('salmiya');
    expect(res.neighborhoodSlug).toBeUndefined();
  });

  it('preserves the exact Jordan picker selection instead of re-looking it up', () => {
    const preserved = preserveVerifiedJordanSelection('JO', 'Amman', 'Tabarbour', {
      city: 'Amman',
      neighborhood: 'Tabarbour',
      citySlug: 'amman',
      districtSlug: 'amman-qasabah',
      neighborhoodSlug: 'tabarbour',
    });
    expect(preserved).toEqual({
      citySlug: 'amman',
      districtSlug: 'amman-qasabah',
      neighborhoodSlug: 'tabarbour',
    });
    expect(preserveVerifiedJordanSelection('SA', 'Riyadh', 'Al-Olaya', {
      city: 'Riyadh',
      neighborhood: 'Al-Olaya',
      citySlug: 'riyadh-region',
    })).toBeNull();
  });

  it('Arabic and English city labels resolve to the same identity', () => {
    const en = resolveTraditionalLocationSlugs('SA', 'Riyadh', '');
    const ar = resolveTraditionalLocationSlugs('SA', 'الرياض', '');
    expect(en.citySlug).toBe('riyadh-region');
    expect(ar.citySlug).toBe(en.citySlug);
  });
});
