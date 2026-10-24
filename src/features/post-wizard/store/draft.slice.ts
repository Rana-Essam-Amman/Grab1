import { create } from 'zustand';
import { PostDraft } from '@/types';
import { getBrowseCountryCode, getUISnapshot } from '@/shared/store-getters/ui.getter';
import { DEFAULT_REGIONAL_CAPITALS } from '@/data/locations';
import type { DraftRepository } from '../data/repositories/DraftRepository';
import { LocalStorageDraftAdapter } from '../data/adapters/LocalStorageDraftAdapter';
import type { PostDraftWithMeta } from '../domain';

function generateDraftId(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch {
    // fall through to Math.random
  }
  return `d-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getInitialDraft(): PostDraft {
  let uiState: ReturnType<typeof getUISnapshot> | null = null;
  let browseCountryCode: ReturnType<typeof getBrowseCountryCode> = 'JO';

  try {
    uiState = getUISnapshot();
    browseCountryCode = getBrowseCountryCode();
  } catch {
    // The UI getter may not be registered during module initialization.
    // Use Jordan defaults until the UI store becomes available.
  }

  const isArabic = uiState?.locale === 'ar';
  const fallback =
    DEFAULT_REGIONAL_CAPITALS[browseCountryCode] ||
    DEFAULT_REGIONAL_CAPITALS.JO;

  return {
    categorySlug: 'motors',
    subcategorySlug: 'cars',
    photos: [],
    city: isArabic
      ? (uiState?.browseCityAr || fallback.cityAr)
      : (uiState?.browseCityEn || fallback.cityEn),
    neighborhood: isArabic
      ? fallback.neighborhoodAr
      : fallback.neighborhoodEn,
    site: '',
    noteText: '',
    variantSeed: 0,
    draftId: generateDraftId(),
  };
}

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
// Wrapped because getBrowseCountryCode may throw if the UI store is not registered yet.
try {
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
  }).catch((err) => {
    console.warn('[Draft] Rehydrate failed:', err);
  });
} catch (err) {
  // Ignore boot-time errors; UI getter will be registered later.
  console.warn('[Draft] Initial rehydrate skipped during boot:', err);
}
