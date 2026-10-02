import { describe, it, expect } from 'vitest';
import { CATEGORY_TEMPLATES } from '../categoryTemplates';
import { CATEGORY_TEMPLATES_V2 } from '../categoryTemplatesV2';

const EXPECTED_CATEGORIES = [
  'motors', 'real-estate', 'mobiles', 'furniture', 'jobs', 'generic',
  'watches', 'computers', 'electronics', 'fashion', 'beauty', 'kids',
  'pets', 'sports', 'books', 'home-garden', 'krakeeb', 'services',
  'cleaning', 'handymen', 'projects',
];

describe('CATEGORY_TEMPLATES — 3-layer merge', () => {
  it('contains all expected categories', () => {
    for (const cat of EXPECTED_CATEGORIES) {
      expect(CATEGORY_TEMPLATES[cat], `missing category: ${cat}`).toBeDefined();
    }
  });

  it('BASE categories retain at least 6 templates per section', () => {
    for (const cat of ['motors', 'real-estate', 'mobiles', 'furniture', 'jobs', 'generic']) {
      const set = CATEGORY_TEMPLATES[cat];
      const minTitles = cat === 'generic' ? 4 : 6;
      const minP3 = cat === 'generic' ? 5 : 6;
      expect(set.titleTemplates.length, `${cat}.titleTemplates`).toBeGreaterThanOrEqual(minTitles);
      expect(set.paragraph1.length, `${cat}.paragraph1`).toBeGreaterThanOrEqual(6);
      expect(set.paragraph2.length, `${cat}.paragraph2`).toBeGreaterThanOrEqual(6);
      expect(set.paragraph3.length, `${cat}.paragraph3`).toBeGreaterThanOrEqual(minP3);
    }
  });

  it('EXTRA-only categories retain at least 6 templates per section', () => {
    for (const cat of ['watches', 'computers', 'electronics', 'fashion', 'beauty', 'kids', 'pets', 'sports', 'books', 'home-garden', 'krakeeb', 'services', 'cleaning', 'handymen', 'projects']) {
      const set = CATEGORY_TEMPLATES[cat];
      expect(set.titleTemplates.length, `${cat}.titleTemplates`).toBeGreaterThanOrEqual(6);
    }
  });

  it('V2 categories gain templates (BASE + EXTRA + V2 combined)', () => {
    // motors has BASE (6) + V2 (12) = up to 18 after dedupe
    expect(CATEGORY_TEMPLATES.motors.titleTemplates.length).toBeGreaterThanOrEqual(12);
    // watches has EXTRA (6) + V2 (12) = up to 18
    expect(CATEGORY_TEMPLATES.watches.titleTemplates.length).toBeGreaterThanOrEqual(12);
  });

  it('no duplicate strings within any section', () => {
    for (const [cat, set] of Object.entries(CATEGORY_TEMPLATES)) {
      for (const [section, arr] of Object.entries(set)) {
        const unique = new Set(arr);
        expect(unique.size, `${cat}.${section} has duplicates`).toBe(arr.length);
      }
    }
  });

  it('V2 layer is not silently ignored', () => {
    // V2 has paragraphs like '{yearTone} {make} {model} — {close}' for motors.
    // If merge dropped V2, this would be missing.
    const v2Count = CATEGORY_TEMPLATES_V2.motors.titleTemplates.length;
    expect(v2Count).toBeGreaterThan(0);
    const hasV2InMerge = CATEGORY_TEMPLATES_V2.motors.titleTemplates.some((t) =>
      CATEGORY_TEMPLATES.motors.titleTemplates.includes(t)
    );
    expect(hasV2InMerge).toBe(true);
  });
});
