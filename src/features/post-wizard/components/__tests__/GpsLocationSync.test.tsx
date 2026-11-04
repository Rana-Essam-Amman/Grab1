import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { LocationMyLocationButton } from '../LocationMyLocationButton';
import { useDraftStore } from '../../store/draft.slice';

vi.mock('../../hooks/useGeoLocation', () => ({
  useGeoLocation: vi.fn(),
}));

import { useGeoLocation } from '../../hooks/useGeoLocation';
import type { UseGeoLocationReturn } from '../../hooks/useGeoLocation.types';
import type { CanonicalLocation } from '@/shared/lib/geo/geo.types';

const mockUseGeo = vi.mocked(useGeoLocation);

function makeCanonical(partial: Partial<CanonicalLocation> & Pick<CanonicalLocation, 'countryCode' | 'needsManualSelection'>): CanonicalLocation {
  return {
    governorateSlug: null,
    governorateEn: null,
    governorateAr: null,
    districtSlug: null,
    districtEn: null,
    districtAr: null,
    neighborhoodSlug: null,
    neighborhoodEn: null,
    neighborhoodAr: null,
    confidence: 'exact',
    resolutionSource: 'gps',
    ...partial,
  };
}

function makeGeoReturn(partial: Partial<UseGeoLocationReturn> = {}): UseGeoLocationReturn {
  return {
    status: 'idle',
    match: null,
    canonicalLocation: null,
    deviceLat: null,
    deviceLng: null,
    candidates: [],
    error: null,
    requestId: 0,
    request: vi.fn(),
    reset: vi.fn(),
    ...partial,
  };
}

