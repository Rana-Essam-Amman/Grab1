import { describe, expect, it } from 'vitest';
import { generate } from '../../v3/engine';

const drafts = [
  'فيلا للبيع في عبدون 4 غرف و3 حمام 300 متر حديقة',
  'أرض للبيع في شفا بدران 500 متر واجهة',
  'شاليه للإيجار في طريق المطار 3 غرف مسبح',
  'محل للبيع في العبدلي 80 متر واجهة',
];

describe('real-estate packs', () => {
  for (const draft of drafts) {
    it(draft.slice(0, 20), () => {
      const listing = generate({ userId: 'u1', draft });
      expect(listing.title.length).toBeGreaterThan(0);
      expect(listing.description).not.toContain('32.');
      if (draft.startsWith('أرض')) expect(listing.description).not.toContain('حمام');
    });
  }
});
