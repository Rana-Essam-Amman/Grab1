import { useCallback, useState } from 'react';
import { GeoMatch } from '../helpers/geoMatch';
import { CanonicalLocation } from '@/shared/lib/geo';
import { processLocationCoords } from '../helpers/geoLocationHelpers';

export type GeoStatus = 'idle' | 'loading' | 'success' | 'denied' | 'unavailable' | 'error';

export interface UseGeoLocationReturn {
  readonly status: GeoStatus;
  readonly match: GeoMatch | null;
  readonly canonicalLocation: CanonicalLocation | null;
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
  const [canonicalLocation, setCanonicalLocation] = useState<CanonicalLocation | null>(null);
  const [deviceLat, setDeviceLat] = useState<number | null>(null);
  const [deviceLng, setDeviceLng] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<readonly string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setMatch(null);
    setCanonicalLocation(null);
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

        const res = await processLocationCoords(latitude, longitude, preferredCountry, isArabic);
        setCandidates(res.candidates);
        setCanonicalLocation(res.canonicalLocation);
        setMatch(res.match);

        if (res.error) {
          setStatus('error');
          setError(res.error);
        } else {
          setStatus('success');
        }
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error');
        setError(err.code === err.PERMISSION_DENIED ? 'Permission denied' : (err.message || 'Location unavailable'));
        setMatch(null);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }, [preferredCountry, isArabic]);

  return { status, match, canonicalLocation, deviceLat, deviceLng, candidates, error, request, reset };
}
