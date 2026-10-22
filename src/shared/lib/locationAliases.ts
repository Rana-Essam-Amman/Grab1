import { locations, locationsAr } from '@/data/locations';

const COUNTRY_ALIASES: Record<string, readonly string[]> = {
  JO: ['Jordan', 'الأردن', 'الاردن', 'اردن', 'jordan', 'jo', 'JO'],
  LB: ['Lebanon', 'لبنان', 'lebanon', 'lb', 'LB'],
  PS: ['Palestine', 'فلسطين', 'palestine', 'ps', 'PS'],
  SY: ['Syria', 'سوريا', 'سورية', 'syria', 'sy', 'SY'],
  SA: ['Saudi', 'السعودية', 'Saudi Arabia', 'saudi', 'saudi arabia', 'sa', 'SA', 'KSA'],
};

export function getCountryAliases(countryCode: string): readonly string[] {
  return COUNTRY_ALIASES[countryCode] ?? [];
}

export function getCityAliases(countryCode: string, cityValue: string): string[] {
  if (!cityValue) return [];
  const trimmed = cityValue.trim();
  const en = locations[countryCode as keyof typeof locations] ?? {};
  const ar = locationsAr[countryCode as keyof typeof locationsAr] ?? {};
  const out = new Set<string>([trimmed]);

  if (trimmed in ar) {
    const enList = Object.keys(en);
    const arList = Object.keys(ar);
    const idx = arList.indexOf(trimmed);
    if (idx >= 0 && enList[idx]) out.add(enList[idx]);
  }
  if (trimmed in en) {
    const enList = Object.keys(en);
    const arList = Object.keys(ar);
    const idx = enList.indexOf(trimmed);
    if (idx >= 0 && arList[idx]) out.add(arList[idx]);
  }
  return Array.from(out);
}

export function getNeighborhoodAliases(
  countryCode: string,
  cityValue: string,
  neighborhoodValue: string,
): string[] {
  if (!neighborhoodValue) return [];
  const trimmed = neighborhoodValue.trim();
  const en = locations[countryCode as keyof typeof locations] ?? {};
  const ar = locationsAr[countryCode as keyof typeof locationsAr] ?? {};

  let enNeighborhoods: readonly string[] = [];
  let arNeighborhoods: readonly string[] = [];
  const cityInEn = cityValue in en ? cityValue : null;
  const cityInAr = cityValue in ar ? cityValue : null;

  if (cityInEn) {
    enNeighborhoods = en[cityInEn] ?? [];
    const idx = Object.keys(en).indexOf(cityInEn);
    arNeighborhoods = Object.values(ar)[idx] ?? [];
  } else if (cityInAr) {
    arNeighborhoods = ar[cityInAr] ?? [];
    const idx = Object.keys(ar).indexOf(cityInAr);
    enNeighborhoods = Object.values(en)[idx] ?? [];
  }

  const out = new Set<string>([trimmed]);
  const enIdx = enNeighborhoods.findIndex(
    (n) => n.toLowerCase() === trimmed.toLowerCase() || n === trimmed,
  );
  if (enIdx >= 0 && arNeighborhoods[enIdx]) out.add(arNeighborhoods[enIdx]);
  const arIdx = arNeighborhoods.findIndex((n) => n === trimmed);
  if (arIdx >= 0 && enNeighborhoods[arIdx]) out.add(enNeighborhoods[arIdx]);
  return Array.from(out);
}

export function getFullLocationAliases(countryCode: string, city: string, neighborhood: string): string[] {
  const out = new Set<string>();
  for (const a of getCountryAliases(countryCode)) out.add(a);
  for (const a of getCityAliases(countryCode, city)) out.add(a);
  for (const a of getNeighborhoodAliases(countryCode, city, neighborhood)) out.add(a);
  return Array.from(out);
}
