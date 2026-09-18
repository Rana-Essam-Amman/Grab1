export interface AiQuota {
  readonly dailyLimit: number;
  readonly usedToday: number;
  readonly lastResetAt: string;
}

export interface PromotedAd {
  readonly listingId: string;
  readonly promotedUntil: string;
  readonly tier: 'basic' | 'premium';
}
