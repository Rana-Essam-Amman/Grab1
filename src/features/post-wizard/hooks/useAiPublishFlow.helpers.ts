import type { GeneratedListing } from '@/types';
import type { CategoryMatch } from '@/ai/categoryMatch';

export interface AIResultParams {
  readonly generated: GeneratedListing;
  readonly match: CategoryMatch;
  readonly raw: string;
  readonly photos: string[];
  readonly isArabic: boolean;
  readonly browseCityAr: string;
  readonly categoryForAI: string;
  readonly subForAI: string;
}

export function buildAppliedDraft(params: AIResultParams) {
  const { generated, match, raw, photos, categoryForAI, subForAI } = params;
  const finalCategory = generated.categorySlug || categoryForAI || 'krakeeb';
  const finalSub = generated.subcategorySlug || subForAI;
  return {
    noteText: raw,
    photos,
    categorySlug: finalCategory,
    subcategorySlug: finalSub,
    city: generated.city || '',
    neighborhood: generated.city || '',
    lat: generated.lat,
    lng: generated.lng,
    generated: {
      ...generated,
      title: generated.title || '',
      categorySlug: finalCategory,
      subcategorySlug: finalSub,
      categoryMatch: match,
    },
  };
}
