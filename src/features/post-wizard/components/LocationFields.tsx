import React from 'react';
import { Input } from '@/shared/ui/Input';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@iconify/react';
import { googleMapsEmbedUrl } from '@/data/mapUrls';
import { isOtherValue } from '@/data/locations';
import { useUI } from '@/hooks/useUI';
import { LocationMyLocationButton } from './LocationMyLocationButton';

interface Props {
  isArabic: boolean;
  selectedCity: string;
  cities: string[];
  selectedNeighborhood: string;
  neighborhoods: string[];
  site: string;
  mapQuery: string;
  customCity: string;
  customNeighborhood: string;
  onCityChange: (c: string) => void;
  onNeighborhoodChange: (n: string) => void;
  onSiteChange: (s: string) => void;
  onCustomCityChange: (v: string) => void;
  onCustomNeighborhoodChange: (v: string) => void;
}

export const LocationFields: React.FC<Props> = ({
  isArabic,
  selectedCity,
  cities,
  selectedNeighborhood,
  neighborhoods,
  site,
  mapQuery,
  customCity,
  customNeighborhood,
  onCityChange,
  onNeighborhoodChange,
  onSiteChange,
  onCustomCityChange,
  onCustomNeighborhoodChange,
}) => {
  const { browseCountryCode } = useUI();
  return (
    <div className="flex flex-col gap-4">
      <LocationMyLocationButton isArabic={isArabic} preferredCountry={browseCountryCode} onCityChange={onCityChange} />
      <div>
        <label className="block text-xs font-bold text-ink mb-1.5">{isArabic ? "المدينة / المحافظة" : "City / Governorate"}</label>
        <select value={selectedCity} onChange={(e) => onCityChange(e.target.value)} className="w-full h-11 px-3.5 rounded-xl bg-surface border border-border text-sm text-ink focus:outline-none focus:border-primary">
          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>
      </div>
      {isOtherValue(selectedCity) && (
        <Input
          label={isArabic ? "اكتب اسم المدينة" : "Type city name"}
          type="text"
          value={customCity}
          onChange={(e) => onCustomCityChange(e.target.value)}
          placeholder={isArabic ? "مثال: الطفيلة" : "e.g., Tafilah"}
          className="h-11"
        />
      )}

      {neighborhoods.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-ink mb-1.5">{isArabic ? "المنطقة / الحي" : "Neighborhood / Area"}</label>
          <select value={selectedNeighborhood} onChange={(e) => onNeighborhoodChange(e.target.value)} className="w-full h-11 px-3.5 rounded-xl bg-surface border border-border text-sm text-ink focus:outline-none focus:border-primary">
            {neighborhoods.map((hood) => <option key={hood} value={hood}>{hood}</option>)}
          </select>

          {/* end of neighborhood select */}
          {isOtherValue(selectedNeighborhood) && (
            <Input
              label={isArabic ? "اكتب اسم المنطقة" : "Type neighborhood name"}
              type="text"
              value={customNeighborhood}
              onChange={(e) => onCustomNeighborhoodChange(e.target.value)}
              placeholder={isArabic ? "مثال: الرابية الجديدة" : "e.g., New Rabieh"}
              className="h-11"
            />
          )}
        </div>
      )}

      <Input
        label={isArabic ? "معلم قريب أو شارع (اختياري)" : "Landmark or Street (Optional)"}
        type="text"
        value={site}
        onChange={(e) => onSiteChange(e.target.value)}
        placeholder={isArabic ? "مثال: قرب دوار المدينة، مجمع تجاري..." : "e.g., Near City Circle..."}
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
