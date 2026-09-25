import type { PostDraft } from '../entities/PostDraft';

export type CanPublishReason =
  | 'missing-category'
  | 'missing-subcategory'
  | 'no-photos'
  | 'missing-location'
  | 'empty-note';

export interface CanPublishResult {
  allowed: boolean;
  reason?: CanPublishReason;
}

export function canPublishDraft(draft: PostDraft): CanPublishResult {
  if (!draft.categorySlug) return { allowed: false, reason: 'missing-category' };
  if (!draft.subcategorySlug)
    return { allowed: false, reason: 'missing-subcategory' };
  if (draft.photos.length === 0) return { allowed: false, reason: 'no-photos' };
  if (!draft.city || !draft.neighborhood)
    return { allowed: false, reason: 'missing-location' };
  if (!draft.noteText.trim()) return { allowed: false, reason: 'empty-note' };
  return { allowed: true };
}
