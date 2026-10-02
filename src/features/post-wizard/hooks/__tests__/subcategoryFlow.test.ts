import { describe, it, expect } from 'vitest';
import { matchCategory } from '@/ai/categoryMatch';
import { composeListing } from '@/ai/expert/composer';
import { extractFacts } from '@/ai/listingCopyAgent';

describe('Subcategory flow — premium tier activation', () => {
  it('matchCategory uses chosenSub when provided', () => {
    const r = matchCategory({
      chosenCategory: 'real-estate',
      chosenSub: 'for-sale',
      note: 'شقة 150 م',
    });
    expect(r.effectiveSub).toBe('for-sale');
  });

  it('composeListing uses premium real-estate when sub=for-sale', () => {
    const facts = {
      area: '150',
      rooms: '3',
      bathrooms: '3',
      price: '50000',
      city: 'عمان',
    };
    const result = composeListing(facts, 'real-estate', 0, 'user-A:draft-1', 'for-sale');
    expect(result).not.toBeNull();
    // Premium title should NOT be "للبيع" and should reference area/rooms/price
    expect(result!.title).not.toBe('للبيع');
    expect(result!.title.length).toBeGreaterThan(10);
  });

  it('real production input composes non-null with for-sale', () => {
    const raw = 'شقة 150 م في طريق المطار مكونه من 3 غرف نوم 3 حمامات';
    const facts = extractFacts(raw);
    const result = composeListing(facts, 'real-estate', 0, 'user-A:draft-1', 'for-sale');
    expect(result).not.toBeNull();
    expect(result!.title).not.toBe('للبيع');
    // Title should reference real facts
    expect(result!.title).toMatch(/150|3/);
  });

  it('different subcategories give different outputs (isolation)', () => {
    const facts = { area: '500', price: '120000' };
    const lands = composeListing(facts, 'real-estate', 0, 'user-A:draft-1', 'lands');
    const sale = composeListing({ ...facts, rooms: '3' }, 'real-estate', 0, 'user-A:draft-1', 'for-sale');
    expect(lands?.title).not.toBe(sale?.title);
    // lands should not mention rooms
    expect(lands?.title).not.toContain('غرف');
  });
});
