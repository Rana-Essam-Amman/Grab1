import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const PS_GEO: CountryGeo = {
  countryCode: 'PS',
  governorates: [
    { slug: 'jenin', nameAr: 'جنين', nameEn: 'Jenin', districts: [
      { slug: 'jenin-city', nameAr: 'جنين', nameEn: 'Jenin City', villages: [] },
      { slug: 'qabatiya', nameAr: 'قباطية', nameEn: 'Qabatiya', villages: [] },
      { slug: 'arrabah', nameAr: 'عرابة', nameEn: 'Arrabah', villages: [] },
    ]},
    { slug: 'tubas', nameAr: 'طوباس', nameEn: 'Tubas', districts: [
      { slug: 'tubas-city', nameAr: 'طوباس', nameEn: 'Tubas City', villages: [] },
      { slug: 'tammun', nameAr: 'طمون', nameEn: 'Tammun', villages: [] },
    ]},
    { slug: 'tulkarm', nameAr: 'طولكرم', nameEn: 'Tulkarm', districts: [
      { slug: 'tulkarm-city', nameAr: 'طولكرم', nameEn: 'Tulkarm City', villages: [] },
      { slug: 'anabta', nameAr: 'عنبتا', nameEn: 'Anabta', villages: [] },
    ]},
    { slug: 'nablus', nameAr: 'نابلس', nameEn: 'Nablus', districts: [
      { slug: 'nablus-city', nameAr: 'نابلس', nameEn: 'Nablus City', villages: [] },
      { slug: 'huwara', nameAr: 'حوارة', nameEn: 'Huwara', villages: [] },
    ]},
    { slug: 'qalqilya', nameAr: 'قلقيلية', nameEn: 'Qalqilya', districts: [
      { slug: 'qalqilya-city', nameAr: 'قلقيلية', nameEn: 'Qalqilya City', villages: [] },
    ]},
    { slug: 'salfit', nameAr: 'سلفيت', nameEn: 'Salfit', districts: [
      { slug: 'salfit-city', nameAr: 'سلفيت', nameEn: 'Salfit City', villages: [] },
    ]},
    { slug: 'ramallah-and-al-bireh', nameAr: 'رام الله والبيرة', nameEn: 'Ramallah and Al-Bireh', districts: [
      { slug: 'ramallah-city', nameAr: 'رام الله', nameEn: 'Ramallah', villages: [] },
      { slug: 'al-bireh-city', nameAr: 'البيرة', nameEn: 'Al-Bireh', villages: [] },
      { slug: 'beitunia', nameAr: 'بيتونيا', nameEn: 'Beitunia', villages: [] },
    ]},
    { slug: 'jericho', nameAr: 'أريحا والأغوار', nameEn: 'Jericho', districts: [
      { slug: 'jericho-city', nameAr: 'أريحا', nameEn: 'Jericho City', villages: [] },
    ]},
    { slug: 'jerusalem', nameAr: 'القدس', nameEn: 'Jerusalem', districts: [
      { slug: 'jerusalem-city', nameAr: 'القدس', nameEn: 'Jerusalem City', villages: [] },
    ]},
    { slug: 'bethlehem', nameAr: 'بيت لحم', nameEn: 'Bethlehem', districts: [
      { slug: 'bethlehem-city', nameAr: 'بيت لحم', nameEn: 'Bethlehem City', villages: [] },
      { slug: 'beit-jala', nameAr: 'بيت جالا', nameEn: 'Beit Jala', villages: [] },
      { slug: 'beit-sahour', nameAr: 'بيت ساحور', nameEn: 'Beit Sahour', villages: [] },
    ]},
    { slug: 'hebron', nameAr: 'الخليل', nameEn: 'Hebron', districts: [
      { slug: 'hebron-city', nameAr: 'الخليل', nameEn: 'Hebron City', villages: [] },
      { slug: 'yatta', nameAr: 'يطا', nameEn: 'Yatta', villages: [] },
      { slug: 'dura', nameAr: 'دورا', nameEn: 'Dura', villages: [] },
    ]},
    { slug: 'north-gaza', nameAr: 'شمال غزة', nameEn: 'North Gaza', districts: [
      { slug: 'jabalia-city', nameAr: 'جباليا', nameEn: 'Jabalia', villages: [] },
      { slug: 'beit-lahia-city', nameAr: 'بيت لاهيا', nameEn: 'Beit Lahia', villages: [] },
      { slug: 'beit-hanoun-city', nameAr: 'بيت حانون', nameEn: 'Beit Hanoun', villages: [] },
    ]},
    { slug: 'gaza', nameAr: 'غزة', nameEn: 'Gaza', districts: [
      { slug: 'gaza-city', nameAr: 'مدينة غزة', nameEn: 'Gaza City', villages: [] },
      { slug: 'al-zahra', nameAr: 'الزهراء', nameEn: 'Al-Zahra', villages: [] },
      { slug: 'al-mughraqa', nameAr: 'المغراقة', nameEn: 'Al-Mughraqa', villages: [] },
    ]},
    { slug: 'deir-al-balah', nameAr: 'دير البلح', nameEn: 'Deir al-Balah', districts: [
      { slug: 'deir-al-balah-city', nameAr: 'دير البلح', nameEn: 'Deir al-Balah City', villages: [] },
      { slug: 'al-zawayda', nameAr: 'الزوايدة', nameEn: 'Al-Zawayda', villages: [] },
    ]},
    { slug: 'khan-younis', nameAr: 'خان يونس', nameEn: 'Khan Younis', districts: [
      { slug: 'khan-younis-city', nameAr: 'خان يونس', nameEn: 'Khan Younis City', villages: [] },
      { slug: 'abasan-al-kabira', nameAr: 'عبسان الكبيرة', nameEn: 'Abasan al-Kabira', villages: [] },
      { slug: 'bani-suheila', nameAr: 'بني سهيلا', nameEn: 'Bani Suheila', villages: [] },
      { slug: 'khuzaa', nameAr: 'خزاعة', nameEn: 'Khuzaa', villages: [] },
    ]},
    { slug: 'rafah', nameAr: 'رفح', nameEn: 'Rafah', districts: [
      { slug: 'rafah-city', nameAr: 'رفح', nameEn: 'Rafah City', villages: [] },
      { slug: 'tel-al-sultan', nameAr: 'تل السلطان', nameEn: 'Tel al-Sultan', villages: [] },
      { slug: 'al-shuka', nameAr: 'الشوكة', nameEn: 'Al-Shuka', villages: [] },
    ]},
  ],

  refugeeCamps: [
    { slug: 'jenin-camp', nameAr: 'مخيم جنين', nameEn: 'Jenin Camp', governorateSlug: 'jenin' },
    { slug: 'balata-camp', nameAr: 'مخيم بلاطة', nameEn: 'Balata Camp', governorateSlug: 'nablus' },
    { slug: 'askar-camp', nameAr: 'مخيم عسكر', nameEn: 'Askar Camp', governorateSlug: 'nablus' },
    { slug: 'nur-shams-camp', nameAr: 'مخيم نور شمس', nameEn: 'Nur Shams Camp', governorateSlug: 'tulkarm' },
    { slug: 'tulkarm-camp', nameAr: 'مخيم طولكرم', nameEn: 'Tulkarm Camp', governorateSlug: 'tulkarm' },
    { slug: 'far-a-camp', nameAr: 'مخيم الفارعة', nameEn: "Far'a Camp", governorateSlug: 'tubas' },
    { slug: 'amari-camp', nameAr: 'مخيم الأمعري', nameEn: 'Amari Camp', governorateSlug: 'ramallah-and-al-bireh' },
    { slug: 'jalazone-camp', nameAr: 'مخيم الجلزون', nameEn: 'Jalazone Camp', governorateSlug: 'ramallah-and-al-bireh' },
    { slug: 'deir-ammar-camp', nameAr: 'مخيم دير عمار', nameEn: 'Deir Ammar Camp', governorateSlug: 'ramallah-and-al-bireh' },
    { slug: 'shufat-camp', nameAr: 'مخيم شعفاط', nameEn: "Shu'fat Camp", governorateSlug: 'jerusalem' },
    { slug: 'kalandia-camp', nameAr: 'مخيم قلنديا', nameEn: 'Kalandia Camp', governorateSlug: 'jerusalem' },
    { slug: 'aqbat-jaber-camp', nameAr: 'مخيم عقبة جبر', nameEn: 'Aqbat Jaber Camp', governorateSlug: 'jericho' },
    { slug: 'ein-as-sultan-camp', nameAr: 'مخيم عين السلطان', nameEn: 'Ein as-Sultan Camp', governorateSlug: 'jericho' },
    { slug: 'camp-1-jericho', nameAr: 'مخيم رقم 1 (أريحا)', nameEn: 'Camp #1 (Jericho)', governorateSlug: 'jericho' },
    { slug: 'dheisheh-camp', nameAr: 'مخيم الدهيشة', nameEn: 'Dheisheh Camp', governorateSlug: 'bethlehem' },
    { slug: 'aida-camp', nameAr: 'مخيم عايدة', nameEn: 'Aida Camp', governorateSlug: 'bethlehem' },
    { slug: 'beit-jibrin-camp', nameAr: 'مخيم بيت جبرين', nameEn: 'Beit Jibrin Camp', governorateSlug: 'bethlehem' },
    { slug: 'al-arroub-camp', nameAr: 'مخيم العروب', nameEn: 'Al-Arroub Camp', governorateSlug: 'hebron' },
    { slug: 'fawwar-camp', nameAr: 'مخيم الفوار', nameEn: 'Fawwar Camp', governorateSlug: 'hebron' },
    { slug: 'jabalia-camp', nameAr: 'مخيم جباليا', nameEn: 'Jabalia Camp', governorateSlug: 'north-gaza' },
    { slug: 'shati-camp', nameAr: 'مخيم الشاطئ', nameEn: 'Beach (Shati) Camp', governorateSlug: 'gaza' },
    { slug: 'nuseirat-camp', nameAr: 'مخيم النصيرات', nameEn: 'Nuseirat Camp', governorateSlug: 'deir-al-balah' },
    { slug: 'bureij-camp', nameAr: 'مخيم البريج', nameEn: 'Bureij Camp', governorateSlug: 'deir-al-balah' },
    { slug: 'maghazi-camp', nameAr: 'مخيم المغازي', nameEn: 'Maghazi Camp', governorateSlug: 'deir-al-balah' },
    { slug: 'deir-al-balah-camp', nameAr: 'مخيم دير البلح', nameEn: 'Deir al-Balah Camp', governorateSlug: 'deir-al-balah' },
    { slug: 'khan-younis-camp', nameAr: 'مخيم خان يونس', nameEn: 'Khan Younis Camp', governorateSlug: 'khan-younis' },
    { slug: 'rafah-camp', nameAr: 'مخيم رفح', nameEn: 'Rafah Camp', governorateSlug: 'rafah' },
  ],
  landmarks: [
    { slug: 'birzeit-university', nameAr: 'جامعة بيرزيت', nameEn: 'Birzeit University', citySlug: 'Ramallah', type: 'university' },
    { slug: 'an-najah-university', nameAr: 'جامعة النجاح الوطنية', nameEn: 'An-Najah National University', citySlug: 'Nablus', type: 'university' },
    { slug: 'al-quds-university', nameAr: 'جامعة القدس', nameEn: 'Al-Quds University', citySlug: 'Jerusalem', type: 'university' },
    { slug: 'islamic-university-gaza', nameAr: 'الجامعة الإسلامية بغزة', nameEn: 'Islamic University of Gaza', citySlug: 'Gaza', type: 'university' },
    { slug: 'hebron-university', nameAr: 'جامعة الخليل', nameEn: 'Hebron University', citySlug: 'Hebron', type: 'university' },
    { slug: 'al-aqsa-mosque', nameAr: 'المسجد الأقصى', nameEn: 'Al-Aqsa Mosque', citySlug: 'Jerusalem', type: 'other' },
    { slug: 'church-of-nativity', nameAr: 'كنيسة المهد', nameEn: 'Church of the Nativity', citySlug: 'Bethlehem', type: 'other' },
    { slug: 'ibrahimi-mosque', nameAr: 'المسجد الإبراهيمي', nameEn: 'Ibrahimi Mosque', citySlug: 'Hebron', type: 'other' },
    { slug: 'al-makassed-hospital', nameAr: 'مستشفى المطلع', nameEn: 'Al-Makassed Hospital', citySlug: 'Jerusalem', type: 'hospital' },
    { slug: 'ramallah-gov-hospital', nameAr: 'مستشفى رام الله الحكومي', nameEn: 'Ramallah Governmental Hospital', citySlug: 'Ramallah', type: 'hospital' },
  ],
};

registerCountry(PS_GEO);

export default PS_GEO;
