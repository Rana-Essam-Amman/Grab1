// RULE-14-EXCEPTION: Static taxonomy
// V2 templates — higher-volume variety for the 20 FOX Marketplace categories.
// Merged as a third layer (after BASE + EXTRA). Duplicates are removed
// automatically by categoryTemplates.ts.
//
// Design notes:
//  - Slots used MUST resolve from the fact set; unresolved templates are
//    skipped by the engine, so bad templates cost nothing at runtime.
//  - No emojis, no numbers, no hardcoded brand names.

export const CATEGORY_TEMPLATES_V2: Record<string, {
  readonly titleTemplates: readonly string[];
  readonly paragraph1: readonly string[];
  readonly paragraph2: readonly string[];
  readonly paragraph3: readonly string[];
}> = {
  // ═══════════════════════════════════════════════
  // MOTORS
  // ═══════════════════════════════════════════════
  'motors': {
    titleTemplates: [
      '{make} {model} {year} {fuel} — {hook}',
      '{year} {make} {model} {color} — {hook}',
      '{make} {model} — {hook}',
      '{make} {model} {year} {condTone}',
      'فرصة {make} {model} {year} — {hook}',
      '{color} {make} {model} موديل {year}',
      '{make} {model} {trans} {year} — {hook}',
      '{hook} في {make} {model} {year}',
      '{make} {model} {fuel} بلون {color}',
      '{yearTone} {make} {model} — {close}',
      '{make} {model} بمسافة {km}',
      '{fuelTone} {make} {model} {year}',
    ],
    paragraph1: [
      '{open} {make} {model} {year} بمحرك {fuel}، {hook}.',
      'سيارة {make} {model} موديل {year} بلون {color}، {fuelTone}.',
      '{yearTone}، و{make} {model} بنظام {fuel} — {hook}.',
      'تُعرض {make} {model} {year} بحالة {condTone}، {hook}.',
      'يجمع {make} {model} بين لون {color} وأداء {fuelTone}.',
      '{hook}، وهذه {make} {model} موديل {year} تثبت ذلك.',
      'تبدأ الحكاية مع {make} {model} بلون {color}، {hook}.',
      '{hook}، و{make} {model} {year} تجسّد هذا المعنى.',
      'ناقل {trans} في {make} {model} {year} يكمّل أداء {fuelTone}.',
      'سيارة {make} {model} {year}، {hook}، بمحرك {fuel}.',
      '{make} {model} {year} بلون {color}، {hook}.',
      '{open} {make} {model} {year}، {hook}.',
    ],
    paragraph2: [
      'السيارة بلون {color}، {colorTone}. نظام {fuel} يبقى {fuelTone}.',
      '{colorTone}، ومحرك {fuel} {fuelTone}. {yearTone}.',
      'بلغت المسافة {km}، مع ناقل {trans} وحالة {condTone}.',
      '{yearTone} يظهر في التفاصيل، والوقود {fuel} يبقى {fuelTone}.',
      'المسافة المقطوعة {km}، والهيكل بلون {color} يعكس {condTone}.',
      'يعمل المحرك بنظام {fuel}، {fuelTone}، بينما الناقل {trans} يضبط الإيقاع.',
      '{colorTone} يرافق الطلاء {color}، و{yearTone} يؤكّد العناية.',
      'ناقل الحركة {trans} يناسب محرك {fuel} الذي يبقى {fuelTone}.',
      'سجّلت السيارة مسافة {km}، وهي موديل {year} بحالة {condTone}.',
      'اللون {color} ليس تفصيلاً عابراً، إذ {colorTone}، والوقود {fuel}.',
      'موديل {year} يحافظ على {yearTone}، والمسافة {km} موثّقة بوضوح.',
      'طلاء {color} بحالة {condTone}، والمحرك {fuel} يبقى {fuelTone}.',
    ],
    paragraph3: [
      'السعر {price} دينار قابل للتفاوض المعقول. {close}.',
      '{price} دينار، مع تفاوض معقول. {close}.',
      'يُطلب مقابلها {price} دينار. {close}.',
      'القيمة المعروضة {price} دينار لمن يقدّر حالة {condTone}. {close}.',
      'السعر {price} دينار، وهو يعكس {yearTone}. {close}.',
      'يمكن إتمام الاتفاق عند {price} دينار. {hook}، و{close}.',
      '{close}، والسعر المحدد {price} دينار.',
      'مبلغ {price} دينار يفتح باب التفاوض الهادئ. {close}.',
      'العرض قائم على {price} دينار بحالة {condTone}. {close}.',
      'السعر {price} دينار، والتفاوض يبقى ضمن المعقول. {close}.',
      'تُعرض السيارة بمبلغ {price} دينار. {close}.',
      'السعر المعلن {price} دينار لمن يبحث عن {hook}. {close}.',
    ],
  },

  // ═══════════════════════════════════════════════
  // REAL ESTATE
  // ═══════════════════════════════════════════════
  'real-estate': {
    titleTemplates: [
      '{rooms} غرف في {area} — {hook}',
      'عقار {year} في {area} — {hook}',
      'طابق {floor} بموقع {area} بحالة {condTone}',
      'فرصة سكن {rooms} غرف — {hook}',
      '{area} على الطابق {floor} — {close}',
      '{yearTone} عقار {area} بعدد غرف {rooms}',
      '{hook} — وحدة في {area} طابق {floor}',
      '{condTone} سكن في {area} من عام {year}',
      'طابق {floor} في {area} — {hook}',
      '{rooms} غرف طابق {floor} عام {year}',
      'عرض {area} بحالة {condTone}',
      '{year} في {area} بعدد غرف {rooms} — {hook}',
    ],
    paragraph1: [
      '{open} وحدة في {area} بعدد غرف {rooms}، {hook}.',
      'يقع العقار في {area} على الطابق {floor}، {hook}.',
      '{yearTone}، والسكن في {area} يجسّد {hook}.',
      'تُعرض وحدة عام {year} في {area} بحالة {condTone}.',
      'يجمع العقار بين موقع {area} وتشطيب {colorTone}.',
      '{hook}، وهذه الوحدة في {area} بعدد غرف {rooms} تثبت ذلك.',
      'من يزور الطابق {floor} في {area} يلحظ حالة {condTone}.',
      'تبدأ الجولة من {area}، حيث الغرف بعدد {rooms}، {hook}.',
      '{colorTone} في التشطيب، والوحدة ضمن {area} تلائم {hook}.',
      'يضع عقار {area} معياراً واضحاً بعدد غرف {rooms}، {hook}.',
      '{yearTone} تظهر في وحدة {year} الكائنة في {area}.',
      '{open} وحدة {area} عام {year}، {hook}.',
    ],
    paragraph2: [
      'الموقع في {area}، وعدد الغرف {rooms}، والطابق {floor}.',
      '{colorTone} في التشطيب، وحالة العقار {condTone}. {yearTone}.',
      'بُني عام {year}، ويقع على الطابق {floor} ضمن {area}.',
      'الغرف بعدد {rooms}، والتشطيب بلون {color} يمنح {colorTone}.',
      '{yearTone} يظهر في التفاصيل، والحالة العامة {condTone}.',
      'الطابق {floor} يطل على محيط {area}، والغرف بعدد {rooms}.',
      'التشطيب يوصف بأنه {colorTone}، بينما الحالة تبقى {condTone}.',
      'عام البناء {year}، والموقع {area}، وعدد الغرف {rooms}.',
      '{colorTone} يرافق اللون {color}، و{yearTone} تؤكّد العناية.',
      'الوحدة من عام {year}، وهي في {area} بحالة {condTone}.',
      '{condTone} في الفراغات، مع غرف بعدد {rooms} ولمسة {colorTone}.',
      'عام {year} يحافظ على {yearTone}، والطابق {floor} واضح في الوصف.',
    ],
    paragraph3: [
      'السعر {price} دينار قابل للتفاوض المعقول. {close}.',
      '{price} دينار، مع تفاوض معقول. {close}.',
      'يُطلب مقابل العقار {price} دينار. {close}.',
      'القيمة المعروضة {price} دينار لمن يقدّر حالة {condTone}. {close}.',
      'السعر {price} دينار، وهو يعكس {yearTone}. {close}.',
      '{close}، والسعر المحدد {price} دينار.',
      'العرض قائم على {price} دينار بحالة {condTone}. {close}.',
      'من يجد في {hook} ما يناسبه فالسعر {price} دينار. {close}.',
      'السعر {price} دينار، والتفاوض يبقى ضمن المعقول. {close}.',
      'تُعرض الوحدة بمبلغ {price} دينار. {close}.',
      '{price} دينار هو المبلغ المطلوب الآن. {close}.',
      'السعر المعلن {price} دينار لمن يبحث عن {hook} في {area}. {close}.',
    ],
  },

  // ═══════════════════════════════════════════════
  // MOBILES
  // ═══════════════════════════════════════════════
  'mobiles': {
    titleTemplates: [
      '{make} {model} {year} سعة {storage} — {hook}',
      '{year} {make} {model} {color} — {hook}',
      '{make} {model} — {hook}',
      '{make} {model} {year} بحالة {condTone}',
      'فرصة {make} {model} {storage} — {hook}',
      '{color} {make} {model} موديل {year}',
      '{make} {model} {storage} {year} — {hook}',
      '{hook} في {make} {model} {year}',
      '{make} {model} بلون {color} وسعة {storage}',
      '{yearTone} {make} {model} — {close}',
      '{make} {model} {condTone} سعة {storage}',
      'عرض {make} {model} {storage} — {hook}',
    ],
    paragraph1: [
      '{open} {make} {model} {year} بسعة {storage}، {hook}.',
      'هاتف {make} {model} موديل {year} بلون {color}، {yearTone}.',
      '{yearTone}، و{make} {model} بسعة {storage} يجسّد {hook}.',
      'يُعرض {make} {model} {year} بحالة {condTone}، {hook}.',
      'يجمع {make} {model} بين لون {color} وسعة {storage}.',
      '{hook}، وهذا {make} {model} موديل {year} يثبت ذلك.',
      'من يمسك {make} {model} {year} يلحظ حالة {condTone} في البدن.',
      'تبدأ التجربة مع {make} {model} بلون {color}، {hook}.',
      '{colorTone}، ويأتي {make} {model} موديل {year} بما يناسب الوصف.',
      'يضع {make} {model} {year} استخداماً واضحاً، {hook}.',
      '{yearTone} تتجلى في {make} {model} ذي السعة {storage}.',
      'هاتف {make} {model} بلون {color}، {hook}.',
    ],
    paragraph2: [
      'الجهاز بلون {color}، {colorTone}. السعة {storage} والحالة {condTone}.',
      '{colorTone}، وسعة {storage} تناسب الاستخدام. {yearTone}.',
      'موديل {year}، بلون {color} وحالة {condTone}.',
      'السعة {storage}، واللون {color} يمنح {colorTone}.',
      '{yearTone} يظهر في التفاصيل، والحالة العامة {condTone}.',
      'الهيكل بلون {color} يعكس {condTone}، والسعة {storage}.',
      'يعمل الجهاز بسعة {storage}، بينما اللون {color} يبقى {colorTone}.',
      'السعة {storage}، والموديل {year}، والحالة العامة {condTone}.',
      '{colorTone} يرافق اللون {color}، و{yearTone} تؤكّد العناية.',
      'الجهاز موديل {year}، وهو بلون {color} بحالة {condTone}.',
      '{condTone} في البدن، مع سعة {storage} ولمسة {colorTone}.',
      'موديل {year} يحافظ على {yearTone}، والسعة {storage} موثّقة.',
    ],
    paragraph3: [
      'السعر {price} دينار قابل للتفاوض المعقول. {close}.',
      '{price} دينار، مع تفاوض معقول. {close}.',
      'يُطلب مقابل الجهاز {price} دينار. {close}.',
      'القيمة المعروضة {price} دينار لمن يقدّر حالة {condTone}. {close}.',
      'السعر {price} دينار، وهو يعكس {yearTone}. {close}.',
      '{close}، والسعر المحدد {price} دينار.',
      'العرض قائم على {price} دينار بحالة {condTone}. {close}.',
      'من يجد في {hook} ما يناسبه فالسعر {price} دينار. {close}.',
      'السعر {price} دينار، والتفاوض يبقى ضمن المعقول. {close}.',
      'يُعرض الجهاز بمبلغ {price} دينار. {close}.',
      '{price} دينار هو المبلغ المطلوب الآن. {close}.',
      'السعر المعلن {price} دينار لمن يبحث عن {hook}. {close}.',
    ],
  },
};
