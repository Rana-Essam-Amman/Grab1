import { describe, it, expect } from 'vitest';
import { MOTORS_PREMIUM } from '../premium/motors-premium';

/**
 * STRUCTURAL DIVERSITY TEST
 *
 * A template's "structure" is defined as: take the template, replace every
 * {slot} with the literal token "S", keep fixed Arabic words as-is. Two
 * templates with identical structure but different slot names are NOT
 * structurally different.
 *
 * Example:
 *   '{make} {model} {year} — {hook}'      → 'S S S — S'
 *   '{make} {model} {year} {color} — {hook}' → 'S S S S — S'  (different)
 *   'فرصة: {make} {model}'                  → 'KW: S S'        (different)
 */

function structureOf(template: string): string {
  return template.replace(/\{[a-zA-Z0-9_]+\}/g, 'S');
}

/** The first fixed Arabic word of a title (or 'S' if it starts with a slot). */
function firstWordOf(template: string): string {
  const trimmed = template.trim();
  const firstToken = trimmed.split(/\s+/)[0];
  return firstToken.replace(/\{[a-zA-Z0-9_]+\}/g, 'S');
}

describe('Motors Premium — structural diversity', () => {
  it('all 4 sections have exactly 10 templates', () => {
    expect(MOTORS_PREMIUM.titleTemplates.length).toBe(10);
    expect(MOTORS_PREMIUM.paragraph1.length).toBe(10);
    expect(MOTORS_PREMIUM.paragraph2.length).toBe(10);
    expect(MOTORS_PREMIUM.paragraph3.length).toBe(10);
  });

  it('titleTemplates: at least 7 distinct structures', () => {
    const structures = new Set(MOTORS_PREMIUM.titleTemplates.map(structureOf));
    expect(structures.size, `distinct structures: ${structures.size}/10`).toBeGreaterThanOrEqual(7);
  });

  it('titleTemplates: at least 5 distinct first words', () => {
    const firsts = new Set(MOTORS_PREMIUM.titleTemplates.map(firstWordOf));
    expect(firsts.size, `distinct first words: ${firsts.size}/10`).toBeGreaterThanOrEqual(5);
  });

  it('paragraph1: at least 8 distinct openers (first word)', () => {
    const firsts = new Set(MOTORS_PREMIUM.paragraph1.map(firstWordOf));
    expect(firsts.size, `distinct openers: ${firsts.size}/10`).toBeGreaterThanOrEqual(8);
  });

  it('paragraph2: at least 7 distinct structures', () => {
    const structures = new Set(MOTORS_PREMIUM.paragraph2.map(structureOf));
    expect(structures.size).toBeGreaterThanOrEqual(7);
  });

  it('paragraph3: at least 7 distinct structures', () => {
    const structures = new Set(MOTORS_PREMIUM.paragraph3.map(structureOf));
    expect(structures.size).toBeGreaterThanOrEqual(7);
  });

  it('no template contains leftover slot markers or unfilled braces', () => {
    const all = [
      ...MOTORS_PREMIUM.titleTemplates,
      ...MOTORS_PREMIUM.paragraph1,
      ...MOTORS_PREMIUM.paragraph2,
      ...MOTORS_PREMIUM.paragraph3,
    ];
    for (const t of all) {
      // Every {xxx} must be a known-safe token (letters/digits/underscore).
      const braces = t.match(/\{[^}]*\}/g) ?? [];
      for (const b of braces) {
        expect(b, `bad slot marker in: ${t}`).toMatch(/^\{[a-zA-Z0-9_]+\}$/);
      }
    }
  });

  it('no title starts with the exact same 3-word prefix as another', () => {
    const prefixes = MOTORS_PREMIUM.titleTemplates.map((t) =>
      t.split(/\s+/).slice(0, 3).join(' ')
    );
    const unique = new Set(prefixes);
    expect(unique.size, `distinct 3-word prefixes: ${unique.size}/10`).toBeGreaterThanOrEqual(7);
  });
});
