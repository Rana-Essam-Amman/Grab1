import type { PromotedAd } from '../entities/AiQuota';

export type CanPromoteReason = 'already-promoted' | 'invalid-tier';

export interface CanPromoteResult {
  allowed: boolean;
  reason?: CanPromoteReason;
}

/**
 * Pure rule: a listing can be promoted if not already actively promoted.
 */
export function canPromoteListing(
  listingId: string,
  activePromotions: readonly PromotedAd[],
  now: string,
): CanPromoteResult {
  const active = activePromotions.find(
    (p) => p.listingId === listingId && p.promotedUntil > now,
  );

  if (active) {
    return { allowed: false, reason: 'already-promoted' };
  }

  return { allowed: true };
}
