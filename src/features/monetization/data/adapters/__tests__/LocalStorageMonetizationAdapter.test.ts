import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageMonetizationAdapter } from '../LocalStorageMonetizationAdapter';
import type { AiQuota, PromotedAd } from '../../../domain';

describe('LocalStorageMonetizationAdapter', () => {
  let adapter: LocalStorageMonetizationAdapter;
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key: string) => storage[key] ?? null,
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key: string, value: string) => { storage[key] = value; },
    );
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(
      (key: string) => { delete storage[key]; },
    );
    adapter = new LocalStorageMonetizationAdapter();
  });

  describe('AI Quota', () => {
    it('returns default quota when storage is empty', async () => {
      const quota = await adapter.getAiQuota();
      expect(quota.dailyLimit).toBe(3);
      expect(quota.usedToday).toBe(0);
    });

    it('saves and retrieves quota', async () => {
      await adapter.saveAiQuota({ dailyLimit: 5, usedToday: 2, lastResetAt: '2023-01-01' });
      const quota = await adapter.getAiQuota();
      expect(quota.dailyLimit).toBe(5);
      expect(quota.usedToday).toBe(2);
      expect(quota.lastResetAt).toBe('2023-01-01');
    });

    it('consumes one credit', async () => {
      await adapter.saveAiQuota({ dailyLimit: 3, usedToday: 1, lastResetAt: '2023-01-01' });
      const updated = await adapter.consumeOneCredit();
      expect(updated.usedToday).toBe(2);
      
      const saved = await adapter.getAiQuota();
      expect(saved.usedToday).toBe(2);
    });

    it('resets daily quota', async () => {
      await adapter.saveAiQuota({ dailyLimit: 3, usedToday: 3, lastResetAt: '2023-01-01' });
      const reset = await adapter.resetDailyQuota();
      expect(reset.usedToday).toBe(0);
      expect(reset.lastResetAt).not.toBe('2023-01-01');
    });
  });

  describe('Promotions', () => {
    it('returns empty array when no promotions exist', async () => {
      const promos = await adapter.getActivePromotions();
      expect(promos).toEqual([]);
    });

    it('promotes a listing and retrieves it', async () => {
      await adapter.promoteListing('l1', 'premium', '2030-01-01T00:00:00Z');
      const promos = await adapter.getActivePromotions();
      expect(promos.length).toBe(1);
      expect(promos[0].listingId).toBe('l1');
      expect(promos[0].tier).toBe('premium');
    });

    it('updates existing promotion if listing is already promoted', async () => {
      await adapter.promoteListing('l1', 'basic', '2030-01-01T00:00:00Z');
      await adapter.promoteListing('l1', 'premium', '2030-02-01T00:00:00Z');
      const promos = await adapter.getActivePromotions();
      expect(promos.length).toBe(1);
      expect(promos[0].tier).toBe('premium');
      expect(promos[0].promotedUntil).toBe('2030-02-01T00:00:00Z');
    });

    it('removes expired promotions', async () => {
      // One expired, one valid
      await adapter.promoteListing('expired', 'basic', '2000-01-01T00:00:00Z');
      await adapter.promoteListing('valid', 'premium', '2099-01-01T00:00:00Z');
      
      await adapter.removeExpiredPromotions();
      
      const promos = await adapter.getActivePromotions();
      expect(promos.length).toBe(1);
      expect(promos[0].listingId).toBe('valid');
    });
  });
});
