export interface SpecChip {
  readonly label: string;
  readonly value: string;
}

const REDUNDANT_LABELS = /^(make\s*\/?\s*model|brand|الماركة|الموديل|ماركة|موديل|الماركة\s+و\s+الموديل|الماركة\s*\/\s*الموديل|category|city|القسم|المدينة)$/i;

const appendUnit = (label: string, value: string): string => {
  const l = label.toLowerCase();
  const v = value.trim();
  if (v.match(/[a-zA-Zء-ي²%]/)) return v;
  if (/km|ممشى|ماشي|mileage|قطعت|كيلومترات/i.test(l)) return `${v} كم`;
  if (/area|مساحة|م²/i.test(l)) return `${v} م²`;
  return v;
};

const normalize = (s: string): string =>
  s.toLowerCase().replace(/[\s\-_\/\\,.·•·،]+/g, ' ').trim();

const isRedundantWithTitle = (value: string, title: string): boolean => {
  const v = normalize(value);
  const t = normalize(title);
  if (!v || !t) return false;
  // Value is contained in title (e.g. "Lexus ES 350 DD" inside title)
  if (t.includes(v)) return true;
  // Title is contained in value (e.g. "تويوتا لاندكروزر" containing title)
  if (v.includes(t)) return true;
  // First 2 words of value appear in title
  const words = v.split(' ').filter(Boolean).slice(0, 2).join(' ');
  if (words.length >= 4 && t.includes(words)) return true;
  return false;
};

export function pickSpecs(
  attributes: Array<{ label: string; value: string }> | undefined,
  count: number,
  title?: string,
): SpecChip[] {
  if (!attributes || attributes.length === 0) return [];
  const t = title || '';
  return attributes
    .filter((a) => a.value && String(a.value).trim().length > 0)
    .filter((a) => !REDUNDANT_LABELS.test(a.label.trim()))
    .filter((a) => !t || !isRedundantWithTitle(String(a.value), t))
    .slice(0, count)
    .map((a) => ({ label: a.label, value: appendUnit(a.label, String(a.value)) }));
}
