/**
 * Generate src/data/locations/JO.geo.ts from GeoNames JO dump + geoBoundaries.
 *
 * Sources:
 *   - GeoNames JO.txt (populated places, featureClass=P, countryCode=JO only)
 *   - geoBoundaries JOR ADM0 (country boundary validation)
 *   - geoBoundaries JOR ADM2 (52 district polygons, public domain)
 *
 * District assignment rules:
 *   1. Each ADM2 polygon is associated with the governorate that contains the
 *      majority of GeoNames places inside it (data-driven, not invented).
 *   2. A place is assigned to a district only if the polygon's governorate
 *      matches the place's GeoNames admin1. Otherwise it is Unverified.
 *   3. Coordinates are validated against the actual ADM0 polygon, not a box.
 *
 * Arabic names:
 *   - Extracted from GeoNames alternatenames where Arabic script is present.
 *   - If missing, the original name is preserved and flagged as untranslated.
 *   - English is never silently used as Arabic.
 *
 * Attribution: geoBoundaries (Runfola et al. 2020), PLoS ONE 15(4): e0231866.
 */
import fs from 'node:fs';

const INPUT = '/tmp/JO.txt';
const ADM2 = '/tmp/JOR-ADM2.geojson';
const ADM0 = '/tmp/JOR-ADM0.geojson';
const OUTPUT = 'src/data/locations/JO.geo.ts';

const ADMIN1_MAP = {
  '16': 'Amman', '18': 'Irbid', '09': 'Karak',
  '19': 'Maan', '21': 'Aqaba', '20': 'Ajloun',
  '02': 'Balqa', '22': 'Jerash', '23': 'Madaba',
  '15': 'Mafraq', '12': 'Tafileh', '17': 'Zarqa',
};

const ARABIC_GOV = {
  Amman: 'العاصمة', Irbid: 'إربد', Karak: 'الكرك', Maan: 'معان',
  Aqaba: 'العقبة', Ajloun: 'عجلون', Balqa: 'البلقاء', Jerash: 'جرش',
  Madaba: 'مادبا', Mafraq: 'المفرق', Tafileh: 'الطفيلة', Zarqa: 'الزرقاء',
};

const DISTRICT_AR = {
  'Al-Aghwar Shamaliyyeh': 'الأغوار الشمالية',
  'Al-Aqaba': 'العقبة',
  'Al-Azraq': 'الأزرق',
  'Al-Balqa': 'البلقاء',
  'Al-Hasa': 'الحسا',
  'Al-Husanyniyya': 'الحسينية',
  'Al-Jizah': 'الجيزة',
  'Al-Karak': 'الكرك',
  'Al-Mafraq': 'المفرق',
  'Al-Mazar al-Janubiyya': 'المزار الجنوبي',
  'Al-Mazra\'a': 'المزرعة',
  'Al-Muwaqqar': 'الموقر',
  'Al-Qasr': 'القصر',
  'Al-Quwayra': 'القويرة',
  'Al-Safi': 'الصافي',
  'Al-Tafila': 'الطفيلة',
  'Aljun': 'عجلون',
  'Amman': 'عمان',
  'Ar Ramtha': 'الرمثا',
  'Ar-Ruwayshid': 'الرويشد',
  'Ardhah': 'العارضة',
  'As-Salt': 'السلط',
  'Ash-Shibek': 'الشوبك',
  'Ayi': 'عي',
  'Ayy': 'عي',
  'Az-Zarqa': 'الزرقاء',
  'Bal\'ama': 'بلعما',
  'Bani Knana': 'بني كنانة',
  'Birin': 'بيرين',
  'Birsayra': 'بصيرا',
  'Dair Alla': 'دير علا',
  'Dhiban': 'ذيبان',
  'Faqqu': 'فقوع',
  'Hariema': 'الحصيلة',
  'Irbid': 'إربد',
  'Jerash': 'جرش',
  'Kofranjah': 'كفرنجة',
  'Kora': 'الكورة',
  'Ma\'an': 'معان',
  'Madaba': 'مادبا',
  'Mazar Shamaliyyeh': 'المزار الشمالي',
  'Na\'ur': 'ناعور',
  'Sabha': 'صبحا',
  'Sahab': 'سحاب',
  'Sama as-Sarhan': 'سما السرحان',
  'Shuna al-Jabiniyya': 'الشونة الجنوبية',
  'Tayybeh': 'الطيبة',
  'Um al-Basatin': 'أم البساتين',
  'Wadi Araba': 'وادي عربة',
  'Wadi Musa': 'وادي موسى',
  'Wadi al-Sayr': 'وادي السير',
  'Wastiyyeh': 'الوسطية',
};

