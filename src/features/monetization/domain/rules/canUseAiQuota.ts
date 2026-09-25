import type { AiQuota } from '../entities/AiQuota';

export type CanUseQuotaReason = 'quota-exhausted' | 'invalid-quota';

export interface CanUseQuotaResult {
  allowed: boolean;
  remaining: number;
  reason?: CanUseQuotaReason;
}

/**
 * Pure rule: user can use AI quota if they have remaining credits today.
 */
export function canUseAiQuota(quota: AiQuota): CanUseQuotaResult {
  if (quota.dailyLimit <= 0 || quota.usedToday < 0) {
    return { allowed: false, remaining: 0, reason: 'invalid-quota' };
  }

  const remaining = Math.max(0, quota.dailyLimit - quota.usedToday);

  if (remaining === 0) {
    return { allowed: false, remaining: 0, reason: 'quota-exhausted' };
  }

  return { allowed: true, remaining };
}
