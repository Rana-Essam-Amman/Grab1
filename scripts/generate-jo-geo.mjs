import fs from 'node:fs';

const INPUT = '/tmp/JO.txt';
const OUTPUT = 'src/data/locations/JO.geo.ts';

const ADMIN1_MAP = {
  '16': 'Amman', '18': 'Irbid', '09': 'Karak',
  '19': 'Maan', '21': 'Aqaba', '20': 'Ajloun',
  '02': 'Balqa', '22': 'Jerash', '23': 'Madaba',
  '15': 'Mafraq', '12': 'Tafileh', '17': 'Zarqa',
};

const ARABIC_MAP = {
  Amman: 'العاصمة', Irbid: 'إربد', Karak: 'الكرك', Maan: 'معان',
  Aqaba: 'العقبة', Ajloun: 'عجلون', Balqa: 'البلقاء', Jerash: 'جرش',
  Madaba: 'مادبا', Mafraq: 'المفرق', Tafileh: 'الطفيلة', Zarqa: 'الزرقاء',
};

const str = (s) => JSON.stringify(String(s));

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '') || 'x';
}

const raw = fs.readFileSync(INPUT, 'utf-8');
const lines = raw.split('\n');

const tree = {};
let totalPlaces = 0;

for (const line of lines) {
  const parts = line.split('\t');
  if (parts.length < 19) continue;
  const name = parts[1];
  const featureClass = parts[6];
  const countryCode = parts[8];
  const admin1 = parts[10];
  const admin2 = parts[11];
  if (countryCode !== 'JO') continue;
  if (featureClass !== 'P') continue;
  if (!name || !admin1) continue;

  const govEn = ADMIN1_MAP[admin1];
  if (!govEn) continue;
  const govAr = ARABIC_MAP[govEn];
  const distName = admin2 || 'General';

  if (!tree[govEn]) tree[govEn] = { nameAr: govAr, nameEn: govEn, districts: {} };
  if (!tree[govEn].districts[distName]) tree[govEn].districts[distName] = [];
  tree[govEn].districts[distName].push(name);
  totalPlaces++;
}

let out = `import { registerCountry } from './registry';\n`;
out += `import type { CountryGeo } from './types';\n\n`;
out += `// AUTO-GENERATED from GeoNames JO dataset.\n`;
out += `// Total populated places: ${totalPlaces}\n`;
out += `// Governorates: ${Object.keys(tree).length}\n\n`;
out += `const JO_GEO: CountryGeo = {\n`;
out += `  countryCode: 'JO',\n`;
out += `  governorates: [\n`;

for (const [govEn, gov] of Object.entries(tree)) {
  out += `    {\n`;
  out += `      slug: ${str(slugify(govEn))},\n`;
  out += `      nameAr: ${str(gov.nameAr)},\n`;
  out += `      nameEn: ${str(govEn)},\n`;
  out += `      districts: [\n`;
  for (const [distName, villages] of Object.entries(gov.districts)) {
    out += `        {\n`;
    out += `          slug: ${str(slugify(distName))},\n`;
    out += `          nameAr: ${str(distName)},\n`;
    out += `          nameEn: ${str(distName)},\n`;
    out += `          villages: [\n`;
    for (const v of villages) {
      out += `            { slug: ${str(slugify(v))}, nameAr: ${str(v)}, nameEn: ${str(v)} },\n`;
    }
    out += `          ],\n        },\n`;
  }
  out += `      ],\n    },\n`;
}

out += `  ],\n  refugeeCamps: [],\n  landmarks: [],\n};\n\n`;
out += `registerCountry(JO_GEO);\n\nexport default JO_GEO;\n`;

fs.writeFileSync(OUTPUT, out);
console.log('Wrote', OUTPUT);
console.log('Total places:', totalPlaces);
console.log('Governorates:', Object.keys(tree).length);
