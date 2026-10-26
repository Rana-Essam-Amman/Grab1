import { create } from 'zustand';
import { PostDraft } from '@/types';
import { getBrowseCountryCode, getUISnapshot } from '@/shared/store-getters/ui.getter';
import type { DraftRepository } from '../data/repositories/DraftRepository';
import { LocalStorageDraftAdapter } from '../data/adapters/LocalStorageDraftAdapter';
import type { PostDraftWithMeta } from '../domain';
import { getInitialDraft } from './draft.helpers';

const draftRepository: DraftRepository = new LocalStorageDraftAdapter(
  () => getBrowseCountryCode()
);

export interface DraftState {
  postDraft: PostDraft;
  updatePostDraft: (updates: Partial<PostDraft>) => void;
  resetPostDraft: () => void;
  resetDraftOnMarketChange: () => void;
  startPostFlow: () => void;
}

export const useDraftStore = create<DraftState>()((set, get) => ({
  postDraft: getInitialDraft(),

  updatePostDraft: (updates) => {
    set((state) => ({ postDraft: { ...state.postDraft, ...updates } }));
    const draftWithMeta: PostDraftWithMeta = {
      ...get().postDraft,
      step: 'review',
      lastUpdatedAt: new Date().toISOString(),
    };
    draftRepository.save(draftWithMeta).catch(console.error);
  },

  resetPostDraft: () => {
    const newDraft = getInitialDraft();
    set({ postDraft: newDraft });
    const draftWithMeta: PostDraftWithMeta = {
      ...newDraft,
      step: 'category',
      lastUpdatedAt: new Date().toISOString(),
    };
    draftRepository.save(draftWithMeta).catch(console.error);
  },

  resetDraftOnMarketChange: () => {
    set({ postDraft: getInitialDraft() });
  },

  startPostFlow: () => {
    get().resetPostDraft();
    getUISnapshot().navigateTo('post-category');
  },
}));

// Initial rehydrate uses the CURRENT market at boot time.
try {
  draftRepository.getCurrent().then((draft) => {
    if (!draft) return;
    useDraftStore.setState({
      postDraft: {
        categorySlug: draft.categorySlug,
        subcategorySlug: draft.subcategorySlug,
        photos: [...draft.photos],
        city: draft.city, neighborhood: draft.neighborhood,
        citySlug: draft.citySlug,
        districtSlug: draft.districtSlug,
        neighborhoodSlug: draft.neighborhoodSlug,
        site: draft.site, noteText: draft.noteText,
      },
    });
  }).catch((err) => console.warn('[Draft] Rehydrate failed:', err));
} catch (err) {
  console.warn('[Draft] Initial rehydrate skipped during boot:', err);
}
