import { getAllGovernorates, getAllCamps, getAllLandmarks } from '@/data/locations/registry';

export function matchGeoHierarchy(
  countryCode: string,
  city: string,
  neighborhood: string,
): string[] {
  if (!countryCode) return [];
  const out: string[] = [];

  const governorates = getAllGovernorates(countryCode);
  for (const gov of governorates) {
    if (
      gov.nameEn.toLowerCase() === city.toLowerCase() ||
      gov.nameAr === city ||
      gov.slug === city.toLowerCase()
    ) {
      out.push(gov.nameAr, gov.nameEn);
      break;
    }
    for (const dist of gov.districts) {
      if (
        dist.nameAr === city || dist.nameAr === neighborhood ||
        dist.nameEn.toLowerCase() === city.toLowerCase() ||
        dist.nameEn.toLowerCase() === neighborhood.toLowerCase() ||
        dist.slug === city.toLowerCase() || dist.slug === neighborhood.toLowerCase()
      ) {
        out.push(dist.nameAr, dist.nameEn, gov.nameAr, gov.nameEn);
        break;
      }
    }
  }

  const camps = getAllCamps(countryCode);
  if (neighborhood) {
    for (const camp of camps) {
      if (
        camp.nameAr === neighborhood ||
        camp.nameEn.toLowerCase() === neighborhood.toLowerCase() ||
        camp.slug === neighborhood.toLowerCase()
      ) {
        out.push(camp.nameAr, camp.nameEn);
        const campGov = governorates.find((g) => g.slug === camp.governorateSlug);
        if (campGov) out.push(campGov.nameAr, campGov.nameEn);
        break;
      }
    }
  }

  const landmarks = getAllLandmarks(countryCode);
  for (const lm of landmarks) {
    if (
      lm.nameAr === neighborhood ||
      lm.nameAr === city ||
      lm.nameEn.toLowerCase() === neighborhood.toLowerCase() ||
      lm.nameEn.toLowerCase() === city.toLowerCase()
    ) {
      out.push(lm.nameAr, lm.nameEn);
      break;
    }
  }

  return Array.from(new Set(out));
}
