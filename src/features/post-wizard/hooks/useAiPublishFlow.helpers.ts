import type { GeneratedListing } from '@/types';
import { writeListingCopy } from '@/ai/listingCopyAgent';
import { buildFieldsFromFacts } from '@/ai/buildFieldsFromFacts';
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

export interface FallbackParams {
  readonly raw: string;
  readonly photos: string[];
  readonly isArabic: boolean;
  readonly browseCityAr: string;
  readonly browseCountryCode: string;
  readonly categorySlug: string;
  readonly subcategorySlug?: string;
  readonly match: CategoryMatch;
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
    generated: {
      ...generated,
      categorySlug: finalCategory,
      subcategorySlug: finalSub,
      categoryMatch: match,
    },
  };
}

export function buildFallbackDraft(params: FallbackParams) {
  const { raw, photos, isArabic, browseCountryCode, categorySlug, subcategorySlug, match } = params;
  const copy = writeListingCopy({ raw, arabic: isArabic, categorySlug, countryCode: browseCountryCode });
  const sub = subcategorySlug || '';
  return {
    noteText: raw,
    photos,
    categorySlug,
    subcategorySlug: sub,
    city: '',
    generated: {
      title: copy.title,
      description: copy.body,
      price: copy.facts.price || '',
      city: '',
      categorySlug,
      subcategorySlug: sub,
      categoryMatch: match,
      missing: copy.missing,
      fields: buildFieldsFromFacts(copy.facts, categorySlug, sub, isArabic),
    },
  };
}
