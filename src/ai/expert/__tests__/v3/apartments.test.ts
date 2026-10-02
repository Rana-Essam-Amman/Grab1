import { describe, expect, it } from 'vitest';
import { generate } from '../../v3/engine';
import { DRAFTS } from '../../v3/drafts';

const BANNED = ['كما هي موصوفة', 'تصميم عصري', 'فرصة مميزة', '{'];

describe('apartments pack', () => {
  for (const draft of DRAFTS) {
    it(`renders ${draft.slice(0, 24)}`, () => {
      const listing = generate({ userId: 'founder', draft });
      expect(listing.title.length).toBeGreaterThan(0);
      expect(listing.description.length).toBeGreaterThan(0);
      expect(listing.description.startsWith(listing.title)).toBe(false);
      for (const phrase of BANNED) expect(listing.description).not.toContain(phrase);
      const numbers = `${listing.title} ${listing.description}`.match(/\d+/g) || [];
      for (const number of numbers) expect(draft).toContain(number);
    });
  }

  it('varies the plan across three users', () => {
    const plans = ['u1', 'u2', 'u3'].map((userId) => generate({ userId, draft: DRAFTS[0] }).planId);
    expect(new Set(plans).size).toBeGreaterThan(1);
  });

  it('repeats the same output for the same user', () => {
    const draft = DRAFTS[0];
    expect(generate({ userId: 'u1', draft })).toEqual(generate({ userId: 'u1', draft }));
  });

  it('resolves Shafa Badran coordinates', () => {
    const listing = generate({ userId: 'u1', draft: DRAFTS[0] });
    expect(listing.facts.lat).toBeCloseTo(32.0066);
    expect(listing.facts.lng).toBeCloseTo(35.9038);
  });
});
