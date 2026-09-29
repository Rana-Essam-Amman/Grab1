import { create } from 'zustand';
import { PostDraft } from '@/types';
import { getUISnapshot } from '@/shared/store-getters/ui.getter';
import type { DraftRepository } from '../data/repositories/DraftRepository';
import { LocalStorageDraftAdapter } from '../data/adapters/LocalStorageDraftAdapter';
import type { PostDraftWithMeta } from '../domain';

const draftRepository: DraftRepository = new LocalStorageDraftAdapter();

export interface DraftState {
  postDraft: PostDraft;
  updatePostDraft: (updates: Partial<PostDraft>) => void;
  resetPostDraft: () => void;
  startPostFlow: () => void;
}

const defaultDraft: PostDraft = {
  categorySlug: 'motors',
  subcategorySlug: 'cars',
  photos: [],
  city: '',
  neighborhood: '',
  site: '',
  noteText: '',
};

export const useDraftStore = create<DraftState>()((set, get) => ({
  postDraft: defaultDraft,

  updatePostDraft: (updates) => {
    set((state) => ({
      postDraft: { ...state.postDraft, ...updates },
    }));
    const current = get().postDraft;
    const draftWithMeta: PostDraftWithMeta = {
      ...current,
      step: 'review',
      lastUpdatedAt: new Date().toISOString(),
    };
    draftRepository.save(draftWithMeta).catch(console.error);
  },

  resetPostDraft: () => {
    const newDraft: PostDraft = {
      categorySlug: 'motors',
      subcategorySlug: 'cars',
      photos: [],
      city: '',
      neighborhood: '',
      site: '',
      noteText: '',
    };
    set(() => ({
      postDraft: newDraft,
    }));

    const draftWithMeta: PostDraftWithMeta = {
      ...newDraft,
      step: 'category',
      lastUpdatedAt: new Date().toISOString(),
    };
    draftRepository.save(draftWithMeta).catch(console.error);
  },

  startPostFlow: () => {
    get().resetPostDraft();
    getUISnapshot().navigateTo('post-category');
  },
}));

draftRepository.getCurrent().then((draft) => {
  if (draft) {
    useDraftStore.setState({
      postDraft: {
        categorySlug: draft.categorySlug,
        subcategorySlug: draft.subcategorySlug,
        photos: [...draft.photos],
        city: draft.city,
        neighborhood: draft.neighborhood,
        site: draft.site,
        noteText: draft.noteText,
      },
    });
  }
}).catch(console.error);
