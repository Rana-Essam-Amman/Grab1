import { describe, it, expect } from 'vitest';
import { generateFromTemplates } from '../templateEngine';

describe('Premium tier fallback', () => {
  it('real-estate for-sale with rooms missing still uses premium', () => {
    // User omitted "rooms" from the input.
    const facts = {
      area: '150',
      bathrooms: '3',
      floor: '1',
      price: '50000',
    };
    const out = generateFromTemplates(facts, 'real-estate', 0, 'user-A:draft-1', 'for-sale');
    expect(out, 'should not return null').not.toBeNull();
    // Title must reference area or price (both available)
    expect(out!.title).toMatch(/150|50000/);
    // No dangling slot markers
    expect(out!.title).not.toMatch(/\{[a-zA-Z]+\}/);
  });

  it('real-estate for-sale with rooms present still works', () => {
    const facts = {
      area: '150',
      rooms: '3',
      bathrooms: '3',
      floor: '1',
      price: '50000',
    };
    const out = generateFromTemplates(facts, 'real-estate', 0, 'user-A:draft-1', 'for-sale');
    expect(out).not.toBeNull();
    expect(out!.title).toMatch(/150|3|50000/);
  });

  it('lands works with only area + price', () => {
    const facts = { area: '500', price: '120000' };
    const out = generateFromTemplates(facts, 'real-estate', 0, 'user-A:draft-1', 'lands');
    expect(out).not.toBeNull();
    expect(out!.title).not.toContain('غرف');
  });

  it('paragraph3 always fills when price is present', () => {
    const facts = { area: '150', price: '50000' };
    const out = generateFromTemplates(facts, 'real-estate', 0, 'user-A:draft-1', 'for-sale');
    expect(out).not.toBeNull();
    expect(out!.paragraph3).toContain('50000');
  });
});
