import type { EditLocationState } from './editListingLocation';

export function selectedHierarchyLabels(
  isArabic: boolean,
  location: EditLocationState,
  districts: readonly { slug: string; nameAr: string; nameEn: string }[],
  villages: readonly { slug: string; nameAr: string; nameEn: string }[]
): { districtValue: string; localityValue: string } {
  const district = districts.find((item) => item.slug === location.districtSlug);
  const locality = villages.find((item) => item.slug === location.neighborhoodSlug);
  return {
    districtValue: district ? (isArabic ? district.nameAr : district.nameEn) : '',
    localityValue: locality ? (isArabic ? locality.nameAr : locality.nameEn) : '',
  };
}

