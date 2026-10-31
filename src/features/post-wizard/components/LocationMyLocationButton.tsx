import React, { useEffect } from 'react';
import { locations, locationsAr } from '@/data/locations';
import { useGeoLocation } from '../hooks/useGeoLocation';
import { usePostWizard } from '../hooks/usePostWizard';
import { matchNeighborhood } from '../helpers/reverseGeocode';
import { toast } from 'sonner';

interface Props {
  readonly isArabic: boolean;
  readonly preferredCountry: string;
  readonly onCityChange: (city: string) => void;
  readonly onNeighborhoodChange: (n: string) => void;
}

function optionCity(country: string, cityEn: string, isArabic: boolean): string {
  if (!isArabic) return cityEn;
  const en = Object.keys(locations[country] || {});
  const ar = Object.keys(locationsAr[country] || {});
  const index = en.indexOf(cityEn);
  return index >= 0 && ar[index] ? ar[index] : cityEn;
}

export const LocationMyLocationButton: React.FC<Props> = ({
  isArabic,
  preferredCountry,
  onCityChange,
  onNeighborhoodChange,
}) => {
  const {
    status, match, deviceLat, deviceLng, candidates, error, request, reset,
  } = useGeoLocation(preferredCountry, isArabic);
  const { updatePostDraft } = usePostWizard();

  // Handle Error Feedback via Toast
  useEffect(() => {
    if (status === 'denied') {
      toast.error(isArabic ? 'تم رفض صلاحية الوصول للموقع. يرجى تفعيلها من إعدادات المتصفح.' : 'Location permission denied. Please enable it in your browser settings.');
    } else if (status === 'unavailable') {
      toast.error(isArabic ? 'خدمة تحديد الموقع غير متاحة على جهازك.' : 'Location service is not available on your device.');
    } else if (status === 'error' && error) {
      toast.error(isArabic ? 'تعذر تحديد موقعك. يرجى المحاولة مرة أخرى.' : 'Could not determine your location. Please try again.');
    }
  }, [status, error, isArabic]);

  // Handle Success & Country Protection
  useEffect(() => {
    if (status !== 'success' || !match) return;

    // Safety check: Ensure the detected country matches the current market
    if (match.country !== preferredCountry) {
      toast.error(
        isArabic
          ? 'موقعك الحالي يبدو خارج نطاق السوق المختار. يرجى تغيير السوق أو اختيار المدينة يدوياً.'
          : 'Your current location appears to be outside the selected market. Please change the market or select manually.'
      );
      reset();
      return;
    }

    const city = optionCity(match.country, match.city, isArabic);
    const list = isArabic
      ? locationsAr[match.country]?.[match.city] || []
      : locations[match.country]?.[match.city] || [];
    const matched = matchNeighborhood(candidates, list) ?? '';

    onCityChange(city);
    onNeighborhoodChange(matched);

    updatePostDraft({
      city,
      neighborhood: matched,
      ...(deviceLat != null && deviceLng != null
        ? { latitude: deviceLat, longitude: deviceLng }
        : {}),
    });

    reset();
  }, [
    status, match, deviceLat, deviceLng, candidates, preferredCountry,
    isArabic, onCityChange, onNeighborhoodChange, reset, updatePostDraft,
  ]);

  const label =
    status === 'loading'
      ? (isArabic ? 'جاري تحديد الموقع...' : 'Locating...')
      : (isArabic ? 'استخدم موقعي الحالي' : 'Use my location');

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={request}
        disabled={status === 'loading'}
        className="h-11 px-3.5 rounded-xl border border-border bg-surface text-sm font-bold text-ink text-start transition-colors hover:bg-canvas disabled:opacity-50"
      >
        {status === 'loading' ? '… ' : '📍 '}{label}
      </button>
      
      {/* Fallback inline error just in case, but toast is primary now */}
      {error && status === 'error' && (
        <p className="text-[11px] text-danger px-1 mt-0.5">{error}</p>
      )}
    </div>
  );
};
