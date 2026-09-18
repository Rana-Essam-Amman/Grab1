import type { PostDraftWithMeta } from '../../domain';

export interface DraftRepository {
  getCurrent(): Promise<PostDraftWithMeta | null>;
  save(draft: PostDraftWithMeta): Promise<void>;
  clear(): Promise<void>;
}
