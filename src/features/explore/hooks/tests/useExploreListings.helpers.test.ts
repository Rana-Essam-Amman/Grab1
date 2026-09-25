import { describe, it, expect } from 'vitest';
import { Listing } from '@/types';
import {
  countCityListings,
  computeAdaptiveFilterMode,
} from '../useExploreListings.helpers';

const createMockListing = (city?: string): Listing =>
  ({
    id: 'test-1',
    title: 'Test Listing',
    price: 100,
    currency: 'JOD',
    countryCode: 'JO',
    city,
    categorySlug: 'electronics',
    createdAt: new Date().toISOString(),
  } as unknown as Listing);

describe('useExploreListings.helpers', () => {
  describe('countCityListings', () => {
    it('matches cityAr', () => {
      const listings = [
        createMockListing('عمان'),
        createMockListing('إربد'),
      ];
      expect(countCityListings(listings, 'عمان', 'Amman')).toBe(1);
    });

    it('matches cityEn', () => {
      const listings = [
        createMockListing('Amman'),
        createMockListing('Zarqa'),
      ];
      expect(countCityListings(listings, 'عمان', 'Amman')).toBe(1);
    });

    it('matches listings without a city as fallback', () => {
      const listings = [
        createMockListing(undefined),
        createMockListing(''),
      ];
      expect(countCityListings(listings, 'عمان', 'Amman')).toBe(2);
    });

    it('returns 0 when no listings match', () => {
      const listings = [
        createMockListing('إربد'),
        createMockListing('Irbid'),
      ];
      expect(countCityListings(listings, 'عمان', 'Amman')).toBe(0);
    });
  });

  describe('computeAdaptiveFilterMode', () => {
    it('returns city when userMode is city even with sparse density', () => {
      expect(computeAdaptiveFilterMode('city', 5, 20)).toBe('city');
    });

    it('returns all when userMode is all even with high density', () => {
      expect(computeAdaptiveFilterMode('all', 50, 20)).toBe('all');
    });

    it('returns city when userMode is null and density is dense', () => {
      expect(computeAdaptiveFilterMode(null, 25, 20)).toBe('city');
    });

    it('returns all when userMode is null and density is sparse', () => {
      expect(computeAdaptiveFilterMode(null, 5, 20)).toBe('all');
    });

    it('returns city when userMode is null and density is exactly at threshold', () => {
      expect(computeAdaptiveFilterMode(null, 20, 20)).toBe('city');
    });
  });
});
