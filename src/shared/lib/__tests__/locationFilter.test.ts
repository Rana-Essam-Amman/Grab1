import { describe, it, expect } from 'vitest';
import { matchLocation } from '../locationFilter';
import type { Listing } from '@/types';

const textMatch = (item: Listing, target: string) =>
  item.neighborhood.toLowerCase() === target.toLowerCase() ||
  item.city.toLowerCase() === target.toLowerCase();

const base = (over: Partial<Listing>): Listing => ({
  id: '1',
  title: 't',
  description: '',
  price: '1',
  currency: 'JOD',
  countryCode: 'JO',
  city: 'Amman',
  neighborhood: 'Same',
  categorySlug: 'c',
  subcategorySlug: 's',
  imageUrl: '',
  images: [],
  sellerPhone: '',
  sellerName: '',
  createdAt: '',
  status: 'active',
  views: 0,
  attributes: [],
  ...over,
});

describe('matchLocation', () => {
  it('does not cross-match the same label in different districts when slugs exist', () => {
    const a = base({ neighborhood: 'Same', districtSlug: 'marka', neighborhoodSlug: 'same-a' });
    const b = base({ neighborhood: 'Same', districtSlug: 'naoor', neighborhoodSlug: 'same-b' });
    expect(matchLocation(a, { neighborhood: 'Same', districtSlug: 'marka', neighborhoodSlug: 'same-a' }, textMatch)).toBe(true);
    expect(matchLocation(b, { neighborhood: 'Same', districtSlug: 'marka', neighborhoodSlug: 'same-a' }, textMatch)).toBe(false);
  });

  it('filters by governorate, district, and village slug', () => {
    const item = base({ citySlug: 'amman', districtSlug: 'marka', neighborhoodSlug: 'wadi' });
    expect(matchLocation(item, { governorateSlug: 'amman' }, textMatch)).toBe(true);
    expect(matchLocation(item, { governorateSlug: 'zarqa' }, textMatch)).toBe(false);
    expect(matchLocation(item, { districtSlug: 'marka' }, textMatch)).toBe(true);
    expect(matchLocation(item, { districtSlug: 'naoor' }, textMatch)).toBe(false);
    expect(matchLocation(item, { neighborhoodSlug: 'wadi' }, textMatch)).toBe(true);
    expect(matchLocation(item, { neighborhoodSlug: 'other' }, textMatch)).toBe(false);
  });

  it('falls back to text for NULL-slug records and does not invent slugs', () => {
    const legacy = base({ neighborhood: 'Abdoun' });
    expect(legacy.citySlug).toBeUndefined();
    expect(matchLocation(legacy, { neighborhood: 'Abdoun', neighborhoodSlug: 'abdoun' }, textMatch)).toBe(true);
    expect(matchLocation(legacy, { neighborhood: 'Other', neighborhoodSlug: 'abdoun' }, textMatch)).toBe(false);
  });
});
