import type { DraftStep, PostDraft } from '../entities/PostDraft';

export type CanAdvanceReason =
  | 'no-category'
  | 'no-subcategory'
  | 'no-photos'
  | 'no-city'
  | 'no-neighborhood'
  | 'no-note';

export interface CanAdvanceResult {
  allowed: boolean;
  reason?: CanAdvanceReason;
}

export const MIN_PHOTOS = 1;

export function canAdvanceStep(
  currentStep: DraftStep,
  draft: PostDraft,
): CanAdvanceResult {
  switch (currentStep) {
    case 'category':
      return draft.categorySlug
        ? { allowed: true }
        : { allowed: false, reason: 'no-category' };
    case 'subcategory':
      return draft.subcategorySlug
        ? { allowed: true }
        : { allowed: false, reason: 'no-subcategory' };
    case 'photos':
      return draft.photos.length >= MIN_PHOTOS
        ? { allowed: true }
        : { allowed: false, reason: 'no-photos' };
    case 'location':
      if (!draft.city) return { allowed: false, reason: 'no-city' };
      if (!draft.neighborhood)
        return { allowed: false, reason: 'no-neighborhood' };
      return { allowed: true };
    case 'ai-draft':
      return draft.noteText.trim().length > 0
        ? { allowed: true }
        : { allowed: false, reason: 'no-note' };
    case 'review':
      return { allowed: true };
  }
}
