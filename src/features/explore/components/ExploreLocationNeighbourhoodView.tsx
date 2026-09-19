import React from 'react';
import { TickCircle, ArrowRight2, ArrowLeft2 } from 'iconsax-react';

interface ExploreLocationNeighbourhoodViewProps {
  selectedCityForNeighs: string;
  currentLocations: Record<string, string[]>;
  activeNeighborhood: string | null;
  isArabic: boolean;
  setSelectedCityForNeighs: (city: string | null) => void;
  handleCityTap: (cityName: string) => void;
  handleSelectNeighborhood: (neigh: string) => void;
}

export const ExploreLocationNeighbourhoodView: React.FC<ExploreLocationNeighbourhoodViewProps> = ({
  selectedCityForNeighs,
  currentLocations,
  activeNeighborhood,
  isArabic,
  setSelectedCityForNeighs,
  handleCityTap,
  handleSelectNeighborhood,
}) => {
  return (
    <div className="flex flex-col gap-2 font-cairo">
      <div className="flex items-center justify-between px-1">
        <button 
          type="button" 
          onClick={() => setSelectedCityForNeighs(null)} 
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer border-none bg-transparent"
        >
          {isArabic ? <ArrowRight2 size={14} variant="Linear" className="inline" /> : <ArrowLeft2 size={14} variant="Linear" className="inline" />}
          <span>{isArabic ? 'العودة للمدن' : 'Back to Cities'}</span>
        </button>
        <span className="text-xs font-bold text-ink-muted">{selectedCityForNeighs}</span>
      </div>
      
      <button
        type="button"
        onClick={() => handleCityTap(selectedCityForNeighs)}
        className="px-4 py-3 rounded-2xl border border-line bg-surface-sunken text-ink hover:border-line-strong text-xs font-bold transition-all text-start cursor-pointer"
      >
        {isArabic ? `كل مناطق ${selectedCityForNeighs}` : `All areas in ${selectedCityForNeighs}`}
      </button>

      <div className="grid grid-cols-2 gap-2 pt-1">
        {(currentLocations[selectedCityForNeighs] || []).map((neigh) => {
          const isSelected = activeNeighborhood === neigh;
          return (
            <button
              key={neigh}
              type="button"
              onClick={() => handleSelectNeighborhood(neigh)}
              className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all text-start cursor-pointer flex items-center justify-between ${
                isSelected 
                  ? 'bg-brand text-white border-brand' 
                  : 'bg-surface-sunken border-line text-ink hover:border-line-strong'
              }`}
            >
              <span className="line-clamp-1">{neigh}</span>
              {isSelected && <TickCircle size={14} variant="Bold" color="#E57E25" className="text-accent shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
