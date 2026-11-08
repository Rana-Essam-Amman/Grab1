import { JO_AMMAN_OPENSOOQ_AREAS } from '@/data/locations/JO_AMMAN_AREAS';
import { getAllDistricts } from '@/data/locations/registry';
import { normalizeArabic } from '@/shared/lib/arabicNormalize';

const ADMIN_WORDS = ['لواء', 'قصبة', 'قضاء', 'Liwa', 'Qasabah', 'Qada'];
const PREFIX_DEDUPE_WHITELIST: ReadonlySet<string> = new Set([
'village:amman-qasabah:hayy-wadi-as-sir','village:amman-qasabah:mintaqat-wadi-as-sir','village:wadi-essier:hayy-umm-as-summaq','village:amman-qasabah:hayy-jabal-al-husayn','village:amman-qasabah:hayy-umm-udhaynah-ash-sharqi','village:amman-qasabah:hayy-ar-rawabi',
'village:amman-qasabah:hayy-ar-radwan','village:amman-qasabah:hayy-jabal-al-luwaybidah','village:amman-qasabah:hayy-jabal-an-nasr','village:amman-qasabah:hayy-jabal-at-taj','village:amman-qasabah:hayy-jabal-al-jawfah','village:amman-qasabah:hayy-jabal-amman',
'village:amman-qasabah:hayy-wadi-as-surur','village:amman-qasabah:hayy-ar-rujum','village:amman-qasabah:hayy-al-adliyah','village:amman-qasabah:hayy-abdun-ash-shamal','village:amman-qasabah:hayy-as-suwayfiyah','village:amman-qasabah:hayy-as-sahl',
'village:amman-qasabah:hayy-ar-rawnaq','village:amman-qasabah:hayy-ad-dayyar','village:amman-qasabah:hayy-as-sina-ah','village:amman-qasabah:hayy-jabal-an-nazif','village:amman-qasabah:hayy-al-awdah','village:amman-qasabah:mintaqat-al-yarmuk',
'village:amman-qasabah:mintaqat-ra-s-al-ayn','village:amman-qasabah:hayy-al-hamraniyah','village:amman-qasabah:hayy-an-nahariyah','village:amman-qasabah:hayy-al-yasmin','village:amman-qasabah:hayy-al-quwaysimah','village:amman-qasabah:mintaqat-badr-al-jadidah',
'village:amman-qasabah:hayy-al-bunayyat','village:amman-qasabah:hayy-al-madinah-ar-riyadiyah','village:amman-qasabah:mintaqat-badr','village:wadi-essier:hayy-khilda','village:wadi-essier:mintaqat-al-jubayhah','village:wadi-essier:hayy-al-khaznah',
'village:wadi-essier:hayy-tila-al-ali-ash-shamali','village:wadi-essier:hayy-tila-al-ali-ash-sharqi','village:wadi-essier:hayy-umm-udhaynah-al-gharbi','village:sahab:hayy-tabarbawr','village:sahab:hayy-az-zahra','village:sahab:mintaqat-basman',
'village:sahab:hayy-ar-rabwah','village:naoor:qurayyat-salim','village:naoor:hayy-al-ma-adi','village:wadi-essier:hayy-ar-rashid',
'village:amman-qasabah:amman',
]);

export function stripAdminWords(label: string): string {
  return label.split(/\s+/).filter(t => !ADMIN_WORDS.includes(t)).join(' ').trim() || label;
}

export interface AmmanArea {
  readonly id: string; readonly slug: string; readonly nameAr: string; readonly nameEn: string;
  readonly districtSlug: string | null; readonly neighborhoodSlug: string | null;
  readonly source: 'geonames-district' | 'geonames-village' | 'opensooq';
}

function normalizeKey(s: string): string {
  return normalizeArabic(s).replace(/\s+/g, ' ').trim();
}

let cachedAreas: readonly AmmanArea[] | null = null;

export function buildMergedAmmanAreas(): readonly AmmanArea[] {
  if (cachedAreas) return cachedAreas;
  const out: AmmanArea[] = [];
  const seenAr = new Set<string>();
  const seenEn = new Set<string>();
  const add = (area: AmmanArea): boolean => {
    const keyAr = normalizeKey(area.nameAr);
    const keyEn = area.nameEn.toLowerCase().trim();
    if (seenAr.has(keyAr) || seenEn.has(keyEn)) return false;
    seenAr.add(keyAr); seenEn.add(keyEn); out.push(area); return true;
  };
  const districts = getAllDistricts('JO', 'amman');
  for (const d of districts) {
    if (d.slug === 'unverified') continue;
    const villages = d.villages ?? [];
    if (villages.length === 0) {
      add({ id: `district:${d.slug}`, slug: d.slug, nameAr: stripAdminWords(d.nameAr), nameEn: stripAdminWords(d.nameEn), districtSlug: d.slug, neighborhoodSlug: null, source: 'geonames-district' });
    } else {
      for (const v of villages) {
        add({ id: `village:${d.slug}:${v.slug}`, slug: v.slug, nameAr: v.nameAr, nameEn: v.nameEn, districtSlug: d.slug, neighborhoodSlug: v.slug, source: 'geonames-village' });
      }
    }
  }
  for (const a of JO_AMMAN_OPENSOOQ_AREAS) {
    add({ id: `opensooq:${a.slug}`, slug: a.slug, nameAr: a.nameAr, nameEn: a.nameEn, districtSlug: null, neighborhoodSlug: null, source: 'opensooq' });
  }
  const final = out.filter(a => !PREFIX_DEDUPE_WHITELIST.has(a.id));
  cachedAreas = final;
  return final;
}

export { matchOpenSooqToGeoNames } from './ammanAreaMatcher';
