import { KIDS_AGE_PATTERNS } from './data/domain-extractors.data';

function normalizeDigits(s: string): string {
  return s.replace(/[٠-٩]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30)
  );
}

/**
 * Extract a kids age range or single age from text.
 * Returns the captured group normalized (Arabic digits → Latin).
 */
export function extractKidsAge(text: string): string | undefined {
  if (!text) return undefined;
  const t = normalizeDigits(text);
  for (const re of KIDS_AGE_PATTERNS) {
    const m = t.match(re);
    if (m && m[1]) {
      const v = m[1].replace(/\s+/g, ' ').trim();
      if (v) return v;
    }
  }
  return undefined;
}
