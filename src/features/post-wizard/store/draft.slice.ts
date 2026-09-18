import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { PostDraft } from '@/types';
import { getBrowseCountryCode, getUISnapshot } from '@/shared/store-getters/ui.getter';
import { DEFAULT_REGIONAL_CAPITALS } from '@/data/locations';
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
  city: 'عمّان',
  neighborhood: 'خلدا',
  site: '',
  noteText: '',
};

export const useDraftStore = create<DraftState>()(
  immer((set, get) => ({
    postDraft: defaultDraft,
    
    updatePostDraft: (updates) => {
      set((state) => {
        state.postDraft = { ...state.postDraft, ...updates };
      });
      const current = get().postDraft;
      const draftWithMeta: PostDraftWithMeta = {
        ...current,
        step: 'review',
        lastUpdatedAt: new Date().toISOString(),
      };
      draftRepository.save(draftWithMeta).catch(console.error);
    },
    
    resetPostDraft: () => {
      const uiState = getUISnapshot();
      const browseCountryCode = getBrowseCountryCode();
      const isArabic = uiState.locale === 'ar';
      
      const fallback = DEFAULT_REGIONAL_CAPITALS[browseCountryCode] || DEFAULT_REGIONAL_CAPITALS.JO;
      
      const newDraft: PostDraft = {
        categorySlug: 'motors',
        subcategorySlug: 'cars',
        photos: [],
        city: isArabic ? (uiState.browseCityAr || fallback.cityAr) : (uiState.browseCityEn || fallback.cityEn),
        neighborhood: isArabic ? fallback.neighborhoodAr : fallback.neighborhoodEn,
        site: '',
        noteText: '',
      };

      set((state) => {
        state.postDraft = newDraft;
      });
      
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
    }
  }))
);

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
      }
    });
  }
}).catch(console.error);

