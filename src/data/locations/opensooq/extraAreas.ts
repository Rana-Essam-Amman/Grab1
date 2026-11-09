import type { OpensooqArea, OpensooqCity } from "./types";

// EXTRA_CITIES: reserved for future true missing governorates.
// Currently empty (user requested additive-only).
export const EXTRA_CITIES: Record<string, readonly OpensooqCity[]> = {};

// EXTRA_AREAS: villages found in GeoNames but not covered by OpenSooq,
// grouped by market → target OpenSooq city slug.
export const EXTRA_AREAS: Record<string, Record<string, readonly OpensooqArea[]>> = {
  SA: {
    "mkh": [
      { slug: "muzdalifah", nameAr: "مزدلفة" },
    ],
    "alryad": [
      { slug: "alyynh", nameAr: "العيينة" },
      { slug: "alartawyh", nameAr: "الأرطاوية" },
    ],
    "jdh": [
      { slug: "albghdadyh", nameAr: "البغدادية" },
    ],
    "rabgh": [
      { slug: "mstwrh", nameAr: "مستورة" },
    ],
    "ynb": [
      { slug: "ynb-albhr", nameAr: "ينبع البحر" },
      { slug: "ynb-alnkhl", nameAr: "ينبع النخل" },
    ],
    "brydh": [
      { slug: "alqsym", nameAr: "القصيم" },
    ],
    "alrs": [
      { slug: "alfwylq", nameAr: "الفويلق" },
    ],
    "alzhran": [
      { slug: "jamh-almlk-fhd", nameAr: "جامعة الملك فهد" },
    ],
    "aljbyl": [
      { slug: "aljbyl-alsnayh", nameAr: "الجبيل الصناعية" },
    ],
    "rr": [
      { slug: "alwyqylh", nameAr: "العويقيلة" },
    ],
    "skaka": [
      { slug: "alysawyh", nameAr: "العيساوية" },
    ],
    "alqryat": [
      { slug: "alnbk", nameAr: "النبك" },
    ],
  },
  PS: {
    "jnyn": [
      { slug: "alfndqwmyh", nameAr: "الفندقومية" },
      { slug: "alhashmyh", nameAr: "الهاشمية" },
    ],
    "twbas": [
      { slug: "tyasyr", nameAr: "تياسير" },
      { slug: "alfarh", nameAr: "الفارعة" },
      { slug: "khrbh-twf", nameAr: "خربة عطوف" },
      { slug: "alhdydyh", nameAr: "الحديدية" },
      { slug: "ras-alfarh", nameAr: "رأس الفارعة" },
      { slug: "yn-albyda", nameAr: "عين البيضا" },
    ],
    "nabls": [
      { slug: "awdla", nameAr: "أودلا" },
    ],
    "ram-allh-walbyrh": [
      { slug: "ram-allh", nameAr: "رام الله" },
      { slug: "alirsal", nameAr: "الإرسال" },
      { slug: "alamry", nameAr: "الأمعري" },
    ],
    "alqds": [
      { slug: "almsrarh", nameAr: "المصرارة" },
      { slug: "mya-shrym", nameAr: "ميا شعريم" },
      { slug: "rhafya", nameAr: "رحافيا" },
      { slug: "altalbyh", nameAr: "الطالبية" },
      { slug: "almalhh", nameAr: "المالحة" },
      { slug: "ghylw", nameAr: "غيلو" },
    ],
    "byt-lhm": [
      { slug: "aldhyshh", nameAr: "الدهيشة" },
    ],
    "alkhlyl": [
      { slug: "khrbh-almjaz", nameAr: "خربة المجاز" },
      { slug: "alkrml", nameAr: "الكرمل" },
      { slug: "khrsa", nameAr: "خرسا" },
      { slug: "dyr-alsl", nameAr: "دير العسل" },
    ],
    "ghzh": [
      { slug: "al-shawka", nameAr: "الشوكة" },
      { slug: "am-alnasr", nameAr: "أم الناصر" },
      { slug: "alslam", nameAr: "السلام" },
      { slug: "alnasr", nameAr: "الناصر" },
      { slug: "alshati", nameAr: "الشاطئ" },
      { slug: "alnzlh", nameAr: "النزلة" },
      { slug: "alsykh", nameAr: "السيكة" },
      { slug: "almshrw", nameAr: "المشروع" },
      { slug: "alnda", nameAr: "الندا" },
      { slug: "alzhra", nameAr: "الزهراء" },
      { slug: "alrmal", nameAr: "الرمال" },
      { slug: "alshjayh", nameAr: "الشجاعية" },
      { slug: "alzytwn", nameAr: "الزيتون" },
      { slug: "alnsr", nameAr: "النصر" },
      { slug: "alshykh-rdwan", nameAr: "الشيخ رضوان" },
      { slug: "wady-ghzh", nameAr: "وادي غزة" },
      { slug: "jwr-aldyk", nameAr: "جور الديك" },
      { slug: "ntsarym", nameAr: "نتساريم" },
      { slug: "karny", nameAr: "كارني" },
      { slug: "alshhda", nameAr: "الشهداء" },
      { slug: "alzwaydh", nameAr: "الزوايدة" },
      { slug: "albryj", nameAr: "البريج" },
      { slug: "almghazy", nameAr: "المغازي" },
      { slug: "almsdr", nameAr: "المصدر" },
      { slug: "wady-alslqa", nameAr: "وادي السلقا" },
      { slug: "alqrarh", nameAr: "القرارة" },
      { slug: "bsan-aljdydh", nameAr: "عبسان الجديدة" },
      { slug: "bsan-alkbyrh", nameAr: "عبسان الكبيرة" },
      { slug: "khzah", nameAr: "خزاعة" },
      { slug: "bsan-alsghyrh", nameAr: "عبسان الصغيرة" },
      { slug: "alfkhary", nameAr: "الفخاري" },
      { slug: "almwasy", nameAr: "المواسي" },
      { slug: "bsan", nameAr: "عبسان" },
      { slug: "tl-alsltan", nameAr: "تل السلطان" },
      { slug: "alshbwrh", nameAr: "الشبورة" },
      { slug: "alswdy", nameAr: "السعودي" },
      { slug: "albrazyl", nameAr: "البرازيل" },
      { slug: "khrbh-alds", nameAr: "خربة العدس" },
      { slug: "alqryh-albdwyh", nameAr: "القرية البدوية" },
    ],
  },
  LB: {
    "byrwt": [
      { slug: "almzrh", nameAr: "المزرعة" },
      { slug: "almdwr", nameAr: "المدور" },
      { slug: "zqaq-alblat", nameAr: "زقاق البلاط" },
    ],
    "bbda": [
      { slug: "yn-ar", nameAr: "عين عار" },
    ],
    "alyh": [
      { slug: "bhmdwn", nameAr: "بحمدون" },
    ],
    "alshwf": [
      { slug: "aldamwr", nameAr: "الدامور" },
      { slug: "mkhtarh", nameAr: "مختارة" },
    ],
    "trabls": [
      { slug: "bab-altbanh", nameAr: "باب التبانة" },
      { slug: "jbl-mhsn", nameAr: "جبل محسن" },
    ],
    "zghrta": [
      { slug: "ardh", nameAr: "أرضة" },
    ],
    "alkwrh": [
      { slug: "btrwmyn", nameAr: "بترومين" },
    ],
    "bshry": [
      { slug: "hdshyt", nameAr: "حدشيت" },
      { slug: "blwza", nameAr: "بلوزا" },
    ],
    "kar": [
      { slug: "alshykh-taba", nameAr: "الشيخ طابا" },
    ],
    "zhlh": [
      { slug: "ly-alnhry", nameAr: "علي النهري" },
    ],
    "albqa-alghrby": [
      { slug: "jb-jnyn", nameAr: "جب جنين" },
      { slug: "sghbyn", nameAr: "سغبين" },
      { slug: "mshghrh", nameAr: "مشغرة" },
    ],
    "rashya": [
      { slug: "kfrmshky", nameAr: "كفرمشكي" },
      { slug: "mdwkha", nameAr: "مدوخا" },
    ],
    "blbk": [
      { slug: "dwrs", nameAr: "دورس" },
      { slug: "tmnyn-althta", nameAr: "تمنين التحتا" },
    ],
    "syda": [
      { slug: "aldwsyh", nameAr: "العدوسية" },
    ],
    "swr": [
      { slug: "mrkh", nameAr: "معركة" },
    ],
    "jzyn": [
      { slug: "yn-almyr", nameAr: "عين المير" },
    ],
    "alnbtyh": [
      { slug: "alkhyam", nameAr: "الخيام" },
      { slug: "blyda", nameAr: "بليدا" },
      { slug: "kfrshwba", nameAr: "كفرشوبا" },
      { slug: "ynata", nameAr: "عيناتا" },
    ],
  },
  SY: {
    "ryf-dmshq": [
      { slug: "mdmyh-alsham", nameAr: "معضمية الشام" },
    ],
    "hlb": [
      { slug: "slah-aldyn", nameAr: "صلاح الدين" },
      { slug: "bzah", nameAr: "بزاعة" },
    ],
    "hms": [
      { slug: "baba-mrw", nameAr: "بابا عمرو" },
      { slug: "alwr", nameAr: "الوعر" },
    ],
    "alqnytrh": [
      { slug: "khan-arnbh", nameAr: "خان أرنبة" },
      { slug: "albth", nameAr: "البعث" },
    ],
  },
  KW: {
    "mdynh-alkwyt": [
      { slug: "hadaiq-al-soor", nameAr: "حدائق السور" },
    ],
  },
};
