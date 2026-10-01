import { AREA_PATTERNS } from './data/numeric-extractors.data';

function normalizeDigits(s: string): string {
  return s.replace(/[٠-٩]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30)
  );
}

export function extractArea(text: string): string | undefined {
  if (!text) return undefined;
  const t = normalizeDigits(text);
  for (const re of AREA_PATTERNS) {
    const m = t.match(re);
    if (m && m[1] && /^\d+$/.test(m[1])) return m[1];
  }
  return undefined;
}
