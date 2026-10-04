import React, { useEffect } from 'react';
import { locations, locationsAr } from '@/data/locations';
import { useGeoLocation } from '../hooks/useGeoLocation';
import { usePostWizard } from '../hooks/usePostWizard';

interface Props {
  readonly isArabic: boolean;
  readonly preferredCountry: string;
  readonly onCityChange: (city: string) => void;
}

function optionCity(country: string, cityEn: string, isArabic: boolean): string {
  if (!isArabic) return cityEn;
  const en = Object.keys(locations[country] || {});
  const ar = Object.keys(locationsAr[country] || {});
  const index = en.indexOf(cityEn);
  return index >= 0 && ar[index] ? ar[index] : cityEn;
}

export const LocationMyLocationButton: React.FC<Props> = ({ isArabic, preferredCountry, onCityChange }) => {
  const { status, match, deviceLat, deviceLng, error, request, reset } = useGeoLocation(preferredCountry);
  const { updatePostDraft } = usePostWizard();

  useEffect(() => {
    if (status !== 'success' || !match) return;
    const city = optionCity(match.country, match.city, isArabic);
    onCityChange(city);
    updatePostDraft({
      city,
      neighborhood: '',
      ...(deviceLat != null && deviceLng != null ? { latitude: deviceLat, longitude: deviceLng } : {}),
    });
    reset();
  }, [status, match, deviceLat, deviceLng, isArabic, onCityChange, reset, updatePostDraft]);

  const label = status === 'loading'
    ? (isArabic ? 'جاري تحديد الموقع...' : 'Locating...')
    : (isArabic ? 'استخدم موقعي الحالي' : 'Use my location');

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={request}
        disabled={status === 'loading'}
        className="h-11 px-3.5 rounded-xl border border-border bg-surface text-sm font-bold text-ink text-start"
      >
        {status === 'loading' ? '… ' : '📍 '}{label}
      </button>
      {error && status !== 'idle' && status !== 'success' && (
        <p className="text-xs text-ink-muted px-1">{error}</p>
      )}
    </div>
  );
};
