import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const SY_GEO: CountryGeo = {
  countryCode: 'SY',
  governorates: [
    { slug: 'damascus', nameAr: 'دمشق', nameEn: 'Damascus', districts: [] },
    { slug: 'rif-dimashq', nameAr: 'ريف دمشق', nameEn: 'Rif Dimashq', districts: [] },
    { slug: 'aleppo', nameAr: 'حلب', nameEn: 'Aleppo', districts: [] },
    { slug: 'homs', nameAr: 'حمص', nameEn: 'Homs', districts: [] },
    { slug: 'hama', nameAr: 'حماة', nameEn: 'Hama', districts: [] },
    { slug: 'latakia', nameAr: 'اللاذقية', nameEn: 'Latakia', districts: [] },
    { slug: 'tartus', nameAr: 'طرطوس', nameEn: 'Tartus', districts: [] },
    { slug: 'idlib', nameAr: 'إدلب', nameEn: 'Idlib', districts: [] },
    { slug: 'daraa', nameAr: 'درعا', nameEn: 'Daraa', districts: [] },
    { slug: 'as-suwayda', nameAr: 'السويداء', nameEn: 'As-Suwayda', districts: [] },
    { slug: 'quneitra', nameAr: 'القنيطرة', nameEn: 'Quneitra', districts: [] },
    { slug: 'deir-ez-zor', nameAr: 'دير الزور', nameEn: 'Deir ez-Zor', districts: [] },
    { slug: 'raqqa', nameAr: 'الرقة', nameEn: 'Raqqa', districts: [] },
    { slug: 'hasakah', nameAr: 'الحسكة', nameEn: 'Hasakah', districts: [] },
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
