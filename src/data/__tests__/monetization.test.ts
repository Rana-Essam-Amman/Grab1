import { describe, it, expect } from 'vitest';
import {
  MONETIZATION_MATRIX,
  getFreeAdLimitForCategory,
  validateAdQuotaAvailability,
  executeAutoBumpScheduler,
} from '../monetization';

describe('Data Layer - Monetization & Regional Quota Rules', () => {
  it('MONETIZATION_MATRIX contains pricing packages for all 5 regional markets', () => {
    const markets = ['JO', 'LB', 'PS', 'SY', 'SA'];
    markets.forEach((code) => {
      expect(MONETIZATION_MATRIX.packages[code]).toBeDefined();
      expect(MONETIZATION_MATRIX.packages[code].countryCode).toBe(code);
      expect(MONETIZATION_MATRIX.packages[code].turboAdCost).toBeGreaterThan(0);
      expect(MONETIZATION_MATRIX.packages[code].autoBumpCost).toBeGreaterThan(0);
      expect(MONETIZATION_MATRIX.packages[code].vipStoreMonthlyCost).toBeGreaterThan(0);
    });
  });

  it('verifies correct currency mapping per market in MONETIZATION_MATRIX', () => {
    expect(MONETIZATION_MATRIX.packages.JO.currency).toBe('JOD');
    expect(MONETIZATION_MATRIX.packages.SA.currency).toBe('SAR');
    expect(MONETIZATION_MATRIX.packages.SY.currency).toBe('USD');
    expect(MONETIZATION_MATRIX.packages.LB.currency).toBe('USD');
    expect(MONETIZATION_MATRIX.packages.PS.currency).toBe('ILS');
  });

  it('getFreeAdLimitForCategory returns 3 for premium categories and 10 for general categories', () => {
    expect(getFreeAdLimitForCategory('motors')).toBe(3);
    expect(getFreeAdLimitForCategory('real-estate')).toBe(3);
    expect(getFreeAdLimitForCategory('سيارات')).toBe(3);
    expect(getFreeAdLimitForCategory('عقارات')).toBe(3);

    expect(getFreeAdLimitForCategory('electronics')).toBe(10);
    expect(getFreeAdLimitForCategory('fashion')).toBe(10);
    expect(getFreeAdLimitForCategory('home-appliances')).toBe(10);
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
    expect(result.limit).toBe(10);
  });

  it('validateAdQuotaAvailability blocks user when count reaches free limit', () => {
    const mockListings = [
      { userId: 'user-1', countryCode: 'JO', categorySlug: 'motors' },
      { userId: 'user-1', countryCode: 'JO', categorySlug: 'motors' },
      { userId: 'user-1', countryCode: 'JO', categorySlug: 'motors' },
    ];

    const result = validateAdQuotaAvailability(
      mockListings,
      'user-1',
      'JO',
      'motors'
    );

    expect(result.allowed).toBe(false);
    expect(result.activeCount).toBe(3);
    expect(result.limit).toBe(3);
  });

  it('validateAdQuotaAvailability provides unlimited bypass gate for VIP merchants', () => {
    const mockListings = [
      { userId: 'vip-user', countryCode: 'JO', categorySlug: 'motors' },
      { userId: 'vip-user', countryCode: 'JO', categorySlug: 'motors' },
      { userId: 'vip-user', countryCode: 'JO', categorySlug: 'motors' },
      { userId: 'vip-user', countryCode: 'JO', categorySlug: 'motors' },
    ];

    const result = validateAdQuotaAvailability(
      mockListings,
      'vip-user',
      'JO',
      'motors',
      true // isVipShop
    );

    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(999);
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

  it('executeAutoBumpScheduler bumps active listings older than 24 hours', () => {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();

    const listings = [
      {
        id: 'ad-1',
        isAutoBumpActive: true,
        lastBumpedAt: twoDaysAgo,
      },
      {
        id: 'ad-2',
        isAutoBumpActive: true,
        lastBumpedAt: oneHourAgo,
      },
      {
        id: 'ad-3',
        isAutoBumpActive: false,
        lastBumpedAt: twoDaysAgo,
      },
    ];

    const updated = executeAutoBumpScheduler(listings);

    // ad-1 should have its timestamp refreshed
    expect(new Date(updated[0].lastBumpedAt!).getTime()).toBeGreaterThan(
      new Date(twoDaysAgo).getTime()
    );
    // ad-2 was bumped recently so lastBumpedAt should stay unchanged
    expect(updated[1].lastBumpedAt).toBe(oneHourAgo);
    // ad-3 is not auto-bump active
    expect(updated[2].lastBumpedAt).toBe(twoDaysAgo);
  });
});
