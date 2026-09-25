interface ConditionRule {
  patterns: (string | RegExp)[];
  result: string;
}

const CONDITION_RULES: ConditionRule[] = [
  { patterns: ['بالكرتونة', 'بالكيس', 'باكيت', /\bin\s*box\b/i, /\bsealed\b/i], result: 'جديد بالكيس' },
  { patterns: ['بحالة الوكالة', 'وكالة'], result: 'بحالة الوكالة' },
  { patterns: ['بحاجة صيانة', 'خربان', 'خرابة', /\bneeds?\s*repair\b/i, /\bfor\s*parts\b/i], result: 'بحاجة صيانة' },
  { patterns: ['مستعمل - ممتاز', 'بحالة ممتازة', /\blike\s*new\b/i, /\bexcellent\b/i], result: 'مستعمل - ممتاز' },
  { patterns: ['مستعمل - جيد', 'بحالة جيدة', /\bgood\s*condition\b/i], result: 'مستعمل - جيد' },
  { patterns: ['مستعمل - مقبول', 'بحالة مقبولة', /\bfair\s*condition\b/i, /\bfair\b/i], result: 'مستعمل - مقبول' },
  { patterns: ['جديد', /\bnew\b/i], result: 'جديد' },
  { patterns: ['مستعمل', /\bused\b/i], result: 'مستعمل' },
];

export function extractCondition(text: string): string | undefined {
  if (!text || !text.trim()) return undefined;
  const t = text.toLowerCase();

  for (const rule of CONDITION_RULES) {
    for (const pat of rule.patterns) {
      if (typeof pat === 'string') {
        if (t.includes(pat.toLowerCase())) return rule.result;
      } else if (pat.test(t)) {
        return rule.result;
      }
    }
  }

  return undefined;
}
