import { describe, it, expect } from 'vitest';
import { stemArabic, stemText } from '../arabicStemmer';
import { normalizeArabic } from '@/data/arabicNormalize';

const stem = (s: string) => stemArabic(normalizeArabic(s));

describe('stemArabic', () => {
  it('strips definite article ال + plural ات', () => {
    expect(stem('السيارات')).toBe('سيار');
    expect(stem('السيارة')).toBe('سيار');
    expect(stem('سيارات')).toBe('سيار');
    expect(stem('سيارة')).toBe('سيار');
  });

  it('strips conjunction + article وال', () => {
    expect(stem('والسيارات')).toBe('سيار');
  });

  it('strips preposition + article بال', () => {
    expect(stem('بالعقارات')).toBe('عقار');
  });

  it('strips plural ين و ون', () => {
    expect(stem('معلمين')).toBe('معلم');
    expect(stem('مهندسون')).toBe('مهندس');
  });

  it('does not over-strip short words', () => {
    expect(stem('بيت')).toBe('بيت');
    expect(stem('الله')).toBe('الله');
    expect(stem('يد')).toBe('يد');
  });

  it('stemText applies per word', () => {
    expect(stemText('شقة في عبدون')).toBe('شقه في عبدون');
    expect(stemText('والبيوت للبيع')).toBe('بيوت للبيع');
  });
});
