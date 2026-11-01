import { describe, it, expect } from 'vitest';
import { matchLocation } from '../locationFilter';
import type { Listing } from '@/types';

const textMatch = (item: Listing, target: string) =>
  [item.city, item.neighborhood].some((value) => value?.toLowerCase() === target.toLowerCase());

const base = (over: Partial<Listing>): Listing => ({
  id: '1', title: 't', price: '1', city: 'Amman', neighborhood: 'Abdoun',
  categorySlug: 'furniture', images: [], attributes: [], status: 'active',
  ...over,
} as Listing);

describe('legacy null-slug parent proof', () => {
  it('rejects the same neighborhood label from another city', () => {
    const otherCity = base({ city: 'Zarqa', neighborhood: 'Abdoun' });
    expect(matchLocation(otherCity, {
      neighborhood: 'Abdoun', cityEn: 'Amman', governorateSlug: 'amman', neighborhoodSlug: 'abdoun',
    }, textMatch)).toBe(false);
  });

  it('returns a null-slug record only when city text proves the parent', () => {
    const legacy = base({ city: 'Amman', neighborhood: 'Abdoun' });
    expect(matchLocation(legacy, {
      neighborhood: 'Abdoun', cityEn: 'Amman', governorateSlug: 'amman', neighborhoodSlug: 'abdoun',
    }, textMatch)).toBe(true);
  });

  it('excludes an ambiguous null-slug record when city cannot be proven', () => {
    const ambiguous = base({ city: 'Abdoun', neighborhood: 'Abdoun' });
    expect(matchLocation(ambiguous, {
      neighborhood: 'Abdoun', governorateSlug: 'amman', neighborhoodSlug: 'abdoun',
    }, textMatch)).toBe(false);
  });
});
