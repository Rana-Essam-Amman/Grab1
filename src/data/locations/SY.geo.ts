// RULE-14-EXCEPTION: Complete Syria location dataset (14 governorates) must stay atomic for market isolation and offline performance.

import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const SY_GEO: CountryGeo = {
  countryCode: 'SY',
  governorates: [
    {
      slug: 'damascus',
      nameAr: 'دمشق',
      nameEn: 'Damascus',
      districts: [
        {
          slug: 'damascus-city',
          nameAr: 'دمشق',
          nameEn: 'Damascus City',
          villages: [
            { slug: 'al-midan', nameAr: 'الميدان', nameEn: 'Al-Midan' },
            { slug: 'al-mazzeh', nameAr: 'المزة', nameEn: 'Al-Mazzeh' },
            { slug: 'kafr-souseh', nameAr: 'كفرسوسة', nameEn: 'Kafr Souseh' },
            { slug: 'al-salihiyah', nameAr: 'الصالحية', nameEn: 'Al-Salihiyah' },
            { slug: 'bab-touma', nameAr: 'باب توما', nameEn: 'Bab Touma' },
            { slug: 'al-shaghour', nameAr: 'الشاغور', nameEn: 'Al-Shaghour' },
            { slug: 'qaboun', nameAr: 'القابون', nameEn: 'Qaboun' },
            { slug: 'barzeh', nameAr: 'برزة', nameEn: 'Barzeh' },
            { slug: 'dummar', nameAr: 'دمر', nameEn: 'Dummar' },
            { slug: 'al-tadamon', nameAr: 'التضامن', nameEn: 'Al-Tadamon' },
            { slug: 'yarmouk', nameAr: 'اليرموك', nameEn: 'Yarmouk' },
          ],
        },
      ],
    },
    {
      slug: 'rif-dimashq',
      nameAr: 'ريف دمشق',
      nameEn: 'Rif Dimashq',
      districts: [
        {
          slug: 'douma',
          nameAr: 'دوما',
          nameEn: 'Douma',
          villages: [
            { slug: 'douma', nameAr: 'دوما', nameEn: 'Douma' },
            { slug: 'harasta', nameAr: 'حرستا', nameEn: 'Harasta' },
            { slug: 'adra', nameAr: 'عدرا', nameEn: 'Adra' },
          ],
        },
        {
          slug: 'darayya',
          nameAr: 'داريا',
          nameEn: 'Darayya',
          villages: [
            { slug: 'darayya', nameAr: 'داريا', nameEn: 'Darayya' },
            { slug: 'moadamiyeh', nameAr: 'معضمية الشام', nameEn: 'Moadamiyeh' },
            { slug: 'sahnaya', nameAr: 'صحنايا', nameEn: 'Sahnaya' },
          ],
        },
        {
          slug: 'jaramana',
          nameAr: 'جرمانا',
          nameEn: 'Jaramana',
          villages: [
            { slug: 'jaramana', nameAr: 'جرمانا', nameEn: 'Jaramana' },
            { slug: 'babbila', nameAr: 'ببيلا', nameEn: 'Babbila' },
            { slug: 'yilda', nameAr: 'يلدا', nameEn: 'Yilda' },
          ],
        },
        {
          slug: 'al-zabadani',
          nameAr: 'الزبداني',
          nameEn: 'Al-Zabadani',
          villages: [
            { slug: 'al-zabadani', nameAr: 'الزبداني', nameEn: 'Al-Zabadani' },
            { slug: 'madaya', nameAr: 'مضايا', nameEn: 'Madaya' },
            { slug: 'bloudan', nameAr: 'بلودان', nameEn: 'Bloudan' },
          ],
        },
      ],
    },
    {
      slug: 'aleppo',
      nameAr: 'حلب',
      nameEn: 'Aleppo',
      districts: [
        {
          slug: 'aleppo-city',
          nameAr: 'حلب',
          nameEn: 'Aleppo City',
          villages: [
            { slug: 'aleppo', nameAr: 'حلب', nameEn: 'Aleppo' },
            { slug: 'al-shahba', nameAr: 'الشهباء', nameEn: 'Al-Shahba' },
            { slug: 'salah-al-din', nameAr: 'صلاح الدين', nameEn: 'Salah Al-Din' },
          ],
        },
        {
          slug: 'manbij',
          nameAr: 'منبج',
          nameEn: 'Manbij',
          villages: [
            { slug: 'manbij', nameAr: 'منبج', nameEn: 'Manbij' },
          ],
        },
        {
          slug: 'azaz',
          nameAr: 'أعزاز',
          nameEn: 'Azaz',
          villages: [
            { slug: 'azaz', nameAr: 'أعزاز', nameEn: 'Azaz' },
            { slug: 'mare', nameAr: 'مارع', nameEn: 'Mare' },
          ],
        },
        {
          slug: 'al-bab',
          nameAr: 'الباب',
          nameEn: 'Al-Bab',
          villages: [
            { slug: 'al-bab', nameAr: 'الباب', nameEn: 'Al-Bab' },
            { slug: 'bzaa', nameAr: 'بزاعة', nameEn: 'Bzaa' },
          ],
        },
        {
          slug: 'afrin',
          nameAr: 'عفرين',
          nameEn: 'Afrin',
          villages: [
            { slug: 'afrin', nameAr: 'عفرين', nameEn: 'Afrin' },
            { slug: 'jindires', nameAr: 'جنديرس', nameEn: 'Jindires' },
          ],
        },
      ],
    },
    {
      slug: 'homs',
      nameAr: 'حمص',
      nameEn: 'Homs',
      districts: [
        {
          slug: 'homs-city',
          nameAr: 'حمص',
          nameEn: 'Homs City',
          villages: [
            { slug: 'homs', nameAr: 'حمص', nameEn: 'Homs' },
            { slug: 'baba-amr', nameAr: 'بابا عمرو', nameEn: 'Baba Amr' },
            { slug: 'al-waer', nameAr: 'الوعر', nameEn: 'Al-Waer' },
          ],
        },
        {
          slug: 'al-rastan',
          nameAr: 'الرستن',
          nameEn: 'Al-Rastan',
          villages: [
            { slug: 'al-rastan', nameAr: 'الرستن', nameEn: 'Al-Rastan' },
            { slug: 'talbeesa', nameAr: 'تلبيسة', nameEn: 'Talbeesa' },
          ],
        },
        {
          slug: 'tadmur',
          nameAr: 'تدمر',
          nameEn: 'Tadmur',
          villages: [
            { slug: 'tadmur', nameAr: 'تدمر', nameEn: 'Tadmur' },
          ],
        },
      ],
    },
    {
      slug: 'hama',
      nameAr: 'حماة',
      nameEn: 'Hama',
      districts: [
        {
          slug: 'hama-city',
          nameAr: 'حماة',
          nameEn: 'Hama City',
          villages: [
            { slug: 'hama', nameAr: 'حماة', nameEn: 'Hama' },
            { slug: 'salamiyah', nameAr: 'سلمية', nameEn: 'Salamiyah' },
          ],
        },
        {
          slug: 'masyaf',
          nameAr: 'مصياف',
          nameEn: 'Masyaf',
          villages: [
            { slug: 'masyaf', nameAr: 'مصياف', nameEn: 'Masyaf' },
            { slug: 'wadi-al-uyun', nameAr: 'وادي العيون', nameEn: 'Wadi Al-Uyun' },
          ],
        },
        {
          slug: 'al-suqaylabiyah',
          nameAr: 'السقيلبية',
          nameEn: 'Al-Suqaylabiyah',
          villages: [
            { slug: 'al-suqaylabiyah', nameAr: 'السقيلبية', nameEn: 'Al-Suqaylabiyah' },
          ],
        },
      ],
    },
    {
      slug: 'latakia',
      nameAr: 'اللاذقية',
      nameEn: 'Latakia',
      districts: [
        {
          slug: 'latakia-city',
          nameAr: 'اللاذقية',
          nameEn: 'Latakia City',
          villages: [
            { slug: 'latakia', nameAr: 'اللاذقية', nameEn: 'Latakia' },
            { slug: 'jableh', nameAr: 'جبلة', nameEn: 'Jableh' },
            { slug: 'qardaha', nameAr: 'القرداحة', nameEn: 'Qardaha' },
            { slug: 'al-haffah', nameAr: 'الحفة', nameEn: 'Al-Haffah' },
          ],
        },
      ],
    },
    {
      slug: 'tartus',
      nameAr: 'طرطوس',
      nameEn: 'Tartus',
      districts: [
        {
          slug: 'tartus-city',
          nameAr: 'طرطوس',
          nameEn: 'Tartus City',
          villages: [
            { slug: 'tartus', nameAr: 'طرطوس', nameEn: 'Tartus' },
            { slug: 'baniyas', nameAr: 'بانياس', nameEn: 'Baniyas' },
            { slug: 'safita', nameAr: 'صافيتا', nameEn: 'Safita' },
          ],
        },
      ],
    },
    {
      slug: 'idlib',
      nameAr: 'إدلب',
      nameEn: 'Idlib',
      districts: [
        {
          slug: 'idlib-city',
          nameAr: 'إدلب',
          nameEn: 'Idlib City',
          villages: [
            { slug: 'idlib', nameAr: 'إدلب', nameEn: 'Idlib' },
            { slug: 'maarrat-al-numan', nameAr: 'معرة النعمان', nameEn: "Ma'arrat al-Nu'man" },
            { slug: 'jisr-al-shughur', nameAr: 'جسر الشغور', nameEn: 'Jisr al-Shughur' },
            { slug: 'ariha', nameAr: 'أريحا', nameEn: 'Ariha' },
          ],
        },
      ],
    },
    {
      slug: 'daraa',
      nameAr: 'درعا',
      nameEn: 'Daraa',
      districts: [
        {
          slug: 'daraa-city',
          nameAr: 'درعا',
          nameEn: 'Daraa City',
          villages: [
            { slug: 'daraa', nameAr: 'درعا', nameEn: 'Daraa' },
            { slug: 'izra', nameAr: 'إزرع', nameEn: "Izra'" },
            { slug: 'al-sanamayn', nameAr: 'الصنمين', nameEn: 'Al-Sanamayn' },
          ],
        },
      ],
    },
    {
      slug: 'as-suwayda',
      nameAr: 'السويداء',
      nameEn: 'As-Suwayda',
      districts: [
        {
          slug: 'as-suwayda-city',
          nameAr: 'السويداء',
          nameEn: 'As-Suwayda City',
          villages: [
            { slug: 'as-suwayda', nameAr: 'السويداء', nameEn: 'As-Suwayda' },
            { slug: 'shahba', nameAr: 'شهبا', nameEn: 'Shahba' },
            { slug: 'salkhad', nameAr: 'صلخد', nameEn: 'Salkhad' },
          ],
        },
      ],
    },
    {
      slug: 'al-hasakah',
      nameAr: 'الحسكة',
      nameEn: 'Al-Hasakah',
      districts: [
        {
          slug: 'al-hasakah-city',
          nameAr: 'الحسكة',
          nameEn: 'Al-Hasakah City',
          villages: [
            { slug: 'al-hasakah', nameAr: 'الحسكة', nameEn: 'Al-Hasakah' },
            { slug: 'qamishli', nameAr: 'القامشلي', nameEn: 'Qamishli' },
            { slug: 'ras-al-ayn', nameAr: 'رأس العين', nameEn: 'Ras al-Ayn' },
          ],
        },
      ],
    },
    {
      slug: 'deir-ez-zor',
      nameAr: 'دير الزور',
      nameEn: 'Deir ez-Zor',
      districts: [
        {
          slug: 'deir-ez-zor-city',
          nameAr: 'دير الزور',
          nameEn: 'Deir ez-Zor City',
          villages: [
            { slug: 'deir-ez-zor', nameAr: 'دير الزور', nameEn: 'Deir ez-Zor' },
            { slug: 'al-mayadin', nameAr: 'الميادين', nameEn: 'Al-Mayadin' },
            { slug: 'al-bukamal', nameAr: 'البوكمال', nameEn: 'Al-Bukamal' },
          ],
        },
      ],
    },
    {
      slug: 'raqqa',
      nameAr: 'الرقة',
      nameEn: 'Raqqa',
      districts: [
        {
          slug: 'raqqa-city',
          nameAr: 'الرقة',
          nameEn: 'Raqqa City',
          villages: [
            { slug: 'raqqa', nameAr: 'الرقة', nameEn: 'Raqqa' },
            { slug: 'tal-abyad', nameAr: 'تل أبيض', nameEn: 'Tal Abyad' },
            { slug: 'al-thawrah', nameAr: 'الثورة', nameEn: 'Al-Thawrah' },
          ],
        },
      ],
    },
    {
      slug: 'quneitra',
      nameAr: 'القنيطرة',
      nameEn: 'Quneitra',
      districts: [
        {
          slug: 'quneitra-city',
          nameAr: 'القنيطرة',
          nameEn: 'Quneitra City',
          villages: [
            { slug: 'quneitra', nameAr: 'القنيطرة', nameEn: 'Quneitra' },
            { slug: 'khan-arnabah', nameAr: 'خان أرنبة', nameEn: 'Khan Arnabah' },
            { slug: 'al-baath', nameAr: 'البعث', nameEn: 'Al-Baath' },
          ],
        },
      ],
    },
  ],
  refugeeCamps: [],
  landmarks: [
    { slug: 'umayyad-mosque', nameAr: 'المسجد الأموي', nameEn: 'Umayyad Mosque', citySlug: 'damascus', type: 'other' },
    { slug: 'aleppo-citadel', nameAr: 'قلعة حلب', nameEn: 'Aleppo Citadel', citySlug: 'aleppo', type: 'other' },
    { slug: 'palmyra', nameAr: 'تدمر', nameEn: 'Palmyra', citySlug: 'homs', type: 'other' },
  ],
};

registerCountry(SY_GEO);

export default SY_GEO;
