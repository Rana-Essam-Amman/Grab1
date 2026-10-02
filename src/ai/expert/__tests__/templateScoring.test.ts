import { describe, it, expect } from 'vitest';
import { generateFromTemplates } from '../templateEngine';

describe('Template scoring — prefers richer fact usage', () => {
  const facts = {
    make: 'تويوتا',
    model: 'كامري',
    year: '2020',
    fuel: 'هايبرد',
    color: 'أسود',
    price: '15000',
  };

  it('motors title includes year when year is available', () => {
    // Run 20 times with different seeds to catch random skips.
    for (let seed = 0; seed < 20; seed++) {
      const out = generateFromTemplates(facts, 'motors', seed);
      expect(out, `seed=${seed}`).not.toBeNull();
      // Year must appear in title because we have a template that uses it
      // AND year is available in facts.
      expect(out!.title, `seed=${seed} title="${out!.title}"`).toContain('2020');
    }
  });

  it('motors title includes make and model always', () => {
    for (let seed = 0; seed < 10; seed++) {
      const out = generateFromTemplates(facts, 'motors', seed);
      expect(out!.title).toContain('تويوتا');
      expect(out!.title).toContain('كامري');
    }
  });

  it('produces variety across seeds (different titles)', () => {
    const titles = new Set<string>();
    for (let seed = 0; seed < 20; seed++) {
      const out = generateFromTemplates(facts, 'motors', seed);
      if (out) titles.add(out.title);
    }
    // Must produce at least 2 distinct titles across 20 seeds.
    expect(titles.size).toBeGreaterThanOrEqual(2);
  });

  it('paragraph1 uses year and fuel when available', () => {
    // Across multiple seeds, at least one paragraph must mention year AND
    // we never produce a paragraph that omits both.
    let atLeastOneWithYear = false;
    let atLeastOneWithFuel = false;
    for (let seed = 0; seed < 20; seed++) {
      const out = generateFromTemplates(facts, 'motors', seed);
      if (out?.paragraph1.includes('2020')) atLeastOneWithYear = true;
      if (out?.paragraph1.includes('هايبرد')) atLeastOneWithFuel = true;
    }
    expect(atLeastOneWithYear).toBe(true);
    expect(atLeastOneWithFuel).toBe(true);
  });

  it('produces a listing even when price is missing', () => {
    const noPrice = {
      make: 'تويوتا',
      model: 'كامري',
      year: '2020',
      fuel: 'هايبرد',
      color: 'رمادي',
    };
    const out = generateFromTemplates(noPrice, 'motors', 0, 'user-A:draft-1');
    expect(out, 'should not return null when price missing').not.toBeNull();
    expect(out!.title).toContain('تويوتا');
    expect(out!.title).toContain('كامري');
    expect(out!.paragraph3).toContain('السعر عند التواصل');
    expect(out!.paragraph3).not.toMatch(/\{price\}/);
  });

  it('handles missing facts gracefully (no crash, no empty slots)', () => {
    const sparse = { make: 'تويوتا', model: 'كامري', price: '15000' };
    const out = generateFromTemplates(sparse, 'generic', 0);
    expect(out).not.toBeNull();
    // No leftover {slot} markers
    expect(out!.title).not.toMatch(/\{[a-zA-Z]+\}/);
    expect(out!.paragraph1).not.toMatch(/\{[a-zA-Z]+\}/);
  });
});
