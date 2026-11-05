import { searchLocationsCanonical, resolveLocationCanonical } from '@/shared/lib/geo/locationSearch';
import { isOtherValue } from '@/data/locations';

const LABEL_SEPARATOR = ' — ';

export interface TraditionalSlugs {
  readonly citySlug?: string;
  readonly districtSlug?: string;
  readonly neighborhoodSlug?: string;
}

function uniqueCitySlug(market: string, query: string): string | undefined {
  const searched = searchLocationsCanonical(market, query);
  const cities = searched.candidates.filter((c) => c.canonicalSlot === 'city_slug');
  return cities.length === 1 ? cities[0].slug : undefined;
}

export function resolveTraditionalLocationSlugs(
  market: string,
  cityLabel: string,
  neighborhoodLabel: string
): TraditionalSlugs {
  if (!cityLabel || isOtherValue(cityLabel)) return {};
  const citySlug = uniqueCitySlug(market, cityLabel);
  if (!citySlug) return {};
  if (!neighborhoodLabel || isOtherValue(neighborhoodLabel)) return { citySlug };

  const sep = neighborhoodLabel.indexOf(LABEL_SEPARATOR);
  if (sep > -1) {
    const villageName = neighborhoodLabel.slice(0, sep);
    const districtName = neighborhoodLabel.slice(sep + LABEL_SEPARATOR.length);
    const district = resolveLocationCanonical(market, districtName, { citySlug });
    if (district.status !== 'unique' || district.resolved?.canonicalSlot !== 'district_slug') return { citySlug };
    const village = resolveLocationCanonical(market, villageName, {
      citySlug,
      districtSlug: district.resolved.districtSlug ?? undefined,
    });
    if (village.status !== 'unique' || !village.resolved?.neighborhoodSlug) return { citySlug };
    return {
      citySlug,
      districtSlug: district.resolved.districtSlug ?? undefined,
      neighborhoodSlug: village.resolved.neighborhoodSlug,
    };
  }

  const child = resolveLocationCanonical(market, neighborhoodLabel, { citySlug });
  if (child.status !== 'unique' || !child.resolved) return { citySlug };
  if (child.resolved.canonicalSlot === 'district_slug') {
    const { districtSlug, neighborhoodSlug } = child.resolved;
    return { citySlug, districtSlug, neighborhoodSlug };
  }
  if (child.resolved.canonicalSlot === 'neighborhood_slug') {
    return {
      citySlug,
      districtSlug: child.resolved.districtSlug ?? undefined,
      neighborhoodSlug: child.resolved.neighborhoodSlug ?? undefined,
    };
  }
  return { citySlug };
}

export function preserveVerifiedJordanSelection(
  market: string,
  cityLabel: string,
  neighborhoodLabel: string,
  draft: { city?: string; neighborhood?: string; citySlug?: string; districtSlug?: string; neighborhoodSlug?: string }
): TraditionalSlugs | null {
  if (market !== 'JO' || !draft.citySlug) return null;
  if ((draft.city || '') !== cityLabel) return null;
  if ((draft.neighborhood || '') !== (neighborhoodLabel || '')) return null;
  return {
    citySlug: draft.citySlug,
    districtSlug: draft.districtSlug,
    neighborhoodSlug: draft.neighborhoodSlug,
  };
}
