import { ROOMS_PATTERNS } from './data/numeric-extractors.data';

const WORD_TO_NUM: Record<string, string> = {
  'واحد': '1', 'واحدة': '1',
  'غرفتين': '2', 'غرفتان': '2',
  'ثلاث': '3', 'ثلاثة': '3', 'ثلاثه': '3',
  'أربع': '4', 'اربعة': '4', 'أربعة': '4', 'اربع': '4',
  'خمس': '5', 'خمسة': '5',
  'ست': '6', 'ستة': '6',
  'سبع': '7', 'سبعة': '7',
};

function normalizeDigits(s: string): string {
  return s.replace(/[٠-٩]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30)
  );
}

export function extractRooms(text: string): string | undefined {
  if (!text) return undefined;
  const t = normalizeDigits(text);
  for (const re of ROOMS_PATTERNS) {
    const m = t.match(re);
    if (m && m[1]) {
      const v = m[1].trim();
      if (/^\d+$/.test(v)) return v;
      const mapped = WORD_TO_NUM[v];
      if (mapped) return mapped;
    }
  }
  return undefined;
}
