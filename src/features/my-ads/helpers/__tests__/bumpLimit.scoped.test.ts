import { describe, it, expect } from 'vitest';
import { getBumpCount, canBump, BUMP_DAILY_LIMIT } from '../bumpLimit';
import type { Listing } from '@/types';

const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

function stub(bumpsToday?: number, bumpsResetDate?: string): Listing {
  return {
    id: 'listing-1',
    userId: 'u1',
    title: '',
    description: '',
    price: '0',
    currency: 'JOD',
    countryCode: 'JO',
    city: '',
    neighborhood: '',
    categorySlug: '',
    subcategorySlug: '',
    imageUrl: '',
    images: [],
    sellerPhone: '',
    sellerName: '',
    createdAt: today,
    views: 0,
    attributes: [],
    bumpsToday,
    bumpsResetDate,
  };
}

describe('bumpLimit helpers (server-backed)', () => {
  it('BUMP_DAILY_LIMIT is 3', () => {
    expect(BUMP_DAILY_LIMIT).toBe(3);
  });

  it('returns 0 when no bumps_reset_date is set', () => {
    expect(getBumpCount(stub())).toBe(0);
    expect(getBumpCount(stub(2))).toBe(0);
  });

  it('returns 0 when bumps_reset_date is yesterday (stale)', () => {
    expect(getBumpCount(stub(2, yesterday))).toBe(0);
  });

  it('returns stored count when reset date is today', () => {
    expect(getBumpCount(stub(0, today))).toBe(0);
    expect(getBumpCount(stub(1, today))).toBe(1);
    expect(getBumpCount(stub(3, today))).toBe(3);
  });

  it('canBump is true below the daily limit', () => {
    expect(canBump(stub(0, today))).toBe(true);
    expect(canBump(stub(2, today))).toBe(true);
  });

  it('canBump is false at or above the daily limit', () => {
    expect(canBump(stub(3, today))).toBe(false);
    expect(canBump(stub(99, today))).toBe(false);
  });

  it('canBump is true when reset date is stale regardless of prior count', () => {
    expect(canBump(stub(3, yesterday))).toBe(true);
  });
});
