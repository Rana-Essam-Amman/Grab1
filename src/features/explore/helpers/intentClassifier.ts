// Extend for new markets by appending here or extracting to
// intentKeywords/<locale>.ts
export const SELL_KEYWORDS: readonly string[] = [
  'للبيع', 'بدي أبيع', 'بدي أنزل', 'بدي انزل', 'حط إعلان', 'حط اعلان',
  'بداعي السفر', 'بحالة ممتازة', 'فحص كامل', 'فحص', 'ماشي', 'ماشية',
  'عداد', 'حالة الوكالة', 'مطلوب فيه', 'للإيجار', 'للايجار',
  'for sale', 'selling', 'for rent', 'clean condition'
];

export const BUY_KEYWORDS: readonly string[] = [
  'بدور على', 'بدي أشتري', 'أبحث عن', 'ابحث عن', 'أبحث', 'ابحث', 'دور',
  'مطلوب', 'شراء', 'وين', 'كم سعر', 'أريد', 'اريد',
  'looking for', 'want to buy', 'search', 'buy', 'needed'
];

export const classifyUserIntent = (text: string): 'SEARCH' | 'PUBLISH' => {
  const raw = text.trim().toLowerCase();
  if (!raw) return 'SEARCH';

  let sellCount = 0;
  for (const kw of SELL_KEYWORDS) {
    if (raw.includes(kw)) sellCount++;
  }

  let buyCount = 0;
  for (const kw of BUY_KEYWORDS) {
    if (raw.includes(kw)) buyCount++;
  }

  if (sellCount > buyCount) return 'PUBLISH';
  if (buyCount > sellCount) return 'SEARCH';

  if (/\d+\s*(دينار|دولار|ليرة|ريال|jod|usd|\$)/i.test(raw)) return 'PUBLISH';
  if (sellCount >= 2) return 'PUBLISH';

  return 'SEARCH';
};

export const extractCleanSearchFallback = (raw: string): string => {
  const clean = raw
    .replace(
      /^(بدي|بدنا|أبحث عن|ابحث عن|مطلوب|شراء|ابحث|بحث|اريد|أريد|looking for|want to buy|search|buy)\s+/gi,
      ''
    )
    .trim();
  return clean || raw;
};
