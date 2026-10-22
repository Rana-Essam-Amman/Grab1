import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const JO_GEO: CountryGeo = {
  countryCode: 'JO',
  governorates: [
    { slug: 'amman', nameAr: 'العاصمة', nameEn: 'Amman', districts: [
      { slug: 'amman-city', nameAr: 'عمان', nameEn: 'Amman City', villages: [] },
      { slug: 'wadi-seer', nameAr: 'وادي السير', nameEn: 'Wadi Seer', villages: [] },
      { slug: 'jiza', nameAr: 'الجيزة', nameEn: 'Jiza', villages: [] },
      { slug: 'marka', nameAr: 'ماركا', nameEn: 'Marka', villages: [] },
      { slug: 'quwaysimah', nameAr: 'القويسمة', nameEn: 'Quwaysimah', villages: [] },
      { slug: 'sahab', nameAr: 'سحاب', nameEn: 'Sahab', villages: [] },
    ]},
    { slug: 'irbid', nameAr: 'إربد', nameEn: 'Irbid', districts: [
      { slug: 'irbid-city', nameAr: 'إربد', nameEn: 'Irbid City', villages: [] },
      { slug: 'ramtha', nameAr: 'الرمثا', nameEn: 'Ramtha', villages: [] },
      { slug: 'bani-kinanah', nameAr: 'بني كنانة', nameEn: 'Bani Kinanah', villages: [] },
      { slug: 'kura', nameAr: 'الكورة', nameEn: 'Kura', villages: [] },
      { slug: 'mazar-shamali', nameAr: 'المزار الشمالي', nameEn: 'Mazar Shamali', villages: [] },
    ]},
    { slug: 'zarqa', nameAr: 'الزرقاء', nameEn: 'Zarqa', districts: [
      { slug: 'zarqa-city', nameAr: 'الزرقاء', nameEn: 'Zarqa City', villages: [] },
      { slug: 'russeifa', nameAr: 'الرصيفة', nameEn: 'Russeifa', villages: [] },
      { slug: 'hashemiyya', nameAr: 'الهاشمية', nameEn: 'Hashemiyya', villages: [] },
    ]},
    { slug: 'mafraq', nameAr: 'المفرق', nameEn: 'Mafraq', districts: [
      { slug: 'mafraq-city', nameAr: 'المفرق', nameEn: 'Mafraq City', villages: [] },
      { slug: 'ruwaished', nameAr: 'الرويشد', nameEn: 'Ruwaished', villages: [] },
      { slug: 'badia-sharqiyya', nameAr: 'البادية الشرقية', nameEn: 'Badia Sharqiyya', villages: [] },
    ]},
    { slug: 'ajloun', nameAr: 'عجلون', nameEn: 'Ajloun', districts: [
      { slug: 'ajloun-city', nameAr: 'عجلون', nameEn: 'Ajloun City', villages: [] },
      { slug: 'kofranjah', nameAr: 'كفرنجة', nameEn: 'Kofranjah', villages: [] },
    ]},
    { slug: 'jerash', nameAr: 'جرش', nameEn: 'Jerash', districts: [
      { slug: 'jerash-city', nameAr: 'جرش', nameEn: 'Jerash City', villages: [] },
    ]},
    { slug: 'madaba', nameAr: 'مادبا', nameEn: 'Madaba', districts: [
      { slug: 'madaba-city', nameAr: 'مادبا', nameEn: 'Madaba City', villages: [] },
      { slug: 'dhiban', nameAr: 'ذيبان', nameEn: 'Dhiban', villages: [] },
    ]},
    { slug: 'balqa', nameAr: 'البلقاء', nameEn: 'Balqa', districts: [
      { slug: 'salt', nameAr: 'السلط', nameEn: 'Salt', villages: [] },
      { slug: 'fuheis', nameAr: 'الفحيص', nameEn: 'Fuheis', villages: [] },
      { slug: 'ain-basha', nameAr: 'عين الباشا', nameEn: 'Ain Basha', villages: [] },
      { slug: 'deir-alla', nameAr: 'دير علا', nameEn: 'Deir Alla', villages: [] },
    ]},
    { slug: 'karak', nameAr: 'الكرك', nameEn: 'Karak', districts: [
      { slug: 'karak-city', nameAr: 'الكرك', nameEn: 'Karak City', villages: [] },
      { slug: 'mazar-janoubi', nameAr: 'المزار الجنوبي', nameEn: 'Mazar Janoubi', villages: [] },
      { slug: 'qasr', nameAr: 'القصر', nameEn: 'Qasr', villages: [] },
    ]},
    { slug: 'tafileh', nameAr: 'الطفيلة', nameEn: 'Tafileh', districts: [
      { slug: 'tafileh-city', nameAr: 'الطفيلة', nameEn: 'Tafileh City', villages: [] },
      { slug: 'buseira', nameAr: 'بصيرا', nameEn: 'Buseira', villages: [] },
    ]},
    { slug: 'maan', nameAr: 'معان', nameEn: "Ma'an", districts: [
      { slug: 'maan-city', nameAr: 'معان', nameEn: "Ma'an City", villages: [] },
      { slug: 'petra-district', nameAr: 'البتراء', nameEn: 'Petra District', villages: [] },
      { slug: 'wadi-musa', nameAr: 'وادي موسى', nameEn: 'Wadi Musa', villages: [] },
    ]},
    { slug: 'aqaba', nameAr: 'العقبة', nameEn: 'Aqaba', districts: [
      { slug: 'aqaba-city', nameAr: 'العقبة', nameEn: 'Aqaba City', villages: [] },
      { slug: 'quweira', nameAr: 'القويرة', nameEn: 'Quweira', villages: [] },
    ]},
  ],
  refugeeCamps: [
    { slug: 'baqaa-camp', nameAr: 'مخيم البقعة', nameEn: "Baqa'a Camp", governorateSlug: 'balqa' },
    { slug: 'wihdat-camp', nameAr: 'مخيم الوحدات', nameEn: 'Wihdat (Amman New) Camp', governorateSlug: 'amman' },
    { slug: 'husn-camp', nameAr: 'مخيم الحصن', nameEn: 'Husn Camp', governorateSlug: 'irbid' },
    { slug: 'irbid-camp', nameAr: 'مخيم إربد', nameEn: 'Irbid Camp', governorateSlug: 'irbid' },
    { slug: 'jabal-hussein-camp', nameAr: 'مخيم جبل الحسين', nameEn: 'Jabal al-Hussein Camp', governorateSlug: 'amman' },
    { slug: 'jerash-camp', nameAr: 'مخيم جرش (غزة)', nameEn: 'Jerash (Gaza) Camp', governorateSlug: 'jerash' },
    { slug: 'marka-camp', nameAr: 'مخيم ماركا', nameEn: 'Marka Camp', governorateSlug: 'amman' },
    { slug: 'souf-camp', nameAr: 'مخيم سوف', nameEn: 'Souf Camp', governorateSlug: 'jerash' },
    { slug: 'talbieh-camp', nameAr: 'مخيم الطالبية', nameEn: 'Talbieh Camp', governorateSlug: 'amman' },
    { slug: 'zaatari-camp', nameAr: 'مخيم الزعتري', nameEn: 'Zaatari Camp', governorateSlug: 'mafraq' },
    { slug: 'azraq-camp', nameAr: 'مخيم الأزرق', nameEn: 'Azraq Camp', governorateSlug: 'zarqa' },
  ],
  landmarks: [
    { slug: 'mecca-mall', nameAr: 'مكة مول', nameEn: 'Mecca Mall', citySlug: 'Amman', type: 'mall' },
    { slug: 'city-mall-amman', nameAr: 'سيتي مول عمان', nameEn: 'City Mall Amman', citySlug: 'Amman', type: 'mall' },
    { slug: 'the-boulevard-amman', nameAr: 'البوليفارد', nameEn: 'The Boulevard', citySlug: 'Amman', type: 'mall' },
    { slug: 'university-of-jordan', nameAr: 'الجامعة الأردنية', nameEn: 'University of Jordan', citySlug: 'Amman', type: 'university' },
    { slug: 'jordan-university-hospital', nameAr: 'مستشفى الجامعة الأردنية', nameEn: 'Jordan University Hospital', citySlug: 'Amman', type: 'hospital' },
    { slug: 'jordan-hospital', nameAr: 'مستشفى الأردن', nameEn: 'Jordan Hospital', citySlug: 'Amman', type: 'hospital' },
    { slug: 'qai-airport', nameAr: 'مطار الملكة علياء الدولي', nameEn: 'Queen Alia International Airport', citySlug: 'Amman', type: 'airport' },
    { slug: 'king-hussein-airport', nameAr: 'مطار الملك حسين الدولي', nameEn: 'King Hussein International Airport', citySlug: 'Aqaba', type: 'airport' },
    { slug: 'petra', nameAr: 'البتراء', nameEn: 'Petra', citySlug: 'Maan', type: 'other' },
    { slug: 'amman-citadel', nameAr: 'جبل القلعة', nameEn: 'Amman Citadel', citySlug: 'Amman', type: 'other' },
  ],
};

registerCountry(JO_GEO);

export default JO_GEO;
