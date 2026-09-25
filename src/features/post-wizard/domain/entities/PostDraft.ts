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
}

export interface PostDraftWithMeta extends PostDraft {
  readonly step: DraftStep;
  readonly lastUpdatedAt: string;
}
