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
    neighborhood: 'Al Olaya — Riyadh City',
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

describe('EditListingLocation display', () => {
  it('shows existing district and locality for a three-level market', () => {
    render(<EditListingLocation isArabic={false} location={controller('SA') as never} />);
    expect(screen.getByText('Riyadh')).toBeInTheDocument();
    expect(screen.getByText('Riyadh City')).toBeInTheDocument();
    expect(screen.getByText('Al Olaya')).toBeInTheDocument();
    expect(screen.queryByText('Al Olaya — Riyadh City')).not.toBeInTheDocument();
    expect(screen.getByTestId('edit-location-level-3')).toBeInTheDocument();
  });

  it('keeps Kuwait two-level and Jordan on its dedicated picker', () => {
    const kuwait = render(<EditListingLocation isArabic={false} location={controller('KW', {
      location: { city: 'Al Asimah', neighborhood: 'Kuwait City', citySlug: 'al-asimah', districtSlug: 'al-kuwait-city', neighborhoodSlug: '' },
      governorates: [{ slug: 'al-asimah', nameAr: 'العاصمة', nameEn: 'Al Asimah' }],
      districts: [{ slug: 'al-kuwait-city', nameAr: 'مدينة الكويت', nameEn: 'Kuwait City', villages: [] }],
      villages: [],
    }) as never} />);
    expect(screen.getByText('Kuwait City')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-location-level-3')).not.toBeInTheDocument();
    kuwait.unmount();

    render(<EditListingLocation isArabic={false} location={controller('JO') as never} />);
    expect(screen.getByTestId('jordan-location-picker')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-listing-location')).not.toBeInTheDocument();
  });
});
