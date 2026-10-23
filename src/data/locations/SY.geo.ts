import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const SY_GEO: CountryGeo = {
  countryCode: 'SY',
  governorates: [
    { slug: 'damascus', nameAr: 'دمشق', nameEn: 'Damascus', districts: [
      { slug: 'damascus-city', nameAr: 'دمشق', nameEn: 'Damascus City', villages: [] },
    ]},
    { slug: 'rif-dimashq', nameAr: 'ريف دمشق', nameEn: 'Rif Dimashq', districts: [
      { slug: 'douma', nameAr: 'دوما', nameEn: 'Douma', villages: [] },
      { slug: 'darayya', nameAr: 'داريا', nameEn: 'Darayya', villages: [] },
      { slug: 'zabadani', nameAr: 'الزبداني', nameEn: 'Zabadani', villages: [] },
      { slug: 'qatana', nameAr: 'قطنا', nameEn: 'Qatana', villages: [] },
      { slug: 'al-tall', nameAr: 'التل', nameEn: 'Al-Tall', villages: [] },
    ]},
    { slug: 'aleppo', nameAr: 'حلب', nameEn: 'Aleppo', districts: [
      { slug: 'aleppo-city', nameAr: 'حلب', nameEn: 'Aleppo City', villages: [] },
      { slug: 'afrin', nameAr: 'عفرين', nameEn: 'Afrin', villages: [] },
      { slug: 'al-bab', nameAr: 'الباب', nameEn: 'Al-Bab', villages: [] },
      { slug: 'manbij', nameAr: 'منبج', nameEn: 'Manbij', villages: [] },
      { slug: 'azaz', nameAr: 'أعزاز', nameEn: 'Azaz', villages: [] },
    ]},
    { slug: 'homs', nameAr: 'حمص', nameEn: 'Homs', districts: [
      { slug: 'homs-city', nameAr: 'حمص', nameEn: 'Homs City', villages: [] },
      { slug: 'palmyra-district', nameAr: 'تدمر', nameEn: 'Palmyra', villages: [] },
      { slug: 'al-qusayr', nameAr: 'القصير', nameEn: 'Al-Qusayr', villages: [] },
      { slug: 'tal-kalakh', nameAr: 'تلكلخ', nameEn: 'Tal Kalakh', villages: [] },
    ]},
    { slug: 'hama', nameAr: 'حماة', nameEn: 'Hama', districts: [
      { slug: 'hama-city', nameAr: 'حماة', nameEn: 'Hama City', villages: [] },
      { slug: 'salamiyah', nameAr: 'السلمية', nameEn: 'Salamiyah', villages: [] },
      { slug: 'misyaf', nameAr: 'مصياف', nameEn: 'Misyaf', villages: [] },
    ]},
    { slug: 'latakia', nameAr: 'اللاذقية', nameEn: 'Latakia', districts: [
      { slug: 'latakia-city', nameAr: 'اللاذقية', nameEn: 'Latakia City', villages: [] },
      { slug: 'jableh', nameAr: 'جبلة', nameEn: 'Jableh', villages: [] },
    ]},
    { slug: 'tartus', nameAr: 'طرطوس', nameEn: 'Tartus', districts: [
      { slug: 'tartus-city', nameAr: 'طرطوس', nameEn: 'Tartus City', villages: [] },
      { slug: 'banyas', nameAr: 'بانياس', nameEn: 'Banyas', villages: [] },
    ]},
    { slug: 'idlib', nameAr: 'إدلب', nameEn: 'Idlib', districts: [
      { slug: 'idlib-city', nameAr: 'إدلب', nameEn: 'Idlib City', villages: [] },
      { slug: 'maarat-al-numan', nameAr: 'معرة النعمان', nameEn: 'Maarat al-Numan', villages: [] },
      { slug: 'jisr-al-shugur', nameAr: 'جسر الشغور', nameEn: 'Jisr al-Shugur', villages: [] },
    ]},
    { slug: 'daraa', nameAr: 'درعا', nameEn: 'Daraa', districts: [
      { slug: 'daraa-city', nameAr: 'درعا', nameEn: 'Daraa City', villages: [] },
      { slug: 'izraa', nameAr: 'إزرع', nameEn: 'Izraa', villages: [] },
    ]},
    { slug: 'as-suwayda', nameAr: 'السويداء', nameEn: 'As-Suwayda', districts: [
      { slug: 'suwayda-city', nameAr: 'السويداء', nameEn: 'Suwayda City', villages: [] },
      { slug: 'shahba', nameAr: 'شهبا', nameEn: 'Shahba', villages: [] },
    ]},
    { slug: 'quneitra', nameAr: 'القنيطرة', nameEn: 'Quneitra', districts: [
      { slug: 'quneitra-city', nameAr: 'القنيطرة', nameEn: 'Quneitra City', villages: [] },
    ]},
    { slug: 'deir-ez-zor', nameAr: 'دير الزور', nameEn: 'Deir ez-Zor', districts: [
      { slug: 'deir-ez-zor-city', nameAr: 'دير الزور', nameEn: 'Deir ez-Zor City', villages: [] },
      { slug: 'al-mayadin', nameAr: 'الميادين', nameEn: 'Al-Mayadin', villages: [] },
    ]},
    { slug: 'raqqa', nameAr: 'الرقة', nameEn: 'Raqqa', districts: [
      { slug: 'raqqa-city', nameAr: 'الرقة', nameEn: 'Raqqa City', villages: [] },
      { slug: 'tal-abyad', nameAr: 'تل أبيض', nameEn: 'Tal Abyad', villages: [] },
    ]},
    { slug: 'hasakah', nameAr: 'الحسكة', nameEn: 'Hasakah', districts: [
      { slug: 'hasakah-city', nameAr: 'الحسكة', nameEn: 'Hasakah City', villages: [] },
      { slug: 'qamishli', nameAr: 'القامشلي', nameEn: 'Qamishli', villages: [] },
      { slug: 'al-malikiyah', nameAr: 'المالكية', nameEn: 'Al-Malikiyah', villages: [] },
    ]},
  ],
  refugeeCamps: [
    { slug: 'yarmouk-camp', nameAr: 'مخيم اليرموك', nameEn: 'Yarmouk Camp', governorateSlug: 'damascus' },
    { slug: 'neirab-camp', nameAr: 'مخيم النيرب', nameEn: 'Neirab Camp', governorateSlug: 'aleppo' },
    { slug: 'ein-el-tal-camp', nameAr: 'مخيم عين التل', nameEn: 'Ein el-Tal Camp', governorateSlug: 'aleppo' },
    { slug: 'hama-camp', nameAr: 'مخيم حماة', nameEn: 'Hama Camp', governorateSlug: 'hama' },
    { slug: 'homs-camp', nameAr: 'مخيم حمص', nameEn: 'Homs Camp', governorateSlug: 'homs' },
    { slug: 'jaramana-camp', nameAr: 'مخيم جرمانا', nameEn: 'Jaramana Camp', governorateSlug: 'rif-dimashq' },
    { slug: 'khan-eshieh-camp', nameAr: 'مخيم خان الشيح', nameEn: 'Khan Eshieh Camp', governorateSlug: 'rif-dimashq' },
    { slug: 'khan-dannoun-camp', nameAr: 'مخيم خان دنون', nameEn: 'Khan Dannoun Camp', governorateSlug: 'rif-dimashq' },
    { slug: 'qabr-essit-camp', nameAr: 'مخيم قبر الست (السبينة)', nameEn: 'Qabr Essit (Sbeineh) Camp', governorateSlug: 'rif-dimashq' },
  ],
  landmarks: [
    { slug: 'damascus-university', nameAr: 'جامعة دمشق', nameEn: 'Damascus University', citySlug: 'دمشق', type: 'university' },
    { slug: 'aleppo-university', nameAr: 'جامعة حلب', nameEn: 'University of Aleppo', citySlug: 'حلب', type: 'university' },
    { slug: 'tishreen-university', nameAr: 'جامعة تشرين', nameEn: 'Tishreen University', citySlug: 'اللاذقية', type: 'university' },
    { slug: 'baath-university', nameAr: 'جامعة البعث', nameEn: 'Al-Baath University', citySlug: 'حمص', type: 'university' },
    { slug: 'umayyad-mosque', nameAr: 'الجامع الأموي', nameEn: 'Umayyad Mosque', citySlug: 'دمشق', type: 'other' },
    { slug: 'hamidiyah-souq', nameAr: 'سوق الحميدية', nameEn: 'Al-Hamidiyah Souq', citySlug: 'دمشق', type: 'other' },
    { slug: 'aleppo-citadel', nameAr: 'قلعة حلب', nameEn: 'Citadel of Aleppo', citySlug: 'حلب', type: 'other' },
    { slug: 'palmyra', nameAr: 'تدمر', nameEn: 'Palmyra', citySlug: 'حمص', type: 'other' },
    { slug: 'damascus-airport', nameAr: 'مطار دمشق الدولي', nameEn: 'Damascus International Airport', citySlug: 'دمشق', type: 'airport' },
    { slug: 'al-mouwasat-hospital', nameAr: 'مستشفى المواساة', nameEn: 'Al-Mouwasat Hospital', citySlug: 'دمشق', type: 'hospital' },
  ],
};

registerCountry(SY_GEO);

export default SY_GEO;
