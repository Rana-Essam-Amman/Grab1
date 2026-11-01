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
  // 1. Canonical matching district still passes.
  it('passes canonical matching district', () => {
    const canonical = base({ citySlug: 'amman', districtSlug: 'marka', neighborhoodSlug: 'same-a' });
    expect(matchLocation(canonical, {
      governorateSlug: 'amman', districtSlug: 'marka',
    }, textMatch)).toBe(true);
  });

  // 2. Conflicting non-NULL district slug rejects.
  it('rejects conflicting non-NULL district slug', () => {
    const conflict = base({ citySlug: 'amman', districtSlug: 'naoor', neighborhoodSlug: 'same-b' });
    expect(matchLocation(conflict, {
      governorateSlug: 'amman', districtSlug: 'marka', neighborhood: 'Abdoun',
    }, textMatch)).toBe(false);
  });

  // 3. Legacy NULL district slug with matching city proof follows safe existing fallback.
  it('accepts legacy NULL district slug with matching city slug proof', () => {
    const legacy = base({ citySlug: 'amman', neighborhood: 'Abdoun' });
    expect(matchLocation(legacy, {
      governorateSlug: 'amman', districtSlug: 'marka', neighborhood: 'Abdoun',
    }, textMatch)).toBe(true);
  });

  it('accepts legacy NULL district slug with matching city text proof', () => {
    const legacy = base({ city: 'Amman', neighborhood: 'Abdoun' });
    expect(matchLocation(legacy, {
      governorateSlug: 'amman', districtSlug: 'marka', cityEn: 'Amman', neighborhood: 'Abdoun',
    }, textMatch)).toBe(true);
  });

  // 4. Legacy NULL district slug with conflicting non-NULL city slug rejects.
  it('rejects legacy NULL district slug with conflicting non-NULL city slug', () => {
    const conflictCity = base({ citySlug: 'zarqa', neighborhood: 'Abdoun' });
    expect(matchLocation(conflictCity, {
      governorateSlug: 'amman', districtSlug: 'marka', neighborhood: 'Abdoun',
    }, textMatch)).toBe(false);
  });

  // 5. Legacy NULL district slug with conflicting city text rejects.
  it('rejects legacy NULL district slug with conflicting city text', () => {
    const conflictCityText = base({ city: 'Zarqa', neighborhood: 'Abdoun' });
    expect(matchLocation(conflictCityText, {
      governorateSlug: 'amman', districtSlug: 'marka', cityEn: 'Amman', neighborhood: 'Abdoun',
    }, textMatch)).toBe(false);
  });

  // 6. Legacy NULL district slug and NULL city slug with identical neighborhood text rejects.
  it('rejects legacy NULL district and NULL city slug with identical neighborhood text under another city', () => {
    const crossCity = base({ city: 'Zarqa', neighborhood: 'Abdoun' });
    expect(matchLocation(crossCity, {
      governorateSlug: 'amman', districtSlug: 'marka', cityEn: 'Amman', neighborhood: 'Abdoun',
    }, textMatch)).toBe(false);
  });

  // 7. Legacy listing with missing/ambiguous parent data rejects.
  it('rejects legacy listing with missing/ambiguous parent data when district filter is active', () => {
    const ambiguous = base({ city: 'Abdoun', neighborhood: 'Abdoun' });
    expect(matchLocation(ambiguous, {
      governorateSlug: 'amman', districtSlug: 'marka', neighborhood: 'Abdoun',
    }, textMatch)).toBe(false);

    // Also test completely missing city with cityEn in filter
    const missingCity = base({ city: '', neighborhood: 'Abdoun' });
    expect(matchLocation(missingCity, {
      governorateSlug: 'amman', districtSlug: 'marka', cityEn: 'Amman', neighborhood: 'Abdoun',
    }, textMatch)).toBe(false);
  });

  // 8. Existing city-only and no-district behavior remains unchanged.
  it('preserves existing city-only and no-district behavior', () => {
    const item = base({ citySlug: 'amman', neighborhood: 'Abdoun' });
    expect(matchLocation(item, { governorateSlug: 'amman' }, textMatch)).toBe(true);
    expect(matchLocation(item, { governorateSlug: 'zarqa' }, textMatch)).toBe(false);
    expect(matchLocation(item, {}, textMatch)).toBe(true);
  });

  // Original tests preserved
  it('rejects the same neighborhood label from another city for neighborhood filter', () => {
    const otherCity = base({ city: 'Zarqa', neighborhood: 'Abdoun' });
    expect(matchLocation(otherCity, {
      neighborhood: 'Abdoun', cityEn: 'Amman', governorateSlug: 'amman', neighborhoodSlug: 'abdoun',
    }, textMatch)).toBe(false);
  });

  it('returns a null-slug record only when city text proves the parent for neighborhood filter', () => {
    const legacy = base({ city: 'Amman', neighborhood: 'Abdoun' });
    expect(matchLocation(legacy, {
      neighborhood: 'Abdoun', cityEn: 'Amman', governorateSlug: 'amman', neighborhoodSlug: 'abdoun',
    }, textMatch)).toBe(true);
  });

  it('excludes an ambiguous null-slug record when city cannot be proven for neighborhood filter', () => {
    const ambiguous = base({ city: 'Abdoun', neighborhood: 'Abdoun' });
    expect(matchLocation(ambiguous, {
      neighborhood: 'Abdoun', governorateSlug: 'amman', neighborhoodSlug: 'abdoun',
    }, textMatch)).toBe(false);
  });
});
