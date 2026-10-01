import { FLOOR_PATTERNS } from './data/numeric-extractors.data';

const ORDINAL_TO_NUM: Record<string, string> = {
  'الأول': '1', 'الاول': '1', 'أول': '1', 'اول': '1',
  'الثاني': '2', 'ثاني': '2',
  'الثالث': '3', 'ثالث': '3',
  'الرابع': '4', 'رابع': '4',
  'الخامس': '5', 'خامس': '5',
  'السادس': '6', 'سادس': '6',
  'السابع': '7', 'سابع': '7',
  'الثامن': '8', 'ثامن': '8',
  'التاسع': '9', 'تاسع': '9',
  'العاشر': '10', 'عاشر': '10',
};

const SPECIAL: Record<string, string> = {
  'أرضي': '0', 'ارضي': '0', 'الأرضي': '0', 'الارضي': '0',
  'تسوية': '0', 'روف': 'roof', 'سطح': 'roof', 'بدروم': 'basement',
};

function normalizeDigits(s: string): string {
  return s.replace(/[٠-٩]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30)
  );
}

export function extractFloor(text: string): string | undefined {
  if (!text) return undefined;
  const t = normalizeDigits(text);
  for (const re of FLOOR_PATTERNS) {
    const m = t.match(re);
    if (m && m[1]) {
      const v = m[1].trim();
      if (/^\d+$/.test(v)) return v;
      if (ORDINAL_TO_NUM[v]) return ORDINAL_TO_NUM[v];
      if (SPECIAL[v]) return SPECIAL[v];
    }
  }
  return undefined;
}
