import { PostDraft } from '@/types';
import { getBrowseCountryCode, getUISnapshot } from '@/shared/store-getters/ui.getter';
import { DEFAULT_REGIONAL_CAPITALS } from '@/data/locations';

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

export function getInitialDraft(): PostDraft {
  let uiState: ReturnType<typeof getUISnapshot> | null = null;
  let browseCountryCode: ReturnType<typeof getBrowseCountryCode> = 'JO';

  try {
    uiState = getUISnapshot();
    browseCountryCode = getBrowseCountryCode();
  } catch {
    // UI getter may not be registered during boot
  }

  const isArabic = uiState?.locale === 'ar';
  const fallback = DEFAULT_REGIONAL_CAPITALS[browseCountryCode] || DEFAULT_REGIONAL_CAPITALS.JO;

  return {
    categorySlug: 'motors',
    subcategorySlug: 'cars',
    photos: [],
    city: isArabic ? (uiState?.browseCityAr || fallback.cityAr) : (uiState?.browseCityEn || fallback.cityEn),
    neighborhood: isArabic ? fallback.neighborhoodAr : fallback.neighborhoodEn,
    site: '',
    noteText: '',
    variantSeed: 0,
    draftId: generateDraftId(),
  };
}
