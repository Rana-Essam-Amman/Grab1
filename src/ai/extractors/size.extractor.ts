import { SIZE_PATTERNS } from './data/size-patterns.data';
import { normalizeArabic } from '@/data/arabicNormalize';

export interface SizeExtraction {
  readonly size?: string;
  readonly weight?: string;
  readonly length?: string;
}

function normalizeDigits(s: string): string {
  return s.replace(/[\u0660-\u0669]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30)
  );
}

/**
 * Extract clothing/screen/shoe/perfume sizes + weight + length.
 * Returns an object; only present keys are populated.
 */
export function extractSizes(text: string): SizeExtraction {
  if (!text) return {};
  const digitNorm = normalizeDigits(text);
  const norm = normalizeArabic(digitNorm).toLowerCase();

  const out: { size?: string; weight?: string; length?: string } = {};

  for (const entry of SIZE_PATTERNS) {
    if (out[entry.extractorKey]) continue;
    for (const pattern of entry.patterns) {
      const m = norm.match(pattern);
      if (m && m[1]) {
        const value = m[1].trim();
        if (value) {
          out[entry.extractorKey] = value;
          break;
        }
      }
    }
  }

  return out;
}
