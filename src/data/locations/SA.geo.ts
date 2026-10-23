import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const SA_GEO: CountryGeo = {
  countryCode: 'SA',
  governorates: [
    { slug: 'riyadh-region', nameAr: 'الرياض', nameEn: 'Riyadh', districts: [
      { slug: 'riyadh-city', nameAr: 'الرياض', nameEn: 'Riyadh City', villages: [] },
      { slug: 'al-kharj', nameAr: 'الخرج', nameEn: 'Al-Kharj', villages: [] },
      { slug: 'al-diriyah', nameAr: 'الدرعية', nameEn: 'Al-Diriyah', villages: [] },
      { slug: 'al-majmaah', nameAr: 'المجمعة', nameEn: 'Al-Majmaah', villages: [] },
      { slug: 'al-quwaiyah', nameAr: 'القويعية', nameEn: 'Al-Quwaiyah', villages: [] },
    ]},
    { slug: 'makkah-region', nameAr: 'مكة المكرمة', nameEn: 'Makkah', districts: [
      { slug: 'makkah-city', nameAr: 'مكة المكرمة', nameEn: 'Makkah City', villages: [] },
      { slug: 'jeddah', nameAr: 'جدة', nameEn: 'Jeddah', villages: [] },
      { slug: 'taif', nameAr: 'الطائف', nameEn: 'Taif', villages: [] },
      { slug: 'rabigh', nameAr: 'رابغ', nameEn: 'Rabigh', villages: [] },
    ]},
    { slug: 'madinah-region', nameAr: 'المدينة المنورة', nameEn: 'Madinah', districts: [
      { slug: 'madinah-city', nameAr: 'المدينة المنورة', nameEn: 'Madinah City', villages: [] },
      { slug: 'yanbu', nameAr: 'ينبع', nameEn: 'Yanbu', villages: [] },
      { slug: 'al-ula', nameAr: 'العلا', nameEn: 'Al-Ula', villages: [] },
    ]},
    { slug: 'qassim', nameAr: 'القصيم', nameEn: 'Qassim', districts: [
      { slug: 'buraydah', nameAr: 'بريدة', nameEn: 'Buraydah', villages: [] },
      { slug: 'unaizah', nameAr: 'عنيزة', nameEn: 'Unaizah', villages: [] },
      { slug: 'al-rass', nameAr: 'الرس', nameEn: 'Al-Rass', villages: [] },
    ]},
    { slug: 'eastern-province', nameAr: 'المنطقة الشرقية', nameEn: 'Eastern Province', districts: [
      { slug: 'dammam', nameAr: 'الدمام', nameEn: 'Dammam', villages: [] },
      { slug: 'khobar', nameAr: 'الخبر', nameEn: 'Khobar', villages: [] },
      { slug: 'dhahran', nameAr: 'الظهران', nameEn: 'Dhahran', villages: [] },
      { slug: 'jubail', nameAr: 'الجبيل', nameEn: 'Jubail', villages: [] },
      { slug: 'qatif', nameAr: 'القطيف', nameEn: 'Qatif', villages: [] },
      { slug: 'hofuf', nameAr: 'الهفوف (الأحساء)', nameEn: 'Hofuf (Al-Ahsa)', villages: [] },
      { slug: 'hafr-al-batin', nameAr: 'حفر الباطن', nameEn: 'Hafr Al-Batin', villages: [] },
    ]},
    { slug: 'asir', nameAr: 'عسير', nameEn: 'Asir', districts: [
      { slug: 'abha', nameAr: 'أبها', nameEn: 'Abha', villages: [] },
      { slug: 'khamis-mushait', nameAr: 'خميس مشيط', nameEn: 'Khamis Mushait', villages: [] },
    ]},
    { slug: 'tabuk', nameAr: 'تبوك', nameEn: 'Tabuk', districts: [
      { slug: 'tabuk-city', nameAr: 'تبوك', nameEn: 'Tabuk City', villages: [] },
    ]},
    { slug: 'hail', nameAr: 'حائل', nameEn: 'Hail', districts: [
      { slug: 'hail-city', nameAr: 'حائل', nameEn: 'Hail City', villages: [] },
    ]},
    { slug: 'northern-borders', nameAr: 'الحدود الشمالية', nameEn: 'Northern Borders', districts: [
      { slug: 'arar', nameAr: 'عرعر', nameEn: 'Arar', villages: [] },
    ]},
    { slug: 'jazan', nameAr: 'جازان', nameEn: 'Jazan', districts: [
      { slug: 'jazan-city', nameAr: 'جازان', nameEn: 'Jazan City', villages: [] },
    ]},
    { slug: 'najran', nameAr: 'نجران', nameEn: 'Najran', districts: [
      { slug: 'najran-city', nameAr: 'نجران', nameEn: 'Najran City', villages: [] },
    ]},
    { slug: 'al-bahah', nameAr: 'الباحة', nameEn: 'Al Bahah', districts: [
      { slug: 'bahah-city', nameAr: 'الباحة', nameEn: 'Bahah City', villages: [] },
    ]},
    { slug: 'al-jouf', nameAr: 'الجوف', nameEn: 'Al Jouf', districts: [
      { slug: 'sakaka', nameAr: 'سكاكا', nameEn: 'Sakaka', villages: [] },
      { slug: 'qurayyat', nameAr: 'القريات', nameEn: 'Qurayyat', villages: [] },
    ]},
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
