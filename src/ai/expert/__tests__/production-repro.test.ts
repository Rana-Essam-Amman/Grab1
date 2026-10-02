import { describe, it, expect } from 'vitest';
import { extractFacts } from '@/ai/listingCopyAgent';
import { composeListing } from '@/ai/expert/composer';

/**
 * Regression test — real production input that failed.
 * Input: user typed "شقة 120 م ..." but extractArea returned undefined and
 * composeListing returned null → fallback showed title "للبيع".
 */
describe('Production repro — real-estate', () => {
  const raw = 'شقة 120 م في طريق المطار مكونه من 3 غرف نوم 3 حمامات';

  it('extracts area as 120 (standalone م)', () => {
    const facts = extractFacts(raw);
    expect(facts.area).toBe('120');
  });

  it('extracts rooms as 3', () => {
    const facts = extractFacts(raw);
    expect(facts.rooms).toBe('3');
  });

  it('extracts bathrooms as 3', () => {
    const facts = extractFacts(raw);
    expect(facts.bathrooms).toBe('3');
  });

  it('composeListing returns non-null with real-estate', () => {
    const facts = extractFacts(raw);
    const result = composeListing(facts, 'real-estate', 0, 'user-A:draft-1', 'for-sale');
    expect(result, 'composeListing must return output, not null').not.toBeNull();
    expect(result!.title).not.toBe('للبيع');
    expect(result!.title.length).toBeGreaterThan(15);
  });

  it('composeListing works even without subcategory', () => {
    const facts = extractFacts(raw);
    const result = composeListing(facts, 'real-estate', 0, 'user-A:draft-1', '');
    expect(result).not.toBeNull();
    expect(result!.title).not.toBe('للبيع');
  });

  it('title mentions area or rooms (uses real facts)', () => {
    const facts = extractFacts(raw);
    const result = composeListing(facts, 'real-estate', 0, 'user-A:draft-1', 'for-sale');
    expect(result!.title).toMatch(/120|3/);
  });
});
