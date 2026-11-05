import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { JordanLocationPicker } from '../JordanLocationPicker';
import { searchJordanLocations } from '../../helpers/jordanLocationIndex';

describe('JordanLocationPicker (OpenSooq-Style)', () => {
  it('1. Direct search for a canonical Amman locality (Tabarbour)', () => {
    const results = searchJordanLocations('طبربور', true);
    expect(results.length).toBeGreaterThan(0);
    const item = results[0];
    expect(item.nameAr).toBe('حي طبربور');
    expect(item.citySlug).toBe('amman');
    expect(item.districtSlug).toBe('sahab');
    expect(item.neighborhoodSlug).toBe('hayy-tabarbawr');
    expect(item.parentPathAr).toBe('عمان');
  });

  it('2. Direct search for a canonical Zarqa locality (Hayy Ma\'sum)', () => {
    const results = searchJordanLocations('معصوم', true);
    expect(results.length).toBeGreaterThan(0);
    const item = results[0];
    expect(item.nameAr).toBe('حي معصوم');
    expect(item.citySlug).toBe('zarqa');
    expect(item.districtSlug).toBe('zarqa-qasabah');
    expect(item.neighborhoodSlug).toBe('hayy-ma-sum');
    expect(item.parentPathAr).toBe('الزرقاء');
  });

  it('3. Arabic and English search parity', () => {
    const arResults = searchJordanLocations('وادي السير', true);
    const enResults = searchJordanLocations('Wadi as Sir', false);
    expect(arResults.some((r) => r.neighborhoodSlug === 'wadi-as-sir')).toBe(true);
    expect(enResults.some((r) => r.neighborhoodSlug === 'wadi-as-sir')).toBe(true);
  });

  it('4. Correct parent path in search results', () => {
    const results = searchJordanLocations('عبدون', true);
    const abdun = results.find((r) => r.neighborhoodSlug === 'abdun');
    expect(abdun).toBeDefined();
    expect(abdun?.parentPathAr).toBe('عمان');
  });

  it('5. Correct canonical slugs after selection in UI component', () => {
    const onSelect = vi.fn();
    const onClear = vi.fn();

    render(
      <JordanLocationPicker
        isArabic={true}
        selectedCity=""
        selectedNeighborhood=""
        onSelect={onSelect}
        onClear={onClear}
      />
    );

    const input = screen.getByTestId('jordan-location-search-input');
    fireEvent.change(input, { target: { value: 'طبربور' } });

    const itemBtn = screen.getByTestId('jordan-loc-item-vill-amman-sahab-hayy-tabarbawr');
    expect(itemBtn).toBeInTheDocument();
    fireEvent.click(itemBtn);

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        citySlug: 'amman',
        districtSlug: 'sahab',
        neighborhoodSlug: 'hayy-tabarbawr',
      })
    );
  });

  it('6. Ambiguous duplicate names display full parent paths and distinct slugs', () => {
    const results = searchJordanLocations('وادي السير', true);
    // There is district wadi-essier and village wadi-as-sir
    const distMatch = results.find((r) => r.type === 'district');
    const villMatch = results.find((r) => r.type === 'village' && r.neighborhoodSlug === 'wadi-as-sir');

    expect(distMatch).toBeDefined();
    expect(villMatch).toBeDefined();
    expect(distMatch?.parentPathAr).toBe('عمان');
    expect(villMatch?.parentPathAr).toBe('عمان');
    expect(distMatch?.districtSlug).not.toBe(villMatch?.districtSlug);
  });

  it('7. Clearing selection clears displayed pill and triggers onClear', () => {
    const onSelect = vi.fn();
    const onClear = vi.fn();

    render(
      <JordanLocationPicker
        isArabic={true}
        selectedCity="عمان"
        selectedNeighborhood="حي طبربور"
        onSelect={onSelect}
        onClear={onClear}
      />
    );

    const pill = screen.getByTestId('jordan-selected-pill');
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveTextContent('حي طبربور (عمان)');

    const clearBtn = screen.getByRole('button', { name: /مسح الموقع/i });
    fireEvent.click(clearBtn);

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
