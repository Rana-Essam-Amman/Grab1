import { stripAdminWords } from '@/shared/lib/geo/stripAdminWords';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';
import type { Governorate } from '@/data/locations/types';
import type { AmmanArea } from '@/features/post-wizard/helpers/ammanAreaResolver';

export function buildFlatAreasForGovernorate(
  gov: Governorate,
): readonly AmmanArea[] {
  const areas: AmmanArea[] = [];
  const seen = new Set<string>();

  const pushUnique = (a: AmmanArea): void => {
    const key = normalizeArabic(stripAdminWords(a.nameAr))
      .replace(/\s+/g, ' ')
      .trim();
    if (seen.has(key)) return;
    seen.add(key);
    areas.push(a);
  };

  for (const d of gov.districts ?? []) {
    if (d.slug === 'unverified') continue;
    const villages = d.villages ?? [];
    if (villages.length === 0) {
      pushUnique({
        id: `district:${d.slug}`,
        slug: d.slug,
        nameAr: stripAdminWords(d.nameAr),
        nameEn: stripAdminWords(d.nameEn),
        districtSlug: d.slug,
        neighborhoodSlug: null,
        source: 'geonames-district',
      });
    } else {
      for (const v of villages) {
        pushUnique({
          id: `village:${d.slug}:${v.slug}`,
          slug: v.slug,
          nameAr: stripAdminWords(v.nameAr),
          nameEn: stripAdminWords(v.nameEn),
          districtSlug: d.slug,
          neighborhoodSlug: v.slug,
          source: 'geonames-village',
        });
      }
    }
  }

  return areas;
}
