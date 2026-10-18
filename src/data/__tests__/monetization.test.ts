import { describe, it, expect } from 'vitest';
import {
  MONETIZATION_MATRIX,
  validateAdQuotaAvailability,
} from '../monetization';

describe('Data Layer - Monetization & Regional Quota Rules', () => {
  it('MONETIZATION_MATRIX contains pricing packages for all 5 regional markets', () => {
    const markets = ['JO', 'LB', 'PS', 'SY', 'SA'];
    markets.forEach((code) => {
      expect(MONETIZATION_MATRIX.packages[code]).toBeDefined();
      expect(MONETIZATION_MATRIX.packages[code].countryCode).toBe(code);
      expect(MONETIZATION_MATRIX.packages[code].featuredAdCost).toBeGreaterThan(0);
    });
  });

  it('verifies correct currency mapping per market in MONETIZATION_MATRIX', () => {
    expect(MONETIZATION_MATRIX.packages.JO.currency).toBe('JOD');
    expect(MONETIZATION_MATRIX.packages.SA.currency).toBe('SAR');
    expect(MONETIZATION_MATRIX.packages.SY.currency).toBe('USD');
    expect(MONETIZATION_MATRIX.packages.LB.currency).toBe('USD');
    expect(MONETIZATION_MATRIX.packages.PS.currency).toBe('ILS');
  });

  it('validateAdQuotaAvailability allows user when count is strictly below limit', () => {
    const mockListings = [
      { userId: 'user-1', countryCode: 'JO', categorySlug: 'electronics' },
      { userId: 'user-1', countryCode: 'JO', categorySlug: 'electronics' },
    ];

    const result = validateAdQuotaAvailability(
      mockListings,
      'user-1',
      'JO',
      'electronics'
    );

    expect(result.allowed).toBe(true);
    expect(result.activeCount).toBe(2);
    expect(result.limit).toBe(20);
  });

  it('validateAdQuotaAvailability blocks user when count reaches free limit', () => {
    const mockListings = Array.from({ length: 20 }, () => ({
      userId: 'user-1',
      countryCode: 'JO',
      categorySlug: 'motors',
    }));

    const result = validateAdQuotaAvailability(
      mockListings,
      'user-1',
      'JO',
      'motors'
    );

    expect(result.allowed).toBe(false);
    expect(result.activeCount).toBe(20);
    expect(result.limit).toBe(20);
  });

  it('validateAdQuotaAvailability scopes quota per country correctly', () => {
    const mockListings = [
      { userId: 'user-1', countryCode: 'SA', categorySlug: 'motors' },
      { userId: 'user-1', countryCode: 'SA', categorySlug: 'motors' },
    ];

    // Testing quota for JO when user has 2 listings in SA
    const result = validateAdQuotaAvailability(
      mockListings,
      'user-1',
      'JO',
      'motors'
    );

    expect(result.allowed).toBe(true);
    expect(result.activeCount).toBe(0);
  });
});
