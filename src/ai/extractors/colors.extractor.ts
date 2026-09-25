const COLORS: Record<string, string> = {
  'أحمر': 'أحمر',
  'حمراء': 'أحمر',
  'red': 'أحمر',
  'أزرق': 'أزرق',
  'زرقاء': 'أزرق',
  'blue': 'أزرق',
  'أخضر': 'أخضر',
  'خضراء': 'أخضر',
  'green': 'أخضر',
  'أصفر': 'أصفر',
  'صفراء': 'أصفر',
  'yellow': 'أصفر',
  'أبيض': 'أبيض',
  'بيضاء': 'أبيض',
  'white': 'أبيض',
  'أسود': 'أسود',
  'سوداء': 'أسود',
  'black': 'أسود',
  'رمادي': 'رمادي',
  'رصاصي': 'رمادي',
  'gray': 'رمادي',
  'grey': 'رمادي',
  'بني': 'بني',
  'brown': 'بني',
  'بيج': 'بيج',
  'beige': 'بيج',
  'برتقالي': 'برتقالي',
  'orange': 'برتقالي',
  'بنفسجي': 'بنفسجي',
  'purple': 'بنفسجي',
  'وردي': 'وردي',
  'pink': 'وردي',
  'ذهبي': 'ذهبي',
  'gold': 'ذهبي',
  'فضي': 'فضي',
  'silver': 'فضي',
  'كحلي': 'كحلي',
  'navy': 'كحلي',
  'زيتي': 'زيتي',
  'olive': 'زيتي',
  'تركواز': 'تركواز',
  'turquoise': 'تركواز',
  'سماوي': 'سماوي',
  'sky': 'سماوي',
  'كريمي': 'كريمي',
  'cream': 'كريمي',
  'نحاسي': 'نحاسي',
  'copper': 'نحاسي',
  'خمري': 'خمري',
  'burgundy': 'خمري',
  'فيروزي': 'فيروزي',
  'teal': 'فيروزي',
  'موف': 'موف',
  'mauve': 'موف',
  'عنابي': 'عنابي',
  'maroon': 'عنابي',
  'أوف وايت': 'أوف وايت',
  'off-white': 'أوف وايت',
  'نيلي': 'نيلي',
  'indigo': 'نيلي',
  'كاكي': 'كاكي',
  'khaki': 'كاكي',
  'عسلي': 'عسلي',
  'hazel': 'عسلي',
  'برونزي': 'برونزي',
  'bronze': 'برونزي',
  'خوخي': 'خوخي',
  'peach': 'خوخي',
  'فوشيا': 'فوشيا',
  'fuchsia': 'فوشيا',
};

function normalizeArabic(s: string): string {
  return s
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[\u064B-\u0652]/g, '');
}

const NORMALIZED_COLORS: Array<{ normalized: string; canonical: string; isLatin: boolean }> =
  Object.entries(COLORS).map(([alias, canonical]) => ({
    normalized: normalizeArabic(alias.toLowerCase()),
    canonical,
    isLatin: /^[a-z0-9-]+$/.test(alias),
  })).sort((a, b) => b.normalized.length - a.normalized.length);

export function extractColor(text: string): string | undefined {
  if (!text || !text.trim()) return undefined;
  const t = normalizeArabic(text.toLowerCase());
  for (const { normalized, canonical, isLatin } of NORMALIZED_COLORS) {
    if (isLatin) {
      const reg = new RegExp(`\\b${normalized}\\b`, 'i');
      if (reg.test(t)) return canonical;
    } else {
      if (t.includes(normalized)) return canonical;
    }
  }
  return undefined;
}
