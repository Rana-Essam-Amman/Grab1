import React from 'react';
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
  isArabic, activeNeighborhood, selectedCityForNeighs, currentLocations, setSelectedCityForNeighs,
  handleCityTap, handleSelectNeighborhood
}) => {
  return (
    <div className="flex flex-col gap-3 overflow-y-auto max-h-[65vh]">
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
