import { describe, it, expect } from 'vitest';
import { matchCategory } from '../categoryMatch';

describe('matchCategory', () => {
  it('returns empty effective when neither hint nor choice exists', () => {
    const result = matchCategory({ chosenCategory: '', chosenSub: '', note: 'xyz random' });
    expect(result.effectiveCategory).toBe('');
    expect(result.effectiveSub).toBe('');
    expect(result.mismatch).toBe(false);
  });

  it('uses the hint when user has no preference (the fix)', () => {
    const result = matchCategory({ chosenCategory: '', chosenSub: '', note: 'تويوتا كامري للبيع' });
    expect(result.effectiveCategory).toBe('motors');
    expect(result.effectiveSub).toBe('cars');
    expect(result.mismatch).toBe(false);
    expect(result.suggested?.categorySlug).toBe('motors');
  });

  it('returns no mismatch when user chose same as hint', () => {
    const result = matchCategory({
      chosenCategory: 'motors',
      chosenSub: 'cars',
      note: 'تويوتا كامري للبيع',
    });
    expect(result.effectiveCategory).toBe('motors');
    expect(result.mismatch).toBe(false);
  });

  it('in confirm policy, keeps user choice when it differs from hint', () => {
    const result = matchCategory({
      chosenCategory: 'real-estate',
      chosenSub: 'for-sale',
      note: 'تويوتا كامري للبيع',
    });
    expect(result.effectiveCategory).toBe('real-estate');
    expect(result.effectiveSub).toBe('for-sale');
    expect(result.mismatch).toBe(true);
    expect(result.suggested?.categorySlug).toBe('motors');
  });

  it('handles real-estate hint', () => {
    const result = matchCategory({ chosenCategory: '', chosenSub: '', note: 'شقة 110 متر بعمان' });
    expect(result.effectiveCategory).toBe('real-estate');
    expect(result.effectiveSub).toBe('for-sale');
  });

  it('handles mobiles hint', () => {
    const result = matchCategory({ chosenCategory: '', chosenSub: '', note: 'ايفون 14 برو ماكس نظيف' });
    expect(result.effectiveCategory).toBe('mobiles');
    expect(result.effectiveSub).toBe('phones');
  });

  it('handles English input', () => {
    const result = matchCategory({ chosenCategory: '', chosenSub: '', note: 'Toyota Camry for sale' });
    expect(result.effectiveCategory).toBe('motors');
    expect(result.effectiveSub).toBe('cars');
  });

  it('matches madda variant (آيفون) via normalization', () => {
    const a = matchCategory({ chosenCategory: '', chosenSub: '', note: 'آيفون 15 نظيف' });
    const b = matchCategory({ chosenCategory: '', chosenSub: '', note: 'ايفون 15 نظيف' });
    expect(a.effectiveCategory).toBe('mobiles');
    expect(b.effectiveCategory).toBe('mobiles');
    expect(a.effectiveSub).toBe('phones');
    expect(b.effectiveSub).toBe('phones');
  });

  it('matches yaa/taa-marbuta variants', () => {
    const a = matchCategory({ chosenCategory: '', chosenSub: '', note: 'شقه للبيع' });
    const b = matchCategory({ chosenCategory: '', chosenSub: '', note: 'شقة للبيع' });
    expect(a.effectiveCategory).toBe('real-estate');
    expect(b.effectiveCategory).toBe('real-estate');
  });
});
