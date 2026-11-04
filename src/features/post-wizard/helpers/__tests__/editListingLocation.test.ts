import { describe, it, expect } from 'vitest';
import { ListingSchema } from '@/schemas/listing.schema';
import { getMarketProfile } from '@/data/locations/marketProfiles';
import {
  loadEditLocation, sameEditLocation, selectDistrict, selectGovernorate, selectJordanLocation, resolveUniqueChildSlug,
} from '../editListingLocation';

const baseListing = {
  id: 'l1', userId: 'u1', title: 'Valid title', description: 'A valid description', price: '10',
  currency: 'JOD' as const, countryCode: 'JO' as const, city: 'Amman', categorySlug: 'motors',
  subcategorySlug: 'cars', imageUrl: 'a.jpg', images: ['a.jpg'], sellerPhone: '079', sellerName: 'A',
  createdAt: '2026-01-01', views: 0, attributes: [],
};

describe('ListingSchema location identity', () => {
  it('retains all three canonical slugs', () => {
    const parsed = ListingSchema.parse({
      ...baseListing,
      citySlug: 'amman',
      districtSlug: 'amman-qasabah',
      neighborhoodSlug: 'abdun',
    });
    expect(parsed.citySlug).toBe('amman');
    expect(parsed.districtSlug).toBe('amman-qasabah');
    expect(parsed.neighborhoodSlug).toBe('abdun');
  });

  it('accepts a legacy listing without slugs', () => {
    const parsed = ListingSchema.parse(baseListing);
    expect(parsed.city).toBe('Amman');
    expect(parsed.citySlug).toBeUndefined();
    expect(parsed.districtSlug).toBeUndefined();
    expect(parsed.neighborhoodSlug).toBeUndefined();
  });
});

describe('Edit Listing location state', () => {
  it('loads the existing location without inventing slugs', () => {
    const loaded = loadEditLocation({ city: 'Amman', neighborhood: 'Abdun', citySlug: 'amman' });
    expect(loaded).toEqual({ city: 'Amman', neighborhood: 'Abdun', citySlug: 'amman', districtSlug: undefined, neighborhoodSlug: undefined });
    expect(loadEditLocation(null)).toEqual({ city: '', neighborhood: '', citySlug: undefined, districtSlug: undefined, neighborhoodSlug: undefined });
  });

  it('preserves location identity when unrelated fields would be saved', () => {
    const initial = loadEditLocation({ city: 'Amman', neighborhood: 'Abdun', citySlug: 'amman', districtSlug: 'amman-qasabah', neighborhoodSlug: 'abdun' });
    expect(sameEditLocation(initial, { ...initial })).toBe(true);
    const payload = sameEditLocation(initial, initial) ? {} : initial;
    expect(payload).toEqual({});
  });

  it('changing a parent clears dependent children and updates slugs together', () => {
    const next = selectGovernorate(false, { slug: 'zarqa', nameAr: 'الزرقاء', nameEn: 'Zarqa' });
    expect(next).toEqual({ city: 'Zarqa', neighborhood: '', citySlug: 'zarqa', districtSlug: undefined, neighborhoodSlug: undefined });
    const withChild = selectDistrict(next, false, { slug: 'zarqa-qasabah', nameAr: 'قصبة', nameEn: 'Qasabah' }, false);
    expect(withChild.districtSlug).toBe('zarqa-qasabah');
    expect(withChild.neighborhoodSlug).toBeUndefined();
  });

  it('does not invent a slug for an ambiguous resolver result', () => {
    expect(resolveUniqueChildSlug('JO', 'maan', 'Al Mansurah')).toBeUndefined();
  });

  it('covers six-market profiles, including Kuwait two-level', () => {
    expect(getMarketProfile('JO')?.visibleLevels.map((level) => level.labelEn)).toEqual(['Governorate', 'Area', 'Locality / Neighborhood']);
    expect(getMarketProfile('SA')?.visibleLevels.map((level) => level.labelEn)).toEqual(['Region', 'City', 'Neighborhood']);
    expect(getMarketProfile('PS')?.visibleLevels).toHaveLength(3);
    expect(getMarketProfile('LB')?.visibleLevels).toHaveLength(3);
    expect(getMarketProfile('SY')?.visibleLevels).toHaveLength(3);
    expect(getMarketProfile('KW')?.visibleLevels).toHaveLength(2);
    expect(getMarketProfile('KW')?.visibleLevels.map((level) => level.labelEn)).toEqual(['Governorate', 'Residential Area']);
  });

  it('Jordan picker selection preserves the exact supplied identity', () => {
    const selected = selectJordanLocation(false, {
      id: 'v1', nameAr: 'عبدون', nameEn: 'Abdun', parentPathAr: '', parentPathEn: '',
      cityAr: 'العاصمة', cityEn: 'Amman', citySlug: 'amman', districtSlug: 'amman-qasabah',
      neighborhoodSlug: 'abdun', type: 'village',
    });
    expect(selected).toEqual({
      city: 'Amman', neighborhood: 'Abdun', citySlug: 'amman', districtSlug: 'amman-qasabah', neighborhoodSlug: 'abdun',
    });
  });
});
