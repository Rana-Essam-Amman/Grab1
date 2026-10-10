import React from 'react';
import { Input } from '@/shared/ui/Input';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@iconify/react';
import { isOtherValue } from '@/data/locations';
import { StaticMapPreview } from './StaticMapPreview';
import { usePostWizard } from '../hooks/usePostWizard';
import { useUI } from '@/hooks/useUI';
import { LocationMyLocationButton } from './LocationMyLocationButton';
import { SearchableDropdown } from '@/shared/ui/SearchableDropdown';

interface Props {
  isArabic: boolean;
  selectedCity: string;
  cities: string[];
  selectedNeighborhood: string;
  neighborhoods: string[];
  site: string;
  mapQuery: string;
  latitude?: number;
  longitude?: number;
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
  latitude,
  longitude,
  customCity,
  customNeighborhood,
  onCityChange,
  onNeighborhoodChange,
  onSiteChange,
  onCustomCityChange,
  onCustomNeighborhoodChange,
}) => {
  const { browseCountryCode } = useUI();
  const { postDraft } = usePostWizard();
  const pinLat = latitude ?? postDraft.latitude;
  const pinLng = longitude ?? postDraft.longitude;
  return (
    <div className="flex flex-col gap-4">
      <LocationMyLocationButton isArabic={isArabic} preferredCountry={browseCountryCode} onCityChange={onCityChange} onNeighborhoodChange={onNeighborhoodChange} />
      <div>
        <label className="block text-xs font-bold text-ink mb-1.5">{isArabic ? "المدينة / المحافظة" : "City / Governorate"}</label>
        <SearchableDropdown
          options={cities}
          value={selectedCity}
          onChange={onCityChange}
          placeholder={isArabic ? 'ابحث عن مدينة...' : 'Search city...'}
          isArabic={isArabic}
        />
      </div>
      {isOtherValue(selectedCity) && (
        <Input label={isArabic ? "اكتب اسم المدينة" : "Type city name"} type="text" value={customCity} onChange={(e) => onCustomCityChange(e.target.value)} placeholder={isArabic ? "مثال: الطفيلة" : "e.g., Tafilah"} className="h-11" />
      )}

      {neighborhoods.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-ink mb-1.5">{isArabic ? "المنطقة / الحي" : "Neighborhood / Area"}</label>
          <SearchableDropdown
            options={neighborhoods}
            value={selectedNeighborhood}
            onChange={onNeighborhoodChange}
            placeholder={isArabic ? 'ابحث عن حي...' : 'Search neighborhood...'}
            isArabic={isArabic}
          />

          {!selectedNeighborhood && (
            <p className="text-xs font-bold text-danger px-1 mt-1">
              {isArabic ? 'الرجاء اختيار الحي' : 'Please select a neighborhood'}
            </p>
          )}

          {isOtherValue(selectedNeighborhood) && (
            <Input label={isArabic ? "اكتب اسم المنطقة" : "Type neighborhood name"} type="text" value={customNeighborhood} onChange={(e) => onCustomNeighborhoodChange(e.target.value)} placeholder={isArabic ? "مثال: الرابية الجديدة" : "e.g., New Rabieh"} className="h-11" />
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
        <StaticMapPreview city={selectedCity} neighborhood={selectedNeighborhood} latitude={pinLat} longitude={pinLng} />
      </Card>
    </div>
  );
};
