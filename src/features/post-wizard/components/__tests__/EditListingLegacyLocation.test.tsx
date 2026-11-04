import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@/data/locations/JO.geo';
import '@/data/locations/SA.geo';
import '@/data/locations/KW.geo';
import { useEditListingLocation } from '../../hooks/useEditListingLocation';
import { EditListingLocation } from '../EditListingLocation';

vi.mock('../JordanLocationPicker', () => ({
  JordanLocationPicker: () => <div data-testid="jordan-location-picker" />,
}));

function Probe({ listing }: { listing: { countryCode: string; city: string; neighborhood: string } }) {
  const location = useEditListingLocation(listing, false);
  return <EditListingLocation isArabic={false} location={location} />;
}

describe('legacy Edit Listing location flow', () => {
  it('shows the resolved three-level hierarchy for a slugless listing', () => {
    render(<Probe listing={{ countryCode: 'SA', city: 'Riyadh', neighborhood: 'Al-Olaya — Riyadh City' }} />);
    expect(screen.getByText('Riyadh')).toBeInTheDocument();
    expect(screen.getByText('Riyadh City')).toBeInTheDocument();
    expect(screen.getByText('Al-Olaya')).toBeInTheDocument();
    expect(screen.getByTestId('edit-location-level-3')).toBeInTheDocument();
  });

  it('keeps Jordan on its dedicated picker for a slugless listing', () => {
    render(<Probe listing={{ countryCode: 'JO', city: 'Amman', neighborhood: 'Al Mansurah' }} />);
    expect(screen.getByTestId('jordan-location-picker')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-listing-location')).not.toBeInTheDocument();
    expect(screen.queryByTestId('edit-location-level-3')).not.toBeInTheDocument();
  });

  it('keeps Kuwait two-level after resolving a slugless listing', () => {
    render(<Probe listing={{ countryCode: 'KW', city: 'Al Asimah', neighborhood: 'Kuwait City' }} />);
    expect(screen.getByText('Al Asimah')).toBeInTheDocument();
    expect(screen.getByText('Kuwait City')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-location-level-3')).not.toBeInTheDocument();
  });
});
