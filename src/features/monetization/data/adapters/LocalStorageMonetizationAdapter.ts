import type { AiQuota, PromotedAd } from '../../domain';
import type { MonetizationRepository } from '../repositories/MonetizationRepository';
import { globalStorage } from '@/shared/lib/marketStorage';
import { z } from 'zod';

const AI_QUOTA_KEY = 'monetization_ai_quota_v1';
const PROMOTIONS_KEY = 'monetization_promotions_v1';
const DEFAULT_QUOTA: AiQuota = {
  dailyLimit: 3,
  usedToday: 0,
  lastResetAt: new Date().toISOString(),
};

const AI_QUOTA_SCHEMA = z.object({
  dailyLimit: z.number(),
  usedToday: z.number(),
  lastResetAt: z.string(),
});

const PROMOTED_AD_SCHEMA = z.object({
  listingId: z.string(),
  tier: z.enum(['basic', 'premium']),
  promotedUntil: z.string(),
});

const PROMOTIONS_ARRAY_SCHEMA = z.array(PROMOTED_AD_SCHEMA);

/**
 * LocalStorage implementation of MonetizationRepository.
 */
export class LocalStorageMonetizationAdapter implements MonetizationRepository {
  async getAiQuota(): Promise<AiQuota> {
    return this._readQuota();
  }

  async saveAiQuota(quota: AiQuota): Promise<void> {
    this._writeQuota(quota);
  }

  async consumeOneCredit(): Promise<AiQuota> {
    const quota = await this.getAiQuota();
    const updated: AiQuota = {
      ...quota,
      usedToday: quota.usedToday + 1,
    };
    this._writeQuota(updated);
    return updated;
  }

  async resetDailyQuota(): Promise<AiQuota> {
    const quota = await this.getAiQuota();
    const updated: AiQuota = {
      ...quota,
      usedToday: 0,
      lastResetAt: new Date().toISOString(),
    };
    this._writeQuota(updated);
    return updated;
  }

  async getActivePromotions(): Promise<PromotedAd[]> {
    return this._readPromotions();
  }

  async promoteListing(listingId: string, tier: 'basic' | 'premium', until: string): Promise<void> {
    const promotions = this._readPromotions();
    const existingIndex = promotions.findIndex((p) => p.listingId === listingId);
    
    const ad: PromotedAd = { listingId, tier, promotedUntil: until };
    if (existingIndex >= 0) {
      promotions[existingIndex] = ad;
    } else {
      promotions.push(ad);
    }
    this._writePromotions(promotions);
  }

  async removeExpiredPromotions(): Promise<void> {
    const promotions = this._readPromotions();
    const now = new Date().getTime();
    
    const active = promotions.filter((p) => {
      const until = new Date(p.promotedUntil).getTime();
      return until > now;
    });
    this._writePromotions(active);
  }

  private _readQuota(): AiQuota {
    try {
      const parsed = globalStorage().get<unknown>(AI_QUOTA_KEY);
      const result = AI_QUOTA_SCHEMA.safeParse(parsed);
      return result.success ? result.data : DEFAULT_QUOTA;
    } catch {
      return DEFAULT_QUOTA;
    }
  }

  private _writeQuota(quota: AiQuota): void {
    globalStorage().set(AI_QUOTA_KEY, quota);
  }

  private _readPromotions(): PromotedAd[] {
    try {
      const parsed = globalStorage().get<unknown>(PROMOTIONS_KEY);
      const result = PROMOTIONS_ARRAY_SCHEMA.safeParse(parsed);
      return result.success ? result.data : [];
    } catch {
      return [];
    }
  }

  private _writePromotions(promotions: PromotedAd[]): void {
    globalStorage().set(PROMOTIONS_KEY, promotions);
  }
}

