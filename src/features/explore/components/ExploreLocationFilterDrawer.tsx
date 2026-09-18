import React, { useState } from 'react';
import { Drawer } from '@/shared/ui/Drawer';
import { Check } from 'lucide-react';
import { locations, locationsAr } from '@/data/locations';
import { ExploreLocationCityList } from './ExploreLocationCityList';

export interface ExploreLocationFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  isArabic: boolean;
  activeNeighborhood: string | null;
  onSelectLocation: (location: string | null) => void;
  onSelectCity?: (cityEn: string, cityAr: string) => void;
  onSelectEntireCountry?: () => void;
  currentLocations: Record<string, string[]>;
  browseCountryCode?: string;
  cities?: string[];
}

const getCityPair = (cityName: string, countryCode: string): { cityEn: string; cityAr: string } => {
  const code = (countryCode as 'JO' | 'SA' | 'LB' | 'PS' | 'SY') || 'JO';
  const enKeys = Object.keys(locations[code] || {});
  const arKeys = Object.keys(locationsAr?.[code] || locations[code] || {});
  let idx = arKeys.indexOf(cityName);
  if (idx === -1) idx = enKeys.indexOf(cityName);
  if (idx !== -1) {
    return { cityEn: enKeys[idx] || cityName, cityAr: arKeys[idx] || cityName };
  }
  return { cityEn: cityName, cityAr: cityName };
};

export const ExploreLocationFilterDrawer: React.FC<ExploreLocationFilterDrawerProps> = React.memo(({
  open, onClose, isArabic, activeNeighborhood, onSelectLocation, onSelectCity, onSelectEntireCountry, currentLocations, browseCountryCode = '',
}) => {
  const [selectedCityForNeighs, setSelectedCityForNeighs] = useState<string | null>(null);

  const handleSelectEntireCountry = () => {
    if (onSelectEntireCountry) {
      onSelectEntireCountry();
    } else {
      onSelectLocation(null);
    }
    setSelectedCityForNeighs(null);
    onClose();
  };

  const handleCityTap = (cityName: string) => {
    const { cityEn, cityAr } = getCityPair(cityName, browseCountryCode);
    if (onSelectCity) {
      onSelectCity(cityEn, cityAr);
    } else {
      onSelectLocation(cityName);
    }
    setSelectedCityForNeighs(null);
    onClose();
  };

  const handleSelectNeighborhood = (neigh: string) => {
    if (selectedCityForNeighs) {
      const { cityEn, cityAr } = getCityPair(selectedCityForNeighs, browseCountryCode);
      onSelectCity?.(cityEn, cityAr);
    }
    onSelectLocation(neigh);
    setSelectedCityForNeighs(null);
    onClose();
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-40"
          onClick={onClose}
        />
      )}
      <Drawer 
        open={open} 
        onOpenChange={(isOpen) => !isOpen && onClose()} 
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <div className="flex flex-col gap-3 font-cairo">
          {/* Close Button Only */}
          <div className="relative w-full h-8 mb-2">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shadow-lg cursor-pointer border-none"
              aria-label="Close"
            >
              <span className="text-lg font-bold">×</span>
            </button>
          </div>

        <ExploreLocationCityList
          isArabic={isArabic}
          activeNeighborhood={activeNeighborhood}
          selectedCityForNeighs={selectedCityForNeighs}
          browseCountryCode={browseCountryCode}
          currentLocations={currentLocations}
          handleSelectEntireCountry={handleSelectEntireCountry}
          setSelectedCityForNeighs={setSelectedCityForNeighs}
          handleCityTap={handleCityTap}
          handleSelectNeighborhood={handleSelectNeighborhood}
        />
      </div>
    </Drawer>
    </>
  );
});

ExploreLocationFilterDrawer.displayName = 'ExploreLocationFilterDrawer';
