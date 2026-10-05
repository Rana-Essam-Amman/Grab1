import React from 'react';
import { CloseCircle } from 'iconsax-react';
import { Drawer } from '@/shared/ui/Drawer';
import { CountrySheetCities } from '@/shared/components/markets/CountrySheetCities';
import { locationsWithOther, locationsArWithOther } from '@/data/locations';

interface AiReviewCityDrawerProps {
  readonly isArabic: boolean;
  readonly open: boolean;
  readonly onClose: () => void;
  readonly browseCountryCode: string;
  readonly currentCity: string;
  readonly onSelect: (cityEn: string, cityAr: string) => void;
}

export const AiReviewCityDrawer: React.FC<AiReviewCityDrawerProps> = ({
  isArabic, open, onClose, browseCountryCode, currentCity, onSelect,
}) => {
  const citiesEn = Object.keys(locationsWithOther[browseCountryCode] || {});
  const citiesAr = Object.keys(locationsArWithOther[browseCountryCode] || {});
  const currentIdx = citiesEn.indexOf(currentCity);
  const currentCityAr = currentIdx >= 0 ? (citiesAr[currentIdx] || currentCity) : currentCity;

  const handleCitySelect = (idx: number) => {
    const cityEn = citiesEn[idx];
    const cityAr = citiesAr[idx] || cityEn;
    onSelect(cityEn, cityAr);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(o) => { if (!o) onClose(); }}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="max-w-[440px] mx-auto"
    >
      <div className="flex flex-col gap-3 font-cairo">
        <div className="flex items-start justify-start">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shadow-md active:scale-95"
          >
            <CloseCircle size={18} variant="Bold" color="#FFFFFF" />
          </button>
        </div>
        <h2 className="text-lg font-bold text-ink px-1">
          {isArabic ? 'اختر المدينة' : 'Select city'}
        </h2>
        <CountrySheetCities
          citiesEn={citiesEn}
          citiesAr={citiesAr}
          selectedCountry={browseCountryCode}
          browseCountryCode={browseCountryCode}
          browseCityEn={currentCity}
          browseCityAr={currentCityAr}
          isArabic={isArabic}
          handleCitySelect={handleCitySelect}
        />
      </div>
    </Drawer>
  );
};
