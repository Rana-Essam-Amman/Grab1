import type { CategoryTemplateSet } from '../categoryTemplates';

/**
 * Motors Premium tier — 10/10/10/10 hand-reviewed templates.
 * Each template has a STRUCTURALLY DIFFERENT sentence pattern:
 * titles use 10 distinct structures, paragraphs use 10 distinct openers /
 * focus orders / closers. No filler words. No repeated sentence shapes.
 */
export const MOTORS_PREMIUM: CategoryTemplateSet = {
  titleTemplates: [
    '{make} {model} {year} {fuel} — اقتصادية وموثوقة',
    'فرصة مميزة: {make} {model} {year} بممشى {km} موثق',
    '{color} {make} {model} {year} — قيادة مريحة وأنيقة',
    '{make} {model} {year} بحالة {condTone} — صيانة منتظمة',
    '{year} {make} {model} {trans} — خيار عائلي عملي',
    'اقتصاد حقيقي في {make} {model} {year} {fuel}',
    '{make} {model} {fuel} بلون {color} موديل {year}',
    'ممشى {km} على {make} {model} {year} — {hook}',
    '{make} {model} بمواصفات {fuel} وناقل {trans} موديل {year}',
    'عرض {make} {model} {year} — {seats} مقاعد مريحة للعائلة',
  ],
  paragraph1: [
    'للبيع {make} {model} {year} بمحرك {fuel}، سيارة عائلية بحالة {condTone}.',
    'معروضة {make} {model} {year} بلون {color} بحالة {condTone}.',
    'فرصة للحصول على {make} {model} {year} بممشى {km} وناقل {trans}.',
    'متوفرة الآن {make} {model} {year} بمحرك {fuel} ولون {color}.',
    'سيارة {make} {model} موديل {year} بممشى {km}، خيار {fuelTone} للاستخدام اليومي.',
    'هل تبحث عن {make} {model} {year} بلون {color}؟ محرك {fuel} يناسب العائلة.',
    'إذا كنت تبحث عن {make} {model} سنة {year} بناقل {trans}، فهذه فرصتك.',
    'متوفرة {make} {model} {year} بلون {color} وممشى {km}.',
    'استعرض معنا {make} {model} موديل {year} بمحرك {fuel} و{seats} مقاعد.',
    'وصلت حديثاً {make} {model} {year} بحالة {condTone} وناقل {trans}.',
  ],
  paragraph2: [
    'اللون {color} ثابت ويليق بالاستخدام اليومي. المحرك {fuel} يمنح استهلاكاً {fuelTone}. موديل {year} ما زال مرغوباً في السوق.',
    'المحرك {fuel} معروف بثباته على الطريق. ناقل الحركة {trans} يريح السائق في الزحام. اللون {color} محافظ بلمعانه.',
    'موديل {year} من {make} ما زال مطلوباً في السوق. الممشى {km} منطقي لعمرها. الحالة {condTone} والناقل {trans} سليمان تماماً.',
    'الحالة {condTone} وتظهر العناية في التفاصيل. اللون {color} سليم من دون بهتان. المقاعد {seats} مع ناقل {trans} تناسب الرحلات.',
    'ناقل الحركة {trans} هادئ داخل المدينة. الوقود {fuel} خيار {fuelTone} للتنقل. سنة الصنع {year} مناسبة لمن يبحث عن توازن.',
    'الممشى {km} مناسب لمن يريد استخداماً يومياً. اللون {color} عملي وسهل العناية. محرك {fuel} يخدم العائلة براحة.',
    'محرك {fuel} يقدّم استهلاكاً {fuelTone}. العداد على {km} لموديل {year}. الاعتمادية ظاهرة مع ناقل {trans} سليم.',
    'سنة {year} تمنح توازناً بين الحداثة والمتانة. اللون {color} {colorTone} ويليق بالمظهر. المقاعد {seats} مريحة للمشاوير الطويلة.',
    'محرك {fuel}، ناقل {trans}، وممشى {km} — مزيج يناسب من يريد سيارة جاهزة. اللون {color} يزيد حضورها على الطريق.',
    'قيادة مريحة يومياً هي أبرز ما فيها. يدعم ذلك محرك {fuel} وناقل {trans} بلون {color}. الممشى {km} يبقى ضمن حد معقول.',
  ],
  paragraph3: [
    'سعر {make} {model} {year} هو {price} قابل للتفاوض. {close} بعد المعاينة المباشرة.',
    'يُطلب في {make} {model} مبلغ {price} فقط. {close} والتسليم حسب الاتفاق.',
    'قيمة {make} {model} {year} تبلغ {price}، مع تفاوض معقول. المعاينة متاحة قبل أي اتفاق.',
    'بمبلغ {price} يمكن إتمام الاتفاق على {make} {model}. موديل {year} بحالة {condTone} يستحق النظر.',
    '{price} — فرصة للتفاوض على {make} {model} {year}. تواصل لتحديد موعد المعاينة.',
    'السعر النهائي لـ {make} {model} {year} هو {price}. {close} دون مماطلة.',
    'أعرض {make} {model} {year} بـ {price}. {close} بعد فحص سريع على الطبيعة.',
    '{price} دينار مقابل {make} {model} {year}، سعر مناسب للسوق. {close} للجادين فقط.',
    'المطلوب في {make} {model} مبلغ {price}. {close} واللون {color} كما تظهر الصور.',
    'بـ {price} فقط تحصل على {make} {model} {year}. {close} والتواصل مباشر مع البائع.',
  ],
};
