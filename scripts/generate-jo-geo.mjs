/**
 * Generate src/data/locations/JO.geo.ts from GeoNames JO dump + geoBoundaries ADM2.
 *
 * Sources:
 *   - GeoNames JO.txt (populated places, featureClass=P, countryCode=JO)
 *   - geoBoundaries JOR ADM2 simplified GeoJSON (52 districts, public domain)
 *
 * District assignment is by point-in-polygon against geoBoundaries ADM2.
 * Governorate assignment is from GeoNames admin1 (official codes).
 * Places whose coordinates fall outside every ADM2 polygon are placed in an
 * "Unverified" district under their GeoNames governorate — not invented.
 *
 * Attribution: geoBoundaries (Runfola et al. 2020), PLoS ONE 15(4): e0231866.
 */
import fs from 'node:fs';

const INPUT = '/tmp/JO.txt';
const BOUNDARIES = '/tmp/JOR-ADM2.geojson';
const OUTPUT = 'src/data/locations/JO.geo.ts';

// Official GeoNames admin1 codes (from admin1CodesASCII.txt)
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

// Arabic names for geoBoundaries ADM2 districts (from official/GeoNames admin2 names)
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

// Jordan bounding box (from geoBoundaries ADM0 extent, with small margin)
const JO_BOUNDS = { minLat: 29.0, maxLat: 33.5, minLon: 34.8, maxLon: 39.5 };

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '') || 'x';
}

function escape(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function extractArabic(alts) {
  if (!alts) return null;
  const parts = alts.split(',');
  for (const p of parts) {
    if (/[\u0600-\u06FF]/.test(p)) return p.trim();
  }
  return null;
}

// Ray-casting point-in-polygon. Handles rings with holes (even-odd).
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
  // coords is an array of rings; first is outer, rest are holes
  if (!pointInRing(lon, lat, coords[0])) return false;
  for (let h = 1; h < coords.length; h++) {
    if (pointInRing(lon, lat, coords[h])) return false;
  }
  return true;
}

function pointInGeometry(lon, lat, geometry) {
  if (geometry.type === 'Polygon') {
    return pointInPolygon(lon, lat, geometry.coordinates);
  }
  if (geometry.type === 'MultiPolygon') {
    for (const poly of geometry.coordinates) {
      if (pointInPolygon(lon, lat, poly)) return true;
    }
    return false;
  }
  return false;
}

// Load boundaries
const boundaries = JSON.parse(fs.readFileSync(BOUNDARIES, 'utf-8'));
const districts = boundaries.features.map(f => ({
  name: f.properties.shapeName,
  geometry: f.geometry,
}));

function findDistrict(lon, lat) {
  for (const d of districts) {
    if (pointInGeometry(lon, lat, d.geometry)) return d.name;
  }
  return null;
}

// Process GeoNames
const raw = fs.readFileSync(INPUT, 'utf-8');
const lines = raw.split('\n');

const tree = {};
let totalPlaces = 0;
let excludedOutside = 0;
let excludedNoAdmin1 = 0;
let unverifiedCount = 0;
const seenSlugs = new Set();

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

  // Strict country filter — do not use cc2
  if (countryCode !== 'JO') continue;
  if (featureClass !== 'P') continue;
  if (!name || !admin1) { excludedNoAdmin1++; continue; }

  // Coordinate validation
  if (!Number.isFinite(lat) || !Number.isFinite(lon) ||
      lat < JO_BOUNDS.minLat || lat > JO_BOUNDS.maxLat ||
      lon < JO_BOUNDS.minLon || lon > JO_BOUNDS.maxLon) {
    excludedOutside++;
    continue;
  }

  const govEn = ADMIN1_MAP[admin1];
  if (!govEn) { excludedNoAdmin1++; continue; }
  const govAr = ARABIC_GOV[govEn];

  // District from spatial containment
  const districtName = findDistrict(lon, lat);
  const distEn = districtName || UNVERIFIED;
  const distAr = districtName ? (DISTRICT_AR[districtName] || districtName) : UNVERIFIED_AR;
  if (!districtName) unverifiedCount++;

  const nameEn = asciiName || name;
  const nameAr = extractArabic(alts) || name;

  if (!tree[govEn]) tree[govEn] = { nameAr: govAr, nameEn: govEn, districts: {} };
  if (!tree[govEn].districts[distEn]) {
    tree[govEn].districts[distEn] = { nameAr: distAr, nameEn: distEn, villages: [] };
  }

  // Unique slug within country
  let baseSlug = slugify(nameEn);
  let slug = baseSlug;
  let n = 2;
  while (seenSlugs.has(slug)) { slug = `${baseSlug}-${n++}`; }
  seenSlugs.add(slug);

  tree[govEn].districts[distEn].villages.push({ slug, nameAr, nameEn });
  totalPlaces++;
}

// Emit
let out = `import { registerCountry } from './registry';\n`;
out += `import type { CountryGeo } from './types';\n\n`;
out += `// AUTO-GENERATED from GeoNames JO dataset + geoBoundaries ADM2.\n`;
out += `// Total populated places: ${totalPlaces}\n`;
out += `// Governorates: ${Object.keys(tree).length}\n`;
out += `// Districts assigned by point-in-polygon against geoBoundaries JOR ADM2.\n`;
out += `// Places outside all ADM2 polygons are in an "Unverified" district.\n`;
out += `// Attribution: geoBoundaries (Runfola et al. 2020), PLoS ONE 15(4): e0231866.\n\n`;
out += `const JO_GEO: CountryGeo = {\n`;
out += `  countryCode: 'JO',\n`;
out += `  governorates: [\n`;

const govOrder = Object.keys(ADMIN1_MAP).map(k => ADMIN1_MAP[k]);
for (const govEn of govOrder) {
  const gov = tree[govEn];
  if (!gov) continue;
  out += `    {\n`;
  out += `      slug: '${slugify(govEn)}',\n`;
  out += `      nameAr: '${escape(gov.nameAr)}',\n`;
  out += `      nameEn: '${escape(govEn)}',\n`;
  out += `      districts: [\n`;
  for (const [distEn, dist] of Object.entries(gov.districts)) {
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
const districtCount = Object.values(tree).reduce((s, g) => s + Object.keys(g.districts).length, 0);
const verifiedDistricts = Object.values(tree).reduce((s, g) => s + Object.keys(g.districts).filter(d => d !== UNVERIFIED).length, 0);

console.log('Wrote', OUTPUT);
console.log('Total places:', totalPlaces);
console.log('Governorates:', Object.keys(tree).length);
console.log('Districts (incl Unverified):', districtCount);
console.log('Verified districts:', verifiedDistricts);
console.log('Unverified places:', unverifiedCount);
console.log('Excluded outside bounds:', excludedOutside);
console.log('Excluded no admin1:', excludedNoAdmin1);
for (const govEn of govOrder) {
  const gov = tree[govEn];
  if (!gov) continue;
  const districts = Object.keys(gov.districts);
  const villages = Object.values(gov.districts).reduce((s, d) => s + d.villages.length, 0);
  const unverified = gov.districts[UNVERIFIED]?.villages.length || 0;
  console.log(`  ${govEn}: ${districts.length} districts, ${villages} villages (${unverified} unverified)`);
}
