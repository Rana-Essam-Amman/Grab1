import type { Governorate, District, Village, RefugeeCamp } from '@/data/locations/types';

export interface LocationSelection {
  readonly governorateSlug: string | null;
  readonly districtSlug: string | null;
  readonly neighborhoodSlug: string | null;
  readonly label: string | null;
  readonly cityEn: string | null;
  readonly cityAr: string | null;
}

export const emptySelection = (): LocationSelection => ({
  governorateSlug: null, districtSlug: null, neighborhoodSlug: null, label: null, cityEn: null, cityAr: null,
});

const display = (isArabic: boolean, item: { nameAr: string; nameEn: string }): string =>
  isArabic ? item.nameAr : item.nameEn;

export function governorateSelection(gov: Governorate | null, isArabic: boolean): LocationSelection {
  if (!gov) return emptySelection();
  return { governorateSlug: gov.slug, districtSlug: null, neighborhoodSlug: null, label: display(isArabic, gov), cityEn: gov.nameEn, cityAr: gov.nameAr };
}

export function districtSelection(govSlug: string | null, district: District | null, isArabic: boolean): LocationSelection {
  return {
    governorateSlug: govSlug, districtSlug: district?.slug ?? null, neighborhoodSlug: null,
    label: district ? display(isArabic, district) : null, cityEn: null, cityAr: null,
  };
}

export function childSelection(
  govSlug: string | null,
  distSlug: string | null,
  item: { slug: string; nameAr: string; nameEn: string } | null,
  isArabic: boolean
): LocationSelection {
  return {
    governorateSlug: govSlug, districtSlug: distSlug, neighborhoodSlug: item?.slug ?? null,
    label: item ? display(isArabic, item) : null, cityEn: null, cityAr: null,
  };
}

export function campBelongsToGovernorate(camp: RefugeeCamp, selectedGov: string | null): boolean {
  return Boolean(selectedGov) && camp.governorateSlug === selectedGov;
}
