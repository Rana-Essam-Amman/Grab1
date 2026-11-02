import React, { useEffect, useRef } from 'react';
import { useGeoLocation } from '../hooks/useGeoLocation';
import { usePostWizard } from '../hooks/usePostWizard';
import { handleGeoStatusToast } from '../helpers/locationToastHelper';
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
  const { status, canonicalLocation, error, requestId, request, reset } = useGeoLocation(preferredCountry, isArabic);
  const { updatePostDraft } = usePostWizard();
  const lastProcessedRequestIdRef = useRef<number>(0);

  useEffect(() => {
    handleGeoStatusToast(status, error, isArabic);
  }, [status, error, isArabic]);

  useEffect(() => {
    if (status !== 'success' || !canonicalLocation) return;
    if (requestId === 0 || requestId <= lastProcessedRequestIdRef.current) return;
    lastProcessedRequestIdRef.current = requestId;

    if (canonicalLocation.countryCode !== preferredCountry || canonicalLocation.needsManualSelection) {
      toast.error(
        isArabic
          ? 'موقعك الحالي خارج نطاق السوق المختار أو غير محدد بدقة. يرجى الاختيار يدوياً.'
          : 'Your location is outside the selected market or unverified. Please select manually.'
      );
      reset();
      return;
    }

    const finalCity = (isArabic ? canonicalLocation.governorateAr : canonicalLocation.governorateEn)
      || canonicalLocation.governorateEn || canonicalLocation.governorateAr || '';
    const finalNeighborhood = (isArabic ? canonicalLocation.neighborhoodAr : canonicalLocation.neighborhoodEn)
      || canonicalLocation.neighborhoodEn || canonicalLocation.neighborhoodAr || '';

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
  }, [status, canonicalLocation, requestId, preferredCountry, isArabic, onCityChange, onNeighborhoodChange, reset, updatePostDraft]);

  const label = status === 'loading'
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
      {error && status === 'error' && (
        <p className="text-[11px] text-danger px-1 mt-0.5">{error}</p>
      )}
    </div>
  );
};
