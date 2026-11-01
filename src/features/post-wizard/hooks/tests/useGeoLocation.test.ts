import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGeoLocation } from '../useGeoLocation';
import { useUIStore } from '@/store/ui.slice';

describe('useGeoLocation — Real Resolver Integration Tests (FIX 3)', () => {
  beforeEach(() => {
    useUIStore.setState({ browseCountryCode: 'JO', isArabic: false });
    vi.restoreAllMocks();
  });

  it('resolves valid device GPS coordinates to canonical location via shared resolver', async () => {
    const mockGeolocation = {
      getCurrentPosition: (success: (pos: { coords: { latitude: number; longitude: number } }) => void) => {
        success({
          coords: {
            latitude: 31.9539,
            longitude: 35.9106,
          },
        });
      },
    };
    vi.stubGlobal('navigator', { geolocation: mockGeolocation });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ address: { city: 'Amman', country: 'Jordan', country_code: 'jo' } }),
    });

    const { result } = renderHook(() => useGeoLocation('JO', false));

    await act(async () => {
      result.current.request();
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.status).toBe('success');
    expect(result.current.canonicalLocation).not.toBeNull();
    expect(result.current.canonicalLocation?.countryCode).toBe('JO');
    expect(result.current.canonicalLocation?.governorateSlug).toBe('amman');
    expect(result.current.canonicalLocation?.needsManualSelection).toBe(false);
  });

  it('rejects foreign coordinates and triggers error status without manufacturing slugs', async () => {
    const mockGeolocation = {
      getCurrentPosition: (success: (pos: { coords: { latitude: number; longitude: number } }) => void) => {
        success({
          coords: {
            latitude: 24.7136, // Riyadh coordinates outside Jordan
            longitude: 46.6753,
          },
        });
      },
    };
    vi.stubGlobal('navigator', { geolocation: mockGeolocation });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ address: { city: 'Riyadh', country: 'Saudi Arabia', country_code: 'sa' } }),
    });

    const { result } = renderHook(() => useGeoLocation('JO', false));

    await act(async () => {
      result.current.request();
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.status).toBe('error');
    expect(result.current.canonicalLocation?.needsManualSelection).toBe(true);
    expect(result.current.match).toBeNull();
  });
});
