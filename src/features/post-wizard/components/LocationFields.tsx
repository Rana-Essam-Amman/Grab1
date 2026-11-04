// RULE-14-EXCEPTION: LocationFields must remain a single component to preserve state cohesion across city/neighborhood/site inputs + Live Search integration + static map preview. Splitting would require props drilling through 5+ levels.

import React, { useState } from 'react';
import { Input } from '@/shared/ui/Input';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@iconify/react';
import { isOtherValue } from '@/data/locations';
import { StaticMapPreview } from './StaticMapPreview';
import { usePostWizard } from '../hooks/usePostWizard';
import { useUI } from '@/hooks/useUI';
import { LocationMyLocationButton } from './LocationMyLocationButton';
import { SearchableDropdown } from '@/shared/ui/SearchableDropdown';
import { useLiveSearch } from '../hooks/useLiveSearch';
import { getMarketProfile } from '@/data/locations/marketProfiles';

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
  /** @deprecated Kept for backward compatibility with PhotoUploadScreen. Unused. */
  onJordanLocationSelect?: (res: unknown) => void;
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
  const profile = getMarketProfile(browseCountryCode);
  const cityLevel = profile?.visibleLevels[0];
  const areaLevel = profile?.visibleLevels[1];
  const cityLevelLabel = isArabic ? cityLevel?.labelAr : cityLevel?.labelEn;
  const areaLevelLabel = isArabic ? areaLevel?.labelAr : areaLevel?.labelEn;
  const { postDraft } = usePostWizard();
  const pinLat = latitude ?? postDraft.latitude;
  const pinLng = longitude ?? postDraft.longitude;

  const [liveQuery, setLiveQuery] = useState('');
  const { results: liveResults } = useLiveSearch({
    query: liveQuery,
    isArabic,
    countryCode: browseCountryCode,
  });

  const allNeighborhoods = Array.from(new Set([...neighborhoods, ...liveResults]));

  return (
    <div className="flex flex-col gap-4">
      <LocationMyLocationButton
        isArabic={isArabic}
        preferredCountry={browseCountryCode}
        onCityChange={onCityChange}
        onNeighborhoodChange={onNeighborhoodChange}
      />

      <div>
        <label className="block text-xs font-bold text-ink mb-1.5">
          {cityLevelLabel || (isArabic ? 'المدينة' : 'City')}
        </label>
        <div data-testid="location-city-wrapper">
          <SearchableDropdown
            options={cities}
            value={selectedCity}
            onChange={onCityChange}
            placeholder={isArabic ? 'ابحث عن مدينة...' : 'Search city...'}
            isArabic={isArabic}
          />
        </div>
      </div>
      {isOtherValue(selectedCity) && (
        <Input
          label={isArabic ? 'اكتب اسم المدينة' : 'Type city name'}
          type="text"
          value={customCity}
          onChange={(e) => onCustomCityChange(e.target.value)}
          placeholder={isArabic ? 'مثال: الطفيلة' : 'e.g., Tafilah'}
          className="h-11"
        />
      )}

      {neighborhoods.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-ink mb-1.5">
            {areaLevelLabel || (isArabic ? 'الحي' : 'Neighbourhood')}
          </label>
          <div data-testid="location-neighborhood-wrapper">
            <SearchableDropdown
              options={allNeighborhoods}
              value={selectedNeighborhood}
              onChange={onNeighborhoodChange}
              onSearch={setLiveQuery}
              placeholder={isArabic ? 'ابحث عن حي...' : 'Search neighbourhood...'}
              isArabic={isArabic}
            />
          </div>

          {!selectedNeighborhood && (
            <p className="text-xs font-bold text-danger px-1 mt-1">
              {isArabic ? 'الرجاء اختيار الحي' : 'Please select a neighbourhood'}
            </p>
          )}

          {isOtherValue(selectedNeighborhood) && (
            <Input
              label={isArabic ? 'اكتب اسم الحي' : 'Type neighbourhood name'}
              type="text"
              value={customNeighborhood}
              onChange={(e) => onCustomNeighborhoodChange(e.target.value)}
              placeholder={isArabic ? 'مثال: الرابية الجديدة' : 'e.g., New Rabieh'}
              className="h-11"
            />
          )}
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
        <StaticMapPreview
          city={selectedCity}
          neighborhood={selectedNeighborhood}
          latitude={pinLat}
          longitude={pinLng}
        />
      </Card>
    </div>
  );
};
