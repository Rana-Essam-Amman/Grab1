import { describe, it, expect } from 'vitest';
import { searchJordanLocations, getJordanIndex } from '../jordanLocationIndex';
import { getAllGovernorates } from '@/data/locations/registry';

describe('jordanLocationIndex registry-backed parent cities', () => {
  const amman = getAllGovernorates('JO').find((g) => g.slug === 'amman')!;
  const zarqa = getAllGovernorates('JO').find((g) => g.slug === 'zarqa')!;

  it('Tabarbour has correct parent governorate', () => {
    const results = searchJordanLocations('طبربور', true);
    const item = results.find((r) => r.neighborhoodSlug === 'hayy-tabarbawr');
    expect(item).toBeDefined();
    expect(item!.nameAr).toBe('حي طبربور');
    expect(item!.cityAr).toBe(amman.nameAr);
    expect(item!.cityEn).toBe(amman.nameEn);
    expect(item!.citySlug).toBe('amman');
    expect(item!.districtSlug).toBe('sahab');
  });

  it('Abdoun has correct parent governorate', () => {
    const results = searchJordanLocations('عبدون', true);
    const item = results.find((r) => r.neighborhoodSlug === 'abdun');
    expect(item).toBeDefined();
    expect(item!.nameAr).toBe('عبدون');
    expect(item!.cityAr).toBe(amman.nameAr);
    expect(item!.cityEn).toBe(amman.nameEn);
  });

  it('Khalda has correct parent governorate', () => {
    const results = searchJordanLocations('خلدا', true);
    const item = results.find((r) => r.neighborhoodSlug === 'hayy-khilda');
    expect(item).toBeDefined();
    expect(item!.nameAr).toBe('حي خلدا');
    expect(item!.cityAr).toBe(amman.nameAr);
    expect(item!.cityEn).toBe(amman.nameEn);
    expect(item!.districtSlug).toBe('wadi-essier');
  });

  it('Zarqa locality has correct parent governorate', () => {
    const results = searchJordanLocations('الزرقاء', true);
    const item = results.find((r) => r.type === 'village' && r.citySlug === 'zarqa');
    expect(item).toBeDefined();
    expect(item!.cityAr).toBe(zarqa.nameAr);
    expect(item!.cityEn).toBe(zarqa.nameEn);
  });

  it('English selection returns correct cityEn', () => {
    const results = searchJordanLocations('Tabarbawr', false);
    const item = results.find((r) => r.neighborhoodSlug === 'hayy-tabarbawr');
    expect(item).toBeDefined();
    expect(item!.cityEn).toBe(amman.nameEn);
    expect(item!.nameEn).toBe('Hayy Tabarbawr');
  });
});
