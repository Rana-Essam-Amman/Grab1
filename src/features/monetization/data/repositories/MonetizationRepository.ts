import type { AiQuota, PromotedAd } from '../../domain';

export interface MonetizationRepository {
  getAiQuota(): Promise<AiQuota>;
  saveAiQuota(quota: AiQuota): Promise<void>;
  consumeOneCredit(): Promise<AiQuota>;
  resetDailyQuota(): Promise<AiQuota>;

  getActivePromotions(): Promise<PromotedAd[]>;
  promoteListing(listingId: string, tier: 'basic' | 'premium', until: string): Promise<void>;
  removeExpiredPromotions(): Promise<void>;
}
