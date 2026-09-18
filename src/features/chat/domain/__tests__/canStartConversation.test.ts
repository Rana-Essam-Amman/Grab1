import { describe, it, expect } from 'vitest';
import { canStartConversation } from '../rules/canStartConversation';

describe('canStartConversation', () => {
  it('allows when listing market matches active market', () => {
    const result = canStartConversation({
      listingCountryCode: 'JO',
      activeMarketCountryCode: 'JO',
    });
    expect(result.allowed).toBe(true);
  });

  it('rejects cross-market conversations', () => {
    const result = canStartConversation({
      listingCountryCode: 'SA',
      activeMarketCountryCode: 'JO',
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('cross-market');
  });

  it('rejects invalid market codes', () => {
    const result = canStartConversation({
      listingCountryCode: 'US',
      activeMarketCountryCode: 'JO',
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('invalid-market');
  });
});
