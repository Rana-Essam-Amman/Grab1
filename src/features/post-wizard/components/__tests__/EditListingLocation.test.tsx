import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { getMarketProfile } from '@/data/locations/marketProfiles';
import { EditListingLocation } from '../EditListingLocation';

vi.mock('../JordanLocationPicker', () => ({
  JordanLocationPicker: () => <div data-testid="jordan-location-picker" />,
}));

const controller = (marketCode: string, overrides: Record<string, unknown> = {}) => ({
  marketCode,
  profile: getMarketProfile(marketCode),
  hasLevel3: (getMarketProfile(marketCode)?.visibleLevels.length ?? 0) >= 3,
  location: {
    city: 'Riyadh',
    neighborhood: 'Al Olaya',
    citySlug: 'riyadh-region',
    districtSlug: 'riyadh-city',
    neighborhoodSlug: 'al-olaya',
  },
  changed: false,
  payload: {},
  governorates: [{ slug: 'riyadh-region', nameAr: 'الرياض', nameEn: 'Riyadh' }],
  districts: [{ slug: 'riyadh-city', nameAr: 'الرياض', nameEn: 'Riyadh City', villages: [] }],
  villages: [{ slug: 'al-olaya', nameAr: 'العليا', nameEn: 'Al Olaya' }],
  onGovernorate: vi.fn(),
  onDistrict: vi.fn(),
  onLocality: vi.fn(),
  onJordan: vi.fn(),
  onClear: vi.fn(),
  ...overrides,
});

describe('EditListingLocation', () => {
  it('shows hierarchy for non-Jordan market with correct labels', () => {
    render(<EditListingLocation isArabic={false} location={controller('SA') as never} />);
    expect(screen.getByTestId('edit-listing-location')).toBeInTheDocument();
    expect(screen.getByTestId('edit-location-level-3')).toBeInTheDocument();
  });

  it('uses Jordan picker for JO and preserves Arabic labels', () => {
    render(<EditListingLocation isArabic={true} location={controller('JO') as never} />);
    expect(screen.getByTestId('jordan-location-picker')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-listing-location')).not.toBeInTheDocument();
  });

  it('does not render for unknown market', () => {
    const { container } = render(<EditListingLocation isArabic={false} location={controller('XX', { profile: null }) as never} />);
    expect(container.firstChild).toBeNull();
  });
});
