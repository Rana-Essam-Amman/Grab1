import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const LB_GEO: CountryGeo = {
  countryCode: 'LB',
  governorates: [
    { slug: 'beirut', nameAr: 'بيروت', nameEn: 'Beirut', districts: [] },
    { slug: 'mount-lebanon', nameAr: 'جبل لبنان', nameEn: 'Mount Lebanon', districts: [] },
    { slug: 'north-lebanon', nameAr: 'الشمال', nameEn: 'North Lebanon', districts: [] },
    { slug: 'akkar', nameAr: 'عكار', nameEn: 'Akkar', districts: [] },
    { slug: 'baalbek-hermel', nameAr: 'بعلبك الهرمل', nameEn: 'Baalbek-Hermel', districts: [] },
    { slug: 'bekaa', nameAr: 'البقاع', nameEn: 'Bekaa', districts: [] },
    { slug: 'nabatieh', nameAr: 'النبطية', nameEn: 'Nabatieh', districts: [] },
    { slug: 'south-lebanon', nameAr: 'الجنوب', nameEn: 'South Lebanon', districts: [] },
  ],
  refugeeCamps: [
    { slug: 'ain-al-hilweh-camp', nameAr: 'مخيم عين الحلوة', nameEn: 'Ain al-Hilweh Camp', governorateSlug: 'south-lebanon' },
    { slug: 'rashidieh-camp', nameAr: 'مخيم الرشيدية', nameEn: 'Rashidieh Camp', governorateSlug: 'south-lebanon' },
    { slug: 'burj-al-barajneh-camp', nameAr: 'مخيم برج البراجنة', nameEn: 'Burj al-Barajneh Camp', governorateSlug: 'mount-lebanon' },
    { slug: 'bourj-el-shemali-camp', nameAr: 'مخيم برج الشمالي', nameEn: 'Bourj el-Shemali Camp', governorateSlug: 'south-lebanon' },
    { slug: 'shatila-camp', nameAr: 'مخيم شاتيلا', nameEn: 'Shatila Camp', governorateSlug: 'beirut' },
    { slug: 'beddawi-camp', nameAr: 'مخيم البداوي', nameEn: 'Beddawi Camp', governorateSlug: 'north-lebanon' },
    { slug: 'nahr-al-bared-camp', nameAr: 'مخيم نهر البارد', nameEn: 'Nahr al-Bared Camp', governorateSlug: 'north-lebanon' },
    { slug: 'mieh-mieh-camp', nameAr: 'مخيم المية ومية', nameEn: 'Mieh Mieh Camp', governorateSlug: 'south-lebanon' },
    { slug: 'dbayeh-camp', nameAr: 'مخيم ضبية', nameEn: 'Dbayeh Camp', governorateSlug: 'mount-lebanon' },
    { slug: 'mar-elias-camp', nameAr: 'مخيم مار الياس', nameEn: 'Mar Elias Camp', governorateSlug: 'beirut' },
    { slug: 'wavel-camp', nameAr: 'مخيم وافل', nameEn: 'Wavel Camp', governorateSlug: 'baalbek-hermel' },
    { slug: 'qasmieh-camp', nameAr: 'مخيم القاسمية', nameEn: 'Qasmieh Camp', governorateSlug: 'south-lebanon' },
  ],
  landmarks: [
    { slug: 'aub', nameAr: 'الجامعة الأميركية في بيروت', nameEn: 'American University of Beirut', citySlug: 'Beirut', type: 'university' },
    { slug: 'lau-beirut', nameAr: 'الجامعة اللبنانية الأميركية', nameEn: 'Lebanese American University', citySlug: 'Beirut', type: 'university' },
    { slug: 'rafic-hariri-airport', nameAr: 'مطار رفيق الحريري الدولي', nameEn: 'Rafic Hariri International Airport', citySlug: 'Beirut', type: 'airport' },
    { slug: 'beirut-mall', nameAr: 'بيروت مول', nameEn: 'Beirut Mall', citySlug: 'Beirut', type: 'mall' },
    { slug: 'city-mall-beirut', nameAr: 'سيتي مول بيروت', nameEn: 'City Mall Beirut', citySlug: 'Beirut', type: 'mall' },
    { slug: 'aubmc', nameAr: 'مستشفى الجامعة الأميركية', nameEn: 'AUB Medical Center', citySlug: 'Beirut', type: 'hospital' },
    { slug: 'casino-du-liban', nameAr: 'كازينو لبنان', nameEn: 'Casino du Liban', citySlug: 'Jounieh', type: 'other' },
    { slug: 'jeita-grotto', nameAr: 'مغارة جعيتا', nameEn: 'Jeita Grotto', citySlug: 'Jounieh', type: 'other' },
    { slug: 'raouche', nameAr: 'صخرة الروشة', nameEn: 'Raouche Rocks', citySlug: 'Beirut', type: 'other' },
    { slug: 'downtown-beirut', nameAr: 'وسط بيروت', nameEn: 'Downtown Beirut', citySlug: 'Beirut', type: 'other' },
  ],
};

registerCountry(LB_GEO);

export default LB_GEO;
