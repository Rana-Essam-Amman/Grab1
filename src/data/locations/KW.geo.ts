import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const KW_GEO: CountryGeo = {
  countryCode: 'KW',
  governorates: [
    { slug: 'al-asimah', nameAr: 'العاصمة', nameEn: 'Al Asimah', districts: [
      { slug: 'al-kuwait-city', nameAr: 'مدينة الكويت', nameEn: 'Kuwait City', villages: [] },
      { slug: 'sharq', nameAr: 'شرق', nameEn: 'Sharq', villages: [] },
      { slug: 'qibla', nameAr: 'قبلة', nameEn: 'Qibla', villages: [] },
      { slug: 'salhiya', nameAr: 'الصالحية', nameEn: 'Salhiya', villages: [] },
      { slug: 'kaifan', nameAr: 'كيفان', nameEn: 'Kaifan', villages: [] },
      { slug: 'mansouriya', nameAr: 'المنصورية', nameEn: 'Mansouriya', villages: [] },
      { slug: 'dasma', nameAr: 'الدسمة', nameEn: 'Dasma', villages: [] },
      { slug: 'bneid-al-gar', nameAr: 'بنيد القار', nameEn: 'Bneid Al Gar', villages: [] },
      { slug: 'shamiya', nameAr: 'الشامية', nameEn: 'Shamiya', villages: [] },
      { slug: 'faiha', nameAr: 'الفيحاء', nameEn: 'Faiha', villages: [] },
      { slug: 'nuzha', nameAr: 'النزهة', nameEn: 'Nuzha', villages: [] },
      { slug: 'yarmouk', nameAr: 'اليرموك', nameEn: 'Yarmouk', villages: [] },
      { slug: 'qadsiya', nameAr: 'القادسية', nameEn: 'Qadsiya', villages: [] },
      { slug: 'surra', nameAr: 'السرة', nameEn: 'Surra', villages: [] },
      { slug: 'qurtuba', nameAr: 'قرطبة', nameEn: 'Qurtuba', villages: [] },
      { slug: 'rawda', nameAr: 'الروضة', nameEn: 'Rawda', villages: [] },
      { slug: 'adailiya', nameAr: 'العديلية', nameEn: 'Adailiya', villages: [] },
      { slug: 'khaldiya', nameAr: 'الخالدية', nameEn: 'Khaldiya', villages: [] },
      { slug: 'shuwaikh', nameAr: 'الشويخ', nameEn: 'Shuwaikh', villages: [] },
      { slug: 'doha', nameAr: 'الدوحة', nameEn: 'Doha', villages: [] }
    ]},
    { slug: 'hawalli', nameAr: 'حولي', nameEn: 'Hawalli', districts: [
      { slug: 'hawalli', nameAr: 'حولي', nameEn: 'Hawalli', villages: [] },
      { slug: 'salmiya', nameAr: 'السالمية', nameEn: 'Salmiya', villages: [] },
      { slug: 'jabriya', nameAr: 'الجابرية', nameEn: 'Jabriya', villages: [] },
      { slug: 'rumaithiya', nameAr: 'الرميثية', nameEn: 'Rumaithiya', villages: [] },
      { slug: 'shaab', nameAr: 'الشعب', nameEn: 'Shaab', villages: [] },
      { slug: 'mishrif', nameAr: 'مشرف', nameEn: 'Mishrif', villages: [] },
      { slug: 'bayan', nameAr: 'بيان', nameEn: 'Bayan', villages: [] },
      { slug: 'salwa', nameAr: 'سلوى', nameEn: 'Salwa', villages: [] },
      { slug: 'salam', nameAr: 'السلام', nameEn: 'Salam', villages: [] },
      { slug: 'shati', nameAr: 'الشاطئ', nameEn: 'Shati', villages: [] },
      { slug: 'siddiq', nameAr: 'الصديق', nameEn: 'Siddiq', villages: [] },
      { slug: 'anjafa', nameAr: 'أنجفة', nameEn: 'Anjafa', villages: [] }
    ]},
    { slug: 'al-farwaniya', nameAr: 'الفروانية', nameEn: 'Al Farwaniya', districts: [
      { slug: 'farwaniya', nameAr: 'الفروانية', nameEn: 'Farwaniya', villages: [] },
      { slug: 'khaitan', nameAr: 'خيطان', nameEn: 'Khaitan', villages: [] },
      { slug: 'rabiya', nameAr: 'الرابية', nameEn: 'Rabiya', villages: [] },
      { slug: 'andalus', nameAr: 'الأندلس', nameEn: 'Andalus', villages: [] },
      { slug: 'ardiya', nameAr: 'العارضية', nameEn: 'Ardiya', villages: [] },
      { slug: 'ardiya-herafiya', nameAr: 'العارضية الحرفية', nameEn: 'Ardiya Herafiya', villages: [] },
      { slug: 'shadadiya', nameAr: 'الشدادية', nameEn: 'Shadadiya', villages: [] },
      { slug: 'jleeb-al-shuyoukh', nameAr: 'جليب الشيوخ', nameEn: 'Jleeb Al-Shuyoukh', villages: [] },
      { slug: 'abbasiya', nameAr: 'العباسية', nameEn: 'Abbasiya', villages: [] },
      { slug: 'sabah-al-nasser', nameAr: 'صباح الناصر', nameEn: 'Sabah Al-Nasser', villages: [] },
      { slug: 'ashbiliya', nameAr: 'الأشبيلية', nameEn: 'Ashbiliya', villages: [] },
      { slug: 'riggae', nameAr: 'الرقعي', nameEn: 'Riggae', villages: [] },
      { slug: 'omariya', nameAr: 'العمرية', nameEn: 'Omariya', villages: [] },
      { slug: 'dhajeej', nameAr: 'الضجيج', nameEn: 'Dhajeej', villages: [] },
      { slug: 'ferdous', nameAr: 'الفردوس', nameEn: 'Ferdous', villages: [] },
      { slug: 'rehab', nameAr: 'الرحاب', nameEn: 'Rehab', villages: [] },
      { slug: 'rai', nameAr: 'الري', nameEn: 'Rai', villages: [] }
    ]},
    { slug: 'mubarak-al-kabeer', nameAr: 'مبارك الكبير', nameEn: 'Mubarak Al-Kabeer', districts: [
      { slug: 'mubarak-al-kabeer', nameAr: 'مبارك الكبير', nameEn: 'Mubarak Al-Kabeer', villages: [] },
      { slug: 'sabah-al-salem', nameAr: 'صباح السالم', nameEn: 'Sabah Al-Salem', villages: [] },
      { slug: 'qurain', nameAr: 'القرين', nameEn: 'Qurain', villages: [] },
      { slug: 'qusour', nameAr: 'القصور', nameEn: 'Qusour', villages: [] },
      { slug: 'adan', nameAr: 'العدان', nameEn: 'Adan', villages: [] },
      { slug: 'messila', nameAr: 'المسيلة', nameEn: 'Messila', villages: [] },
      { slug: 'waha', nameAr: 'الواحة', nameEn: 'Waha', villages: [] },
      { slug: 'masayel', nameAr: 'المسايل', nameEn: 'Masayel', villages: [] },
      { slug: 'fnaitees', nameAr: 'الفنيطيس', nameEn: 'Fnaitees', villages: [] },
      { slug: 'abu-halifa', nameAr: 'أبو حليفة', nameEn: 'Abu Halifa', villages: [] },
      { slug: 'abu-al-hasaniya', nameAr: 'أبو الحصانية', nameEn: 'Abu Al-Hasaniya', villages: [] }
    ]},
    { slug: 'al-ahmadi', nameAr: 'الأحمدي', nameEn: 'Al Ahmadi', districts: [
      { slug: 'ahmadi', nameAr: 'الأحمدي', nameEn: 'Ahmadi', villages: [] },
      { slug: 'fahaheel', nameAr: 'الفحيحيل', nameEn: 'Fahaheel', villages: [] },
      { slug: 'mahboula', nameAr: 'المهبولة', nameEn: 'Mahboula', villages: [] },
      { slug: 'mangaf', nameAr: 'المنقف', nameEn: 'Mangaf', villages: [] },
      { slug: 'sabahiya', nameAr: 'الصباحية', nameEn: 'Sabahiya', villages: [] },
      { slug: 'fintas', nameAr: 'الفنطاس', nameEn: 'Fintas', villages: [] },
      { slug: 'riqqa', nameAr: 'الرقة', nameEn: 'Riqqa', villages: [] },
      { slug: 'hadiya', nameAr: 'هدية', nameEn: 'Hadiya', villages: [] },
      { slug: 'fahad-al-ahmad', nameAr: 'فهد الأحمد', nameEn: 'Fahad Al-Ahmad', villages: [] },
      { slug: 'sabah-al-ahmad-sea-city', nameAr: 'صباح الأحمد البحرية', nameEn: 'Sabah Al-Ahmad Sea City', villages: [] },
      { slug: 'wafra', nameAr: 'الوفرة', nameEn: 'Wafra', villages: [] },
      { slug: 'khiran', nameAr: 'الخيران', nameEn: 'Khiran', villages: [] },
      { slug: 'nuwaiseeb', nameAr: 'النويصيب', nameEn: 'Nuwaiseeb', villages: [] },
      { slug: 'zour', nameAr: 'الزور', nameEn: 'Zour', villages: [] },
      { slug: 'shuaiba', nameAr: 'الشعيبة', nameEn: 'Shuaiba', villages: [] },
      { slug: 'ali-sabah-al-salem', nameAr: 'علي صباح السالم', nameEn: 'Ali Sabah Al-Salem', villages: [] }
    ]},
    { slug: 'al-jahra', nameAr: 'الجهراء', nameEn: 'Al Jahra', districts: [
      { slug: 'jahra', nameAr: 'الجهراء', nameEn: 'Jahra', villages: [] },
      { slug: 'saad-al-abdullah', nameAr: 'سعد العبدالله', nameEn: 'Saad Al-Abdullah', villages: [] },
      { slug: 'sulaibikhat', nameAr: 'الصليبخات', nameEn: 'Sulaibikhat', villages: [] },
      { slug: 'sulaibiya', nameAr: 'الصليبية', nameEn: 'Sulaibiya', villages: [] },
      { slug: 'qasr', nameAr: 'القصر', nameEn: 'Qasr', villages: [] },
      { slug: 'naseem', nameAr: 'النسيم', nameEn: 'Naseem', villages: [] },
      { slug: 'taima', nameAr: 'تيماء', nameEn: 'Taima', villages: [] },
      { slug: 'nahda', nameAr: 'النهضة', nameEn: 'Nahda', villages: [] },
      { slug: 'oyoun', nameAr: 'العيون', nameEn: 'Oyoun', villages: [] },
      { slug: 'amghara', nameAr: 'أمغرة', nameEn: 'Amghara', villages: [] },
      { slug: 'mutlaa', nameAr: 'المطلاع', nameEn: 'Mutlaa', villages: [] },
      { slug: 'abdali', nameAr: 'العبدلي', nameEn: 'Abdali', villages: [] },
      { slug: 'salmi', nameAr: 'السالمي', nameEn: 'Salmi', villages: [] },
      { slug: 'kabad', nameAr: 'كبد', nameEn: 'Kabad', villages: [] }
    ]}
  ],
  refugeeCamps: [],
  landmarks: [
    { slug: 'kuwait-towers', nameAr: 'أبراج الكويت', nameEn: 'Kuwait Towers', citySlug: 'Al Kuwayt', type: 'other' },
    { slug: 'avenues-mall', nameAr: 'الأفنيوز مول', nameEn: 'The Avenues Mall', citySlug: 'Al Rai', type: 'mall' },
    { slug: '360-mall', nameAr: '360 مول', nameEn: '360 Mall', citySlug: 'Al Zahra', type: 'mall' },
    { slug: 'kuwait-international-airport', nameAr: 'مطار الكويت الدولي', nameEn: 'Kuwait International Airport', citySlug: 'Al Farwaniya', type: 'airport' },
    { slug: 'kuwait-university', nameAr: 'جامعة الكويت', nameEn: 'Kuwait University', citySlug: 'Al Shuwaikh', type: 'university' }
  ]
};

registerCountry(KW_GEO);
export default KW_GEO;
