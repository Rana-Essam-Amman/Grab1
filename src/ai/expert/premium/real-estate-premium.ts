import type { PremiumCategory } from './types';

/**
 * Real-estate premium templates — 10/10/10/10, subcategory-aware.
 * Slugs must match src/data/subcategories.ts: for-sale, for-rent, lands,
 * commercial, chalets.
 */
export const REAL_ESTATE_PREMIUM: PremiumCategory = {
  titleTemplates: [
    { template: "أرض {area}م² بسعر {price} — واجهة شارع وجاهزة للبناء", subcategories: ["lands"] },
    { template: "فرصة واضحة: أرض {area}م² مقابل {price} بصك ساري", subcategories: ["lands"] },
    { template: "عرض أرض {area}م² بـ{price} ومدخل سيارة مباشر", subcategories: ["lands"] },
    { template: "عقار {area}م² بـ{rooms} غرف مقابل {price} — توزيع عملي", subcategories: ["for-sale", "for-rent", "commercial", "chalets"] },
    { template: "تبحث عن {rooms} غرف بمساحة {area}م² بسعر {price}؟", subcategories: ["for-sale", "for-rent", "commercial", "chalets"] },
    { template: "مساحة {area}م² تكفي {rooms} غرف بسعر {price} قرب الخدمات", subcategories: ["for-sale", "for-rent", "commercial", "chalets"] },
    { template: "شقة {area}م² بـ{rooms} غرف وطابق {floor} بسعر {price}", subcategories: ["for-sale"] },
    { template: "تمليك {area}م² و{rooms} غرف ودور {floor} بحالة {condTone}", subcategories: ["for-sale"] },
    { template: "وحدة {rooms} غرف و{bathrooms} حمامات على {area}م² بسعر {price}", subcategories: ["for-sale", "for-rent", "chalets"] },
    { template: "استلم {rooms} غرف و{bathrooms} حمامات على {area}م² بـ{price}", subcategories: ["for-sale", "for-rent", "chalets"] },
  ],
  paragraph1: [
    { template: "للبيع أرض بمساحة {area} متر مربع بسعر {price}. الواجهة على شارع والصك واضح لمن يريد البناء فورًا.", subcategories: ["lands"] },
    { template: "هذه أرض مساحتها {area} متر ومعروضة بـ{price}. الأرض مستوية والمدخل يستقبل سيارة بلا عناء.", subcategories: ["lands"] },
    { template: "نعرض أرضًا مساحتها {area} متر مقابل {price}. الموقع يصلح لفيلا والحد واضح بعد المعاينة.", subcategories: ["lands"] },
    { template: "عقار بمساحة {area} متر يضم {rooms} غرف بسعر {price}. التوزيع عملي ويناسب سكنًا أو مكتبًا قرب الخدمات.", subcategories: ["for-sale", "for-rent", "commercial", "chalets"] },
    { template: "المساحة {area} متر تتوزع على {rooms} غرف بسعر {price}. المكان هادئ والوصول إلى الخدمات قصير.", subcategories: ["for-sale", "for-rent", "commercial", "chalets"] },
    { template: "طرحنا مساحة {area} متر بعدد {rooms} غرف مقابل {price}. التقسيم مريح والمعاينة متاحة هذا الأسبوع.", subcategories: ["for-sale", "for-rent", "commercial", "chalets"] },
    { template: "شقة تمليك بمساحة {area} متر و{rooms} غرف على الطابق {floor}. الحالة {condTone} والسعر {price} يثبت بعد المعاينة.", subcategories: ["for-sale"] },
    { template: "سكن على الدور {floor} بمساحة {area} متر و{rooms} غرف و{bathrooms} حمامات. التشطيب {condTone} والمطلوب {price}.", subcategories: ["for-sale"] },
    { template: "الوحدة فيها {rooms} غرف و{bathrooms} حمامات على مساحة {area} متر. السعر {price} والإقامة هادئة قرب خدمات اليوم.", subcategories: ["for-sale", "for-rent", "chalets"] },
    { template: "سكن بـ{rooms} غرف و{bathrooms} حمامات ومساحة {area} متر. القيمة {price} والإضاءة طبيعية طوال النهار.", subcategories: ["for-sale", "for-rent", "chalets"] },
  ],
  paragraph2: [
    { template: "الأرض مستوية والمساحة {area} متر تسمح ببناء مريح. السعر {price} يبقى إلى حين مشاهدة الموقع.", subcategories: ["lands"] },
    { template: "شارع الأرض واضح ومساحتها {area} متر بلا عائق على المدخل. القيمة {price} تناسب من يبني قريبًا.", subcategories: ["lands"] },
    { template: "يمكن الوقوف أمام الأرض ومساحتها {area} متر بسهولة. المطلوب {price} والصك جاهز للمراجعة.", subcategories: ["lands"] },
    { template: "قرب الخدمات يختصر المشوار من هذه المساحة {area} متر. {rooms} غرف بسعر {price} تمنح جلوسًا مريحًا.", subcategories: ["for-sale", "for-rent", "commercial", "chalets"] },
    { template: "التهوية جيدة داخل {rooms} غرف على {area} متر. السعر {price} يشمل المساحة كما هي بلا رسوم خفية.", subcategories: ["for-sale", "for-rent", "commercial", "chalets"] },
    { template: "المعاينة تظهر توزيع {rooms} غرف على {area} متر. الاتفاق حول {price} يتم بعد الزيارة.", subcategories: ["for-sale", "for-rent", "commercial", "chalets"] },
    { template: "الإضاءة الطبيعية تملأ الطابق {floor} طوال النهار. المساحة {area} متر و{rooms} غرف بحالة {condTone} والسعر {price}.", subcategories: ["for-sale"] },
    { template: "الخصوصية أوضح على الدور {floor} مع {bathrooms} حمامات. {rooms} غرف بمساحة {area} متر وحالة {condTone} مقابل {price}.", subcategories: ["for-sale"] },
    { template: "الحمامات {bathrooms} تخدم {rooms} غرف بلا ازدحام. المساحة {area} متر والسعر {price} مناسب لإقامة هادئة.", subcategories: ["for-sale", "for-rent", "chalets"] },
    { template: "الجلسة تتسع لأهل البيت داخل {rooms} غرف. {bathrooms} حمامات على {area} متر والسعر {price} بعد الاتفاق.", subcategories: ["for-sale", "for-rent", "chalets"] },
  ],
  paragraph3: [
    { template: "السعر {price} لأرض مساحتها {area} متر. المعاينة متاحة والصك يُراجع قبل التحويل.", subcategories: ["lands"] },
    { template: "نطلب {price} مقابل أرض {area} متر. الاتفاق يتم بعد مشاهدة الواجهة.", subcategories: ["lands"] },
    { template: "القيمة {price} تشمل أرض {area} متر بصك واضح. التسليم بعد إتمام الفحص.", subcategories: ["lands"] },
    { template: "السعر المطلوب {price} لمساحة {area} متر و{rooms} غرف. المعاينة تحدد موعد الكتابة.", subcategories: ["for-sale", "for-rent", "commercial", "chalets"] },
    { template: "نطلب {price} مقابل {rooms} غرف على {area} متر. الزيارة متاحة قبل أي التزام.", subcategories: ["for-sale", "for-rent", "commercial", "chalets"] },
    { template: "العرض المالي {price} لعقار {area} متر بعدد {rooms} غرف. الإغلاق يتم بعد المعاينة.", subcategories: ["for-sale", "for-rent", "commercial", "chalets"] },
    { template: "السعر {price} لشقة {area} متر على الطابق {floor}. فيها {rooms} غرف بحالة {condTone} وجاهزة للمشاهدة.", subcategories: ["for-sale"] },
    { template: "المطلوب {price} لتمليك الدور {floor} بمساحة {area} متر. عدد الغرف {rooms} والحالة {condTone}.", subcategories: ["for-sale"] },
    { template: "القيمة {price} لـ{rooms} غرف و{bathrooms} حمامات. المساحة {area} متر والتسليم بعد الاتفاق.", subcategories: ["for-sale", "for-rent", "chalets"] },
    { template: "مقابل {price} تحصل على {area} متر و{rooms} غرف و{bathrooms} حمامات. الموعد يتحدد بعد المعاينة.", subcategories: ["for-sale", "for-rent", "chalets"] },
  ],
};
