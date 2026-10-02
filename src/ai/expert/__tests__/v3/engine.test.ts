import { describe, expect, it } from 'vitest';
import { generate } from '../v3/engine';
import { resolveLocation } from '../v3/locations';

const draft = 'شقة للبيع في شفا بدران مساحه 120م مكونه من 3 نوم و 3 حمامات و بلكونه بسعر 50 الف';

describe('listing engine v3', () => {
  it('keeps the same listing for the same user and draft', () => {
    const a = generate({ userId: 'u1', draft, categorySlug: 'real-estate', subcategorySlug: 'for-sale' });
    const b = generate({ userId: 'u1', draft, categorySlug: 'real-estate', subcategorySlug: 'for-sale' });
    expect(a).toEqual(b);
  });

  it('changes the plan across users without inventing facts', () => {
    const listings = ['u1', 'u2', 'u3'].map((userId) =>
      generate({ userId, draft, categorySlug: 'real-estate', subcategorySlug: 'for-sale' })
    );
    expect(new Set(listings.map((item) => item.planId)).size).toBeGreaterThan(1);
    for (const item of listings) {
      expect(item.title).toBe('شقة للبيع في شفا بدران');
      expect(item.description).not.toContain('تصميم عصري');
      expect(item.description).not.toContain('كما هي موصوفة');
      expect(item.facts.lat).toBeCloseTo(32.0066);
    }
  });

  it('resolves a neighborhood to coordinates', () => {
    expect(resolveLocation('شقة في أبو نصير')?.district).toBe('أبو نصير');
  });
});
