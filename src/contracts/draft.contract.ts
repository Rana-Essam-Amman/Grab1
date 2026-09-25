import type { PostDraft } from '@/types';

export interface DraftStoreContract {
  postDraft: PostDraft;
  startPostFlow: () => void;
  updatePostDraft: (updates: Partial<PostDraft>) => void;
  resetPostDraft: () => void;
}
