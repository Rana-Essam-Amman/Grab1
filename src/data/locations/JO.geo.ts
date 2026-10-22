import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const JO_GEO: CountryGeo = {
  countryCode: 'JO',
  governorates: [
    { slug: 'amman', nameAr: 'العاصمة', nameEn: 'Amman', districts: [] },
    { slug: 'irbid', nameAr: 'إربد', nameEn: 'Irbid', districts: [] },
    { slug: 'zarqa', nameAr: 'الزرقاء', nameEn: 'Zarqa', districts: [] },
    { slug: 'mafraq', nameAr: 'المفرق', nameEn: 'Mafraq', districts: [] },
    { slug: 'ajloun', nameAr: 'عجلون', nameEn: 'Ajloun', districts: [] },
    { slug: 'jerash', nameAr: 'جرش', nameEn: 'Jerash', districts: [] },
    { slug: 'madaba', nameAr: 'مادبا', nameEn: 'Madaba', districts: [] },
    { slug: 'balqa', nameAr: 'البلقاء', nameEn: 'Balqa', districts: [] },
    { slug: 'karak', nameAr: 'الكرك', nameEn: 'Karak', districts: [] },
    { slug: 'tafileh', nameAr: 'الطفيلة', nameEn: 'Tafileh', districts: [] },
    { slug: 'maan', nameAr: 'معان', nameEn: "Ma'an", districts: [] },
    { slug: 'aqaba', nameAr: 'العقبة', nameEn: 'Aqaba', districts: [] },
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
