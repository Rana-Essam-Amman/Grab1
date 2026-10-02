import { describe, it, expect } from 'vitest';
import { generateFromTemplates } from '../templateEngine';

describe('Real-estate Premium tier', () => {
  const apartmentFacts = {
    area: '120',
    rooms: '3',
    bathrooms: '2',
    floor: '2',
    price: '80000',
    city: 'عمان',
  };

  const landFacts = {
    area: '500',
    price: '120000',
    city: 'عمان',
  };

  it('lands subcategory does not use {rooms} or {floor}', () => {
    const out = generateFromTemplates(landFacts, 'real-estate', 0, 'user-A:draft-1', 'lands');
    expect(out).not.toBeNull();
    // No leftover slots
    expect(out!.title).not.toMatch(/\{[a-zA-Z]+\}/);
    expect(out!.paragraph1).not.toMatch(/\{[a-zA-Z]+\}/);
    // Lands should not mention rooms/floor
    expect(out!.title).not.toContain('غرف');
  });

  it('for-sale uses {rooms} + {floor} when available', () => {
    const out = generateFromTemplates(apartmentFacts, 'real-estate', 0, 'user-A:draft-1', 'for-sale');
    expect(out).not.toBeNull();
    expect(out!.title).toMatch(/120|3|2/);
  });

  it('different subcategories → different titles', () => {
    const land = generateFromTemplates(landFacts, 'real-estate', 0, 'user-X:draft-1', 'lands');
    const apt = generateFromTemplates(apartmentFacts, 'real-estate', 0, 'user-X:draft-1', 'for-sale');
    expect(land?.title).not.toBe(apt?.title);
  });

  it('falls back gracefully when subcategory is empty', () => {
    const out = generateFromTemplates(apartmentFacts, 'real-estate', 0, 'user-A:draft-1', '');
    // Should fall through to existing pool — must still succeed.
    expect(out).not.toBeNull();
  });

  it('20 users same facts + same subcategory → varied titles', () => {
    const titles = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const out = generateFromTemplates(apartmentFacts, 'real-estate', 0, `user-${i}:draft-1`, 'for-sale');
      if (out) titles.add(out.title);
    }
    expect(titles.size, `unique: ${titles.size}/20`).toBeGreaterThanOrEqual(4);
  });
});
