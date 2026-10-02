import { describe, it, expect } from 'vitest';
import { composeListing } from '../composer';
import { extractFacts } from '../../listingCopyAgent';

describe('mobiles structured layout', () => {
  const rawPhone = 'ايفون 15 مستعمل للبيع بسعر 40 دينار لون ذهبي';

  it('produces structured output for phones', () => {
    const facts = extractFacts(rawPhone);
    const out = composeListing(facts, 'mobiles', 0, 'u:1', 'phones');
    expect(out).not.toBeNull();
    expect(out!.description).toContain('🔹 المواصفات:');
    expect(out!.description).toContain('🔹 أبرز المميزات:');
    expect(out!.description).not.toMatch(/\{[a-zA-Z]+\}/);
  });

  it('produces structured output for numbers subcategory', () => {
    const facts = { price: '2000' };
    const out = composeListing(facts, 'mobiles', 0, 'u:1', 'numbers');
    expect(out).not.toBeNull();
    expect(out!.description).toContain('🔹 المواصفات:');
  });

  it('different seeds produce different descriptions', () => {
    const facts = extractFacts(rawPhone);
    const descs = new Set<string>();
    for (let s = 0; s < 8; s++) {
      const out = composeListing(facts, 'mobiles', s, 'u:1', 'phones');
      if (out) descs.add(out.description);
    }
    expect(descs.size).toBeGreaterThanOrEqual(6);
  });

  it('is deterministic for same seed + uniqueId', () => {
    const facts = extractFacts(rawPhone);
    const a = composeListing(facts, 'mobiles', 0, 'u:1', 'phones');
    const b = composeListing(facts, 'mobiles', 0, 'u:1', 'phones');
    expect(a?.description).toBe(b?.description);
  });
});
