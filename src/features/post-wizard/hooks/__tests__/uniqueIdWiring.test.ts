import { describe, it, expect } from 'vitest';
import { generateFromTemplates } from '@/ai/expert/templateEngine';

describe('uniqueId wiring — same facts, different users → different titles', () => {
  const facts = {
    make: 'تويوتا',
    model: 'كامري',
    year: '2020',
    fuel: 'هايبرد',
    color: 'أسود',
    price: '15000',
  };

  it('two different users + same facts → different titles', () => {
    const a = generateFromTemplates(facts, 'motors', 0, 'user-A:draft-1');
    const b = generateFromTemplates(facts, 'motors', 0, 'user-B:draft-1');
    expect(a?.title).not.toBe(b?.title);
  });

  it('same user + same draft → identical titles (deterministic)', () => {
    const a = generateFromTemplates(facts, 'motors', 0, 'user-A:draft-1');
    const b = generateFromTemplates(facts, 'motors', 0, 'user-A:draft-1');
    expect(a?.title).toBe(b?.title);
    expect(a?.paragraph1).toBe(b?.paragraph1);
  });

  it('guest fallback does not crash', () => {
    const out = generateFromTemplates(facts, 'motors', 0, 'guest:unknown');
    expect(out).not.toBeNull();
    expect(out!.title.length).toBeGreaterThan(5);
  });
});
