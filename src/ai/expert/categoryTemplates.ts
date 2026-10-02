// RULE-14-EXCEPTION: Static taxonomy
import { CATEGORY_TEMPLATES_EXTRA } from './phase3a-expansion';
import { CATEGORY_TEMPLATES_V2 } from './categoryTemplatesV2';
import { MOTORS_PREMIUM } from './premium/motors-premium';

/**
 * Layer 5 — Sentence Planner
 *
 * Per-category structural templates with {slots} filled by the template
 * engine. Every template is a fragment, not a full sentence.
 *
 * SLOT CONTRACT (engine must resolve):
 *  {open}       - opening phrase       (from toneLibrary.openings)
 *  {hook}       - benefit hook         (from toneLibrary.hooks)
 *  {close}      - closing line         (from toneLibrary.closings)
 *  {make}       - brand / manufacturer (from facts.make)
 *  {model}      - model                (from facts.model)
 *  {year}       - year                 (from facts.year)
 *  {price}      - formatted price      (from facts.price, e.g. "15,000")
 *  {fuel}       - fuel type            (from facts.fuel)
 *  {color}      - color                (from facts.color)
 *  {trans}      - transmission         (from facts.transmission)
 *  {km}         - mileage              (from facts.km)
 *  {area}       - real-estate area     (from facts.area)
 *  {rooms}      - number of rooms      (from facts.rooms)
 *  {floor}      - floor                (from facts.floor)
 *  {storage}    - storage capacity     (from facts.storage)
 *  {jobTitle}   - job title            (from facts.title/jobType)
 *  {exp}        - experience years     (from facts.experience)
 *  {fuelTone}   - enrichment phrase    (from enrichmentRules, key=fuel, value={fuel})
 *  {colorTone}  - enrichment phrase    (from enrichmentRules, key=color, value={color})
 *  {yearTone}   - enrichment phrase    (from enrichmentRules, key=year, value={year})
 *  {condTone}   - enrichment phrase    (from enrichmentRules, key=condition, value=...)
 *
 * If a slot's source fact is missing, the engine SKIPS that template and
 * picks another. Never leave an unfilled slot in the output.
 */

export interface CategoryTemplateSet {
  readonly titleTemplates: readonly string[];
  readonly paragraph1: readonly string[];
  readonly paragraph2: readonly string[];
  readonly paragraph3: readonly string[];
}

