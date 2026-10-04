import { useCallback, useState } from 'react';
import { findNearestCity, GeoMatch } from '../helpers/geoMatch';
import { reverseGeocode } from '../helpers/reverseGeocode';

export type GeoStatus = 'idle' | 'loading' | 'success' | 'denied' | 'unavailable' | 'error';

export interface UseGeoLocationReturn {
  readonly status: GeoStatus;
  readonly match: GeoMatch | null;
  readonly deviceLat: number | null;
  readonly deviceLng: number | null;
  readonly candidates: readonly string[];
  readonly error: string | null;
  readonly request: () => void;
  readonly reset: () => void;
}

export function useGeoLocation(
  preferredCountry: string,
  isArabic: boolean
): UseGeoLocationReturn {
  const [status, setStatus] = useState<GeoStatus>('idle');
  const [match, setMatch] = useState<GeoMatch | null>(null);
  const [deviceLat, setDeviceLat] = useState<number | null>(null);
  const [deviceLng, setDeviceLng] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<readonly string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setMatch(null);
    setDeviceLat(null);
    setDeviceLng(null);
    setCandidates([]);
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
      async (pos) => {
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

        const rv = await reverseGeocode(latitude, longitude, isArabic);
        setCandidates(rv.candidates);

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
  }, [preferredCountry, isArabic]);

  return {
    status, match, deviceLat, deviceLng, candidates, error, request, reset,
  };
}
