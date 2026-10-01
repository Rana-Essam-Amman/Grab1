// RULE-14-EXCEPTION: Static taxonomy
/**
 * Layer 3 — Facts Enricher
 *
 * Maps a fact key+value to a benefit phrase. Used by the composer to expand
 * short facts ("هايبرد", "3 غرف") into marketing benefits without inventing
 * new information.
 *
 * Keys are normalized Arabic. Values are read-only marketing phrases that
 * describe the fact (not new facts).
 */

export interface EnrichmentRule {
  readonly key: string;       // normalized attribute key: 'fuel', 'color', 'rooms'...
  readonly value: string;     // normalized value: 'هايبرد', 'اسود', '3'...
  readonly phrase: string;    // marketing benefit phrase in Arabic
}

export const ENRICHMENT_RULES: readonly EnrichmentRule[] = [
  // ═══════════ FUEL ═══════════
  { key: 'fuel', value: 'هايبرد',   phrase: 'اقتصادية جداً في استهلاك الوقود' },
  { key: 'fuel', value: 'كهرباء',   phrase: 'صديقة للبيئة وبدون ضجيج' },
  { key: 'fuel', value: 'بنزين',    phrase: 'أداء قوي واستجابة سريعة' },
  { key: 'fuel', value: 'ديزل',     phrase: 'عزم ممتاز على المسافات الطويلة' },

  // ═══════════ COLOR ═══════════
  { key: 'color', value: 'أسود',    phrase: 'لون فخم يبرز الأناقة' },
  { key: 'color', value: 'أبيض',    phrase: 'لون نظيف ومحبوب' },
  { key: 'color', value: 'فضي',     phrase: 'لون عصري يبرز التصميم' },
  { key: 'color', value: 'رمادي',   phrase: 'لون عملي وأنيق' },
  { key: 'color', value: 'أحمر',    phrase: 'لون جذاب وملفت' },
  { key: 'color', value: 'أزرق',    phrase: 'لون هادئ وراقٍ' },

  // ═══════════ YEAR ═══════════
  { key: 'year', value: '2024', phrase: 'موديل حديث جداً' },
  { key: 'year', value: '2023', phrase: 'موديل حديث' },
  { key: 'year', value: '2022', phrase: 'موديل حديث' },
  { key: 'year', value: '2021', phrase: 'موديل قريب' },
  { key: 'year', value: '2020', phrase: 'موديل موثوق' },

  // ═══════════ CONDITION ═══════════
  { key: 'condition', value: 'جديد',              phrase: 'جديد ولم يستخدم' },
  { key: 'condition', value: 'مستعمل - ممتاز',    phrase: 'بحالة الوكالة تقريباً' },
  { key: 'condition', value: 'مستعمل - جيد',      phrase: 'بحالة جيدة ومحافظ عليه' },

  // ═══════════ REAL ESTATE ═══════════
  { key: 'rooms', value: '1', phrase: 'مناسبة لشخص واحد أو زوجين' },
  { key: 'rooms', value: '2', phrase: 'مساحة مريحة لزوجين' },
  { key: 'rooms', value: '3', phrase: 'مساحة عائلية مريحة' },
  { key: 'rooms', value: '4', phrase: 'مساحة واسعة للعائلات الكبيرة' },
  { key: 'rooms', value: '5', phrase: 'مساحة فاخرة وواسعة' },

  // ═══════════ MOBILES / ELECTRONICS ═══════════
  { key: 'storage', value: '64GB',  phrase: 'سعة مناسبة للاستخدام اليومي' },
  { key: 'storage', value: '128GB', phrase: 'سعة مريحة للتطبيقات والصور' },
  { key: 'storage', value: '256GB', phrase: 'سعة واسعة لكل الاحتياجات' },
  { key: 'storage', value: '512GB', phrase: 'سعة ضخمة بدون قلق' },

  // ═══════════ TRANSMISSION ═══════════
  { key: 'transmission', value: 'أوتوماتيك', phrase: 'قيادة سلسة ومريحة' },
  { key: 'transmission', value: 'عادي',      phrase: 'تحكم كامل وأداء رياضي' },
];

/**
 * Look up an enrichment phrase for a key+value pair.
 * Returns undefined if no rule matches — never fabricates.
 */
export function findEnrichment(key: string, value: string): string | undefined {
  if (!key || !value) return undefined;
  for (const rule of ENRICHMENT_RULES) {
    if (rule.key === key && rule.value === value) return rule.phrase;
  }
  return undefined;
}
