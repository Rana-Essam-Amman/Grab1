/**
 * Generate src/data/locations/JO.geo.ts from GeoNames JO + DOS 2025 hierarchy.
 *
 * Official hierarchy source (names and parents only, no boundaries):
 *   Department of Statistics, Statistical Yearbook 2025, Table 2.4
 *   https://dosweb.dos.gov.jo/databank/Population/Population_Estimares/PopulationEstimates.pdf
 *
 * Locality source:
 *   GeoNames JO dump, featureClass=P, countryCode=JO, inside geoBoundaries ADM0.
 *
 * Rules:
 *   - Liwa are District. Qada exist only in JO_ADMIN_AUX.
 *   - No majority-of-GeoNames inference.
 *   - No official boundary claims. Polygon name is navigation metadata only.
 *   - A locality is placed under a Liwa only when the previous polygon name
 *     maps to a DOS unit whose governorate matches the locality's admin1.
 *     That link is parentStatus 'source-association', not official verification.
 *   - Otherwise parentStatus is 'unknown' and the locality is under Unverified.
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

const GOV_META = {
  Amman: { slug: 'amman', nameAr: 'العاصمة', nameEn: 'Amman' },
  Irbid: { slug: 'irbid', nameAr: 'إربد', nameEn: 'Irbid' },
  Karak: { slug: 'karak', nameAr: 'الكرك', nameEn: 'Karak' },
  Maan: { slug: 'maan', nameAr: 'معان', nameEn: "Ma'an" },
  Aqaba: { slug: 'aqaba', nameAr: 'العقبة', nameEn: 'Aqaba' },
  Ajloun: { slug: 'ajloun', nameAr: 'عجلون', nameEn: 'Ajlun' },
  Balqa: { slug: 'balqa', nameAr: 'البلقاء', nameEn: 'Balqa' },
  Jerash: { slug: 'jarash', nameAr: 'جرش', nameEn: 'Jarash' },
  Madaba: { slug: 'madaba', nameAr: 'مادبا', nameEn: 'Madaba' },
  Mafraq: { slug: 'mafraq', nameAr: 'المفرق', nameEn: 'Mafraq' },
  Tafileh: { slug: 'tafileh', nameAr: 'الطفيلة', nameEn: 'Tafiela' },
  Zarqa: { slug: 'zarqa', nameAr: 'الزرقاء', nameEn: 'Zarqa' },
};

const GOV_ORDER = ['Amman', 'Balqa', 'Zarqa', 'Madaba', 'Irbid', 'Mafraq', 'Jerash', 'Ajloun', 'Karak', 'Tafileh', 'Maan', 'Aqaba'];

// 51 DOS 2025 Liwa. slug is unique within governorate.
const LIWAS = [
  { gov: 'Amman', slug: 'amman-qasabah', nameEn: 'Amman Qasabah', nameAr: 'لواء قصبة عمان' },
  { gov: 'Amman', slug: 'marka', nameEn: 'Marka', nameAr: 'لواء ماركا' },
  { gov: 'Amman', slug: 'quaismeh', nameEn: 'Quaismeh', nameAr: 'لواء القويسمة' },
  { gov: 'Amman', slug: 'al-jamiah', nameEn: "Al-Jami'ah", nameAr: 'لواء الجامعة' },
  { gov: 'Amman', slug: 'wadi-essier', nameEn: 'Wadi Essier', nameAr: 'لواء وادي السير' },
  { gov: 'Amman', slug: 'sahab', nameEn: 'Sahab', nameAr: 'لواء سحاب' },
  { gov: 'Amman', slug: 'jizah', nameEn: 'Jizah', nameAr: 'لواء الجيزة' },
  { gov: 'Amman', slug: 'muaqqar', nameEn: 'Muaqqar', nameAr: 'لواء الموقر' },
  { gov: 'Amman', slug: 'naoor', nameEn: "Na'oor", nameAr: 'لواء ناعور' },
  { gov: 'Balqa', slug: 'salt-qasabah', nameEn: 'Salt Qasabah', nameAr: 'لواء قصبة السلط' },
  { gov: 'Balqa', slug: 'shoonah-janoobiyah', nameEn: 'Shoonah Janoobiyah', nameAr: 'لواء الشونة الجنوبية' },
  { gov: 'Balqa', slug: 'dair-alla', nameEn: 'Dair Alla', nameAr: 'لواء دير علا' },
  { gov: 'Balqa', slug: 'ain-albasha', nameEn: 'Ain Albasha', nameAr: 'لواء عين الباشا' },
  { gov: 'Balqa', slug: 'fuhais-mahes', nameEn: 'Fuhais&Mahes', nameAr: 'لواء ماحص والفحيص' },
  { gov: 'Zarqa', slug: 'zarqa-qasabah', nameEn: 'Zarqa Qasabah', nameAr: 'لواء قصبة الزرقاء' },
  { gov: 'Zarqa', slug: 'russeifa', nameEn: 'Russeifa', nameAr: 'لواء الرصيفة' },
  { gov: 'Zarqa', slug: 'hashemiyah', nameEn: 'Hashemiyah', nameAr: 'لواء الهاشمية' },
  { gov: 'Madaba', slug: 'madaba-qasabah', nameEn: 'Madaba Qasabah', nameAr: 'لواء قصبة مأدبا' },
  { gov: 'Madaba', slug: 'dieban', nameEn: 'Dieban', nameAr: 'لواء ذيبان' },
  { gov: 'Irbid', slug: 'irbid-qasabah', nameEn: 'Irbid Qasabah', nameAr: 'لواء قصبة اربد' },
  { gov: 'Irbid', slug: 'ramtha', nameEn: 'Ramtha', nameAr: 'لواء الرمثا' },
  { gov: 'Irbid', slug: 'koorah', nameEn: 'Koorah', nameAr: 'لواء الكورة' },
  { gov: 'Irbid', slug: 'bani-kenanah', nameEn: 'Bani Kenanah', nameAr: 'لواء بني كنانة' },
  { gov: 'Irbid', slug: 'aghwar-shamaliyah', nameEn: 'Aghwar Shamaliyah', nameAr: 'لواء الأغوار الشمالية' },
  { gov: 'Irbid', slug: 'bani-obeid', nameEn: 'Bani Obeid', nameAr: 'لواء بني عبيد' },
  { gov: 'Irbid', slug: 'mazar-shamali', nameEn: 'Mazar Shamali', nameAr: 'لواء المزار الشمالي' },
  { gov: 'Irbid', slug: 'taybeh', nameEn: 'Taybeh', nameAr: 'لواء الطيبة' },
  { gov: 'Irbid', slug: 'wastiyyah', nameEn: 'Wastiyyah', nameAr: 'لواء الوسطية' },
  { gov: 'Mafraq', slug: 'mafraq-qasabah', nameEn: 'Mafraq Qasabah', nameAr: 'لواء قصبة المفرق' },
  { gov: 'Mafraq', slug: 'badiah-shamaliyah', nameEn: 'Badiah Shamaliyah', nameAr: 'لواء البادية الشمالية' },
  { gov: 'Mafraq', slug: 'badiah-sh-gh', nameEn: 'Badiah Sh.Gh.', nameAr: 'لواء البادية الشمالية الغربية' },
  { gov: 'Mafraq', slug: 'rwaished', nameEn: 'Rwaished', nameAr: 'لواء الرويشد' },
  { gov: 'Jerash', slug: 'jarash', nameEn: 'Jarash', nameAr: 'لواء جرش' },
  { gov: 'Ajloun', slug: 'ajlun', nameEn: 'Ajlun', nameAr: 'لواء قصبة عجلون' },
  { gov: 'Ajloun', slug: 'kufranjah', nameEn: 'Kufranjah', nameAr: 'لواء كفرنجة' },
  { gov: 'Karak', slug: 'karak', nameEn: 'Karak', nameAr: 'لواء قصبة الكرك' },
  { gov: 'Karak', slug: 'mazar-janoobee', nameEn: 'Mazar Janoobee', nameAr: 'لواء المزار الجنوبي' },
  { gov: 'Karak', slug: 'qasr', nameEn: 'Qasr', nameAr: 'لواء القصر' },
  { gov: 'Karak', slug: 'aghwar-janoobiyah', nameEn: 'Aghwar Janoobiyah', nameAr: 'لواء الأغوار الجنوبية' },
  { gov: 'Karak', slug: 'ayy', nameEn: 'Ayy', nameAr: 'لواء عي' },
  { gov: 'Karak', slug: 'faqoe', nameEn: 'Faqo\'e', nameAr: 'لواء فقوع' },
  { gov: 'Karak', slug: 'qatraneh', nameEn: 'Qatraneh', nameAr: 'لواء القطرانة' },
  { gov: 'Tafileh', slug: 'tafiela', nameEn: 'Tafiela', nameAr: 'لواء قصبة الطفيلة' },
  { gov: 'Tafileh', slug: 'bsaira', nameEn: 'Bsaira', nameAr: 'لواء بصيرا' },
  { gov: 'Tafileh', slug: 'hasa', nameEn: 'Hasa', nameAr: 'لواء الحسا' },
  { gov: 'Maan', slug: 'maan', nameEn: "Ma'an", nameAr: 'لواء قصبة معان' },
  { gov: 'Maan', slug: 'petra', nameEn: 'Petra', nameAr: 'لواء البتراء' },
  { gov: 'Maan', slug: 'shobak-qasabah', nameEn: 'Shobak Qasabah', nameAr: 'لواء الشوبك' },
  { gov: 'Maan', slug: 'huseiniya', nameEn: 'Huseiniya', nameAr: 'لواء الحسينية' },
  { gov: 'Aqaba', slug: 'aqaba', nameEn: 'Aqaba', nameAr: 'مركز لواء العقبة' },
  { gov: 'Aqaba', slug: 'quairah', nameEn: 'Quairah', nameAr: 'مركز لواء القويرة' },
];

// 54 DOS 2025 Qada. sameNameAsLiwa is documentary; none are dropped.
const QADAS = [
  { gov: 'Amman', liwa: 'jizah', slug: 'jizah', nameEn: 'Jizah', nameAr: 'قضاء الجيزة', sameNameAsLiwa: true },
  { gov: 'Amman', liwa: 'jizah', slug: 'um-al-rasas', nameEn: 'Um Al-Rasas', nameAr: 'قضاء ام الرصاص', sameNameAsLiwa: false },
  { gov: 'Amman', liwa: 'muaqqar', slug: 'muaqqar', nameEn: 'Muaqqar', nameAr: 'قضاء الموقر', sameNameAsLiwa: true },
  { gov: 'Amman', liwa: 'muaqqar', slug: 'rajm-al-shami', nameEn: 'Rajm al-Shami', nameAr: 'قضاء رجم الشامي', sameNameAsLiwa: false },
  { gov: 'Amman', liwa: 'naoor', slug: 'naoor', nameEn: "Na'oor", nameAr: 'قضاء ناعور', sameNameAsLiwa: true },
  { gov: 'Amman', liwa: 'naoor', slug: 'um-elbasatien', nameEn: 'Um Elbasatien', nameAr: 'قضاء ام البساتين', sameNameAsLiwa: false },
  { gov: 'Amman', liwa: 'naoor', slug: 'hosban', nameEn: "Hosba'n", nameAr: 'قضاء حسبان', sameNameAsLiwa: false },
  { gov: 'Balqa', liwa: 'salt-qasabah', slug: 'salt', nameEn: 'Salt', nameAr: 'قضاء السلط', sameNameAsLiwa: true },
  { gov: 'Balqa', liwa: 'salt-qasabah', slug: 'al-ardha', nameEn: 'Al-Ardha', nameAr: 'قضاء العارضة', sameNameAsLiwa: false },
  { gov: 'Balqa', liwa: 'salt-qasabah', slug: 'allan-zayy', nameEn: 'Allan & Zayy', nameAr: 'قضاء علان وزي', sameNameAsLiwa: false },
  { gov: 'Balqa', liwa: 'salt-qasabah', slug: 'ira-yargha', nameEn: 'Ira & Yargha', nameAr: 'قضاء عيرا ويرقا', sameNameAsLiwa: false },
  { gov: 'Zarqa', liwa: 'zarqa-qasabah', slug: 'zarqa', nameEn: 'Zarqa', nameAr: 'قضاء الزرقاء', sameNameAsLiwa: true },
  { gov: 'Zarqa', liwa: 'zarqa-qasabah', slug: 'bierain', nameEn: 'Bierain', nameAr: 'قضاء بيرين', sameNameAsLiwa: false },
  { gov: 'Zarqa', liwa: 'zarqa-qasabah', slug: 'dhlail', nameEn: 'Dhlail', nameAr: 'قضاء الظليل', sameNameAsLiwa: false },
  { gov: 'Zarqa', liwa: 'zarqa-qasabah', slug: 'azraq', nameEn: 'Azraq', nameAr: 'قضاء الأزرق', sameNameAsLiwa: false },
  { gov: 'Madaba', liwa: 'madaba-qasabah', slug: 'madaba', nameEn: 'Madaba', nameAr: 'قضاء مادبا', sameNameAsLiwa: true },
  { gov: 'Madaba', liwa: 'madaba-qasabah', slug: 'jrainah', nameEn: 'Jrainah', nameAr: 'قضاء جرينة', sameNameAsLiwa: false },
  { gov: 'Madaba', liwa: 'madaba-qasabah', slug: 'maeen', nameEn: 'Maeen', nameAr: 'قضاء ماعين', sameNameAsLiwa: false },
  { gov: 'Madaba', liwa: 'madaba-qasabah', slug: 'faisaliah', nameEn: 'Faisaliah', nameAr: 'قضاء الفيصلية', sameNameAsLiwa: false },
  { gov: 'Madaba', liwa: 'dieban', slug: 'dieban', nameEn: 'Dieban', nameAr: 'قضاء ذيبان', sameNameAsLiwa: true },
  { gov: 'Madaba', liwa: 'dieban', slug: 'areedh', nameEn: 'Areedh', nameAr: 'قضاء العريض', sameNameAsLiwa: false },
  { gov: 'Madaba', liwa: 'dieban', slug: 'mlaih', nameEn: 'Mlaih', nameAr: 'قضاء مليح', sameNameAsLiwa: false },
  { gov: 'Mafraq', liwa: 'mafraq-qasabah', slug: 'mafraq', nameEn: 'Mafraq', nameAr: 'قضاء المفرق', sameNameAsLiwa: true },
  { gov: 'Mafraq', liwa: 'mafraq-qasabah', slug: 'balama', nameEn: "Bal'ama", nameAr: 'قضاء بلعما', sameNameAsLiwa: false },
  { gov: 'Mafraq', liwa: 'mafraq-qasabah', slug: 'irhab', nameEn: 'Irhab', nameAr: 'قضاء إرحاب', sameNameAsLiwa: false },
  { gov: 'Mafraq', liwa: 'mafraq-qasabah', slug: 'manshiyah', nameEn: 'Manshiyah', nameAr: 'قضاء المنشية', sameNameAsLiwa: false },
  { gov: 'Mafraq', liwa: 'badiah-shamaliyah', slug: 'salhiya', nameEn: 'Salhiya', nameAr: 'قضاء الصالحية', sameNameAsLiwa: false },
  { gov: 'Mafraq', liwa: 'badiah-shamaliyah', slug: 'sabha', nameEn: 'Sabha', nameAr: 'قضاء صبحا', sameNameAsLiwa: false },
  { gov: 'Mafraq', liwa: 'badiah-shamaliyah', slug: 'um-al-jemal', nameEn: 'Um Al-Jemal', nameAr: 'قضاء أم الجمال', sameNameAsLiwa: false },
  { gov: 'Mafraq', liwa: 'badiah-shamaliyah', slug: 'dair-al-kahf', nameEn: 'Dair Al Kahf', nameAr: 'قضاء دير الكهف', sameNameAsLiwa: false },
  { gov: 'Mafraq', liwa: 'badiah-shamaliyah', slug: 'om-elqotain', nameEn: 'Om-Elqotain', nameAr: 'قضاء أم القطين', sameNameAsLiwa: false },
  { gov: 'Mafraq', liwa: 'badiah-sh-gh', slug: 'badiyah-sh-gh', nameEn: 'Badiyah Sh.Gh', nameAr: 'قضاء البادية الشمالية الغربية', sameNameAsLiwa: true },
  { gov: 'Mafraq', liwa: 'badiah-sh-gh', slug: 'sama-serhan', nameEn: 'Sama Serhan', nameAr: 'قضاء سما السرحان', sameNameAsLiwa: false },
  { gov: 'Mafraq', liwa: 'badiah-sh-gh', slug: 'hosha', nameEn: 'Hosha', nameAr: 'قضاء حوشا', sameNameAsLiwa: false },
  { gov: 'Mafraq', liwa: 'badiah-sh-gh', slug: 'khaldiyah', nameEn: 'Khaldiyah', nameAr: 'قضاء الخالدية', sameNameAsLiwa: false },
  { gov: 'Jerash', liwa: 'jarash', slug: 'jarash', nameEn: 'Jarash', nameAr: 'قضاء جرش', sameNameAsLiwa: true },
  { gov: 'Jerash', liwa: 'jarash', slug: 'mastabah', nameEn: 'Mastabah', nameAr: 'قضاء المصطبة', sameNameAsLiwa: false },
  { gov: 'Jerash', liwa: 'jarash', slug: 'borma', nameEn: 'Borma', nameAr: 'قضاء برما', sameNameAsLiwa: false },
  { gov: 'Ajloun', liwa: 'ajlun', slug: 'ajlun', nameEn: 'Ajlun', nameAr: 'قضاء عجلون', sameNameAsLiwa: true },
  { gov: 'Ajloun', liwa: 'ajlun', slug: 'sakhrah', nameEn: 'Sakhrah', nameAr: 'قضاء صخرة', sameNameAsLiwa: false },
  { gov: 'Ajloun', liwa: 'ajlun', slug: 'orjan', nameEn: 'Orjan', nameAr: 'قضاء عرجان', sameNameAsLiwa: false },
  { gov: 'Karak', liwa: 'mazar-janoobee', slug: 'mazar', nameEn: 'Mazar', nameAr: 'قضاء المزار', sameNameAsLiwa: true },
  { gov: 'Karak', liwa: 'mazar-janoobee', slug: 'moaab', nameEn: "Mo'aab", nameAr: 'قضاء مؤاب', sameNameAsLiwa: false },
  { gov: 'Karak', liwa: 'qasr', slug: 'qasr', nameEn: 'Qasr', nameAr: 'قضاء القصر', sameNameAsLiwa: true },
  { gov: 'Karak', liwa: 'qasr', slug: 'mowjeb', nameEn: 'Mowjeb', nameAr: 'قضاء الموجب', sameNameAsLiwa: false },
  { gov: 'Karak', liwa: 'aghwar-janoobiyah', slug: 'safi', nameEn: 'Safi', nameAr: 'قضاء الصافي', sameNameAsLiwa: false },
  { gov: 'Karak', liwa: 'aghwar-janoobiyah', slug: 'ghawr-almazraa', nameEn: "Ghawr Almazra'a", nameAr: 'قضاء غور المزرعة', sameNameAsLiwa: false },
  { gov: 'Maan', liwa: 'maan', slug: 'maan', nameEn: "Ma'an", nameAr: 'قضاء معان', sameNameAsLiwa: true },
  { gov: 'Maan', liwa: 'maan', slug: 'iel', nameEn: 'Iel', nameAr: 'قضاء إيل', sameNameAsLiwa: false },
  { gov: 'Maan', liwa: 'maan', slug: 'jafr', nameEn: 'Jafr', nameAr: 'قضاء الجفر', sameNameAsLiwa: false },
  { gov: 'Maan', liwa: 'maan', slug: 'mraighah', nameEn: 'Mraighah', nameAr: 'قضاء المريغة', sameNameAsLiwa: false },
  { gov: 'Maan', liwa: 'maan', slug: 'athroh', nameEn: 'Athroh', nameAr: 'قضاء أذرح', sameNameAsLiwa: false },
  { gov: 'Aqaba', liwa: 'aqaba', slug: 'wadi-araba', nameEn: 'Wadi Araba', nameAr: 'قضاء وادي عربة', sameNameAsLiwa: false },
  { gov: 'Aqaba', liwa: 'quairah', slug: 'diesah', nameEn: 'Diesah', nameAr: 'قضاء الديسة', sameNameAsLiwa: false },
];

// Previous geoBoundaries polygon name -> DOS unit. Navigation metadata only.
// null = no official unit; locality stays Unverified.
const POLY_MAP = {
  'Al-Azraq': { type: 'qada', slug: 'azraq', gov: 'Zarqa' },
  'Al-Muwaqqar': { type: 'liwa', slug: 'muaqqar', gov: 'Amman' },
  'Um al-Basatin': { type: 'qada', slug: 'um-elbasatien', gov: 'Amman' },
  "Na'ur": { type: 'liwa', slug: 'naoor', gov: 'Amman' },
  'Sahab': { type: 'liwa', slug: 'sahab', gov: 'Amman' },
  'As-Salt': { type: 'liwa', slug: 'salt-qasabah', gov: 'Balqa' },
  'Al-Balqa': null,
  'Shuna al-Jabiniyya': { type: 'liwa', slug: 'shoonah-janoobiyah', gov: 'Balqa' },
  'Dair Alla': { type: 'liwa', slug: 'dair-alla', gov: 'Balqa' },
  'Wastiyyeh': { type: 'liwa', slug: 'wastiyyah', gov: 'Irbid' },
  'Tayybeh': { type: 'liwa', slug: 'taybeh', gov: 'Irbid' },
  'Bani Knana': { type: 'liwa', slug: 'bani-kenanah', gov: 'Irbid' },
  'Al-Aghwar Shamaliyyeh': { type: 'liwa', slug: 'aghwar-shamaliyah', gov: 'Irbid' },
  'Ar-Ruwayshid': { type: 'liwa', slug: 'rwaished', gov: 'Mafraq' },
  'Sabha': { type: 'qada', slug: 'sabha', gov: 'Mafraq' },
  'Al-Mafraq': { type: 'liwa', slug: 'mafraq-qasabah', gov: 'Mafraq' },
  'Wadi Araba': { type: 'qada', slug: 'wadi-araba', gov: 'Aqaba' },
  'Al-Safi': { type: 'qada', slug: 'safi', gov: 'Karak' },
  'Ayy': { type: 'liwa', slug: 'ayy', gov: 'Karak' },
  'Al-Karak': { type: 'liwa', slug: 'karak', gov: 'Karak' },
  "Ma'an": { type: 'liwa', slug: 'maan', gov: 'Maan' },
  'Ayi': null,
  'Wadi Musa': { type: 'liwa', slug: 'petra', gov: 'Maan' },
  'Al-Husanyniyya': { type: 'liwa', slug: 'huseiniya', gov: 'Maan' },
  'Ash-Shibek': { type: 'liwa', slug: 'shobak-qasabah', gov: 'Maan' },
  'Al-Aqaba': { type: 'liwa', slug: 'aqaba', gov: 'Aqaba' },
  'Al-Tafila': { type: 'liwa', slug: 'tafiela', gov: 'Tafileh' },
  'Birsayra': { type: 'liwa', slug: 'bsaira', gov: 'Tafileh' },
  'Al-Hasa': { type: 'liwa', slug: 'hasa', gov: 'Tafileh' },
  'Hariema': null,
  'Kora': { type: 'liwa', slug: 'koorah', gov: 'Irbid' },
  'Irbid': { type: 'liwa', slug: 'irbid-qasabah', gov: 'Irbid' },
  'Al-Jizah': { type: 'liwa', slug: 'jizah', gov: 'Amman' },
  'Dhiban': { type: 'liwa', slug: 'dieban', gov: 'Madaba' },
  'Madaba': { type: 'liwa', slug: 'madaba-qasabah', gov: 'Madaba' },
  'Amman': { type: 'liwa', slug: 'amman-qasabah', gov: 'Amman' },
  'Wadi al-Sayr': { type: 'liwa', slug: 'wadi-essier', gov: 'Amman' },
  'Az-Zarqa': { type: 'liwa', slug: 'zarqa-qasabah', gov: 'Zarqa' },
  'Birin': { type: 'qada', slug: 'bierain', gov: 'Zarqa' },
  'Ar Ramtha': { type: 'liwa', slug: 'ramtha', gov: 'Irbid' },
  'Ardhah': { type: 'qada', slug: 'al-ardha', gov: 'Balqa' },
  'Kofranjah': { type: 'liwa', slug: 'kufranjah', gov: 'Ajloun' },
  'Aljun': { type: 'liwa', slug: 'ajlun', gov: 'Ajloun' },
  'Mazar Shamaliyyeh': { type: 'liwa', slug: 'mazar-shamali', gov: 'Irbid' },
  'Jerash': { type: 'liwa', slug: 'jarash', gov: 'Jerash' },
  'Sama as-Sarhan': { type: 'qada', slug: 'sama-serhan', gov: 'Mafraq' },
  "Bal'ama": { type: 'qada', slug: 'balama', gov: 'Mafraq' },
  'Al-Quwayra': { type: 'liwa', slug: 'quairah', gov: 'Aqaba' },
  'Al-Qasr': { type: 'liwa', slug: 'qasr', gov: 'Karak' },
  'Faqqu': { type: 'liwa', slug: 'faqoe', gov: 'Karak' },
  "Al-Mazra'a": { type: 'qada', slug: 'ghawr-almazraa', gov: 'Karak' },
  'Al-Mazar al-Janubiyya': { type: 'liwa', slug: 'mazar-janoobee', gov: 'Karak' },
};

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'x';
}
function escape(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
function extractArabic(alts) {
  if (!alts) return null;
  for (const a of alts.split(',')) {
    const t = a.trim();
    if (/[\u0600-\u06FF]/.test(t)) return t;
  }
  return null;
}
function pointInRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if (((yi > lat) !== (yj > lat)) && (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}
function pointInPolygon(lon, lat, coords) {
  if (!pointInRing(lon, lat, coords[0])) return false;
  for (let h = 1; h < coords.length; h++) if (pointInRing(lon, lat, coords[h])) return false;
  return true;
}
function pointInGeometry(lon, lat, g) {
  if (g.type === 'Polygon') return pointInPolygon(lon, lat, g.coordinates);
  if (g.type === 'MultiPolygon') return g.coordinates.some((p) => pointInPolygon(lon, lat, p));
  return false;
}

const adm2 = JSON.parse(fs.readFileSync(ADM2, 'utf-8'));
const adm0 = JSON.parse(fs.readFileSync(ADM0, 'utf-8'));
const countryGeom = adm0.features[0].geometry;
const polygons = adm2.features.map((f) => ({ name: f.properties.shapeName, geometry: f.geometry }));

function findPolygonName(lon, lat) {
  for (const p of polygons) if (pointInGeometry(lon, lat, p.geometry)) return p.name;
  return null;
}

const places = [];
let excludedOutside = 0;
for (const line of fs.readFileSync(INPUT, 'utf-8').split('\n')) {
  const parts = line.split('\t');
  if (parts.length < 19) continue;
  const geonameid = parts[0];
  const name = parts[1];
  const asciiName = parts[2];
  const alts = parts[3];
  const lat = parseFloat(parts[4]);
  const lon = parseFloat(parts[5]);
  if (parts[6] !== 'P' || parts[8] !== 'JO' || !name) continue;
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !pointInGeometry(lon, lat, countryGeom)) {
    excludedOutside++;
    continue;
  }
  const govEn = ADMIN1_MAP[parts[10]];
  if (!govEn) continue;
  places.push({ geonameid, name, asciiName, alts, lat, lon, govEn });
}

if (places.length !== 1748) {
  console.error(`Expected 1748 localities, got ${places.length}`);
  process.exit(1);
}
if (LIWAS.length !== 51) {
  console.error(`Expected 51 Liwa, got ${LIWAS.length}`);
  process.exit(1);
}
if (QADAS.length !== 54) {
  console.error(`Expected 54 Qada, got ${QADAS.length}`);
  process.exit(1);
}

const qadaByKey = new Map(QADAS.map((q) => [`${q.gov}/${q.slug}`, q]));
const liwaByKey = new Map(LIWAS.map((l) => [`${l.gov}/${l.slug}`, l]));

const tree = {};
for (const gov of GOV_ORDER) {
  tree[gov] = { districts: {} };
  for (const l of LIWAS.filter((x) => x.gov === gov)) {
    tree[gov].districts[l.slug] = { meta: l, villages: [] };
  }
  tree[gov].districts.unverified = {
    meta: { slug: 'unverified', nameEn: 'Unverified', nameAr: 'غير محدد' },
    villages: [],
  };
}

const seenSlugs = new Set();
const links = [];
let sourceAssoc = 0;
let unknown = 0;
let untranslated = 0;

for (const pl of places) {
  const polyName = findPolygonName(pl.lon, pl.lat);
  const mapped = polyName ? POLY_MAP[polyName] : undefined;
  let liwaSlug = null;
  let qadaSlug = null;
  let parentStatus = 'unknown';

  if (mapped && mapped.gov === pl.govEn) {
    if (mapped.type === 'liwa' && liwaByKey.has(`${pl.govEn}/${mapped.slug}`)) {
      liwaSlug = mapped.slug;
      parentStatus = 'source-association';
    } else if (mapped.type === 'qada') {
      const q = qadaByKey.get(`${pl.govEn}/${mapped.slug}`);
      if (q && liwaByKey.has(`${pl.govEn}/${q.liwa}`)) {
        liwaSlug = q.liwa;
        qadaSlug = q.slug;
        parentStatus = 'source-association';
      }
    }
  }

  const nameEn = pl.asciiName || pl.name;
  const arabicAlt = extractArabic(pl.alts);
  const nameAr = arabicAlt || pl.name;
  if (!arabicAlt) untranslated++;

  let base = slugify(nameEn);
  let slug = base;
  let n = 2;
  while (seenSlugs.has(slug)) slug = `${base}-${n++}`;
  seenSlugs.add(slug);

  const dest = liwaSlug ? tree[pl.govEn].districts[liwaSlug] : tree[pl.govEn].districts.unverified;
  dest.villages.push({ slug, nameAr, nameEn });
  if (parentStatus === 'source-association') sourceAssoc++;
  else unknown++;

  const govSlug = GOV_META[pl.govEn].slug;
  links.push({
    linkKey: `${govSlug}/${pl.geonameid}`,
    geonameid: pl.geonameid,
    localitySlug: slug,
    governorateSlug: govSlug,
    liwaSlug,
    qadaSlug,
    parentStatus,
    sourcePolygon: polyName,
  });
}

const linkKeys = new Set(links.map((l) => l.linkKey));
const geonameids = new Set(links.map((l) => l.geonameid));
if (linkKeys.size !== links.length || geonameids.size !== links.length) {
  console.error('Duplicate linkKey or geonameid');
  process.exit(1);
}

let out = `// RULE-14-EXCEPTION: Complete Jordan location dataset must stay atomic for market isolation and offline performance. Splitting into 12 files would break the single-source-of-truth contract enforced by registry.ts.

import { registerCountry } from './registry';
import type { CountryGeo } from './types';

// AUTO-GENERATED. Official hierarchy: DOS Statistical Yearbook 2025 Table 2.4 (names/parents only).
// Localities: GeoNames JO, featureClass=P, countryCode=JO, inside ADM0. Count: ${places.length}.
// Liwa are District. Qada are only in JO_ADMIN_AUX. No majority inference. No official boundary claims.
// localityLinks.parentStatus 'source-association' is navigation metadata, not official verification.
// Excluded outside ADM0: ${excludedOutside}. Untranslated Arabic: ${untranslated}.

const JO_GEO: CountryGeo = {
  countryCode: 'JO',
  governorates: [
`;

for (const gov of GOV_ORDER) {
  const g = GOV_META[gov];
  out += `    {\n      slug: '${g.slug}',\n      nameAr: '${escape(g.nameAr)}',\n      nameEn: '${escape(g.nameEn)}',\n      districts: [\n`;
  const districts = Object.values(tree[gov].districts);
  for (const d of districts) {
    out += `        {\n          slug: '${d.meta.slug}',\n          nameAr: '${escape(d.meta.nameAr)}',\n          nameEn: '${escape(d.meta.nameEn)}',\n          villages: [\n`;
    for (const v of d.villages) {
      out += `            { slug: '${escape(v.slug)}', nameAr: '${escape(v.nameAr)}', nameEn: '${escape(v.nameEn)}' },\n`;
    }
    out += `          ],\n        },\n`;
  }
  out += `      ],\n    },\n`;
}

out += `  ],
  refugeeCamps: [],
  landmarks: [],
};

registerCountry(JO_GEO);

export default JO_GEO;

export interface JoQada {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly governorateSlug: string;
  readonly liwaSlug: string;
  readonly sameNameAsLiwa: boolean;
}

export interface JoLocalityLink {
  readonly linkKey: string;
  readonly geonameid: string;
  readonly localitySlug: string;
  readonly governorateSlug: string;
  readonly liwaSlug: string | null;
  readonly qadaSlug: string | null;
  readonly parentStatus: 'source-association' | 'unknown';
  readonly sourcePolygon: string | null;
}

export const JO_ADMIN_AUX: {
  readonly qada: readonly JoQada[];
  readonly localityLinks: readonly JoLocalityLink[];
} = {
  qada: [
`;

for (const q of QADAS) {
  const govSlug = GOV_META[q.gov].slug;
  out += `    { slug: '${q.slug}', nameAr: '${escape(q.nameAr)}', nameEn: '${escape(q.nameEn)}', governorateSlug: '${govSlug}', liwaSlug: '${q.liwa}', sameNameAsLiwa: ${q.sameNameAsLiwa} },\n`;
}

out += `  ],
  localityLinks: [
`;

for (const l of links) {
  out += `    { linkKey: '${l.linkKey}', geonameid: '${l.geonameid}', localitySlug: '${escape(l.localitySlug)}', governorateSlug: '${l.governorateSlug}', liwaSlug: ${l.liwaSlug ? `'${l.liwaSlug}'` : 'null'}, qadaSlug: ${l.qadaSlug ? `'${l.qadaSlug}'` : 'null'}, parentStatus: '${l.parentStatus}', sourcePolygon: ${l.sourcePolygon ? `'${escape(l.sourcePolygon)}'` : 'null'} },\n`;
}

out += `  ],
};
`;

fs.writeFileSync(OUTPUT, out);
console.log('Localities:', places.length);
console.log('Liwa:', LIWAS.length);
console.log('Qada:', QADAS.length);
console.log('Same-name Qada:', QADAS.filter((q) => q.sameNameAsLiwa).length);
console.log('Source-association:', sourceAssoc);
console.log('Unknown:', unknown);
console.log('Untranslated:', untranslated);
console.log('Wrote', OUTPUT);
