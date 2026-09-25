import { useDraftStore } from '@/features/post-wizard/store/draft.slice';

export const useDraft = () => {
  const store = useDraftStore();
  return {
    postDraft: store.postDraft,
    updatePostDraft: store.updatePostDraft,
    resetPostDraft: store.resetPostDraft,
    startPostFlow: store.startPostFlow,
  };
};
