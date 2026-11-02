import { useCallback, useState, useRef, useEffect } from 'react';
import { GeoMatch } from '../helpers/geoMatch';
import { CanonicalLocation } from '@/shared/lib/geo';
import { processLocationCoords } from '../helpers/geoLocationHelpers';
import type { GeoStatus, UseGeoLocationReturn } from './useGeoLocation.types';

export type { GeoStatus, UseGeoLocationReturn };

export function useGeoLocation(preferredCountry: string, isArabic: boolean): UseGeoLocationReturn {
  const [status, setStatus] = useState<GeoStatus>('idle');
  const [match, setMatch] = useState<GeoMatch | null>(null);
  const [canonicalLocation, setCanonicalLocation] = useState<CanonicalLocation | null>(null);
  const [deviceLat, setDeviceLat] = useState<number | null>(null);
  const [deviceLng, setDeviceLng] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<readonly string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<number>(0);

  const activeRequestIdRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);
  const initialMountRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      activeRequestIdRef.current = 0;
    };
  }, []);

  const reset = useCallback(() => {
    activeRequestIdRef.current += 1;
    setCurrentRequestId(activeRequestIdRef.current);
    setStatus('idle');
    setMatch(null);
    setCanonicalLocation(null);
    setDeviceLat(null);
    setDeviceLng(null);
    setCandidates([]);
    setError(null);
  }, []);

  useEffect(() => {
    if (initialMountRef.current) {
      initialMountRef.current = false;
      return;
    }
    reset();
  }, [preferredCountry, reset]);

  const request = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unavailable');
      setError('Geolocation is not available');
      return;
    }
    const thisRequestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = thisRequestId;
    setCurrentRequestId(thisRequestId);
    setStatus('loading');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (!isMountedRef.current || activeRequestIdRef.current !== thisRequestId) return;
        setDeviceLat(pos.coords.latitude);
        setDeviceLng(pos.coords.longitude);

        const res = await processLocationCoords(pos.coords.latitude, pos.coords.longitude, preferredCountry, isArabic);
        if (!isMountedRef.current || activeRequestIdRef.current !== thisRequestId) return;

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
        if (!isMountedRef.current || activeRequestIdRef.current !== thisRequestId) return;
        setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error');
        setError(err.code === err.PERMISSION_DENIED ? 'Permission denied' : (err.message || 'Location unavailable'));
        setMatch(null);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }, [preferredCountry, isArabic]);

  return {
    status, match, canonicalLocation, deviceLat, deviceLng,
    candidates, error, requestId: currentRequestId, request, reset,
  };
}
