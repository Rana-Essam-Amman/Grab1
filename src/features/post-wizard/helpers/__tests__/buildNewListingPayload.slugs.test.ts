import { describe, it, expect } from 'vitest';
import { buildNewListingPayload } from '../buildNewListingPayload';
import type { PostDraft, UserProfile } from '@/types';

describe('buildNewListingPayload location slugs', () => {
  it('preserves city, district, and neighborhood slugs', () => {
    const postDraft: PostDraft = {
      title: 'Chair',
      price: '10',
      description: 'Wood',
      city: 'Amman',
      neighborhood: 'Wadi as Sir',
      citySlug: 'amman',
      districtSlug: 'amman-qasabah',
      neighborhoodSlug: 'wadi-as-sir',
      categorySlug: 'furniture',
      subcategorySlug: 'chairs',
      photos: [],
      site: '',
      noteText: '',
    };
    const user: UserProfile = {
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.c',
      phone: '079',
      countryCode: 'JO',
    };

    const listing = buildNewListingPayload({
      postDraft,
      user,
      browseCountryCode: 'JO',
      isAdmin: false,
      activeCurrency: 'JOD',
    });

    expect(listing.newListing.citySlug).toBe('amman');
    expect(listing.newListing.districtSlug).toBe('amman-qasabah');
    expect(listing.newListing.neighborhoodSlug).toBe('wadi-as-sir');
  });
});
