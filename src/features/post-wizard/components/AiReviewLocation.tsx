import React from 'react';
import { Icon } from '@iconify/react';
import { googleMapsEmbedUrl } from '@/data/mapUrls';

interface AiReviewLocationProps {
  readonly isArabic: boolean;
  readonly city: string;
  readonly neighborhood: string;
  readonly mapQuery: string;
  readonly onOpenCityPicker: () => void;
  readonly onOpenNeighborhoodPicker: () => void;
}

export const AiReviewLocation: React.FC<AiReviewLocationProps> = ({
  isArabic,
  city,
  neighborhood,
  mapQuery,
  onOpenCityPicker,
  onOpenNeighborhoodPicker,
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onOpenCityPicker}
        className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-canvas border border-line text-sm font-semibold text-ink cursor-pointer hover:bg-surface-raised transition-colors min-w-0"
      >
        <Icon icon="noto:round-pushpin" width={16} height={16} className="shrink-0" />
        <span className="truncate">{city || (isArabic ? 'اختر المدينة' : 'Select city')}</span>
      </button>
      <button
        type="button"
        onClick={onOpenNeighborhoodPicker}
        disabled={!city}
        className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-canvas border border-line text-sm font-semibold text-ink cursor-pointer hover:bg-surface-raised transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-w-0"
      >
        <Icon icon="noto:round-pushpin" width={16} height={16} className="shrink-0" />
        <span className="truncate">{neighborhood || (isArabic ? 'اختر الحي' : 'Select area')}</span>
      </button>
    </div>
    {city && (
      <div className="rounded-xl overflow-hidden border border-line h-[160px] bg-canvas">
        <iframe
          key={mapQuery}
          src={googleMapsEmbedUrl(mapQuery)}
          className="w-full h-[160px] border-0"
          title="Map"
          loading="lazy"
        />
      </div>
    )}
  </div>
);
