import React from 'react';
import { TickCircle } from 'iconsax-react';
import { ExploreLocationCityView } from './ExploreLocationCityView';
import { ExploreLocationNeighbourhoodView } from './ExploreLocationNeighbourhoodView';

export interface ExploreLocationCityListProps {
  isArabic: boolean;
  activeNeighborhood: string | null;
  selectedCityForNeighs: string | null;
  browseCountryCode: string;
  currentLocations: Record<string, string[]>;
  handleSelectEntireCountry: () => void;
  setSelectedCityForNeighs: (city: string | null) => void;
  handleCityTap: (cityName: string) => void;
  handleSelectNeighborhood: (neigh: string) => void;
}

export const ExploreLocationCityList: React.FC<ExploreLocationCityListProps> = ({
  isArabic, activeNeighborhood, selectedCityForNeighs, browseCountryCode,
  currentLocations, handleSelectEntireCountry, setSelectedCityForNeighs,
  handleCityTap, handleSelectNeighborhood
}) => {
  return (
    <div className="flex flex-col gap-3 overflow-y-auto max-h-[55vh] pe-1 -me-1">
      <button
        type="button"
        onClick={handleSelectEntireCountry}
        className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all cursor-pointer ${
          !activeNeighborhood 
            ? 'bg-brand text-white border-brand font-bold' 
            : 'bg-surface-sunken border-line text-ink hover:border-line-strong'
        }`}
      >
        <span className="text-sm font-bold">{isArabic ? `كامل الدولة (${browseCountryCode})` : `Entire Country (${browseCountryCode})`}</span>
        {!activeNeighborhood && <TickCircle size={18} variant="Bold" color="#E57E25" className="text-accent shrink-0" />}
      </button>

      {selectedCityForNeighs ? (
        <ExploreLocationNeighbourhoodView
          selectedCityForNeighs={selectedCityForNeighs}
          currentLocations={currentLocations}
          activeNeighborhood={activeNeighborhood}
          isArabic={isArabic}
          setSelectedCityForNeighs={setSelectedCityForNeighs}
          handleCityTap={handleCityTap}
          handleSelectNeighborhood={handleSelectNeighborhood}
        />
      ) : (
        <ExploreLocationCityView
          currentLocations={currentLocations}
          activeNeighborhood={activeNeighborhood}
          isArabic={isArabic}
          handleCityTap={handleCityTap}
          setSelectedCityForNeighs={setSelectedCityForNeighs}
        />
      )}
    </div>
  );
};
