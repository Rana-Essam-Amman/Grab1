import { useCallback, useState } from 'react';
import { findNearestCity, GeoMatch } from '../helpers/geoMatch';

export type GeoStatus = 'idle' | 'loading' | 'success' | 'denied' | 'unavailable' | 'error';

export interface UseGeoLocationReturn {
  readonly status: GeoStatus;
  readonly match: GeoMatch | null;
  readonly deviceLat: number | null;
  readonly deviceLng: number | null;
  readonly error: string | null;
  readonly request: () => void;
  readonly reset: () => void;
}

export function useGeoLocation(preferredCountry: string): UseGeoLocationReturn {
  const [status, setStatus] = useState<GeoStatus>('idle');
  const [match, setMatch] = useState<GeoMatch | null>(null);
  const [deviceLat, setDeviceLat] = useState<number | null>(null);
  const [deviceLng, setDeviceLng] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setMatch(null);
    setDeviceLat(null);
    setDeviceLng(null);
    setError(null);
  }, []);

  const request = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unavailable');
      setError('Geolocation is not available');
      return;
    }

    setStatus('loading');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setDeviceLat(latitude);
        setDeviceLng(longitude);
        const found = findNearestCity(latitude, longitude, preferredCountry);
        if (!found) {
          setStatus('error');
          setError('No nearby supported city found');
          setMatch(null);
          return;
        }
        setMatch(found);
        setStatus('success');
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus('denied');
          setError('Permission denied');
        } else {
          setStatus('error');
          setError(err.message || 'Location unavailable');
        }
        setMatch(null);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }, [preferredCountry]);

  return { status, match, deviceLat, deviceLng, error, request, reset };
}
