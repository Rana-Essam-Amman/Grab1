import { getAllGovernorates, getAllDistricts } from '@/data/locations/registry';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';
import '@/data/locations/JO.geo';

export interface JordanLocationSearchResult {
  readonly id: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly parentPathAr: string;
  readonly parentPathEn: string;
  readonly cityAr: string;
  readonly cityEn: string;
  readonly citySlug: string;
  readonly districtSlug?: string;
  readonly neighborhoodSlug?: string;
  readonly type: 'governorate' | 'district' | 'village';
}

function buildJordanIndex(): readonly JordanLocationSearchResult[] {
  const govs = getAllGovernorates('JO');
  if (!govs?.length) return [];
  const list: JordanLocationSearchResult[] = [];
  for (const g of govs) {
    list.push({ id: `gov-${g.slug}`, nameAr: g.nameAr, nameEn: g.nameEn, parentPathAr: 'الأردن', parentPathEn: 'Jordan', cityAr: g.nameAr, cityEn: g.nameEn, citySlug: g.slug, type: 'governorate' });
    for (const d of getAllDistricts('JO', g.slug)) {
      if (d.slug === 'unverified') continue;
      list.push({ id: `dist-${g.slug}-${d.slug}`, nameAr: d.nameAr, nameEn: d.nameEn, parentPathAr: g.nameAr, parentPathEn: g.nameEn, cityAr: g.nameAr, cityEn: g.nameEn, citySlug: g.slug, districtSlug: d.slug, type: 'district' });
      for (const v of d.villages || []) {
        list.push({ id: `vill-${g.slug}-${d.slug}-${v.slug}`, nameAr: v.nameAr, nameEn: v.nameEn, parentPathAr: `${g.nameAr} — ${d.nameAr}`, parentPathEn: `${g.nameEn} — ${d.nameEn}`, cityAr: g.nameAr, cityEn: g.nameEn, citySlug: g.slug, districtSlug: d.slug, neighborhoodSlug: v.slug, type: 'village' });
      }
    }
  }
  return list;
}

let cachedIndex: readonly JordanLocationSearchResult[] | null = null;

export function searchJordanLocations(query: string, isArabic: boolean): readonly JordanLocationSearchResult[] {
  if (!cachedIndex || !cachedIndex.length) cachedIndex = buildJordanIndex();
  const q = normalizeArabic(query.trim().toLowerCase());
  if (!q) return [];
  return cachedIndex.filter((item) => {
    const target = normalizeArabic((isArabic ? item.nameAr : item.nameEn).toLowerCase());
    const alt = normalizeArabic((isArabic ? item.nameEn : item.nameAr).toLowerCase());
    return target.includes(q) || alt.includes(q);
  }).slice(0, 15);
}

export function getJordanIndex(): readonly JordanLocationSearchResult[] {
  if (!cachedIndex || !cachedIndex.length) cachedIndex = buildJordanIndex();
  return cachedIndex;
}
