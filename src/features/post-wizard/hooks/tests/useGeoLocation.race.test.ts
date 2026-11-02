import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGeoLocation } from '../useGeoLocation';
import * as helpers from '../../helpers/geoLocationHelpers';
import type { LocationResolutionResult } from '../../helpers/geoLocationHelpers';

function createMockPosition(latitude: number, longitude: number): GeolocationPosition {
  return {
    coords: {
      latitude,
      longitude,
      accuracy: 10,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
      toJSON: () => ({}),
    },
    timestamp: Date.now(),
    toJSON: () => ({}),
  };
}

describe('useGeoLocation — Race Conditions & Stale Rejection (FIX E)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects stale responses when a newer request has started', async () => {
    let resolveFirst: (val: LocationResolutionResult) => void = () => {};
    let resolveSecond: (val: LocationResolutionResult) => void = () => {};

    const p1 = new Promise<LocationResolutionResult>((resolve) => {
      resolveFirst = resolve;
    });
    const p2 = new Promise<LocationResolutionResult>((resolve) => {
      resolveSecond = resolve;
    });

    let callCount = 0;
    vi.spyOn(helpers, 'processLocationCoords').mockImplementation(() => {
      callCount++;
      return callCount === 1 ? p1 : p2;
    });

    const mockGeolocation = {
      getCurrentPosition: vi.fn((success: PositionCallback) => {
        success(createMockPosition(31.95, 35.91));
      }),
    };
    vi.stubGlobal('navigator', { geolocation: mockGeolocation });

    const { result } = renderHook(() => useGeoLocation('JO', false));

    // Fire Request 1
    act(() => {
      result.current.request();
    });
    expect(result.current.requestId).toBe(1);

    // Fire Request 2 immediately
    act(() => {
      result.current.request();
    });
    expect(result.current.requestId).toBe(2);

    // Request 2 completes first
    await act(async () => {
      resolveSecond({
        match: null,
        candidates: ['Second City'],
        canonicalLocation: {
          countryCode: 'JO',
          governorateSlug: 'second',
          governorateEn: 'Second',
          governorateAr: 'ثاني',
          districtSlug: null,
          districtEn: null,
          districtAr: null,
          neighborhoodSlug: null,
          neighborhoodEn: null,
          neighborhoodAr: null,
          confidence: 'exact',
          resolutionSource: 'canonical_match',
          needsManualSelection: false,
        },
        error: null,
      });
    });

    expect(result.current.candidates).toEqual(['Second City']);

    // Stale Request 1 completes later -> must be dropped
    await act(async () => {
      resolveFirst({
        match: null,
        candidates: ['First City'],
        canonicalLocation: {
          countryCode: 'JO',
          governorateSlug: 'first',
          governorateEn: 'First',
          governorateAr: 'أول',
          districtSlug: null,
          districtEn: null,
          districtAr: null,
          neighborhoodSlug: null,
          neighborhoodEn: null,
          neighborhoodAr: null,
          confidence: 'exact',
          resolutionSource: 'canonical_match',
          needsManualSelection: false,
        },
        error: null,
      });
    });

    // Candidates must still be 'Second City', not overwritten by 'First City'
    expect(result.current.candidates).toEqual(['Second City']);
  });

  it('invalidates pending request when reset is called', async () => {
    let resolveFirst: (val: LocationResolutionResult) => void = () => {};
    const p1 = new Promise<LocationResolutionResult>((resolve) => {
      resolveFirst = resolve;
    });

    vi.spyOn(helpers, 'processLocationCoords').mockReturnValue(p1);

    const mockGeolocation = {
      getCurrentPosition: vi.fn((success: PositionCallback) => {
        success(createMockPosition(31.95, 35.91));
      }),
    };
    vi.stubGlobal('navigator', { geolocation: mockGeolocation });

    const { result } = renderHook(() => useGeoLocation('JO', false));

    act(() => {
      result.current.request();
    });
    expect(result.current.status).toBe('loading');

    act(() => {
      result.current.reset();
    });
    expect(result.current.status).toBe('idle');

    // Late resolve
    await act(async () => {
      resolveFirst({
        match: null,
        candidates: ['Amman'],
        canonicalLocation: {
          countryCode: 'JO',
          governorateSlug: 'amman',
          governorateEn: 'Amman',
          governorateAr: 'عمان',
          districtSlug: null,
          districtEn: null,
          districtAr: null,
          neighborhoodSlug: null,
          neighborhoodEn: null,
          neighborhoodAr: null,
          confidence: 'exact',
          resolutionSource: 'canonical_match',
          needsManualSelection: false,
        },
        error: null,
      });
    });

    // Must remain idle with null canonicalLocation
    expect(result.current.status).toBe('idle');
    expect(result.current.canonicalLocation).toBeNull();
  });

  it('invalidates pending request when market changes', async () => {
    let resolveFirst: (val: LocationResolutionResult) => void = () => {};
    const p1 = new Promise<LocationResolutionResult>((resolve) => {
      resolveFirst = resolve;
    });

    vi.spyOn(helpers, 'processLocationCoords').mockReturnValue(p1);

    const mockGeolocation = {
      getCurrentPosition: vi.fn((success: PositionCallback) => {
        success(createMockPosition(31.95, 35.91));
      }),
    };
    vi.stubGlobal('navigator', { geolocation: mockGeolocation });

    let market = 'JO';
    const { result, rerender } = renderHook(() => useGeoLocation(market, false));

    act(() => {
      result.current.request();
    });
    expect(result.current.status).toBe('loading');

    // Switch market to SA
    market = 'SA';
    rerender();

    expect(result.current.status).toBe('idle');

    // Late resolve
    await act(async () => {
      resolveFirst({
        match: null,
        candidates: ['Amman'],
        canonicalLocation: {
          countryCode: 'JO',
          governorateSlug: 'amman',
          governorateEn: 'Amman',
          governorateAr: 'عمان',
          districtSlug: null,
          districtEn: null,
          districtAr: null,
          neighborhoodSlug: null,
          neighborhoodEn: null,
          neighborhoodAr: null,
          confidence: 'exact',
          resolutionSource: 'canonical_match',
          needsManualSelection: false,
        },
        error: null,
      });
    });

    // Should not record Amman for SA
    expect(result.current.canonicalLocation).toBeNull();
  });
});
