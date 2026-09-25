import { globalStorage } from '@/shared/lib/marketStorage';
import type { DraftRepository } from '../repositories/DraftRepository';
import type { PostDraftWithMeta } from '../../domain';
import { readValidated, writeValidated, removeStored } from '@/shared/lib/safeStorage';
import { z } from 'zod';

const STORAGE_KEY = 'post_draft_v1';

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
});

/**
 * LocalStorage implementation of DraftRepository.
 * Handles persistence of in-flight ad creation drafts.
 * Swappable with FirestoreDraftAdapter in the future.
 */
export class LocalStorageDraftAdapter implements DraftRepository {
  async getCurrent(): Promise<PostDraftWithMeta | null> {
    return readValidated(STORAGE_KEY, DRAFT_SCHEMA, null) as PostDraftWithMeta | null;
  }

  async save(draft: PostDraftWithMeta): Promise<void> {
    writeValidated(STORAGE_KEY, DRAFT_SCHEMA, draft);
  }

  async clear(): Promise<void> {
    removeStored(STORAGE_KEY);
  }
}
