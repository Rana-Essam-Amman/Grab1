import type { GeneratedListing } from '@/types';

export type DraftStep =
  | 'category'
  | 'subcategory'
  | 'photos'
  | 'location'
  | 'ai-draft'
  | 'review';

export interface PostDraft {
  readonly categorySlug: string;
  readonly subcategorySlug: string;
  readonly photos: readonly string[];
  readonly city: string;
  readonly neighborhood: string;
  readonly site: string;
  readonly noteText: string;
  readonly title?: string;
  readonly description?: string;
  readonly price?: string;
  readonly generated?: GeneratedListing;
}

export interface PostDraftWithMeta extends PostDraft {
  readonly step: DraftStep;
  readonly lastUpdatedAt: string;
}
