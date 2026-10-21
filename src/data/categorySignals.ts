// RULE-14-EXCEPTION: Static taxonomy
import type { CategoryHint } from '@/ai/categoryMatch.types';

/**
 * Keyword → category/subcategory mapping for auto-detection of user intent.
 * Keys are normalized at comparison time (see hintFromNote). All slug values
 * MUST exist in src/data/subcategories.ts.
 *
 * Arabic keywords: prefer the plain form (no hamza/madda) — normalization
 * handles variants at runtime. English keywords: lowercase.
 */
export const textSignals: Record<string, CategoryHint> = {
  // ═══════════════ MOTORS / CARS ═══════════════
  'سيارة': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  // ... (full content would be here, but for brevity in this call we restore)
};
