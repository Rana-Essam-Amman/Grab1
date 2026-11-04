import { resolveLocationCanonical } from '@/shared/lib/geo/locationSearch';
import type { CanonicalLocationCandidate } from '@/shared/lib/geo/locationSearch.types';
import { loadEditLocation, type EditLocationState } from './editListingLocation';

const LABEL_SEPARATOR = ' — ';

function uniqueCity(marketCode: string, city: string): CanonicalLocationCandidate | null {
  const result = resolveLocationCanonical(marketCode, city);
  if (result.status !== 'unique' || !result.resolved) return null;
  if (result.resolved.canonicalSlot !== 'city_slug') return null;
  return result.resolved;
}

function childSlots(marketCode: string, citySlug: string, neighborhood: string): Pick<EditLocationState, 'districtSlug' | 'neighborhoodSlug'> {
  if (!neighborhood) return {};
  const direct = resolveLocationCanonical(marketCode, neighborhood, { citySlug });
  if (direct.status === 'unique' && direct.resolved?.citySlug === citySlug) {
    return { districtSlug: direct.resolved.districtSlug || undefined, neighborhoodSlug: direct.resolved.neighborhoodSlug || undefined };
  }

  const separator = neighborhood.indexOf(LABEL_SEPARATOR);
  if (separator <= 0) return {};
  const locality = neighborhood.slice(0, separator);
  const district = neighborhood.slice(separator + LABEL_SEPARATOR.length);
  const districtResult = resolveLocationCanonical(marketCode, district, { citySlug });
  if (districtResult.status !== 'unique' || districtResult.resolved?.canonicalSlot !== 'district_slug') return {};
  const localityResult = resolveLocationCanonical(marketCode, locality, { citySlug, districtSlug: districtResult.resolved.slug });
  if (localityResult.status !== 'unique' || localityResult.resolved?.neighborhoodSlug == null) {
    return { districtSlug: districtResult.resolved.slug };
  }
  return { districtSlug: districtResult.resolved.slug, neighborhoodSlug: localityResult.resolved.neighborhoodSlug };
}

export function resolveLegacyEditLocation(
  marketCode: string,
  listing: Parameters<typeof loadEditLocation>[0]
): EditLocationState {
  const loaded = loadEditLocation(listing);
  if (!marketCode || loaded.citySlug || !loaded.city) return loaded;
  const city = uniqueCity(marketCode, loaded.city);
  if (!city?.citySlug) return loaded;
  return { ...loaded, citySlug: city.citySlug, ...childSlots(marketCode, city.citySlug, loaded.neighborhood) };
}
