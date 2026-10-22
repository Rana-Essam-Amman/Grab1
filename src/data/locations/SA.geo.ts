import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const SA_GEO: CountryGeo = {
  countryCode: 'SA',
  governorates: [
    { slug: 'riyadh-region', nameAr: 'الرياض', nameEn: 'Riyadh', districts: [] },
    { slug: 'makkah-region', nameAr: 'مكة المكرمة', nameEn: 'Makkah', districts: [] },
    { slug: 'madinah-region', nameAr: 'المدينة المنورة', nameEn: 'Madinah', districts: [] },
    { slug: 'qassim', nameAr: 'القصيم', nameEn: 'Qassim', districts: [] },
    { slug: 'eastern-province', nameAr: 'المنطقة الشرقية', nameEn: 'Eastern Province', districts: [] },
    { slug: 'asir', nameAr: 'عسير', nameEn: 'Asir', districts: [] },
    { slug: 'tabuk', nameAr: 'تبوك', nameEn: 'Tabuk', districts: [] },
    { slug: 'hail', nameAr: 'حائل', nameEn: 'Hail', districts: [] },
    { slug: 'northern-borders', nameAr: 'الحدود الشمالية', nameEn: 'Northern Borders', districts: [] },
    { slug: 'jazan', nameAr: 'جازان', nameEn: 'Jazan', districts: [] },
    { slug: 'najran', nameAr: 'نجران', nameEn: 'Najran', districts: [] },
    { slug: 'al-bahah', nameAr: 'الباحة', nameEn: 'Al Bahah', districts: [] },
    { slug: 'al-jouf', nameAr: 'الجوف', nameEn: 'Al Jouf', districts: [] },
  ],
  refugeeCamps: [],
  landmarks: [
    { slug: 'king-saud-university', nameAr: 'جامعة الملك سعود', nameEn: 'King Saud University', citySlug: 'الرياض', type: 'university' },
    { slug: 'king-abdulaziz-university', nameAr: 'جامعة الملك عبدالعزيز', nameEn: 'King Abdulaziz University', citySlug: 'جدة', type: 'university' },
    { slug: 'kfupm', nameAr: 'جامعة الملك فهد للبترول والمعادن', nameEn: 'KFUPM', citySlug: 'الدمام', type: 'university' },
    { slug: 'king-khalid-airport', nameAr: 'مطار الملك خالد الدولي', nameEn: 'King Khalid International Airport', citySlug: 'الرياض', type: 'airport' },
    { slug: 'king-abdulaziz-airport', nameAr: 'مطار الملك عبدالعزيز الدولي', nameEn: 'King Abdulaziz International Airport', citySlug: 'جدة', type: 'airport' },
    { slug: 'masjid-al-haram', nameAr: 'المسجد الحرام', nameEn: 'Masjid al-Haram', citySlug: 'مكة المكرمة', type: 'other' },
    { slug: 'masjid-an-nabawi', nameAr: 'المسجد النبوي', nameEn: 'Al-Masjid an-Nabawi', citySlug: 'المدينة المنورة', type: 'other' },
    { slug: 'riyadh-park-mall', nameAr: 'الرياض بارك مول', nameEn: 'Riyadh Park Mall', citySlug: 'الرياض', type: 'mall' },
    { slug: 'andalus-mall', nameAr: 'الأندلس مول', nameEn: 'Andalus Mall', citySlug: 'جدة', type: 'mall' },
    { slug: 'kingdom-centre', nameAr: 'المملكة سنتر', nameEn: 'Kingdom Centre', citySlug: 'الرياض', type: 'mall' },
  ],
};

registerCountry(SA_GEO);

export default SA_GEO;
