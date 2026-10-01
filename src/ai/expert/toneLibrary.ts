// RULE-14-EXCEPTION: Static taxonomy
/**
 * Layer 4 — Tone Library
 *
 * Language pools for the template engine. All phrases are marketing tone
 * (style, not facts). The composer picks ONE from each pool per listing,
 * seeded by a hash of the facts — same input = same output.
 */

export interface CategoryTone {
  readonly openings: readonly string[];   // first 3-4 words of description
  readonly hooks: readonly string[];      // benefit clauses
  readonly closings: readonly string[];   // final line (before CTA)
  readonly titleHooks: readonly string[]; // appended to title after " — "
}

export const TONE_LIBRARY: Record<string, CategoryTone> = {
  // ═══════════ MOTORS ═══════════
  motors: {
    openings: [
      'للبيع',
      'معروضة للبيع',
      'متوفرة للبيع',
      'فرصة مميزة',
    ],
    hooks: [
      'سيارة موثوقة وجاهزة للاستخدام',
      'خيار عملي للاستخدام اليومي',
      'أداء ممتاز وراحة في القيادة',
      'خيار عائلي مريح واقتصادي',
    ],
    closings: [
      'السيارة جاهزة للمعاينة',
      'متوفرة للفحص والاختبار',
      'جاهزة للتسليم الفوري',
    ],
    titleHooks: [
      'فرصة ممتازة',
      'اقتصادية ومميزة',
      'بحالة رائعة',
      'خيار عملي',
      'فرصة لا تعوّض',
    ],
  },

  // ═══════════ REAL ESTATE ═══════════
  'real-estate': {
    openings: [
      'للبيع',
      'معروض للبيع',
      'متوفر للبيع',
      'فرصة عقارية',
    ],
    hooks: [
      'موقع مميز وهادئ',
      'مناسبة للسكن العائلي',
      'فرصة استثمارية ممتازة',
      'تشطيب أنيق وإضاءة طبيعية',
    ],
    closings: [
      'متاح للمعاينة في أي وقت',
      'جاهز للمعاينة الفورية',
      'متاح للزيارة والمعاينة',
    ],
    titleHooks: [
      'فرصة ممتازة',
      'موقع مميز',
      'فرصة عقارية',
      'بإضاءة ممتازة',
      'خيار عائلي',
    ],
  },

  // ═══════════ MOBILES ═══════════
  mobiles: {
    openings: [
      'للبيع',
      'معروض للبيع',
      'متوفر للبيع',
    ],
    hooks: [
      'جهاز نظيف وجاهز للاستخدام',
      'أداء ممتاز وحالة رائعة',
      'خيار ممتاز بمواصفات عالية',
    ],
    closings: [
      'الجهاز جاهز للمعاينة',
      'متوفر للتسليم الفوري',
      'جاهز للفحص والتسليم',
    ],
    titleHooks: [
      'نظيف وممتاز',
      'بحالة الوكالة',
      'خيار ممتاز',
      'بمواصفات عالية',
      'فرصة مميزة',
    ],
  },

  // ═══════════ FURNITURE ═══════════
  furniture: {
    openings: [
      'للبيع',
      'معروضة للبيع',
      'متوفرة للبيع',
    ],
    hooks: [
      'قطعة أنيقة ومريحة',
      'مناسبة لغرف الجلوس أو النوم',
      'خيار عملي وأنيق',
    ],
    closings: [
      'متوفرة للمعاينة',
      'جاهزة للتسليم',
      'متاحة للمعاينة الفورية',
    ],
    titleHooks: [
      'أنيقة ومريحة',
      'بحالة ممتازة',
      'خيار عملي',
      'قطعة مميزة',
      'بسعر مناسب',
    ],
  },

  // ═══════════ JOBS ═══════════
  jobs: {
    openings: [
      'مطلوب',
      'مطلوب للعمل',
      'فرصة عمل',
    ],
    hooks: [
      'بيئة عمل احترافية',
      'فرصة ممتازة للتطور',
      'بيئة عمل محفزة',
    ],
    closings: [
      'للتقديم يرجى التواصل',
      'للجادين فقط',
      'الأولوية لأصحاب الخبرة',
    ],
    titleHooks: [
      'دوام كامل',
      'خبرة مطلوبة',
      'فرصة مميزة',
      'بيئة احترافية',
    ],
  },

  // ═══════════ FALLBACK ═══════════
  generic: {
    openings: ['للبيع', 'معروض للبيع', 'متوفر للبيع'],
    hooks: ['بحالة جيدة وجاهز للاستخدام', 'خيار ممتاز بسعر مناسب'],
    closings: ['متوفر للمعاينة', 'جاهز للتسليم الفوري'],
    titleHooks: ['فرصة مميزة', 'خيار ممتاز', 'بسعر مناسب'],
  },
};

/**
 * Deterministic picker — same seed + same pool = same pick.
 * Seed is a 32-bit unsigned integer.
 */
export function pickTone<T>(pool: readonly T[], seed: number): T {
  if (pool.length === 0) throw new Error('empty tone pool');
  return pool[seed % pool.length];
}

/**
 * Hash a string into a 32-bit unsigned integer (FNV-1a).
 * Used to seed tone selection for deterministic variety.
 */
export function hashFacts(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}
