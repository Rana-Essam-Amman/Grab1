import { normalizeArabic } from '@/data/arabicNormalize';

const FUEL_ALIASES: Array<[string, string[]]> = [
  ['هايبرد', ['هايبرد', 'هايبر', 'hybrid', 'هجين']],
  ['كهرباء', ['كهرباء', 'كهربائي', 'electric', 'ev']],
  ['ديزل', ['ديزل', 'diesel']],
  ['بنزين', ['بنزين', 'بترول', 'petrol', 'gasoline']],
];

const NORMALIZED_FUEL: Array<[string, string[]]> = FUEL_ALIASES.map(
  ([canonical, aliases]) => [
    canonical,
    aliases.map((a) => normalizeArabic(a).toLowerCase()),
  ]
);

export function extractFuel(text: string): string | undefined {
  if (!text) return undefined;
  // Strip negation clauses: "الديزل غير موجود", "بنزين لا يوجد", "X غير متوفر"
  const cleaned = text.replace(
    /(\S+)\s+(?:غير\s+موجود|غير\s+متوفر|لا\s+يوجد|ما\s+في|مش\s+موجود)/g,
    ' '
  );
  const t = normalizeArabic(cleaned).toLowerCase();
  for (const [canonical, aliases] of NORMALIZED_FUEL) {
    for (const alias of aliases) {
      if (t.includes(alias)) return canonical;
    }
  }
  return undefined;
}
