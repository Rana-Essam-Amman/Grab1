import { describe, it, expect } from 'vitest';
import { canPromoteListing } from '../rules/canPromoteListing';

const now = '2026-09-16T12:00:00Z';
const future = '2026-12-31T12:00:00Z';
const past = '2025-01-01T12:00:00Z';

describe('canPromoteListing', () => {
  it('allows promoting a listing with no active promotions', () => {
    const r = canPromoteListing('l1', [], now);
    expect(r.allowed).toBe(true);
  });

  it('allows promoting when previous promotion expired', () => {
    const r = canPromoteListing(
      'l1',
      [{ listingId: 'l1', promotedUntil: past, tier: 'basic' }],
      now,
    );
    expect(r.allowed).toBe(true);
  });

  it('blocks promoting when same listing is already actively promoted', () => {
    const r = canPromoteListing(
      'l1',
      [{ listingId: 'l1', promotedUntil: future, tier: 'basic' }],
      now,
    );
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('already-promoted');
  });

  it('allows promoting when other listings are promoted', () => {
    const r = canPromoteListing(
      'l1',
      [{ listingId: 'other', promotedUntil: future, tier: 'premium' }],
      now,
    );
    expect(r.allowed).toBe(true);
  });
});
