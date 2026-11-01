import React, { useEffect, useRef } from 'react';
import { useGeoLocation } from '../hooks/useGeoLocation';
import { usePostWizard } from '../hooks/usePostWizard';
import { toast } from 'sonner';

interface Props {
  readonly isArabic: boolean;
  readonly preferredCountry: string;
  readonly onCityChange: (city: string) => void;
  readonly onNeighborhoodChange: (n: string) => void;
}

export const LocationMyLocationButton: React.FC<Props> = ({
  isArabic,
  preferredCountry,
  onCityChange,
  onNeighborhoodChange,
}) => {
  const {
    status, canonicalLocation, error, request, reset,
  } = useGeoLocation(preferredCountry, isArabic);
  const { updatePostDraft } = usePostWizard();
  const requestTimestamp = useRef<number>(0);

  const handleRequest = () => {
    requestTimestamp.current = Date.now();
    request();
  };

  useEffect(() => {
    if (status === 'denied') {
      toast.error(
        isArabic
          ? 'تم رفض صلاحية الوصول للموقع. يرجى تفعيلها من إعدادات المتصفح.'
          : 'Location permission denied. Please enable it in your browser settings.'
      );
    } else if (status === 'unavailable') {
      toast.error(
        isArabic
          ? 'خدمة تحديد الموقع غير متاحة على جهازك.'
          : 'Location service is not available on your device.'
      );
    } else if (status === 'error' && error) {
      toast.error(
        isArabic
          ? 'تعذر تحديد موقعك بدقة. يرجى اختيار المدينة والحي يدوياً.'
          : 'Could not determine your location accurately. Please select manually.'
      );
    }
  }, [status, error, isArabic]);

  // Handle Canonical Resolution Atomically (BLOCKER A)
  useEffect(() => {
    if (status !== 'success' || !canonicalLocation) return;

    // Safety check 1: Market agreement
    if (canonicalLocation.countryCode !== preferredCountry || canonicalLocation.needsManualSelection) {
      toast.error(
        isArabic
          ? 'موقعك الحالي خارج نطاق السوق المختار أو غير محدد بدقة. يرجى الاختيار يدوياً.'
          : 'Your location is outside the selected market or unverified. Please select manually.'
      );
      reset();
      return;
    }

    // Authoritative atomic canonical resolution
    const finalCity = isArabic
      ? canonicalLocation.governorateAr || canonicalLocation.governorateEn || ''
      : canonicalLocation.governorateEn || canonicalLocation.governorateAr || '';

    const finalNeighborhood = isArabic
      ? canonicalLocation.neighborhoodAr || canonicalLocation.neighborhoodEn || ''
      : canonicalLocation.neighborhoodEn || canonicalLocation.neighborhoodAr || '';

    if (!finalCity) {
      reset();
      return;
    }

    onCityChange(finalCity);
    onNeighborhoodChange(finalNeighborhood);

    updatePostDraft({
      city: finalCity,
      neighborhood: finalNeighborhood,
      citySlug: canonicalLocation.governorateSlug ?? undefined,
      districtSlug: canonicalLocation.districtSlug ?? undefined,
      neighborhoodSlug: canonicalLocation.neighborhoodSlug ?? undefined,
    });

    reset();
  }, [
    status, canonicalLocation, preferredCountry, isArabic,
    onCityChange, onNeighborhoodChange, reset, updatePostDraft,
  ]);

  const label =
    status === 'loading'
      ? (isArabic ? 'جاري تحديد الموقع...' : 'Locating...')
      : (isArabic ? 'استخدم موقعي الحالي' : 'Use my location');

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleRequest}
        disabled={status === 'loading'}
        className="h-11 px-3.5 rounded-xl border border-border bg-surface text-sm font-bold text-ink text-start transition-colors hover:bg-canvas disabled:opacity-50"
      >
        {status === 'loading' ? '… ' : '📍 '}{label}
      </button>
      
      {error && status === 'error' && (
        <p className="text-[11px] text-danger px-1 mt-0.5">{error}</p>
      )}
    </div>
  );
};
