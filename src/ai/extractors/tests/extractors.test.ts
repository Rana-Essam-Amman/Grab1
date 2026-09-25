import { describe, it, expect } from 'vitest';
import { extractColor } from '../colors.extractor';
import { extractCondition } from '../conditions.extractor';
import { extractSize } from '../sizes.extractor';

describe('extractColor', () => {
  it('extracts أحمر from فستان أحمر', () => {
    expect(extractColor('فستان أحمر')).toBe('أحمر');
  });

  it('extracts أحمر from red dress', () => {
    expect(extractColor('red dress')).toBe('أحمر');
  });

  it('extracts أزرق from قميص أزرق', () => {
    expect(extractColor('قميص أزرق')).toBe('أزرق');
  });

  it('extracts بيج from كنبة بيج', () => {
    expect(extractColor('كنبة بيج')).toBe('بيج');
  });

  it('extracts ذهبي from gold watch', () => {
    expect(extractColor('gold watch')).toBe('ذهبي');
  });

  it('returns undefined for بدون لون', () => {
    expect(extractColor('بدون لون')).toBeUndefined();
  });
});

describe('extractCondition', () => {
  it('extracts جديد بالكيس from جديد بالكرتونة', () => {
    expect(extractCondition('جديد بالكرتونة')).toBe('جديد بالكيس');
  });

  it('extracts جديد from جديد', () => {
    expect(extractCondition('جديد')).toBe('جديد');
  });

  it('extracts بحالة الوكالة from بحالة الوكالة', () => {
    expect(extractCondition('بحالة الوكالة')).toBe('بحالة الوكالة');
  });

  it('extracts مستعمل - ممتاز from مستعمل بحالة ممتازة', () => {
    expect(extractCondition('مستعمل بحالة ممتازة')).toBe('مستعمل - ممتاز');
  });

  it('extracts مستعمل - مقبول from used fair condition', () => {
    expect(extractCondition('used fair condition')).toBe('مستعمل - مقبول');
  });

  it('returns undefined for empty string', () => {
    expect(extractCondition('')).toBeUndefined();
  });
});

describe('extractSize', () => {
  it('extracts M from فستان مقاس M', () => {
    expect(extractSize('فستان مقاس M')).toBe('M');
  });

  it('extracts XL from size XL dress', () => {
    expect(extractSize('size XL dress')).toBe('XL');
  });

  it('extracts 42 from مقاس 42', () => {
    expect(extractSize('مقاس 42')).toBe('42');
  });

  it('extracts 256GB from آيفون 256GB', () => {
    expect(extractSize('آيفون 256GB')).toBe('256GB');
  });

  it('returns undefined for بدون', () => {
    expect(extractSize('بدون')).toBeUndefined();
  });

  it('extracts XL from size xl', () => {
    expect(extractSize('size xl')).toBe('XL');
  });
});
