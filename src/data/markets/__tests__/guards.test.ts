import { describe, it, expect } from 'vitest';
import { assertSameMarket, isSameMarket, MarketViolationError } from '../guards';
import { scopedKey, marketFromKey, isScopedKey } from '../storage';

describe('Market isolation guards', () => {
  it('assertSameMarket passes when equal', () => {
    expect(() => assertSameMarket('JO', 'JO', 'test')).not.toThrow();
  });

  it('assertSameMarket throws on mismatch', () => {
    expect(() => assertSameMarket('JO', 'LB', 'listing-view')).toThrow(MarketViolationError);
  });

  it('assertSameMarket throws on undefined', () => {
    expect(() => assertSameMarket('JO', undefined, 'x')).toThrow(MarketViolationError);
    expect(() => assertSameMarket('JO', null, 'x')).toThrow(MarketViolationError);
  });

  it('isSameMarket returns true only for equal non-empty codes', () => {
    expect(isSameMarket('JO', 'JO')).toBe(true);
    expect(isSameMarket('JO', 'LB')).toBe(false);
    expect(isSameMarket('JO', undefined)).toBe(false);
    expect(isSameMarket(undefined, 'JO')).toBe(false);
  });
});

describe('Market-scoped storage keys', () => {
  it('scopedKey builds namespaced key', () => {
    expect(scopedKey('JO', 'post_draft')).toBe('fox:JO:post_draft');
    expect(scopedKey('LB', 'post_draft')).toBe('fox:LB:post_draft');
  });

  it('scopedKey falls back to JO for invalid input', () => {
    expect(scopedKey(undefined, 'x')).toBe('fox:JO:x');
    expect(scopedKey('XX', 'x')).toBe('fox:JO:x');
  });

  it('marketFromKey extracts market correctly', () => {
    expect(marketFromKey('fox:JO:post_draft')).toBe('JO');
    expect(marketFromKey('fox:LB:post_draft')).toBe('LB');
    expect(marketFromKey('fox:XX:post_draft')).toBe(null);
    expect(marketFromKey('unscoped')).toBe(null);
  });

  it('different markets produce different keys for same logical name', () => {
    const joKey = scopedKey('JO', 'post_draft');
    const lbKey = scopedKey('LB', 'post_draft');
    expect(joKey).not.toBe(lbKey);
  });

  it('isScopedKey detects properly scoped keys', () => {
    expect(isScopedKey('fox:JO:post_draft')).toBe(true);
    expect(isScopedKey('post_draft')).toBe(false);
    expect(isScopedKey('fox:XX:post_draft')).toBe(false);
  });
});
