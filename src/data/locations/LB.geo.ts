// RULE-14-EXCEPTION: Complete Lebanon location dataset (8 governorates, 26 districts) must stay atomic for market isolation and offline performance.

import { registerCountry } from './registry';
import type { CountryGeo } from './types';

const LB_GEO: CountryGeo = {
  countryCode: 'LB',
  governorates: [
    {
      slug: 'beirut',
      nameAr: 'بيروت',
      nameEn: 'Beirut',
      districts: [
        {
          slug: 'beirut-city',
          nameAr: 'بيروت',
          nameEn: 'Beirut City',
          villages: [
            { slug: 'achrafieh', nameAr: 'الأشرفية', nameEn: 'Achrafieh' },
            { slug: 'hamra', nameAr: 'الحمرا', nameEn: 'Hamra' },
            { slug: 'ras-beirut', nameAr: 'رأس بيروت', nameEn: 'Ras Beirut' },
            { slug: 'mazraa', nameAr: 'المزرعة', nameEn: 'Mazraa' },
            { slug: 'bachoura', nameAr: 'الباشورة', nameEn: 'Bachoura' },
            { slug: 'medawar', nameAr: 'المدور', nameEn: 'Medawar' },
            { slug: 'saifi', nameAr: 'الصيفي', nameEn: 'Saifi' },
            { slug: 'zokak-el-blat', nameAr: 'زقاق البلاط', nameEn: 'Zokak El-Blat' },
            { slug: 'msaytbeh', nameAr: 'المصيطبة', nameEn: 'Msaytbeh' },
            { slug: 'marfa', nameAr: 'المرفأ', nameEn: 'Marfa' },
            { slug: 'minet-el-hosn', nameAr: 'ميناء الحصن', nameEn: 'Minet El-Hosn' },
            { slug: 'clemenceau', nameAr: 'كليمنصو', nameEn: 'Clemenceau' },
          ],
        },
      ],
    },
    {
      slug: 'mount-lebanon',
      nameAr: 'جبل لبنان',
      nameEn: 'Mount Lebanon',
      districts: [
        {
          slug: 'baabda',
          nameAr: 'بعبدا',
          nameEn: 'Baabda',
          villages: [
            { slug: 'baabda', nameAr: 'بعبدا', nameEn: 'Baabda' },
            { slug: 'hazmieh', nameAr: 'الحازمية', nameEn: 'Hazmieh' },
            { slug: 'hadath', nameAr: 'الحدث', nameEn: 'Hadath' },
            { slug: 'chiyah', nameAr: 'الشياح', nameEn: 'Chiyah' },
            { slug: 'bourj-el-barajneh', nameAr: 'برج البراجنة', nameEn: 'Bourj El-Barajneh' },
            { slug: 'haret-hreik', nameAr: 'حارة حريك', nameEn: 'Haret Hreik' },
            { slug: 'ghobeiry', nameAr: 'الغبيري', nameEn: 'Ghobeiry' },
            { slug: 'ain-aar', nameAr: 'عين عار', nameEn: 'Ain Aar' },
          ],
        },
        {
          slug: 'metn',
          nameAr: 'المتن',
          nameEn: 'Metn',
          villages: [
            { slug: 'jdeideh', nameAr: 'الجديدة', nameEn: 'Jdeideh' },
            { slug: 'antelias', nameAr: 'أنطلياس', nameEn: 'Antelias' },
            { slug: 'jal-el-dib', nameAr: 'جل الديب', nameEn: 'Jal El Dib' },
            { slug: 'zalka', nameAr: 'الزلقا', nameEn: 'Zalka' },
            { slug: 'dbayeh', nameAr: 'الضعية', nameEn: 'Dbayeh' },
            { slug: 'broummana', nameAr: 'برمانا', nameEn: 'Broummana' },
            { slug: 'beit-mery', nameAr: 'بيت مري', nameEn: 'Beit Mery' },
            { slug: 'bikfaya', nameAr: 'بكفيا', nameEn: 'Bikfaya' },
            { slug: 'sin-el-fil', nameAr: 'سن الفيل', nameEn: 'Sin El Fil' },
            { slug: 'dekwaneh', nameAr: 'الدكوانة', nameEn: 'Dekwaneh' },
          ],
        },
        {
          slug: 'keserwan',
          nameAr: 'كسروان',
          nameEn: 'Keserwan',
          villages: [
            { slug: 'jounieh', nameAr: 'جونية', nameEn: 'Jounieh' },
            { slug: 'ghazir', nameAr: 'غزير', nameEn: 'Ghazir' },
            { slug: 'zouk-mikael', nameAr: 'زوق مكايل', nameEn: 'Zouk Mikael' },
            { slug: 'zouk-mosbeh', nameAr: 'زوق مصبح', nameEn: 'Zouk Mosbeh' },
            { slug: 'kaslik', nameAr: 'كسليك', nameEn: 'Kaslik' },
            { slug: 'haret-sakhr', nameAr: 'حارة صخر', nameEn: 'Haret Sakhr' },
            { slug: 'safra', nameAr: 'صفرة', nameEn: 'Safra' },
            { slug: 'faraya', nameAr: 'فاريا', nameEn: 'Faraya' },
          ],
        },
        {
          slug: 'aley',
          nameAr: 'عاليه',
          nameEn: 'Aley',
          villages: [
            { slug: 'aley', nameAr: 'عاليه', nameEn: 'Aley' },
            { slug: 'bhamdoun', nameAr: 'بحمدون', nameEn: 'Bhamdoun' },
            { slug: 'souk-el-gharb', nameAr: 'سوق الغرب', nameEn: 'Souk El Gharb' },
            { slug: 'khalde', nameAr: 'خلدة', nameEn: 'Khalde' },
            { slug: 'choueifat', nameAr: 'الشويفات', nameEn: 'Choueifat' },
            { slug: 'aaray', nameAr: 'عارة', nameEn: 'Aaray' },
          ],
        },
        {
          slug: 'chouf',
          nameAr: 'الشوف',
          nameEn: 'Chouf',
          villages: [
            { slug: 'beiteddine', nameAr: 'بيت الدين', nameEn: 'Beiteddine' },
            { slug: 'deir-el-qamar', nameAr: 'دير القمر', nameEn: 'Deir El-Qamar' },
            { slug: 'barja', nameAr: 'برجا', nameEn: 'Barja' },
            { slug: 'damour', nameAr: 'الدامور', nameEn: 'Damour' },
            { slug: 'baakline', nameAr: 'بعقلين', nameEn: 'Baakline' },
            { slug: 'moukhtara', nameAr: 'مختارة', nameEn: 'Moukhtara' },
          ],
        },
        {
          slug: 'jbeil',
          nameAr: 'جبيل',
          nameEn: 'Jbeil',
          villages: [
            { slug: 'jbeil', nameAr: 'جبيل', nameEn: 'Jbeil' },
            { slug: 'amchit', nameAr: 'عمشيت', nameEn: 'Amchit' },
            { slug: 'halat', nameAr: 'حالات', nameEn: 'Halat' },
            { slug: 'blat', nameAr: 'بلاط', nameEn: 'Blat' },
            { slug: 'annaya', nameAr: 'عنيا', nameEn: 'Annaya' },
          ],
        },
      ],
    },
    {
      slug: 'north-lebanon',
      nameAr: 'الشمال',
      nameEn: 'North Lebanon',
      districts: [
        {
          slug: 'tripoli',
          nameAr: 'طرابلس',
          nameEn: 'Tripoli',
          villages: [
            { slug: 'tripoli', nameAr: 'طرابلس', nameEn: 'Tripoli' },
            { slug: 'mina', nameAr: 'الميناء', nameEn: 'Mina' },
            { slug: 'qobbe', nameAr: 'القبة', nameEn: 'Qobbe' },
            { slug: 'abu-samra', nameAr: 'أبو سمراء', nameEn: 'Abu Samra' },
            { slug: 'bab-al-tebbaneh', nameAr: 'باب التبانة', nameEn: 'Bab Al-Tebbaneh' },
            { slug: 'jabal-mohsen', nameAr: 'جبل محسن', nameEn: 'Jabal Mohsen' },
          ],
        },
        {
          slug: 'zgharta',
          nameAr: 'زغرتا',
          nameEn: 'Zgharta',
          villages: [
            { slug: 'zgharta', nameAr: 'زغرتا', nameEn: 'Zgharta' },
            { slug: 'ehden', nameAr: 'إهدن', nameEn: 'Ehden' },
            { slug: 'arida', nameAr: 'أرضة', nameEn: 'Arida' },
          ],
        },
        {
          slug: 'koura',
          nameAr: 'الكورة',
          nameEn: 'Koura',
          villages: [
            { slug: 'amioun', nameAr: 'أميون', nameEn: 'Amioun' },
            { slug: 'kousba', nameAr: 'كوسبا', nameEn: 'Kousba' },
            { slug: 'batroumine', nameAr: 'بترومين', nameEn: 'Batroumine' },
          ],
        },
        {
          slug: 'batroun',
          nameAr: 'البترون',
          nameEn: 'Batroun',
          villages: [
            { slug: 'batroun', nameAr: 'البترون', nameEn: 'Batroun' },
            { slug: 'chekka', nameAr: 'شكا', nameEn: 'Chekka' },
            { slug: 'thoum', nameAr: 'توم', nameEn: 'Thoum' },
          ],
        },
        {
          slug: 'bcharre',
          nameAr: 'بشرّي',
          nameEn: 'Bcharre',
          villages: [
            { slug: 'bcharre', nameAr: 'بشرّي', nameEn: 'Bcharre' },
            { slug: 'hadchit', nameAr: 'حدشيت', nameEn: 'Hadchit' },
            { slug: 'blouza', nameAr: 'بلوزا', nameEn: 'Blouza' },
          ],
        },
        {
          slug: 'minieh-danniyeh',
          nameAr: 'المنية الضنية',
          nameEn: 'Minieh-Danniyeh',
          villages: [
            { slug: 'minieh', nameAr: 'المنية', nameEn: 'Minieh' },
            { slug: 'sir-el-danniyeh', nameAr: 'سير الضنية', nameEn: 'Sir El-Danniyeh' },
            { slug: 'bakhoun', nameAr: 'بخعون', nameEn: 'Bakhoun' },
          ],
        },
      ],
    },
    {
      slug: 'akkar',
      nameAr: 'عكار',
      nameEn: 'Akkar',
      districts: [
        {
          slug: 'halba',
          nameAr: 'حلبا',
          nameEn: 'Halba',
          villages: [
            { slug: 'halba', nameAr: 'حلبا', nameEn: 'Halba' },
            { slug: 'qoubaiyat', nameAr: 'القبيات', nameEn: 'Qoubaiyat' },
            { slug: 'cheikh-taba', nameAr: 'الشيخ طابا', nameEn: 'Cheikh Taba' },
          ],
        },
      ],
    },
    {
      slug: 'beqaa',
      nameAr: 'البقاع',
      nameEn: 'Beqaa',
      districts: [
        {
          slug: 'zahle',
          nameAr: 'زحلة',
          nameEn: 'Zahle',
          villages: [
            { slug: 'zahle', nameAr: 'زحلة', nameEn: 'Zahle' },
            { slug: 'chtaura', nameAr: 'شتورا', nameEn: 'Chtaura' },
            { slug: 'anjar', nameAr: 'عنجر', nameEn: 'Anjar' },
            { slug: 'taalabaya', nameAr: 'تعلبايا', nameEn: 'Taalabaya' },
            { slug: 'ali-nahri', nameAr: 'علي النهري', nameEn: 'Ali Nahri' },
          ],
        },
        {
          slug: 'west-beqaa',
          nameAr: 'البقاع الغربي',
          nameEn: 'West Beqaa',
          villages: [
            { slug: 'joub-jannine', nameAr: 'جب جنين', nameEn: 'Joub Jannine' },
            { slug: 'saghbine', nameAr: 'سغبين', nameEn: 'Saghbine' },
            { slug: 'mashghara', nameAr: 'مشغرة', nameEn: 'Mashghara' },
          ],
        },
        {
          slug: 'rashaya',
          nameAr: 'راشيا',
          nameEn: 'Rashaya',
          villages: [
            { slug: 'rashaya', nameAr: 'راشيا', nameEn: 'Rashaya' },
            { slug: 'kfar-mashki', nameAr: 'كفرمشكي', nameEn: 'Kfar Mashki' },
            { slug: 'mdoukha', nameAr: 'مدوخا', nameEn: 'Mdoukha' },
          ],
        },
      ],
    },
    {
      slug: 'baalbek-hermel',
      nameAr: 'بعلبك الهرمل',
      nameEn: 'Baalbek-Hermel',
      districts: [
        {
          slug: 'baalbek',
          nameAr: 'بعلبك',
          nameEn: 'Baalbek',
          villages: [
            { slug: 'baalbek', nameAr: 'بعلبك', nameEn: 'Baalbek' },
            { slug: 'duris', nameAr: 'دورس', nameEn: 'Duris' },
            { slug: 'temnin-el-tahta', nameAr: 'تمنين التحتا', nameEn: 'Temnin El-Tahta' },
          ],
        },
        {
          slug: 'hermel',
          nameAr: 'الهرمل',
          nameEn: 'Hermel',
          villages: [
            { slug: 'hermel', nameAr: 'الهرمل', nameEn: 'Hermel' },
            { slug: 'chawaghir', nameAr: 'الشواغير', nameEn: 'Chawaghir' },
          ],
        },
      ],
    },
    {
      slug: 'south-lebanon',
      nameAr: 'الجنوب',
      nameEn: 'South Lebanon',
      districts: [
        {
          slug: 'sidon',
          nameAr: 'صيدا',
          nameEn: 'Sidon',
          villages: [
            { slug: 'sidon', nameAr: 'صيدا', nameEn: 'Sidon' },
            { slug: 'ghaziyeh', nameAr: 'الغازية', nameEn: 'Ghaziyeh' },
            { slug: 'abras', nameAr: 'العدوسية', nameEn: 'Abras' },
          ],
        },
        {
          slug: 'tyre',
          nameAr: 'صور',
          nameEn: 'Tyre',
          villages: [
            { slug: 'tyre', nameAr: 'صور', nameEn: 'Tyre' },
            { slug: 'burj-al-shemali', nameAr: 'برج الشمالي', nameEn: 'Burj Al-Shemali' },
            { slug: 'maarake', nameAr: 'معركة', nameEn: 'Maarake' },
          ],
        },
        {
          slug: 'jezzine',
          nameAr: 'جزين',
          nameEn: 'Jezzine',
          villages: [
            { slug: 'jezzine', nameAr: 'جزين', nameEn: 'Jezzine' },
            { slug: 'roum', nameAr: 'روم', nameEn: 'Roum' },
            { slug: 'ain-el-mir', nameAr: 'عين المير', nameEn: 'Ain El-Mir' },
          ],
        },
      ],
    },
    {
      slug: 'nabatieh',
      nameAr: 'النبطية',
      nameEn: 'Nabatieh',
      districts: [
        {
          slug: 'nabatieh-city',
          nameAr: 'النبطية',
          nameEn: 'Nabatieh City',
          villages: [
            { slug: 'nabatieh', nameAr: 'النبطية', nameEn: 'Nabatieh' },
            { slug: 'kfar-remman', nameAr: 'كفر رمان', nameEn: 'Kfar Remman' },
            { slug: 'zebdine', nameAr: 'زبدين', nameEn: 'Zebdine' },
          ],
        },
        {
          slug: 'marjeyoun',
          nameAr: 'مرجعيون',
          nameEn: 'Marjeyoun',
          villages: [
            { slug: 'marjeyoun', nameAr: 'مرجعيون', nameEn: 'Marjeyoun' },
            { slug: 'khiam', nameAr: 'الخيام', nameEn: 'Khiam' },
            { slug: 'blida', nameAr: 'بليدا', nameEn: 'Blida' },
          ],
        },
        {
          slug: 'hasbaya',
          nameAr: 'حاصبيا',
          nameEn: 'Hasbaya',
          villages: [
            { slug: 'hasbaya', nameAr: 'حاصبيا', nameEn: 'Hasbaya' },
            { slug: 'kfarchouba', nameAr: 'كفرشوبا', nameEn: 'Kfarchouba' },
          ],
        },
        {
          slug: 'bint-jbeil',
          nameAr: 'بنت جبيل',
          nameEn: 'Bint Jbeil',
          villages: [
            { slug: 'bint-jbeil', nameAr: 'بنت جبيل', nameEn: 'Bint Jbeil' },
            { slug: 'ainata', nameAr: 'عيناتا', nameEn: 'Ainata' },
          ],
        },
      ],
    },
  ],
  refugeeCamps: [
    { slug: 'ain-el-hilweh-camp', nameAr: 'مخيم عين الحلوة', nameEn: 'Ain El-Hilweh Camp', governorateSlug: 'south-lebanon' },
    { slug: 'shatila-camp', nameAr: 'مخيم شاتيلا', nameEn: 'Shatila Camp', governorateSlug: 'beirut' },
    { slug: 'burj-el-barajneh-camp', nameAr: 'مخيم برج البراجنة', nameEn: 'Burj El-Barajneh Camp', governorateSlug: 'mount-lebanon' },
    { slug: 'beddawi-camp', nameAr: 'مخيم البداوي', nameEn: 'Beddawi Camp', governorateSlug: 'north-lebanon' },
    { slug: 'nabatieh-camp', nameAr: 'مخيم النبطية', nameEn: 'Nabatieh Camp', governorateSlug: 'nabatieh' },
  ],
  landmarks: [
    { slug: 'raouche', nameAr: 'صخرة الروشة', nameEn: 'Raouche Rocks', citySlug: 'beirut', type: 'other' },
    { slug: 'jeita-grotto', nameAr: 'مغارة جعيتا', nameEn: 'Jeita Grotto', citySlug: 'keserwan', type: 'other' },
    { slug: 'baalbek-temples', nameAr: 'معابد بعلبك', nameEn: 'Baalbek Temples', citySlug: 'baalbek', type: 'other' },
    { slug: 'cedars-of-god', nameAr: 'أرز الرب', nameEn: 'Cedars of God', citySlug: 'bcharre', type: 'other' },
    { slug: 'rafic-hariri-airport', nameAr: 'مطار رفيق الحريري الدولي', nameEn: 'Rafic Hariri International Airport', citySlug: 'beirut', type: 'airport' },
  ],
};

registerCountry(LB_GEO);

export default LB_GEO;
