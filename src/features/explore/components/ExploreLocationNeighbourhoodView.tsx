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
    <div className="flex flex-col gap-3 font-cairo">
      <div className="flex items-center justify-between px-1">
        <button 
          type="button" 
          onClick={() => setSelectedCityForNeighs(null)} 
          className="text-xs font-bold text-[#E57E25] hover:underline flex items-center gap-1"
        >
          {isArabic ? <ArrowRight2 size={14} variant="Linear" /> : <ArrowLeft2 size={14} variant="Linear" />}
          <span>{isArabic ? 'العودة للمدن' : 'Back to Cities'}</span>
        </button>
        <span className="text-xs font-bold text-[#64748B]">{selectedCityForNeighs}</span>
      </div>
      
      <button
        type="button"
        onClick={() => handleCityTap(selectedCityForNeighs)}
        className="h-12 rounded-full bg-[#DDE3EC] text-[#0F172A] text-xs font-bold transition-all active:scale-[0.98]"
      >
        {isArabic ? `كل مناطق ${selectedCityForNeighs}` : `All areas in ${selectedCityForNeighs}`}
      </button>

      <div className="grid grid-cols-2 gap-3">
        {(currentLocations[selectedCityForNeighs] || []).map((neigh) => {
          const isSelected = activeNeighborhood === neigh;
          return (
            <button
              key={neigh}
              type="button"
              onClick={() => handleSelectNeighborhood(neigh)}
              className={`h-14 rounded-full flex items-center justify-between px-4 gap-2 transition-all active:scale-[0.98] ${
                isSelected 
                  ? 'bg-[#1a2238] text-white font-bold' 
                  : 'bg-[#DDE3EC] text-[#0F172A] font-bold'
              }`}
            >
              <span className="text-sm truncate flex-1 text-start">{neigh}</span>
              {isSelected && <TickCircle size={16} variant="Bold" color="#E57E25" className="shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
