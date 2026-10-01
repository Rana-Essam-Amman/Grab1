import { describe, it, expect } from 'vitest';
import { extractFacts, writeListingCopy } from '../listingCopyAgent';
import { buildFieldsFromFacts } from '../buildFieldsFromFacts';

describe('extractFacts — universal (non-car categories)', () => {
  it('extracts type/condition/size from dress', () => {
    const f = extractFacts('فستان أحمر مقاس M جديد');
    expect(f.type).toBe('فستان');
    expect(f.condition).toBe('جديد');
    expect(f.size).toBe('M');
  });

  it('extracts type/condition from sofa', () => {
    const f = extractFacts('كنبة 3 مقاعد مستعملة بحالة ممتازة');
    expect(f.type).toBe('كنبة');
    expect(f.condition).toBe('مستعمل - ممتاز');
  });

  it('extracts type from laptop', () => {
    const f = extractFacts('لابتوب Dell i7 رام 16');
    expect(f.type).toBe('لابتوب');
  });

  it('extracts type from apartment', () => {
    const f = extractFacts('شقة للبيع 150 متر 3 غرف');
    expect(f.type).toBe('شقة');
  });

  it('extracts car fields (backwards compat)', () => {
    const f = extractFacts('كامري 2022 ماشية 50 ألف فحص كامل');
    expect(f.make).toBe('تويوتا');
    expect(f.model).toBe('كامري');
    expect(f.year).toBe('2022');
    expect(f.km).toBe('50000');
    expect(f.inspect).toBe(true);
  });
});

describe('buildFieldsFromFacts — all schema fields always present', () => {
  it('returns ALL fashion fields even when partial facts', () => {
    const facts = extractFacts('فستان أحمر مقاس M');
    const fields = buildFieldsFromFacts(facts, 'fashion', '', false);
    expect(fields.length).toBe(4);
    expect(fields.find((f) => f.key === 'type')?.value).toBe('فستان');
    expect(fields.find((f) => f.key === 'size')?.value).toBe('M');
  });

  it('returns ALL furniture fields when nothing extracted', () => {
    const facts = extractFacts('شيء للبيع');
    const fields = buildFieldsFromFacts(facts, 'furniture', '', false);
    expect(fields.length).toBe(4);
    expect(fields.every((f) => typeof f.value === 'string')).toBe(true);
  });

  it('returns ALL motors fields (10) even with empty facts', () => {
    const facts = extractFacts('');
    const fields = buildFieldsFromFacts(facts, 'motors', '', false);
    expect(fields.length).toBe(10);
  });
});

describe('writeListingCopy — non-car fallback', () => {
  it('produces title and body for fashion without AI', () => {
    const result = writeListingCopy({
      raw: 'فستان أحمر مقاس M جديد',
      arabic: true,
      categorySlug: 'fashion',
    });
    expect(result.title).toBeTruthy();
    expect(result.body).toBeTruthy();
    expect(result.facts.type).toBe('فستان');
  });
});
