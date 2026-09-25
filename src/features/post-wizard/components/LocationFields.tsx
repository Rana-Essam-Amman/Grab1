import React from 'react';
import { Input } from '@/shared/ui/Input';
import { Icon } from '@iconify/react';
import { googleMapsEmbedUrl } from '@/data/mapUrls';
import { AiReviewSectionCard } from './AiReviewSectionCard';

interface Props {
  isArabic: boolean;
  selectedCity: string;
  cities: string[];
  selectedNeighborhood: string;
  neighborhoods: string[];
  site: string;
  mapQuery: string;
  onCityChange: (c: string) => void;
  onNeighborhoodChange: (n: string) => void;
  onSiteChange: (s: string) => void;
}

const SELECT_CLASS = 'w-full h-11 px-3.5 rounded-xl bg-canvas border border-line text-sm text-ink focus:outline-none focus:border-brand cursor-pointer';

export const LocationFields: React.FC<Props> = ({
  isArabic, selectedCity, cities, selectedNeighborhood, neighborhoods, site, mapQuery,
  onCityChange, onNeighborhoodChange, onSiteChange
}) => {
  return (
    <div className="flex flex-col gap-3">

      <AiReviewSectionCard title={isArabic ? 'المدينة' : 'City'}>
        <select
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className={SELECT_CLASS}
        >
          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>
      </AiReviewSectionCard>

      {neighborhoods.length > 0 && (
        <AiReviewSectionCard title={isArabic ? 'الحي' : 'Neighborhood'}>
          <select
            value={selectedNeighborhood}
            onChange={(e) => onNeighborhoodChange(e.target.value)}
            className={SELECT_CLASS}
          >
            {neighborhoods.map((hood) => <option key={hood} value={hood}>{hood}</option>)}
          </select>
        </AiReviewSectionCard>
      )}

      <AiReviewSectionCard title={isArabic ? 'معلم قريب' : 'Nearby Landmark'}>
        <Input
          type="text"
          value={site}
          onChange={(e) => onSiteChange(e.target.value)}
          placeholder={isArabic ? 'مثال: قرب دوار المدينة، مجمع تجاري...' : 'e.g., Near City Circle...'}
          className="h-11"
        />
      </AiReviewSectionCard>

      <AiReviewSectionCard title={isArabic ? 'الخريطة' : 'Map'}>
        <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-2">
          <Icon icon="noto:round-pushpin" width={14} height={14} className="shrink-0" />
          <span>{mapQuery}</span>
        </div>
        <div className="w-full h-44 rounded-xl overflow-hidden bg-canvas">
          <iframe
            title="Map Preview"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={googleMapsEmbedUrl(mapQuery)}
            className="border-0"
          />
        </div>
      </AiReviewSectionCard>

    </div>
  );
};
