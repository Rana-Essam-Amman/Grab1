// RULE-14-EXCEPTION: Complete Syria location dataset (14 governorates, 60+ districts) must stay atomic for market isolation and offline performance.

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
            { slug: 'rكن-al-din', nameAr: 'ركن الدين', nameEn: 'Rukn Al-Din' },
            { slug: 'al-muhajireen', nameAr: 'المهاجرين', nameEn: 'Al-Muhajireen' },
            { slug: 'bab-touma', nameAr: 'باب توما', nameEn: 'Bab Touma' },
            { slug: 'al-shaghour', nameAr: 'الشاغور', nameEn: 'Al-Shaghour' },
            { slug: 'qaboun', nameAr: 'القابون', nameEn: 'Qaboun' },
            { slug: 'barzeh', nameAr: 'برزة', nameEn: 'Barzeh' },
            { slug: 'dummar', nameAr: 'دمر', nameEn: 'Dummar' },
            { slug: 'al-tadamon', nameAr: 'التضامن', nameEn: 'Al-Tadamon' },
            { slug: 'yarmouk', nameAr: 'اليرموك', nameEn: 'Yarmouk' },
            { slug: 'al-qadam', nameAr: 'القدم', nameEn: 'Al-Qadam' },
            { slug: 'al-hajar-al-aswad', nameAr: 'الحجر الأسود', nameEn: 'Al-Hajar Al-Aswad' },
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
            { slug: 'sabe-bour', nameAr: 'سبع بور', nameEn: 'Sabe Bour' },
            { slug: 'adra', nameAr: 'عدرا', nameEn: 'Adra' },
            { slug: 'al-dumayr', nameAr: 'الضمير', nameEn: 'Al-Dumayr' },
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
            { slug: 'ashrafiyat-sahnaya', nameAr: 'أشرفية صحنايا', nameEn: 'Ashrafiyat Sahnaya' },
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
            { slug: 'beit-sahm', nameAr: 'بيت سحم', nameEn: 'Beit Sahm' },
          ],
        },
        {
          slug: 'qatana',
          nameAr: 'قطنا',
          nameEn: 'Qatana',
          villages: [
            { slug: 'qatana', nameAr: 'قطنا', nameEn: 'Qatana' },
            { slug: 'beqaasem', nameAr: 'بيقعسم', nameEn: 'Beqaasem' },
            { slug: 'artouz', nameAr: 'أرطوز', nameEn: 'Artouz' },
            { slug: 'kanaker', nameAr: 'كنانكر', nameEn: 'Kanaker' },
          ],
        },
        {
          slug: 'al-tall',
          nameAr: 'التل',
          nameEn: 'Al-Tall',
          villages: [
            { slug: 'al-tall', nameAr: 'التل', nameEn: 'Al-Tall' },
            { slug: 'maaret-saydnaya', nameAr: 'معرة صيدنايا', nameEn: 'Maaret Saydnaya' },
            { slug: 'manin', nameAr: 'منين', nameEn: 'Manin' },
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
            { slug: 'ain-al-fijeh', nameAr: 'عين الفيجة', nameEn: 'Ain Al-Fijeh' },
          ],
        },
        {
          slug: 'al-nabk',
          nameAr: 'النبك',
          nameEn: 'Al-Nabk',
          villages: [
            { slug: 'al-nabk', nameAr: 'النبك', nameEn: 'Al-Nabk' },
            { slug: 'yabroud', nameAr: 'يبرود', nameEn: 'Yabroud' },
            { slug: 'qara', nameAr: 'قارة', nameEn: 'Qara' },
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
            { slug: 'al-sukkari', nameAr: 'السكري', nameEn: 'Al-Sukkari' },
            { slug: 'al-furqan', nameAr: 'الفرقان', nameEn: 'Al-Furqan' },
            { slug: 'al-hamdaniyah', nameAr: 'الحمدانية', nameEn: 'Al-Hamdaniyah' },
          ],
        },
        {
          slug: 'manbij',
          nameAr: 'منبج',
          nameEn: 'Manbij',
          villages: [
            { slug: 'manbij', nameAr: 'منبج', nameEn: 'Manbij' },
            { slug: 'abu-qalqal', nameAr: 'أبو قلقل', nameEn: 'Abu Qalqal' },
            { slug: 'al-khafsah', nameAr: 'الخفسة', nameEn: 'Al-Khafsah' },
          ],
        },
        {
          slug: 'azaz',
          nameAr: 'أعزاز',
          nameEn: 'Azaz',
          villages: [
            { slug: 'azaz', nameAr: 'أعزاز', nameEn: 'Azaz' },
            { slug: 'mare', nameAr: 'مارع', nameEn: 'Mare' },
            { slug: 'tall-rifat', nameAr: 'تل رفعت', nameEn: 'Tall Rifat' },
          ],
        },
        {
          slug: 'al-bab',
          nameAr: 'الباب',
          nameEn: 'Al-Bab',
          villages: [
            { slug: 'al-bab', nameAr: 'الباب', nameEn: 'Al-Bab' },
            { slug: 'bzaa', nameAr: 'بزاعة', nameEn: 'Bzaa' },
            { slug: 'tadef', nameAr: 'تادف', nameEn: 'Tadef' },
          ],
        },
        {
          slug: 'afrin',
          nameAr: 'عفرين',
          nameEn: 'Afrin',
          villages: [
            { slug: 'afrin', nameAr: 'عفرين', nameEn: 'Afrin' },
            { slug: 'jindires', nameAr: 'جنديرس', nameEn: 'Jindires' },
            { slug: 'sharran', nameAr: 'شران', nameEn: 'Sharran' },
            { slug: 'rajo', nameAr: 'راجو', nameEn: 'Rajo' },
          ],
        },
        {
          slug: 'ain-al-arab',
          nameAr: 'عين العرب (كوباني)',
          nameEn: 'Ain al-Arab (Kobani)',
          villages: [
            { slug: 'kobani', nameAr: 'كوباني', nameEn: 'Kobani' },
            { slug: 'sarrin', nameAr: 'صرين', nameEn: 'Sarrin' },
          ],
        },
        {
          slug: 'jarabulus',
          nameAr: 'جرابلس',
          nameEn: 'Jarabulus',
          villages: [
            { slug: 'jarabulus', nameAr: 'جرابلس', nameEn: 'Jarabulus' },
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
            { slug: 'al-khalediyah', nameAr: 'الخالدية', nameEn: 'Al-Khalediyah' },
            { slug: 'al-waer', nameAr: 'الوعر', nameEn: 'Al-Waer' },
            { slug: 'al-insha'at', nameAr: 'الإنشاءات', nameEn: '
