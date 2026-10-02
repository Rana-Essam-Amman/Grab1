import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getBumpCount, recordBump, canBump } from '../bumpLimit';

// Mock UI getter for market
let mockedMarket = 'JO';
vi.mock('@/shared/store-getters/ui.getter', () => ({
  getBrowseCountryCode: () => mockedMarket,
}));

describe('bumpLimit — market-scoped', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedMarket = 'JO';
  });

  it('recordBump writes to a market-scoped key', () => {
    mockedMarket = 'JO';
    recordBump('listing-1');

    // The exact key shape is catch_JO_bump_listing-1_<date>
    const keys = Object.keys(localStorage).filter((k) => k.includes('bump_listing-1'));
    expect(keys.length).toBeGreaterThan(0);
    expect(keys[0]).toMatch(/^catch_JO_bump_listing-1_/);
  });

  it('JO and LB bumps are isolated', () => {
    mockedMarket = 'JO';
    recordBump('listing-1');
    recordBump('listing-1');
    expect(getBumpCount('listing-1')).toBe(2);

    mockedMarket = 'LB';
    expect(getBumpCount('listing-1')).toBe(0);
    recordBump('listing-1');
    expect(getBumpCount('listing-1')).toBe(1);

    mockedMarket = 'JO';
    expect(getBumpCount('listing-1')).toBe(2);
  });

  it('respects daily limit per market', () => {
    mockedMarket = 'SA';
    while (canBump('listing-9')) {
      recordBump('listing-9');
    }
    expect(canBump('listing-9')).toBe(false);

    mockedMarket = 'PS';
    expect(canBump('listing-9')).toBe(true);
  });
});
