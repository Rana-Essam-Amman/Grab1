/**
 * Cross-market isolation rule: buyer cannot start a conversation
 * with a listing from a different market than their active one.
 * Pure function.
 */
export interface CanStartConversationInput {
  listingCountryCode: string;
  activeMarketCountryCode: string;
}

export interface CanStartConversationResult {
  allowed: boolean;
  reason?: 'cross-market' | 'invalid-market';
}

const VALID_MARKETS = ['JO', 'SA', 'PS', 'LB', 'SY'] as const;

export function canStartConversation(
  input: CanStartConversationInput,
): CanStartConversationResult {
  const { listingCountryCode, activeMarketCountryCode } = input;

  if (!(VALID_MARKETS as readonly string[]).includes(listingCountryCode)) {
    return { allowed: false, reason: 'invalid-market' };
  }

  if (listingCountryCode !== activeMarketCountryCode) {
    return { allowed: false, reason: 'cross-market' };
  }

  return { allowed: true };
}