const BASE_CATEGORY_TEMPLATES: Record<string, CategoryTemplateSet> = {
  // ═══════════════════════════════════════════════
  // MOTORS (cars)
  // ═══════════════════════════════════════════════
  motors: {
    titleTemplates: [
      '{make} {model} {year} {fuel} — {hook}',
      '{make} {model} {year} — {hook}',
      '{make} {model} {year} {fuel} — {hook}',
      '{make} {model} — {hook}',
      '{make} {model} {year} {color} — {hook}',
      '{make} {model} {year} — {colorTone} و{hook}',
    ],
    paragraph1: [
      '{open} {make} {model} {year} {fuel}، {hook}.',
      '{open} {make} {model} موديل {year}، {hook}. نظام {fuel} {fuelTone}.',
      '{open} {make} {model} {year}، {hook}. نظام {fuel} {fuelTone}.',
      'سيارة {make} {model} {year} {fuel}، {hook}.',
      '{open} {make} {model} {year} {color}، {hook}.',
      'فرصة للحصول على {make} {model} {year} {fuel}، {hook}.',
    ],
    paragraph2: [
      '{colorTone}. نظام {fuel} {fuelTone}. {yearTone}.',
      'لون {color}، {colorTone}. نظام {fuel} {fuelTone}. {yearTone}.',
      '{colorTone}. نظام {fuel} {fuelTone}. {yearTone}.',
      'السيارة بلون {color}، {colorTone}. نظام {fuel} {fuelTone}. {yearTone}.',
      '{yearTone}. لون {color}، {colorTone}. نظام {fuel} {fuelTone}.',
      '{colorTone}. {yearTone}. نظام {fuel} {fuelTone}.',
    ],
    paragraph3: [
      'السعر {price} دينار قابل للتفاوض المعقول.',
      'السعر المطلوب {price} دينار، تفاوض معقول.',
      '{price} دينار، مع إمكانية تفاوض بسيط.',
      'السعر النهائي {price} دينار قابل للتفاوض المعقول.',
      '{price} دينار، سعر مناسب مقارنة بالسوق.',
      'السعر {price} دينار. تفاوض معقول للجادين.',
    ],
  },

  // ═══════════════════════════════════════════════
  // REAL ESTATE
  // ═══════════════════════════════════════════════
  'real-estate': {
    titleTemplates: [
      'شقة {area}م {rooms} غرف — {hook}',
      'شقة {area}م {rooms} غرف {floor} — {hook}',
      'شقة {area}م — {hook}',
      'شقة {rooms} غرف {area}م — {hook}',
      'عقار {area}م {rooms} غرف — {hook}',
      'شقة {area}م {rooms} غرف {floor} — {hook}',
    ],
    paragraph1: [
      '{open} شقة بمساحة {area} متر مربع، تتكون من {rooms} غرف، {hook}.',
      '{open} شقة {area} متر مربع، {rooms} غرف، {hook}.',
      '{open} شقة بمساحة {area}م، {rooms} غرف، {floor}، {hook}.',
      'شقة {area} متر مربع، {rooms} غرف، {hook}، {close}.',
      '{open} شقة تتكون من {rooms} غرف بمساحة {area} متر، {hook}.',
      'فرصة لشقة {area} متر مربع، {rooms} غرف، {hook}.',
    ],
    paragraph2: [
      'الشقة {floor}، {hook}. موقع مميز قريب من الخدمات والمواصلات.',
      '{hook}. الشقة {floor} بإضاءة طبيعية ممتازة وتشطيب جيد.',
      'الشقة {floor}، {hook}. منطقة هادئة وقريبة من كل الخدمات.',
      '{hook}. الشقة {floor}، تشطيب جيد وإضاءة ممتازة.',
      'موقع مميز وهادئ، {hook}. الشقة {floor} بإضاءة طبيعية.',
      '{hook}. {close}. تشطيب جيد وموقع قريب من الخدمات.',
    ],
    paragraph3: [
      'السعر {price} دينار قابل للتفاوض المعقول.',
      'السعر المطلوب {price} دينار، تفاوض معقول.',
      '{price} دينار، مع إمكانية تفاوض بسيط.',
      'السعر {price} دينار قابل للتفاوض المعقول.',
      'السعر النهائي {price} دينار، فرصة استثمارية.',
      '{price} دينار قابل للتفاوض للجادين.',
    ],
  },

  // ═══════════════════════════════════════════════
  // MOBILES
  // ═══════════════════════════════════════════════
  mobiles: {
    titleTemplates: [
      '{make} {model} {storage} — {hook}',
      '{make} {model} — {hook}',
      '{make} {model} {storage} {color} — {hook}',
      '{make} {model} {storage}GB — {hook}',
      '{make} {model} {color} — {hook}',
      '{make} {model} {storage} — {colorTone} و{hook}',
    ],
    paragraph1: [
      '{open} {make} {model} بسعة {storage}، {hook}.',
      '{open} {make} {model}، {hook}.',
      '{open} {make} {model} بسعة {storage}، {colorTone}، {hook}.',
      'جهاز {make} {model} بسعة {storage}، {hook}.',
      '{open} {make} {model}، {hook}، {close}.',
      'فرصة للحصول على {make} {model} بسعة {storage}، {hook}.',
    ],
    paragraph2: [
      'الجهاز {colorTone}، {hook}. {close}.',
      '{colorTone}، {close}. بحالة ممتازة وجاهز للاستخدام.',
      '{hook}. {colorTone}. الجهاز جاهز للاستخدام الفوري.',
      'الجهاز بحالة ممتازة، {hook}. {colorTone}.',
      '{hook}. {close}. {colorTone}.',
      'جهاز نظيف وبحالة ممتازة، {hook}.',
    ],
    paragraph3: [
      'السعر {price} دينار قابل للتفاوض المعقول.',
      'السعر المطلوب {price} دينار، تفاوض معقول.',
      '{price} دينار، مع إمكانية تفاوض بسيط.',
      'السعر {price} دينار قابل للتفاوض المعقول.',
      'السعر {price} دينار، سعر مناسب مقارنة بالسوق.',
      'السعر {price} دينار. تفاوض معقول للجادين.',
    ],
  },

  // ═══════════════════════════════════════════════
  // FURNITURE
  // ═══════════════════════════════════════════════
  furniture: {
    titleTemplates: [
      '{model} {color} — {hook}',
      '{model} — {hook}',
      '{model} {color} {condTone} — {hook}',
      '{model} — {colorTone} و{hook}',
      '{model} {color} — {hook}',
      '{model} — {hook}',
    ],
    paragraph1: [
      '{open} {model} {color}، {hook}.',
      '{open} {model} بلون {color}، {hook}.',
      '{open} {model} {color}، {condTone}، {hook}.',
      'قطعة {model} بلون {color}، {hook}.',
      '{open} {model}، {hook}، {close}.',
      'فرصة للحصول على {model} {color}، {hook}.',
    ],
    paragraph2: [
      'القطعة {colorTone}، {hook}. {close}.',
      '{colorTone}، {close}. استعمال منزلي خفيف.',
      '{hook}. {colorTone}. القطعة جاهزة للاستخدام.',
      'القطعة بحالة ممتازة، {hook}. {colorTone}.',
      '{hook}. {close}. {colorTone}.',
      'قطعة نظيفة بحالة ممتازة، {hook}.',
    ],
    paragraph3: [
      'السعر {price} دينار قابل للتفاوض المعقول.',
      'السعر المطلوب {price} دينار، تفاوض معقول.',
      '{price} دينار، مع إمكانية تفاوض بسيط.',
      'السعر {price} دينار قابل للتفاوض المعقول.',
      'السعر {price} دينار، سعر مناسب.',
      '{price} دينار قابل للتفاوض للجادين.',
    ],
  },

  // ═══════════════════════════════════════════════
  // JOBS
  // ═══════════════════════════════════════════════
  jobs: {
    titleTemplates: [
      'مطلوب {jobTitle} — {hook}',
      '{jobTitle} — {hook}',
      'مطلوب {jobTitle} {exp} — {hook}',
      '{jobTitle} {exp} — {hook}',
      'فرصة عمل: {jobTitle} — {hook}',
      '{jobTitle} — {hook}',
    ],
    paragraph1: [
      '{open} {jobTitle}، {hook}.',
      '{open} {jobTitle} بخبرة {exp}، {hook}.',
      '{open} {jobTitle}، {hook}، {close}.',
      'فرصة عمل لـ {jobTitle}، {hook}.',
      '{open} {jobTitle} {exp}، {hook}.',
      'مطلوب {jobTitle} بخبرة {exp}، {hook}.',
    ],
    paragraph2: [
      '{hook}. {close}. دوام كامل مع بيئة عمل احترافية.',
      '{hook}. {close}. فرصة ممتازة للتطور المهني.',
      '{hook}. نبحث عن شخص ملتزم، {close}.',
      '{hook}. {close}. بيئة عمل محفزة ومستقرة.',
      '{hook}. {close}. رواتب تنافسية حسب الخبرة.',
      '{hook}. {close}. فرصة للتطور والنمو.',
    ],
    paragraph3: [
      'الراتب {price} دينار قابل للتفاوض حسب الخبرة.',
      'الراتب {price} دينار، تفاوض حسب الخبرة.',
      '{price} دينار، قابل للتفاوض حسب الخبرة.',
      'الراتب المطلوب {price} دينار، تفاوض معقول.',
      '{price} دينار، رواتب تنافسية حسب الخبرة.',
      'الراتب {price} دينار قابل للتفاوض.',
    ],
  },

  // ═══════════════════════════════════════════════
  // GENERIC (fallback for unmapped categories)
  // ═══════════════════════════════════════════════
  generic: {
    titleTemplates: [
      '{model} — {hook}',
      '{make} {model} — {hook}',
      '{model} {color} — {hook}',
      '{make} {model} {color} — {hook}',
      '{model} — {hook}',
      '{make} {model} — {hook}',
    ],
    paragraph1: [
      '{open} {make} {model}، {hook}.',
      '{open} {model}، {hook}.',
      '{open} {model} {color}، {hook}.',
      '{open} {make} {model} {color}، {hook}.',
      'فرصة للحصول على {model}، {hook}.',
      '{open} {model}، {hook}، {close}.',
    ],
    paragraph2: [
      '{hook}. {colorTone}. {close}.',
      '{colorTone}، {hook}. {close}.',
      '{hook}. {close}. الحالة جيدة وجاهز للاستخدام.',
      '{colorTone}. {hook}. {close}.',
      '{hook}. {close}.',
      'بحالة جيدة، {hook}. {close}.',
    ],
    paragraph3: [
      'السعر {price} دينار قابل للتفاوض المعقول.',
      'السعر المطلوب {price} دينار، تفاوض معقول.',
      '{price} دينار، مع إمكانية تفاوض بسيط.',
      'السعر {price} دينار قابل للتفاوض المعقول.',
      'السعر {price} دينار، سعر مناسب.',
      '{price} دينار قابل للتفاوض للجادين.',
    ],
  },
};

