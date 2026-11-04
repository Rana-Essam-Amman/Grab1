
export interface EditLocationState {
  readonly city: string;
  readonly neighborhood: string;
  readonly citySlug?: string;
  readonly districtSlug?: string;
  readonly neighborhoodSlug?: string;
}

export function loadEditLocation(listing: {
  city?: string;
  neighborhood?: string;
  citySlug?: string;
  districtSlug?: string;
  neighborhoodSlug?: string;
} | null): EditLocationState {
  return {
    city: listing?.city || '',
    neighborhood: listing?.neighborhood || '',
    citySlug: listing?.citySlug,
    districtSlug: listing?.districtSlug,
    neighborhoodSlug: listing?.neighborhoodSlug,
  };
}

export function sameEditLocation(a: EditLocationState, b: EditLocationState): boolean {
  return a.city === b.city
    && a.neighborhood === b.neighborhood
    && a.citySlug === b.citySlug
    && a.districtSlug === b.districtSlug
    && a.neighborhoodSlug === b.neighborhoodSlug;
}

export function selectGovernorate(
  isArabic: boolean,
  gov: { slug: string; nameAr: string; nameEn: string }
): EditLocationState {
  return {
    city: isArabic ? gov.nameAr : gov.nameEn,
    neighborhood: '',
    citySlug: gov.slug,
    districtSlug: '',
    neighborhoodSlug: '',
  };
}
export function clearEditLocation(): EditLocationState {
  return { city: '', neighborhood: '', citySlug: '', districtSlug: '', neighborhoodSlug: '' };
}

export function selectDistrict(
  current: EditLocationState,
  isArabic: boolean,
  district: { slug: string; nameAr: string; nameEn: string },
  hasLevel3: boolean
): EditLocationState {
  return {
    ...current,
    neighborhood: hasLevel3 ? '' : (isArabic ? district.nameAr : district.nameEn),
    districtSlug: district.slug,
    neighborhoodSlug: '',
  };
}

export function selectLocality(
  current: EditLocationState,
  isArabic: boolean,
  districtName: string,
  locality: { slug: string; nameAr: string; nameEn: string }
): EditLocationState {
  const name = isArabic ? locality.nameAr : locality.nameEn;
  return {
    ...current,
    neighborhood: districtName ? `${name} — ${districtName}` : name,
    neighborhoodSlug: locality.slug,
  };
}

export { selectedHierarchyLabels } from './editListingLocation.display';
export { resolveUniqueChildSlug, selectJordanLocation } from './editListingLocation.jordan';