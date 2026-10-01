import { normalizeArabic } from '@/data/arabicNormalize';

const TRANSMISSION_ALIASES: Array<[string, string[]]> = [
  ['أوتوماتيك', ['اوتوماتيك', 'أوتوماتيك', 'automatic', 'auto']],
  ['عادي', ['عادي', 'مانويل', 'manual', 'stick']],
];

const NORMALIZED: Array<[string, string[]]> = TRANSMISSION_ALIASES.map(
  ([canonical, aliases]) => [
    canonical,
    aliases.map((a) => normalizeArabic(a).toLowerCase()),
  ]
);

export function extractTransmission(text: string): string | undefined {
  if (!text) return undefined;
  const t = normalizeArabic(text).toLowerCase();
  for (const [canonical, aliases] of NORMALIZED) {
    for (const alias of aliases) {
      if (t.includes(alias)) return canonical;
    }
  }
  return undefined;
}
