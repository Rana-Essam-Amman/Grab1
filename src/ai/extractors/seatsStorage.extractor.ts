import { SEATS_PATTERNS, STORAGE_PATTERNS } from './data/numeric-extractors.data';

const SEAT_WORD_TO_NUM: Record<string, string> = {
  'مقعدين': '2', 'مقعدان': '2', 'كرسيين': '2',
  'واحد': '1', 'واحدة': '1',
  'ثلاث': '3', 'ثلاثة': '3',
  'أربع': '4', 'أربعة': '4',
  'خمس': '5', 'خمسة': '5',
};

function normalizeDigits(s: string): string {
  return s.replace(/[٠-٩]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30)
  );
}

export function extractSeats(text: string): string | undefined {
  if (!text) return undefined;
  const t = normalizeDigits(text);
  for (const re of SEATS_PATTERNS) {
    const m = t.match(re);
    if (m && m[1]) {
      const v = m[1].trim();
      if (/^\d+$/.test(v)) return v;
      if (SEAT_WORD_TO_NUM[v]) return SEAT_WORD_TO_NUM[v];
    }
  }
  return undefined;
}

/**
 * Extract storage capacity as "256GB" or "1TB".
 * Arabic inputs normalized to Latin unit: "256 جيجا" → "256GB", "1 تيرا" → "1TB".
 */
export function extractStorage(text: string): string | undefined {
  if (!text) return undefined;
  const t = normalizeDigits(text);
  for (const re of STORAGE_PATTERNS) {
    const m = t.match(re);
    if (m && m[1]) {
      const num = m[1];
      // Look at the match to find the unit
      const full = m[0].toLowerCase();
      const isTB = /تيرا|tb/.test(full);
      if (isTB) return `${num}TB`;
      return `${num}GB`;
    }
  }
  return undefined;
}
