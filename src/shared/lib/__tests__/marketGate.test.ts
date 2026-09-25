import { describe, it, expect } from 'vitest';
import { 
  isValidMarket, 
  filterListingsByMarket, 
  canAccessListing, 
  canStartChat, 
  canPostIn, 
  getEffectiveMarket 
} from '../marketGate';
import { createMockListing } from '@/test/helpers';

describe('marketGate', () => {
  describe('isValidMarket', () => {
    it('should return true for valid market codes', () => {
      ['JO', 'LB', 'PS', 'SY', 'SA'].forEach(m => {
        expect(isValidMarket(m)).toBe(true);
      });
    });

    it('should return false for invalid market codes', () => {
      ['US', 'UK', '', 'jo', 'abc'].forEach(m => {
        expect(isValidMarket(m as any)).toBe(false);
      });
    });

    it('should handle null and undefined', () => {
      expect(isValidMarket(null as any)).toBe(false);
      expect(isValidMarket(undefined as any)).toBe(false);
    });
  });

  describe('filterListingsByMarket', () => {
    const listings = [
      createMockListing({ countryCode: 'JO' }),
      createMockListing({ countryCode: 'LB' }),
      createMockListing({ countryCode: 'JO' }),
    ];

    it('should filter listings correctly', () => {
      expect(filterListingsByMarket(listings, 'JO')).toHaveLength(2);
      expect(filterListingsByMarket(listings, 'LB')).toHaveLength(1);
      expect(filterListingsByMarket(listings, 'SA')).toHaveLength(0);
    });

    it('should return empty array for empty input', () => {
      expect(filterListingsByMarket([], 'JO')).toHaveLength(0);
    });

    it('should return empty array for invalid market', () => {
      expect(filterListingsByMarket(listings, 'US' as any)).toHaveLength(0);
    });

    it('should preserve listing order', () => {
      const filtered = filterListingsByMarket(listings, 'JO');
      expect(filtered[0]).toBe(listings[0]);
      expect(filtered[1]).toBe(listings[2]);
    });
  });

  describe('canAccessListing', () => {
    const listing = createMockListing({ countryCode: 'JO' });

    it('should return true if markets match', () => {
      expect(canAccessListing(listing, 'JO')).toBe(true);
    });

    it('should return false if markets do not match', () => {
      expect(canAccessListing(listing, 'LB')).toBe(false);
    });

    it('should return false if listing is null', () => {
      expect(canAccessListing(null as any, 'JO')).toBe(false);
      expect(canAccessListing(undefined as any, 'JO')).toBe(false);
    });

    it('should return false if market is empty', () => {
      expect(canAccessListing(listing, '' as any)).toBe(false);
    });
  });

  describe('canStartChat', () => {
    const listing = createMockListing({ countryCode: 'JO' });

    it('should return true for matching active market (guest)', () => {
      expect(canStartChat(listing, 'JO')).toBe(true);
    });

    it('should return false for mismatching active market (guest)', () => {
      expect(canStartChat(listing, 'LB')).toBe(false);
    });

    it('should return true for matching user country (auth)', () => {
      expect(canStartChat(listing, 'LB', 'JO')).toBe(true);
    });

    it('should return false for mismatching user country (auth)', () => {
      expect(canStartChat(listing, 'JO', 'LB')).toBe(false);
    });
  });

  describe('canPostIn', () => {
    it('should allow posting in active market if no user country is set', () => {
      expect(canPostIn('JO', 'JO')).toBe(true);
      expect(canPostIn('LB', 'JO')).toBe(false);
    });

    it('should allow posting only in user country if set', () => {
      expect(canPostIn('JO', 'JO', 'JO')).toBe(true);
      expect(canPostIn('JO', 'LB', 'JO')).toBe(true);
      expect(canPostIn('SA', 'LB', 'JO')).toBe(false);
    });
  });

  describe('getEffectiveMarket', () => {
    it('should return user country if provided', () => {
      expect(getEffectiveMarket('JO', 'LB')).toBe('LB');
    });

    it('should return active market if user country is not provided', () => {
      expect(getEffectiveMarket('JO')).toBe('JO');
      expect(getEffectiveMarket('JO', undefined)).toBe('JO');
    });
  });
});
