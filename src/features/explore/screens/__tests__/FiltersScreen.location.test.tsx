import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FiltersScreen } from '../FiltersScreen';

const setBrowseLocation = vi.fn();

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    isArabic: false,
    goBack: vi.fn(),
    navigateTo: vi.fn(),
    setActiveTab: vi.fn(),
    categoryFilter: null,
    subcategoryFilter: null,
    sortBy: 'newest',
    minPriceFilter: null,
    maxPriceFilter: null,
    neighborhoodFilter: null,
    attrsFilter: {},
    setCategoryFilter: vi.fn(),
    setSubcategoryFilter: vi.fn(),
    setSortBy: vi.fn(),
    setMinPriceFilter: vi.fn(),
    setMaxPriceFilter: vi.fn(),
    setNeighborhoodFilter: vi.fn(),
    setAttrsFilter: vi.fn(),
    activeCurrency: 'JD',
    browseCountryCode: 'JO',
    setBrowseLocation,
  }),
}));

vi.mock('@/hooks/useListings', () => ({
  useListings: () => ({ listings: [] }),
}));

vi.mock('../../hooks/useShareFilters', () => ({
  useShareFilters: () => vi.fn(),
}));

vi.mock('../../hooks/useFiltersUrlSync', () => ({
  useFiltersUrlSync: () => undefined,
}));

describe('FiltersScreen location selection', () => {
  it('renders only the hierarchy location UI', () => {
    render(<FiltersScreen />);
    expect(screen.getByTestId('location-hierarchy-filter')).toBeInTheDocument();
    expect(screen.queryByTestId('location-filter-section')).not.toBeInTheDocument();
  });

  it('selecting a governorate updates the browse city', () => {
    setBrowseLocation.mockClear();
    render(<FiltersScreen />);
    fireEvent.click(screen.getByRole('button', { name: /^Amman$/ }));
    expect(setBrowseLocation).toHaveBeenCalledWith('JO', 'Amman', 'العاصمة');
  });
});
