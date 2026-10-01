import { describe, it, expect } from 'vitest';
import { computeConfidence } from '../confidence';

describe('computeConfidence', () => {
  it('marks exact-match values as high', () => {
    const facts = { make: 'تويوتا', model: 'كامري' };
    const conf = computeConfidence('تويوتا كامري 2020', facts);
    expect(conf.make).toBe('high');
    expect(conf.model).toBe('high');
  });

  it('marks inferred values as medium', () => {
    const facts = { make: 'تويوتا', model: 'كامري' };
    const conf = computeConfidence('كامري 2020', facts);
    expect(conf.make).toBe('medium'); // تويوتا not in raw
    expect(conf.model).toBe('high');
  });

  it('marks numeric parser keys as high', () => {
    const facts = { price: '15000', year: '2020', km: '87000' };
    const conf = computeConfidence('15 الف دينار', facts);
    expect(conf.price).toBe('high');
    expect(conf.year).toBe('high');
    expect(conf.km).toBe('high');
  });

  it('marks empty/missing values as low', () => {
    const facts = { color: '', fuel: undefined as unknown as string };
    const conf = computeConfidence('كامري 2020', facts);
    expect(conf.color).toBe('low');
    expect(conf.fuel).toBe('low');
  });

  it('marks booleans correctly', () => {
    const facts = { inspect: true, negotiable: false };
    const conf = computeConfidence('فحص كامل', facts);
    expect(conf.inspect).toBe('high');
    expect(conf.negotiable).toBe('low');
  });

  it('treats non-numeric parser values via substring rule', () => {
    const facts = { floor: 'روف' };
    const conf = computeConfidence('شقة روف في جدة', facts);
    expect(conf.floor).toBe('high');
  });

  it('returns all low when raw is empty', () => {
    const facts = { make: 'تويوتا', price: '15000' };
    const conf = computeConfidence('', facts);
    expect(conf.make).toBe('low');
    expect(conf.price).toBe('low');
  });
});
