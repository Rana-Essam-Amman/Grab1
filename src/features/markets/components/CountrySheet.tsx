import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { countries } from '@/data/countries';
import { locations, locationsAr } from '@/data/locations';
import { Lock1 } from 'iconsax-react';
import { Drawer } from '@/shared/ui/Drawer';
import { CountrySelectorTabs } from './CountrySelectorTabs';
import { CountrySheetCities } from './CountrySheetCities';

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
    () => Object.keys(locationsAr?.[selectedCountry] || locations[selectedCountry] || {}),
    [selectedCountry]
  );

  const handleCountryChange = useCallback((code: string) => {
    if (isAuthenticated && user?.countryCode && code !== user.countryCode) return;
    setSelectedCountry(code as 'JO' | 'LB' | 'PS' | 'SY' | 'SA');
  }, [isAuthenticated, user?.countryCode]);

  const handleCitySelect = useCallback(
    (index: number) => {
      const cEn = citiesEn[index] || citiesEn[0];
      const cAr = citiesAr[index] || cEn;
      setBrowseLocation(selectedCountry, cEn, cAr);
      setIsCountrySheetOpen(false);
    },
    [citiesEn, citiesAr, selectedCountry, setBrowseLocation, setIsCountrySheetOpen]
  );

  return (
    <Drawer
      open={isCountrySheetOpen}
      onOpenChange={setIsCountrySheetOpen}
      className="font-cairo max-w-[440px]"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col gap-3 font-cairo">
        {/* Close Button Only */}
        <div className="relative w-full h-6 mb-2">
          <button
            type="button"
            onClick={() => setIsCountrySheetOpen(false)}
            className={`absolute top-0 ${isArabic ? 'left-0' : 'right-0'} text-ink hover:text-ink-strong w-6 h-6 flex items-center justify-center cursor-pointer text-lg font-sans font-bold`}
          >
            ✕
          </button>
        </div>

        {/* Content list */}
        <div className="flex flex-col gap-4 max-h-[55vh] overflow-y-auto pe-1 -me-1">
          {isAuthenticated && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary rounded-xl text-[10px] font-bold self-start border border-primary/10">
              <Lock1 size={12} variant="Linear" />
              <span>{isArabic ? 'تم قفل المتجر على دولتك المسجلة' : 'Store locked to your registered country'}</span>
            </div>
          )}

          {/* Country Selector Tabs */}
          <CountrySelectorTabs
            filteredCountries={filteredCountries}
            selectedCountry={selectedCountry}
            isArabic={isArabic}
            handleCountryChange={handleCountryChange}
          />

          {/* City List */}
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
      </div>
    </Drawer>
  );
};
