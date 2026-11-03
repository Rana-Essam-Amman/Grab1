import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';
import { LocationHierarchyFilter } from '../LocationHierarchyFilter';
import { searchJordanLocations } from '@/features/post-wizard/helpers/jordanLocationIndex';
import { getAllGovernorates } from '@/data/locations/registry';

describe('ExploreFilterIntegration', () => {
  it('Search → select Tabarbour → draft → Apply → Reset', () => {
    const amman = getAllGovernorates('JO').find((g) => g.slug === 'amman')!;
    const tabarbour = searchJordanLocations('طبربور', true).find((r) => r.neighborhoodSlug === 'hayy-tabarbawr')!;
    expect(tabarbour.citySlug).toBe('amman');
    expect(tabarbour.districtSlug).toBe('sahab');
    expect(tabarbour.cityAr).toBe(amman.nameAr);

    const onSelect = vi.fn();
    const onLocationChange = vi.fn();
    const applied: any[] = [];

    function Wrapper() {
      const [draft, setDraft] = useState<any>(null);
      const [appliedFilters, setAppliedFilters] = useState<any>(null);
      return (
        <>
          <LocationHierarchyFilter
            countryCode="JO"
            isArabic={true}
            activeNeighborhood={null}
            onSelect={(label) => {
              onSelect(label);
              setDraft((d: any) => ({ ...d, neighborhood: label }));
            }}
            onLocationChange={(sel) => {
              onLocationChange(sel);
              setDraft(sel);
            }}
          />
          <button onClick={() => setAppliedFilters(draft)} data-testid="apply">Apply</button>
          <button onClick={() => { setDraft(null); setAppliedFilters(null); }} data-testid="reset">Reset</button>
          <div data-testid="draft">{JSON.stringify(draft)}</div>
          <div data-testid="applied">{JSON.stringify(appliedFilters)}</div>
        </>
      );
    }

    render(<Wrapper />);

    const search = screen.getByTestId('geo-hierarchy-search');
    fireEvent.change(search, { target: { value: 'طبربور' } });

    const item = screen.getByTestId('jordan-filter-result-vill-amman-sahab-hayy-tabarbawr');
    fireEvent.click(item);

    expect(onLocationChange).toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith('حي طبربور');

    const draftEl = screen.getByTestId('draft');
    expect(draftEl.textContent).toContain('amman');
    expect(draftEl.textContent).toContain('sahab');
    expect(draftEl.textContent).toContain('hayy-tabarbawr');
    expect(draftEl.textContent).toContain(amman.nameAr);

    // Applied unchanged before Apply
    expect(screen.getByTestId('applied').textContent).toBe('null');

    fireEvent.click(screen.getByTestId('apply'));
    expect(screen.getByTestId('applied').textContent).toContain('hayy-tabarbawr');

    fireEvent.click(screen.getByTestId('reset'));
    expect(screen.getByTestId('draft').textContent).toBe('null');
    expect(screen.getByTestId('applied').textContent).toBe('null');
  });
});
