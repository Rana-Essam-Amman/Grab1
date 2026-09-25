import { describe, it, expect } from 'vitest';
import { classifyUserIntent, extractCleanSearchFallback } from '../intentClassifier';

describe('classifyUserIntent', () => {
  it.each([
    ['كامري 2020 بحالة ممتازة بدي أبيعها 12 ألف', 'PUBLISH'],
    ['بدي سيارة كامري', 'SEARCH'],
    ['بدور على شقة للإيجار في عمان', 'SEARCH'],
    ['شقة للبيع في عمان', 'PUBLISH'],
    ['كم سعر كامري 2020', 'SEARCH'],
    ['بدي أنزل إعلان سيارة', 'PUBLISH'],
    ['سيارة نظيفة للبيع', 'PUBLISH'],
    ['وين ألاقي أيفون 15', 'SEARCH'],
    ['عندي ساعة رولكس للبيع', 'PUBLISH'],
    ['ابحث عن لابتوب', 'SEARCH'],
  ] as const)('classifyUserIntent(%s) → %s', (input, expected) => {
    expect(classifyUserIntent(input)).toBe(expected);
  });

  it.each([
    ['', 'IGNORE'],
    ['   ', 'IGNORE'],
    ['ك', 'IGNORE'],
    ['مرحبا', 'IGNORE'],
    ['Hello', 'IGNORE'],
    ['السلام عليكم', 'IGNORE'],
    ['كامري', 'SEARCH'],
    ['بدي', 'SEARCH'],
    ['بدي أبيعها', 'PUBLISH'],
  ] as const)('classifyUserIntent edge case: %s → %s', (input, expected) => {
    expect(classifyUserIntent(input)).toBe(expected);
  });
});

describe('extractCleanSearchFallback', () => {
  it.each([
    ['بدي سيارة', 'سيارة'],
    ['ابحث عن شقة', 'شقة'],
    ['', ''],
  ] as const)('extractCleanSearchFallback(%s) → %s', (input, expected) => {
    expect(extractCleanSearchFallback(input)).toBe(expected);
  });
});
