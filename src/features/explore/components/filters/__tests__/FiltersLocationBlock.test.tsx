import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FiltersLocationBlock } from '../FiltersLocationBlock';

vi.mock('@/data/locations/registry', () => ({
  getAllGovernorates: () => [{ slug: 'amman', nameAr: 'العاصمة', nameEn: 'Amman', districts: [] }],
  getAllDistricts: () => [],
  getAllCamps: () => [],
}));

describe('FiltersLocationBlock', () => {
  it('renders only the hierarchy location UI', () => {
    render(
      <FiltersLocationBlock
        isArabic={false}
        countryCode="JO"
        activeNeighborhood={null}
        onCityChange={vi.fn()}
        onNeighborhoodChange={vi.fn()}
      />
    );
    expect(screen.getByTestId('location-hierarchy-filter')).toBeInTheDocument();
    expect(screen.queryByTestId('location-filter-section')).not.toBeInTheDocument();
  });
});
