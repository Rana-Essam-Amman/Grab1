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

  it('excludes other-subcategory templates from the pool (wildcard bug regression)', () => {
    // For 'phones' subcategory, template pool MUST NOT include the numbers-only templates.
    // Regression check for wildcard fallback bug fixed in commit D.
    const facts = {
      make: 'Apple',
      model: 'iPhone 15',
      color: 'ذهبي',
      condition: 'مستعمل',
      price: '400',
    };
    const out = composeListing(facts, 'mobiles', 0, 'u:1', 'phones');
    expect(out).not.toBeNull();
    // Should NOT contain phrases unique to the numbers subcategory
    expect(out!.description).not.toContain('رقم مميز للبيع');
    expect(out!.description).not.toContain('نقل ملكية');
    expect(out!.description).not.toContain('لا وسيط');
    expect(out!.description).not.toContain('نقل الرقم');
  });

  it('sub pools raise entropy — 20 seeds produce ≥ 15 unique titles (commit H)', () => {
    const facts = extractFacts('ايفون 15 مستعمل للبيع بسعر 40 دينار لون ذهبي 256 جيجا ضمان سنة نسخة وكيل');
    const titles = new Set<string>();
    const descs = new Set<string>();
    for (let s = 0; s < 20; s++) {
      const out = composeListing(facts, 'mobiles', s, 'u:1', 'phones');
      if (out) {
        titles.add(out.title);
        descs.add(out.description);
      }
    }
    expect(titles.size).toBeGreaterThanOrEqual(15);
    expect(descs.size).toBeGreaterThanOrEqual(18);
  });
});
