import { BATHROOMS_PATTERNS } from './data/numeric-extractors.data';

const WORD_TO_NUM: Record<string, string> = {
  'واحد': '1', 'واحدة': '1',
  'حمامان': '2', 'حمامين': '2',
};

function normalizeDigits(s: string): string {
  return s.replace(/[٠-٩]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30)
  );
}

export function extractBathrooms(text: string): string | undefined {
  if (!text) return undefined;
  const t = normalizeDigits(text);
  for (const re of BATHROOMS_PATTERNS) {
    const m = t.match(re);
    if (m && m[1]) {
      const v = m[1].trim();
      if (/^\d+$/.test(v)) return v;
      if (WORD_TO_NUM[v]) return WORD_TO_NUM[v];
      // "حمام ومطبخ" → canonical 1
      if (v === 'حمام') return '1';
    }
  }
  return undefined;
}
