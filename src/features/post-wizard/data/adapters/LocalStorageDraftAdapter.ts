import { marketStorage } from '@/shared/lib/marketStorage';
import type { DraftRepository } from '../repositories/DraftRepository';
import type { PostDraftWithMeta } from '../../domain';
import { z } from 'zod';
import type { MarketCode } from '@/data/markets/types';
import { isValidMarketCode } from '@/data/markets/config';

const STORAGE_KEY = 'post_draft_v1';

const GENERATED_SCHEMA = z.object({
  title: z.string(),
  description: z.string(),
  price: z.string(),
  categorySlug: z.string(),
  subcategorySlug: z.string(),
  missing: z.array(z.string()),
}).passthrough();

const DRAFT_SCHEMA: z.ZodType<PostDraftWithMeta> = z.object({
  categorySlug: z.string(),
  subcategorySlug: z.string(),
  photos: z.array(z.string()),
  city: z.string(),
  neighborhood: z.string(),
  citySlug: z.string().optional(),
  districtSlug: z.string().optional(),
  neighborhoodSlug: z.string().optional(),
  site: z.string(),
  noteText: z.string(),
  step: z.enum(['category', 'subcategory', 'photos', 'location', 'ai-draft', 'review']),
  lastUpdatedAt: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  generated: GENERATED_SCHEMA.optional(),
});

/**
 * Drafts are MARKET-SCOPED. A draft created in JO must never be readable
 * from LB. The adapter takes a market-resolver function so it can react
 * to market switches at runtime (rather than snapshot at construction).
 */
export class LocalStorageDraftAdapter implements DraftRepository {
  constructor(private readonly resolveMarket: () => string | undefined) {}

  private requireMarket(): MarketCode {
    const market = this.resolveMarket();
    if (!isValidMarketCode(market)) {
      throw new Error(`[Draft] Invalid or missing market: ${String(market)}`);
    }
    return market;
  }

  async getCurrent(): Promise<PostDraftWithMeta | null> {
    return marketStorage(this.requireMarket()).readValidated(STORAGE_KEY, DRAFT_SCHEMA, null);
  }

  async save(draft: PostDraftWithMeta): Promise<void> {
    const market = this.requireMarket();
    const parsed = DRAFT_SCHEMA.safeParse(draft);
    if (!parsed.success) return;
    const stored = marketStorage(market).writeValidated(STORAGE_KEY, DRAFT_SCHEMA, parsed.data);
    if (!stored) throw new Error('[Draft] Failed to persist draft.');
  }

  async clear(): Promise<void> {
    const removed = marketStorage(this.requireMarket()).removeValidated(STORAGE_KEY);
    if (!removed) throw new Error('[Draft] Failed to remove draft.');
  }
}
