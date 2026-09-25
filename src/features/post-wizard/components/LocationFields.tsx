import React from 'react';
import { Input } from '@/shared/ui/Input';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@iconify/react';
import { googleMapsEmbedUrl } from '@/data/mapUrls';

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

export const LocationFields: React.FC<Props> = ({ 
  isArabic, selectedCity, cities, selectedNeighborhood, neighborhoods, site, mapQuery, 
  onCityChange, onNeighborhoodChange, onSiteChange 
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-bold text-ink mb-1.5">{isArabic ? 'المدينة / المحافظة' : 'City / Governorate'}</label>
        <select value={selectedCity} onChange={(e) => onCityChange(e.target.value)} className="w-full h-11 px-3.5 rounded-xl bg-surface border border-border text-sm text-ink focus:outline-none focus:border-primary">
          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>
      </div>

      {neighborhoods.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-ink mb-1.5">{isArabic ? 'المنطقة / الحي' : 'Neighborhood / Area'}</label>
          <select value={selectedNeighborhood} onChange={(e) => onNeighborhoodChange(e.target.value)} className="w-full h-11 px-3.5 rounded-xl bg-surface border border-border text-sm text-ink focus:outline-none focus:border-primary">
            {neighborhoods.map((hood) => <option key={hood} value={hood}>{hood}</option>)}
          </select>
        </div>
      )}

      <Input
        label={isArabic ? 'معلم قريب أو شارع (اختياري)' : 'Landmark or Street (Optional)'}
        type="text"
        value={site}
        onChange={(e) => onSiteChange(e.target.value)}
        placeholder={isArabic ? 'مثال: قرب دوار المدينة، مجمع تجاري...' : 'e.g., Near City Circle...'}
        className="h-11"
      />

      <Card variant="default" className="p-2 border border-border bg-surface rounded-2xl">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-2 px-1">
          <Icon icon="noto:round-pushpin" width={14} height={14} className="text-primary shrink-0" />
          <span>{mapQuery}</span>
        </div>
        <div className="w-full h-44 rounded-xl overflow-hidden bg-background">
          <iframe title="Map Preview" width="100%" height="100%" frameBorder="0" scrolling="no" src={googleMapsEmbedUrl(mapQuery)} className="border-0" />
        </div>
      </Card>
    </div>
  );
};
