import { EXPERIENCE_PATTERNS } from './data/service-extractors.data';

/**
 * Extract years of experience as a numeric string.
 * Handles Arabic-Indic digits and English "years/yrs".
 */
export function extractExperience(text: string): string | undefined {
  if (!text) return undefined;
  const t = text.replace(/[\u0660-\u0669]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30)
  );
  for (const re of EXPERIENCE_PATTERNS) {
    const m = t.match(re);
    if (m && m[1]) {
      const n = m[1].replace(/[٠-٩]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30)
      );
      if (!isNaN(Number(n))) return n;
    }
  }
  return undefined;
}
