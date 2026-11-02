import { resolveAiLocationSlugs } from '../helpers/aiLocationResolver';
import type { AIResultParams } from '../helpers/aiLocationResolver.helpers';

export type { AIResultParams };

export function buildAppliedDraft(params: AIResultParams) {
  const { generated, match, raw, photos, categoryForAI, subForAI, browseCountryCode } = params;
  const finalCategory = generated.categorySlug || categoryForAI || 'krakeeb';
  const finalSub = generated.subcategorySlug || subForAI;
  const targetCity = generated.city || params.browseCityAr || '';
  const targetNeighborhood = generated.city || '';

  const { citySlug, districtSlug, neighborhoodSlug } = browseCountryCode
    ? resolveAiLocationSlugs(browseCountryCode, targetCity, targetNeighborhood)
    : { citySlug: undefined, districtSlug: undefined, neighborhoodSlug: undefined };

  return {
    noteText: raw,
    photos,
    categorySlug: finalCategory,
    subcategorySlug: finalSub,
    city: targetCity,
    neighborhood: targetNeighborhood,
    citySlug,
    districtSlug,
    neighborhoodSlug,
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
