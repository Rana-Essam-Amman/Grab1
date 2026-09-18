export const classifyUserIntent = (text: string): 'SEARCH' | 'PUBLISH' => {
  const raw = text.trim().toLowerCase();
  if (!raw) return 'SEARCH';

  const sellKw = [
    'للبيع',
    'عندي',
    'بدي انزل',
    'بدي أنزل',
    'للبدل',
    'حط اعلان',
    'حط إعلان',
    'بسعر',
    'بيع',
    'بداعي السفر',
    'فحص',
    'فحص كامل',
    'ماشي',
    'ماشية',
    'عداد',
    'حالة الوكالة',
    'مطلوب فيه',
    'للإيجار',
    'للايجار',
    'for sale',
    'selling',
    'for swap',
    'for rent',
    'clean condition',
  ];

  const buyKw = [
    'بدي',
    'بدنا',
    'أبحث عن',
    'ابحث عن',
    'ابحث',
    'دور',
    'مطلوب',
    'شراء',
    'وين',
    'كم سعر',
    'اريد',
    'أريد',
    'بحث',
    'looking for',
    'want to buy',
    'search',
    'buy',
    'needed',
  ];

  const hasSell = sellKw.some((kw) => raw.includes(kw));
  const hasBuy = buyKw.some((kw) => raw.includes(kw));

  if (hasSell && !hasBuy) return 'PUBLISH';
  if (hasBuy) return 'SEARCH';
  if (/\d+\s*(دينار|دولار|ليرة|ريال|jod|usd|\$)/i.test(raw) || hasSell) {
    return 'PUBLISH';
  }

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
