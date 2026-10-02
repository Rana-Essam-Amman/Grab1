import { globalStorage, marketStorage } from '@/shared/lib/marketStorage';
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

const DRAFT_SCHEMA = z.object({
  categorySlug: z.string(),
  subcategorySlug: z.string(),
  photos: z.array(z.string()),
  city: z.string(),
  neighborhood: z.string(),
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
  constructor(private readonly resolveMarket: () => string | undefined = () => undefined) {}

  private getStore() {
    const m = this.resolveMarket();
    return isValidMarketCode(m) ? marketStorage(m as MarketCode) : globalStorage();
  }

  async getCurrent(): Promise<PostDraftWithMeta | null> {
    const raw = this.getStore().get<unknown>(STORAGE_KEY);
    if (raw == null) return null;
    const parsed = DRAFT_SCHEMA.safeParse(raw);
    return parsed.success ? (parsed.data as PostDraftWithMeta) : null;
  }

  async save(draft: PostDraftWithMeta): Promise<void> {
    const parsed = DRAFT_SCHEMA.safeParse(draft);
    if (!parsed.success) return;
    this.getStore().set(STORAGE_KEY, parsed.data);
  }

  async clear(): Promise<void> {
    this.getStore().remove(STORAGE_KEY);
  }
}