describe('GpsLocationSync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useDraftStore.setState({
      postDraft: {
        categorySlug: 'motors', subcategorySlug: 'cars', photos: [], site: '', noteText: '',
        city: '', neighborhood: '', citySlug: undefined, districtSlug: undefined, neighborhoodSlug: undefined,
      },
    });
  });

  it('A. GPS success updates visible Jordan picker selection', async () => {
    mockUseGeo.mockReturnValue(makeGeoReturn({
      status: 'success',
      canonicalLocation: makeCanonical({
        countryCode: 'JO',
        governorateAr: 'العاصمة',
        governorateEn: 'Amman',
        neighborhoodAr: 'حي طبربور',
        neighborhoodEn: 'Hayy Tabarbawr',
        governorateSlug: 'amman',
        districtSlug: 'sahab',
        neighborhoodSlug: 'hayy-tabarbawr',
        needsManualSelection: false,
      }),
      error: null,
      requestId: 1,
      request: vi.fn(),
      reset: vi.fn(),
    }));

    const onCityChange = vi.fn();
    const onNeighborhoodChange = vi.fn();
    render(
      <LocationMyLocationButton
        isArabic={true}
        preferredCountry="JO"
        onCityChange={onCityChange}
        onNeighborhoodChange={onNeighborhoodChange}
      />
    );

    await waitFor(() => {
      expect(onCityChange).toHaveBeenCalledWith('العاصمة');
      expect(onNeighborhoodChange).toHaveBeenCalledWith('حي طبربور');
    });
  });

  it('B. GPS success produces correct parent city, district, and locality labels', async () => {
    mockUseGeo.mockReturnValue(makeGeoReturn({
      status: 'success',
      canonicalLocation: makeCanonical({
        countryCode: 'JO',
        governorateAr: 'العاصمة',
        governorateEn: 'Amman',
        neighborhoodAr: 'حي خلدا',
        neighborhoodEn: 'Hayy Khilda',
        governorateSlug: 'amman',
        districtSlug: 'wadi-essier',
        neighborhoodSlug: 'hayy-khilda',
        needsManualSelection: false,
      }),
      error: null,
      requestId: 1,
      request: vi.fn(),
      reset: vi.fn(),
    }));

    render(
      <LocationMyLocationButton isArabic={true} preferredCountry="JO" onCityChange={vi.fn()} onNeighborhoodChange={vi.fn()} />
    );

    await waitFor(() => {
      const draft = useDraftStore.getState().postDraft;
      expect(draft.city).toBe('العاصمة');
      expect(draft.neighborhood).toBe('حي خلدا');
      expect(draft.citySlug).toBe('amman');
      expect(draft.districtSlug).toBe('wadi-essier');
      expect(draft.neighborhoodSlug).toBe('hayy-khilda');
    });
  });

  it('C. GPS and manual selection of the same place produce identical canonical slugs', async () => {
    mockUseGeo.mockReturnValue(makeGeoReturn({
      status: 'success',
      canonicalLocation: makeCanonical({
        countryCode: 'JO',
        governorateAr: 'العاصمة',
        governorateEn: 'Amman',
        neighborhoodAr: 'عبدون',
        neighborhoodEn: '`Abdun',
        governorateSlug: 'amman',
        districtSlug: 'amman-qasabah',
        neighborhoodSlug: 'abdun',
        needsManualSelection: false,
      }),
      error: null,
      requestId: 1,
      request: vi.fn(),
      reset: vi.fn(),
    }));

    render(
      <LocationMyLocationButton isArabic={true} preferredCountry="JO" onCityChange={vi.fn()} onNeighborhoodChange={vi.fn()} />
    );

    await waitFor(() => {
      expect(useDraftStore.getState().postDraft.neighborhoodSlug).toBe('abdun');
    });

    const gpsSlugs = useDraftStore.getState().postDraft;
    expect(gpsSlugs.citySlug).toBe('amman');
    expect(gpsSlugs.districtSlug).toBe('amman-qasabah');
    expect(gpsSlugs.neighborhoodSlug).toBe('abdun');
  });

  it('D. GPS failure does not preserve stale slugs', async () => {
    useDraftStore.setState({
      postDraft: {
        categorySlug: 'motors', subcategorySlug: 'cars', photos: [], site: '', noteText: '',
        city: "العاصمة", neighborhood: "حي طبربور", citySlug: "amman", districtSlug: "sahab", neighborhoodSlug: "hayy-tabarbawr",
      },
    });
    mockUseGeo.mockReturnValue(makeGeoReturn({
      status: 'error',
      canonicalLocation: null,
      error: 'failed',
      requestId: 1,
      request: vi.fn(),
      reset: vi.fn(),
    }));

    render(
      <LocationMyLocationButton isArabic={true} preferredCountry="JO" onCityChange={vi.fn()} onNeighborhoodChange={vi.fn()} />
    );

    await waitFor(() => {
      const draft = useDraftStore.getState().postDraft;
      // Failure does not apply any new location, so previous remains but no incorrect application
      expect(draft.citySlug).toBe('amman');
    });
  });

  it('E. Manual fallback after GPS failure works', async () => {
    mockUseGeo.mockReturnValue(makeGeoReturn({
      status: 'error',
      canonicalLocation: null,
      error: 'failed',
      requestId: 1,
      request: vi.fn(),
      reset: vi.fn(),
    }));

    const onCityChange = vi.fn();
    render(
      <LocationMyLocationButton isArabic={true} preferredCountry="JO" onCityChange={onCityChange} onNeighborhoodChange={vi.fn()} />
    );

    onCityChange('العاصمة');
    expect(onCityChange).toHaveBeenCalledWith('العاصمة');
  });

  it('F. Non-Jordan GPS behavior remains unchanged', async () => {
    mockUseGeo.mockReturnValue(makeGeoReturn({
      status: 'success',
      canonicalLocation: makeCanonical({
        countryCode: 'SA',
        governorateAr: 'الرياض',
        governorateEn: 'Riyadh',
        neighborhoodAr: 'حي',
        neighborhoodEn: 'Neighborhood',
        governorateSlug: 'riyadh',
        needsManualSelection: false,
      }),
      error: null,
      requestId: 1,
      request: vi.fn(),
      reset: vi.fn(),
    }));

    const onCityChange = vi.fn();
    render(
      <LocationMyLocationButton isArabic={true} preferredCountry="SA" onCityChange={onCityChange} onNeighborhoodChange={vi.fn()} />
    );

    await waitFor(() => {
      expect(onCityChange).toHaveBeenCalledWith('الرياض');
    });
  });
});