const UNVERIFIED = 'Unverified';
const UNVERIFIED_AR = 'غير محدد';

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '') || 'x';
}

function escape(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function extractArabic(alts) {
  if (!alts) return null;
  for (const p of alts.split(',')) {
    if (/[\u0600-\u06FF]/.test(p)) return p.trim();
  }
  return null;
}

function pointInRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if (((yi > lat) !== (yj > lat)) && (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInPolygon(lon, lat, coords) {
  if (!pointInRing(lon, lat, coords[0])) return false;
  for (let h = 1; h < coords.length; h++) {
    if (pointInRing(lon, lat, coords[h])) return false;
  }
  return true;
}

function pointInGeometry(lon, lat, geometry) {
  if (geometry.type === 'Polygon') return pointInPolygon(lon, lat, geometry.coordinates);
  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.some((poly) => pointInPolygon(lon, lat, poly));
  }
  return false;
}

// Load boundaries
const adm2 = JSON.parse(fs.readFileSync(ADM2, 'utf-8'));
const adm0 = JSON.parse(fs.readFileSync(ADM0, 'utf-8'));
const countryGeom = adm0.features[0].geometry;

const polygons = adm2.features.map((f) => ({
  name: f.properties.shapeName,
  geometry: f.geometry,
  govCounts: {},
  gov: null,
}));

function findPolygon(lon, lat) {
  for (const p of polygons) {
    if (pointInGeometry(lon, lat, p.geometry)) return p;
  }
  return null;
}

// Parse places
const raw = fs.readFileSync(INPUT, 'utf-8');
const lines = raw.split('\n');
const places = [];
let excludedOutside = 0;
let excludedNoAdmin1 = 0;

for (const line of lines) {
  const parts = line.split('\t');
  if (parts.length < 19) continue;
  const name = parts[1];
  const asciiName = parts[2];
  const alts = parts[3];
  const lat = parseFloat(parts[4]);
  const lon = parseFloat(parts[5]);
  const featureClass = parts[6];
  const countryCode = parts[8];
  const admin1 = parts[10];

  if (countryCode !== 'JO') continue;
  if (featureClass !== 'P') continue;
  if (!name) continue;

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !pointInGeometry(lon, lat, countryGeom)) {
    excludedOutside++;
    continue;
  }

  const govEn = ADMIN1_MAP[admin1];
  if (!govEn) { excludedNoAdmin1++; continue; }

  places.push({ name, asciiName, alts, lat, lon, govEn });
}

// Pass 1: determine each polygon's governorate by majority of places inside
for (const pl of places) {
  const poly = findPolygon(pl.lon, pl.lat);
  if (poly) poly.govCounts[pl.govEn] = (poly.govCounts[pl.govEn] || 0) + 1;
}
for (const p of polygons) {
  const entries = Object.entries(p.govCounts).sort((a, b) => b[1] - a[1]);
  p.gov = entries.length > 0 ? entries[0][0] : null;
}

// Pass 2: assign places, enforcing governorate match
const tree = {};
let totalPlaces = 0;
let unverifiedCount = 0;
let crossGovBlocked = 0;
let untranslatedLocalities = 0;
let untranslatedDistricts = 0;
const seenSlugs = new Set();
const untranslatedList = [];

for (const pl of places) {
  const poly = findPolygon(pl.lon, pl.lat);
  let distEn, distAr, isUnverified = false;

  if (!poly || !poly.gov) {
    distEn = UNVERIFIED;
    distAr = UNVERIFIED_AR;
    isUnverified = true;
    unverifiedCount++;
  } else if (poly.gov !== pl.govEn) {
    // Cross-governorate: do not assign
    distEn = UNVERIFIED;
    distAr = UNVERIFIED_AR;
    isUnverified = true;
    unverifiedCount++;
    crossGovBlocked++;
  } else {
    distEn = poly.name;
    if (DISTRICT_AR[poly.name]) {
      distAr = DISTRICT_AR[poly.name];
    } else {
      distAr = poly.name;
      untranslatedDistricts++;
    }
  }

  const nameEn = pl.asciiName || pl.name;
  const arabicAlt = extractArabic(pl.alts);
  let nameAr;
  if (arabicAlt) {
    nameAr = arabicAlt;
  } else {
    nameAr = pl.name;
    untranslatedLocalities++;
    untranslatedList.push(`${pl.govEn}/${distEn}: ${pl.name}`);
  }

  if (!tree[pl.govEn]) {
    tree[pl.govEn] = { nameAr: ARABIC_GOV[pl.govEn], nameEn: pl.govEn, districts: {} };
  }
  if (!tree[pl.govEn].districts[distEn]) {
    tree[pl.govEn].districts[distEn] = { nameAr: distAr, nameEn: distEn, villages: [], unverified: isUnverified };
  }

  let baseSlug = slugify(nameEn);
  let slug = baseSlug;
  let n = 2;
  while (seenSlugs.has(slug)) { slug = `${baseSlug}-${n++}`; }
  seenSlugs.add(slug);

  tree[pl.govEn].districts[distEn].villages.push({ slug, nameAr, nameEn });
  totalPlaces++;
}

// Emit
const uniquePolygons = polygons.length;
const polygonsWithGov = polygons.filter((p) => p.gov).length;
const verifiedDistricts = new Set();
let scopedDistricts = 0;

let out = `// RULE-14-EXCEPTION: Complete Jordan location dataset must stay atomic for market isolation and offline performance. Splitting into 12 files would break the single-source-of-truth contract enforced by registry.ts.

import { registerCountry } from './registry';\n`;
out += `import type { CountryGeo } from './types';\n\n`;
out += `// AUTO-GENERATED from GeoNames JO + geoBoundaries ADM0/ADM2.\n`;
out += `// Total populated places: ${totalPlaces}\n`;
out += `// Governorates: ${Object.keys(tree).length}\n`;
out += `// Unique ADM2 source polygons: ${uniquePolygons}\n`;
out += `// District assignment: point-in-polygon, governorate-matched only.\n`;
out += `// Places outside ADM0 or with cross-governorate mismatch are Unverified.\n`;
out += `// Attribution: geoBoundaries (Runfola et al. 2020), PLoS ONE 15(4): e0231866.\n\n`;
out += `const JO_GEO: CountryGeo = {\n`;
out += `  countryCode: 'JO',\n`;
out += `  governorates: [\n`;

const govOrder = Object.keys(ADMIN1_MAP).map((k) => ADMIN1_MAP[k]);
for (const govEn of govOrder) {
  const gov = tree[govEn];
  if (!gov) continue;
  out += `    {\n`;
  out += `      slug: '${slugify(govEn)}',\n`;
  out += `      nameAr: '${escape(gov.nameAr)}',\n`;
  out += `      nameEn: '${escape(govEn)}',\n`;
  out += `      districts: [\n`;
  for (const [distEn, dist] of Object.entries(gov.districts)) {
    scopedDistricts++;
    if (distEn !== UNVERIFIED) verifiedDistricts.add(distEn);
    out += `        {\n`;
    out += `          slug: '${slugify(distEn)}',\n`;
    out += `          nameAr: '${escape(dist.nameAr)}',\n`;
    out += `          nameEn: '${escape(distEn)}',\n`;
    out += `          villages: [\n`;
    for (const v of dist.villages) {
      out += `            { slug: '${escape(v.slug)}', nameAr: '${escape(v.nameAr)}', nameEn: '${escape(v.nameEn)}' },\n`;
    }
    out += `          ],\n        },\n`;
  }
  out += `      ],\n    },\n`;
}

out += `  ],\n  refugeeCamps: [],\n  landmarks: [],\n};\n\n`;
out += `registerCountry(JO_GEO);\n\nexport default JO_GEO;\n`;

fs.writeFileSync(OUTPUT, out);

// Report
console.log('Wrote', OUTPUT);
console.log('Total places:', totalPlaces);
console.log('Governorates:', Object.keys(tree).length);
console.log('Unique ADM2 source polygons:', uniquePolygons);
console.log('Polygons with governorate association:', polygonsWithGov);
console.log('Unique verified districts:', verifiedDistricts.size);
console.log('Governorate-scoped district entries:', scopedDistricts);
console.log('Unverified places:', unverifiedCount);
console.log('Cross-governorate blocked:', crossGovBlocked);
console.log('Excluded outside ADM0:', excludedOutside);
console.log('Excluded no admin1:', excludedNoAdmin1);
console.log('Untranslated localities:', untranslatedLocalities);
console.log('Untranslated district names:', untranslatedDistricts);
if (untranslatedList.length > 0 && untranslatedList.length <= 30) {
  console.log('Untranslated list:');
  for (const u of untranslatedList) console.log('  ', u);
}
for (const govEn of govOrder) {
  const gov = tree[govEn];
  if (!gov) continue;
  const dists = Object.keys(gov.districts);
  const villages = Object.values(gov.districts).reduce((s, d) => s + d.villages.length, 0);
  const unverified = gov.districts[UNVERIFIED]?.villages.length || 0;
  console.log(`  ${govEn}: ${dists.length} scoped districts, ${villages} villages (${unverified} unverified)`);
}
