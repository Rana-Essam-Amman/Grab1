import { describe, it, expect } from 'vitest';
import { scoreIntent, INTENT_CONFIDENCE_THRESHOLD } from '../intentScoring';

describe('scoreIntent', () => {
  it.each([
    ['', { confidence: 0, signals: [] }],
    ['بدي أبيعها كامري', { confidence: 0.75, signals: ['explicit_sell'] }],
    ['للبيع شقة', { confidence: 0.35, signals: ['weak_sell'] }],
    ['شقة للبيع 50 ألف', { confidence: 0.50, signals: ['weak_sell', 'price'] }],
    ['بدي أبيعها', { confidence: 0.75, signals: ['explicit_sell'] }],
    ['hello world', { confidence: 0, signals: [] }],
  ] as const)('scoreIntent(%s) → %j', (input, expected) => {
    expect(scoreIntent(input)).toEqual(expected);
  });

  it('handles detailed text and capping at 1.00', () => {
    const res = scoreIntent('بدي أبيعها كامري 2020 بحالة ممتازة 12 ألف');
    expect(res.confidence).toBe(1.00);
    expect(res.signals).toContain('explicit_sell');
    expect(res.signals).toContain('condition');
    expect(res.signals).toContain('price');
    expect(res.signals).toContain('detailed');
  });

  it('adds detailed bonus for text > 30 characters', () => {
    const res = scoreIntent('شقة للبيع في عمان مع اطلالة رائعة وجميلة جدا جدا');
    expect(res.signals).toContain('detailed');
    expect(res.confidence).toBe(0.40);
  });
});

describe('INTENT_CONFIDENCE_THRESHOLD', () => {
  it('is equal to 0.75', () => {
    expect(INTENT_CONFIDENCE_THRESHOLD).toBe(0.75);
  });
});