/**
 * Merge multiple template layers into one set per category.
 *
 * Priority order (first wins on duplicate):
 *   1. BASE   — hand-curated, 6 templates/section per category
 *   2. EXTRA  — Phase 3A expansion, 6 templates/section per category
 *   3. V2     — Grok-generated, 12 templates/section per category
 *
 * Deduplication ensures no literal string appears twice in the same
 * section. Order is preserved — BASE templates are tried first by the
 * engine's deterministic picker.
 */
function mergeTemplateLayers(
  ...layers: ReadonlyArray<CategoryTemplateSet | undefined>
): CategoryTemplateSet {
  const valid = layers.filter((s): s is CategoryTemplateSet => Boolean(s));
  const dedupe = (arr: readonly string[]): readonly string[] =>
    Array.from(new Set(arr));
  return {
    titleTemplates: dedupe(valid.flatMap((s) => s.titleTemplates)),
    paragraph1: dedupe(valid.flatMap((s) => s.paragraph1)),
    paragraph2: dedupe(valid.flatMap((s) => s.paragraph2)),
    paragraph3: dedupe(valid.flatMap((s) => s.paragraph3)),
  };
}

const ALL_CATEGORY_KEYS = Array.from(
  new Set<string>([
    ...Object.keys(BASE_CATEGORY_TEMPLATES),
    ...Object.keys(CATEGORY_TEMPLATES_EXTRA),
    ...Object.keys(CATEGORY_TEMPLATES_V2),
  ])
);

export const CATEGORY_TEMPLATES: Record<string, CategoryTemplateSet> = {};
for (const key of ALL_CATEGORY_KEYS) {
  const premiumSet = key === 'motors' ? MOTORS_PREMIUM : undefined;
  CATEGORY_TEMPLATES[key] = mergeTemplateLayers(
    BASE_CATEGORY_TEMPLATES[key],
    premiumSet,
    CATEGORY_TEMPLATES_EXTRA[key],
    CATEGORY_TEMPLATES_V2[key]
  );
}

