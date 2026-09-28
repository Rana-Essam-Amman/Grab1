import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { countries } from '@/data/countries';
import { locations, locationsAr } from '@/data/locations';
import { Lock1, CloseCircle } from 'iconsax-react';
import { Drawer } from '@/shared/ui/Drawer';
import { CountrySelectorTabs } from './CountrySelectorTabs';
import { CountrySheetCities } from '@/shared/components/markets/CountrySheetCities';

export const CountrySheet: React.FC = () => {
  const { isArabic, isCountrySheetOpen, setIsCountrySheetOpen, browseCountryCode, browseCityEn, browseCityAr, setBrowseLocation } = useUI();
  const { user, authStatus } = useAuth();
  const isAuthenticated = authStatus === 'authenticated';
  const [selectedCountry, setSelectedCountry] = useState<'JO' | 'LB' | 'PS' | 'SY' | 'SA'>(
    (browseCountryCode as 'JO' | 'LB' | 'PS' | 'SY' | 'SA') || 'JO'
  );

  useEffect(() => {
    if (isCountrySheetOpen && browseCountryCode) {
      setSelectedCountry(browseCountryCode as 'JO' | 'LB' | 'PS' | 'SY' | 'SA');
    }
  }, [isCountrySheetOpen, browseCountryCode]);

  const filteredCountries = useMemo(() => {
    if (isAuthenticated && user?.countryCode) {
      return countries.filter(c => c.code === user.countryCode);
    }
    return countries;
  }, [isAuthenticated, user?.countryCode]);

  const citiesEn = useMemo(
    () => Object.keys(locations[selectedCountry] || {}),
    [selectedCountry]
  );

  const citiesAr = useMemo(
    () => Object.keys(locationsAr[selectedCountry] || locations[selectedCountry] || {}),
    [selectedCountry]
  );

  const handleCountryChange = useCallback((code: string) => {
    if (isAuthenticated && user?.countryCode && code !== user.countryCode) return;
    setSelectedCountry(code as 'JO' | 'LB' | 'PS' | 'SY' | 'SA');
  }, [isAuthenticated, user?.countryCode]);

  const handleCitySelect = useCallback(
    (index: number) => {
      const country = selectedCountry;
      const cityEn = citiesEn[index];
      const cityAr = citiesAr[index] || cityEn;
      if (!cityEn) return;
      setBrowseLocation(country, cityEn, cityAr);
      setIsCountrySheetOpen(false);
    },
    [citiesEn, citiesAr, selectedCountry, setBrowseLocation, setIsCountrySheetOpen]
  );

  return (
    <Drawer
      open={isCountrySheetOpen}
      onOpenChange={setIsCountrySheetOpen}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="max-w-[440px] mx-auto"
    >
      <div className="flex flex-col gap-3 font-cairo">
        {/* Close button (top-start) */}
        <div className="flex items-start justify-start">
          <button
            onClick={() => setIsCountrySheetOpen(false)}
            aria-label="Close"
            className="w-10 h-10 rounded-full bg-[#1a2238] text-white flex items-center justify-center shadow-md active:scale-95"
          >
            <CloseCircle size={18} variant="Bold" color="#FFFFFF" />
          </button>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#DC2626]/5 text-[#DC2626] rounded-xl text-[10px] font-bold self-start border border-[#DC2626]/10">
            <Lock1 size={12} variant="Linear" />
            <span>{isArabic ? 'تم قفل المتجر على دولتك المسجلة' : 'Store locked to your country'}</span>
          </div>
        )}

        {/* Country tabs — small pills row */}
        <CountrySelectorTabs
          filteredCountries={filteredCountries}
          selectedCountry={selectedCountry}
          isArabic={isArabic}
          handleCountryChange={handleCountryChange}
        />

        {/* Cities grid */}
        <CountrySheetCities
          citiesEn={citiesEn}
          citiesAr={citiesAr}
          selectedCountry={selectedCountry}
          browseCountryCode={browseCountryCode}
          browseCityEn={browseCityEn}
          browseCityAr={browseCityAr}
          isArabic={isArabic}
          handleCitySelect={handleCitySelect}
        />
      </div>
    </Drawer>
  );
};
