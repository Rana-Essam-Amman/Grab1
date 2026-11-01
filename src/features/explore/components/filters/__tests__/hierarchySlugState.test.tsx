import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FiltersLocationBlock } from '../FiltersLocationBlock';
import { useUIStore } from '@/store/ui.slice';

vi.mock('@/data/locations/registry', () => ({
  getAllGovernorates: () => [
    { slug: 'amman', nameAr: 'العاصمة', nameEn: 'Amman', districts: [] },
  ],
  getAllDistricts: () => [
    { slug: 'marka', nameAr: 'ماركا', nameEn: 'Marka', governorateSlug: 'amman', villages: [] },
  ],
  getAllCamps: () => [],
}));

describe('hierarchy slug state', () => {
  beforeEach(() => {
    useUIStore.setState({
      browseGovernorateSlug: null,
      browseDistrictSlug: null,
      neighborhoodSlugFilter: null,
      neighborhoodFilter: null,
    });
  });

  it('stores the governorate slug after setBrowseLocation clears it', () => {
    const onCityChange = vi.fn(() => {
      useUIStore.setState({
        browseGovernorateSlug: null,
        browseDistrictSlug: null,
        neighborhoodSlugFilter: null,
      });
    });
    const onNeighborhoodChange = vi.fn();
    const onDraftChange = vi.fn();
    render(
      <FiltersLocationBlock
        isArabic={false}
        countryCode="JO"
        activeNeighborhood={null}
        onCityChange={onCityChange}
        onNeighborhoodChange={onNeighborhoodChange}
        onDraftChange={onDraftChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /^Amman$/ }));

    expect(onCityChange).toHaveBeenCalledWith('Amman', 'العاصمة');
    expect(onNeighborhoodChange).toHaveBeenCalledWith(null);
    expect(onDraftChange).toHaveBeenCalledWith(expect.objectContaining({ governorateSlug: 'amman', districtSlug: null }));
  });

  it('stores district slug without writing the district label as neighborhood', () => {
    render(
      <FiltersLocationBlock
        isArabic={false}
        countryCode="JO"
        activeNeighborhood={null}
        onCityChange={vi.fn()}
        onNeighborhoodChange={(value) => useUIStore.setState({ neighborhoodFilter: value })}
        onDraftChange={(draft) => useUIStore.setState({
          browseGovernorateSlug: draft.governorateSlug,
          browseDistrictSlug: draft.districtSlug,
          neighborhoodSlugFilter: draft.neighborhoodSlug,
        })}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /^Amman$/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Marka' }));

    expect(useUIStore.getState().browseGovernorateSlug).toBe('amman');
    expect(useUIStore.getState().browseDistrictSlug).toBe('marka');
    expect(useUIStore.getState().neighborhoodFilter).toBeNull();
    expect(useUIStore.getState().neighborhoodSlugFilter).toBeNull();
  });
});
