import { describe, expect, it } from 'vitest';
import { generate } from '../../v3/engine';

describe('mobiles packs', () => {
  it('renders a phone draft', () => {
    const listing = generate({ userId: 'u1', draft: 'ايفون للبيع في خلدا' });
    expect(listing.title).toContain('جوال');
    expect(listing.description).not.toMatch(/\d+\.\d+/);
  });
});
