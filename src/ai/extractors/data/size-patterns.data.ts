// RULE-14-EXCEPTION: Static taxonomy
/**
 * Size patterns for screens, clothing, shoes, perfume, weight, length.
 * Storage and kids-age are handled by dedicated extractors (storage.extractor
 * and kidsAge.extractor). Simplified: no lookbehind (breaks under normalize).
 */
export const SIZE_PATTERNS: ReadonlyArray<{
  readonly kind: 'screen' | 'clothing' | 'shoes' | 'perfume' | 'weight' | 'length';
  readonly unit: string;
  readonly extractorKey: 'size' | 'weight' | 'length';
  readonly patterns: readonly RegExp[];
}> = [
  {
    kind: 'screen',
    unit: 'inch',
    extractorKey: 'size',
    patterns: [
      /([0-9]{2})\s*(?:بوصة|بوصه|انش|إنش|inch|inches)/i,
      /(?:شاشة|تلفزيون|تلفاز|monitor|tv)\s*([0-9]{2})(?![0-9])/i,
    ],
  },
  {
    kind: 'clothing',
    unit: 'size',
    extractorKey: 'size',
    patterns: [
      /(?:مقاس|سايز)\s*(XXL|XL|L|M|S|XS)(?![A-Za-z])/i,
      /(?:مقاس|سايز)\s*(اكس لارج|اكس لارچ|لارج|ميديم|سمول|small|medium|large)/i,
    ],
  },
  {
    kind: 'shoes',
    unit: 'eu',
    extractorKey: 'size',
    patterns: [
      /(?:حذاء|جزمة|شوز|shoes?)\s*(?:مقاس|نمرة|نمره)?\s*([0-9]{2})(?![0-9])/i,
      /(?:نمرة|نمره|مقاس حذاء)\s*([0-9]{2})(?![0-9])/i,
    ],
  },
  {
    kind: 'perfume',
    unit: 'ml',
    extractorKey: 'size',
    patterns: [
      /([0-9]{2,3})\s*(?:مل|ميل|ml)\b/i,
    ],
  },
  {
    kind: 'weight',
    unit: 'kg',
    extractorKey: 'weight',
    patterns: [
      /([0-9]{1,3})\s*(?:كيلو|كيلوغرام|كغم|kg)\b/i,
    ],
  },
  {
    kind: 'length',
    unit: 'cm',
    extractorKey: 'length',
    patterns: [
      /([0-9]{1,4})\s*(?:سم|سنتيمتر|سنتيم|cm)\b/i,
    ],
  },
];
