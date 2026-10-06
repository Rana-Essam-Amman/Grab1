import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { countries } from '@/data/countries';
import { locationsWithOther as locations, locationsArWithOther as locationsAr } from '@/data/locations';
import { CloseCircle } from 'iconsax-react';
import { Drawer } from '@/shared/ui/Drawer';
import { CountrySelectorTabs } from './CountrySelectorTabs';
import { CountrySheetCities } from '@/shared/components/markets/CountrySheetCities';
import { saveBrowseMarket } from '@/shared/lib/profilesService';

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

  // Markets are open to all — no filtering.
  const filteredCountries = countries;

  const citiesEn = useMemo(
    () => Object.keys(locations[selectedCountry] || {}),
    [selectedCountry]
  );

  const citiesAr = useMemo(
    () => Object.keys(locationsAr[selectedCountry] || locations[selectedCountry] || {}),
    [selectedCountry]
  );

  const handleCountryChange = useCallback((code: string) => {
    setSelectedCountry(code as 'JO' | 'LB' | 'PS' | 'SY' | 'SA');
  }, []);

  const handleCitySelect = useCallback(
    (index: number) => {
      const country = selectedCountry;
      const cityEn = citiesEn[index];
      const cityAr = citiesAr[index] || cityEn;
      if (!cityEn) return;
      setBrowseLocation(country, cityEn, cityAr);

      // Persist the market choice to Supabase for signed-in users.
      if (isAuthenticated && user?.id) {
        const override = user.countryCode === country ? null : country;
        void saveBrowseMarket(user.id, override).catch(() => {});
      }

      setIsCountrySheetOpen(false);
    },
    [citiesEn, citiesAr, selectedCountry, setBrowseLocation, setIsCountrySheetOpen, isAuthenticated, user]
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
            className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shadow-md active:scale-95"
          >
            <CloseCircle size={18} variant="Bold" color="#FFFFFF" />
          </button>
        </div>



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
