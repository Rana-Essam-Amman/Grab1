import { describe, it, expect } from 'vitest';
import { levenshtein, fuzzyContains, fuzzyFindCanonical, weightedDistance } from '../fuzzyMatch';

describe('levenshtein', () => {
  it('returns 0 for identical strings', () => {
    expect(levenshtein('كامري', 'كامري', 2)).toBe(0);
  });
  it('returns 1 for one substitution (yaa variant)', () => {
    expect(levenshtein('كامري', 'كامرى', 2)).toBe(1);
  });
  it('returns 1 for one insertion', () => {
    expect(levenshtein('هيونداي', 'هونداي', 2)).toBe(1);
  });
  it('early-exits when over max', () => {
    expect(levenshtein('abcdef', 'xyz', 2)).toBe(3);
  });
  it('handles empty strings', () => {
    expect(levenshtein('', 'abc', 2)).toBe(3);
    expect(levenshtein('abc', '', 2)).toBe(3);
  });
});

describe('fuzzyContains', () => {
  it('exact match works via substring', () => {
    expect(fuzzyContains('سيارة كامري 2020', 'كامري')).toBe(true);
  });
  it('rejects needles shorter than 4 chars', () => {
    expect(fuzzyContains('سيارة كامري', 'كم')).toBe(false);
  });
  it('handles ya/yaa variant: كامرى vs كامري', () => {
    expect(fuzzyContains('سيارة كامرى 2020', 'كامري')).toBe(true);
  });
  it('handles haa/yaa variant: هيونداى vs هيونداي', () => {
    expect(fuzzyContains('سيارة هيونداى النترا', 'هيونداي')).toBe(true);
  });
  it('rejects far-away matches', () => {
    expect(fuzzyContains('سيارة تويوتا', 'كيا')).toBe(false);
  });
});

describe('fuzzyFindCanonical', () => {
  const dict = [
    { term: 'كامري', canonical: 'تويوتا' },
    { term: 'النترا', canonical: 'هيونداي' },
    { term: 'كورولا', canonical: 'تويوتا' },
  ];
  it('returns canonical on exact match', () => {
    expect(fuzzyFindCanonical('كامري 2020', dict)).toBe('تويوتا');
  });
  it('returns canonical on 1-edit variant', () => {
    expect(fuzzyFindCanonical('كامرى 2020', dict)).toBe('تويوتا');
  });
  it('returns undefined when no match', () => {
    expect(fuzzyFindCanonical('مازدا 3', dict)).toBeUndefined();
  });
});

describe('weightedDistance — Arabic pair costs', () => {
  it('يا substitution costs 0.15', () => {
    expect(weightedDistance('النترا', 'النترى')).toBeLessThanOrEqual(0.2);
  });
  it('كة substitution costs 0.15', () => {
    expect(weightedDistance('ساعة', 'ساعه')).toBeLessThanOrEqual(0.2);
  });
  it('قك substitution costs 0.3', () => {
    expect(weightedDistance('نايك', 'نايق')).toBeLessThanOrEqual(0.35);
  });
  it('one deletion costs 1', () => {
    expect(weightedDistance('رولكس', 'رولس')).toBeLessThanOrEqual(1.05);
  });
});

