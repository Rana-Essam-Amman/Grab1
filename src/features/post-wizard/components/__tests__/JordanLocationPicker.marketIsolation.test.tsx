import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { LocationFields } from '../LocationFields';

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    browseCountryCode: 'SA',
    isArabic: false,
  }),
}));

vi.mock('../hooks/usePostWizard', () => ({
  usePostWizard: () => ({
    postDraft: {
      latitude: undefined,
      longitude: undefined,
    },
    updatePostDraft: vi.fn(),
  }),
}));

describe('LocationFields Market Isolation', () => {
  it('does not render JordanLocationPicker when market is SA', () => {
    render(
      <LocationFields
        isArabic={false}
        selectedCity="Riyadh"
        cities={['Riyadh', 'Jeddah']}
        selectedNeighborhood=""
        neighborhoods={['Al-Olaya']}
        site=""
        mapQuery=""
        customCity=""
        customNeighborhood=""
        onCityChange={vi.fn()}
        onNeighborhoodChange={vi.fn()}
        onSiteChange={vi.fn()}
        onCustomCityChange={vi.fn()}
        onCustomNeighborhoodChange={vi.fn()}
      />
    );

    expect(screen.queryByTestId('jordan-location-picker')).not.toBeInTheDocument();
    expect(screen.getByTestId('location-city-wrapper')).toBeInTheDocument();
  });
});
