/**
 * Anti-spam rule: buyer can send at most 6 messages per conversation.
 * Pure function — no side effects, no external dependencies.
 */
export const MAX_BUYER_MESSAGES = 6;

export interface CanSendMessageResult {
  allowed: boolean;
  reason?: 'quota-exceeded' | 'empty-message' | 'too-long';
}

export function canSendMessage(
  messageText: string,
  existingMessages: readonly { fromBuyer: boolean }[],
): CanSendMessageResult {
  const trimmed = messageText.trim();

  if (trimmed.length === 0) {
    return { allowed: false, reason: 'empty-message' };
  }

  if (trimmed.length > 2000) {
    return { allowed: false, reason: 'too-long' };
  }

  const buyerMessageCount = existingMessages.filter((m) => m.fromBuyer).length;

  if (buyerMessageCount >= MAX_BUYER_MESSAGES) {
    return { allowed: false, reason: 'quota-exceeded' };
  }

  return { allowed: true };
}
