import React, { useState, useEffect } from 'react';
import { Drawer } from '@/shared/ui/Drawer';
import { CloseCircle } from 'iconsax-react';
import { ExploreLocationCityList } from './ExploreLocationCityList';
import { getCityPair } from '@/shared/lib/locationHelpers';
import { EntireCountryPill } from './EntireCountryPill';

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
  readonly initialCityForNeighs?: string;
}

export const ExploreLocationFilterDrawer: React.FC<ExploreLocationFilterDrawerProps> = React.memo(({
  open, onClose, isArabic, activeNeighborhood, onSelectLocation, onSelectCity, onSelectEntireCountry, currentLocations, browseCountryCode = '', initialCityForNeighs,
}) => {
  const [selectedCityForNeighs, setSelectedCityForNeighs] = useState<string | null>(
    initialCityForNeighs || null
  );

  useEffect(() => {
    if (open && initialCityForNeighs) {
      setSelectedCityForNeighs(initialCityForNeighs);
    }
  }, [open, initialCityForNeighs]);

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
    <Drawer 
      open={open} 
      onOpenChange={(isOpen) => !isOpen && onClose()} 
      dir={isArabic ? 'rtl' : 'ltr'}
      className="max-w-[440px] mx-auto"
    >
      <div className="flex flex-col gap-3 font-cairo">
        {/* Close button (top-start) */}
        <div className="flex items-start justify-start">
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shadow-md active:scale-95"
          >
            <CloseCircle size={18} variant="Bold" color="currentColor" />
          </button>
        </div>

        {/* Primary Pill ("all" option) */}
        {!selectedCityForNeighs && (
          <EntireCountryPill
            isArabic={isArabic}
            browseCountryCode={browseCountryCode}
            activeNeighborhood={activeNeighborhood}
            onClick={handleSelectEntireCountry}
          />
        )}

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
  );
});

ExploreLocationFilterDrawer.displayName = 'ExploreLocationFilterDrawer';
