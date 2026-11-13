import { describe, it, expect } from 'vitest';
import { buildMissingRequiredLabels } from '../missingRequiredLabels';

describe('buildMissingRequiredLabels', () => {
  it('includes translated title label when title is empty', () => {
    expect(buildMissingRequiredLabels('', '5000', 'Listing Title', 'Price', [])).toEqual(['Listing Title']);
  });

  it('includes translated price label when price is empty', () => {
    expect(buildMissingRequiredLabels('My Car', '', 'Listing Title', 'Price', [])).toEqual(['Price']);
  });

  it('appends missing attribute labels after title and price', () => {
    expect(buildMissingRequiredLabels('', '', 'Listing Title', 'Price', ['Year', 'Mileage'])).toEqual([
      'Listing Title',
      'Price',
      'Year',
      'Mileage',
    ]);
  });

  it('returns only attribute labels when title and price are present', () => {
    expect(buildMissingRequiredLabels('My Car', '5000', 'Listing Title', 'Price', ['Year'])).toEqual(['Year']);
  });

  it('returns an empty array when nothing is missing', () => {
    expect(buildMissingRequiredLabels('My Car', '5000', 'Listing Title', 'Price', [])).toEqual([]);
  });

  it('uses the Arabic labels that are passed in', () => {
    expect(buildMissingRequiredLabels('', '', 'عنوان الإعلان', 'السعر', [])).toEqual(['عنوان الإعلان', 'السعر']);
  });
});
