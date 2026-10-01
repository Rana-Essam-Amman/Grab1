import { normalizeArabic } from '@/data/arabicNormalize';

const MATERIAL_ALIASES: Array<[string, string[]]> = [
  ['قماش', ['قماش', 'fabric']],
  ['جلد', ['جلد', 'leather']],
  ['جلد صناعي', ['جلد صناعي', 'fake leather', 'pu']],
  ['خشب', ['خشب', 'wood']],
  ['معدن', ['معدن', 'metal']],
  ['بلاستيك', ['بلاستيك', 'plastic']],
  ['قطن', ['قطن', 'cotton']],
  ['حرير', ['حرير', 'silk']],
  ['ستانلس', ['ستانلس', 'stainless']],
  ['زجاج', ['زجاج', 'glass']],
  ['سيراميك', ['سيراميك', 'ceramic']],
  ['صوف', ['صوف', 'wool']],
  ['كتان', ['كتان', 'linen']],
  ['مخمل', ['مخمل', 'velvet']],
  ['ألمنيوم', ['المنيوم', 'ألمنيوم', 'aluminum']],
];

const NORMALIZED: Array<[string, string[]]> = MATERIAL_ALIASES.map(
  ([canonical, aliases]) => [
    canonical,
    aliases.map((a) => normalizeArabic(a).toLowerCase()),
  ]
);

export function extractMaterial(text: string): string | undefined {
  if (!text) return undefined;
  const t = normalizeArabic(text).toLowerCase();
  // Sort longer aliases first via underlying list — the list already favors
  // specific ("جلد صناعي") over generic ("جلد") when canonical order matches.
  for (const [canonical, aliases] of NORMALIZED) {
    for (const alias of aliases) {
      if (t.includes(alias)) return canonical;
    }
  }
  return undefined;
}
