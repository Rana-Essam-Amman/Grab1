import { describe, it, expect } from 'vitest';
import { generateFromTemplates } from '../templateEngine';

describe('Seed variety — cross-user uniqueness', () => {
  const facts = {
    make: 'تويوتا',
    model: 'كامري',
    year: '2020',
    fuel: 'هايبرد',
    color: 'أسود',
    price: '15000',
  };

  it('different users with same facts → produces variety within top tier', () => {
    const titles = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const out = generateFromTemplates(facts, 'motors', 0, `user-${i}:draft-1`);
      if (out) titles.add(out.title);
    }
    // Since there are exactly 3 max-scoring title templates for motors with these facts,
    // we expect the deterministic variety picker to hit at least 2 of them.
    expect(titles.size).toBeGreaterThanOrEqual(2);
  });

  it('same user + same draft + same facts → identical output', () => {
    const a = generateFromTemplates(facts, 'motors', 0, 'user-A:draft-1');
    const b = generateFromTemplates(facts, 'motors', 0, 'user-A:draft-1');
    expect(a?.title).toBe(b?.title);
    expect(a?.paragraph1).toBe(b?.paragraph1);
    expect(a?.paragraph2).toBe(b?.paragraph2);
  });

  it('different uniqueIds can produce different titles', () => {
    const titles = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const out = generateFromTemplates(facts, 'motors', 0, `user-A:draft-${i}`);
      if (out) titles.add(out.title);
    }
    expect(titles.size).toBeGreaterThanOrEqual(2);
  });

  it('variantSeed changes output for same uniqueId', () => {
    const a = generateFromTemplates(facts, 'motors', 0, 'user-A:draft-1');
    const b = generateFromTemplates(facts, 'motors', 1, 'user-A:draft-1');
    expect(a?.title).not.toBe(b?.title);
  });

  it('backward compatible: no uniqueId behaves like facts-only seed', () => {
    const a = generateFromTemplates(facts, 'motors', 0);
    const b = generateFromTemplates(facts, 'motors', 0, '');
    expect(a?.title).toBe(b?.title);
  });
});
