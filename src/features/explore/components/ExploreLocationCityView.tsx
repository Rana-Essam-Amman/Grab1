import React from 'react';
import { TickCircle } from 'iconsax-react';
import { Icon } from '@iconify/react';

interface ExploreLocationCityViewProps {
  currentLocations: Record<string, string[]>;
  activeNeighborhood: string | null;
  isArabic: boolean;
  handleCityTap: (cityName: string) => void;
  setSelectedCityForNeighs: (cityName: string) => void;
}

export const ExploreLocationCityView: React.FC<ExploreLocationCityViewProps> = ({
  currentLocations,
  activeNeighborhood,
  isArabic,
  handleCityTap,
  setSelectedCityForNeighs,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Object.keys(currentLocations).map((cityName) => {
        const isSelected = activeNeighborhood === cityName;
        const hasNeighs = (currentLocations[cityName] || []).length > 0;
        
        return (
          <button
            key={cityName}
            onClick={() => handleCityTap(cityName)}
            className={`h-14 rounded-full flex items-center justify-between px-4 gap-2 transition-all active:scale-[0.98] ${
              isSelected
                ? 'bg-[#1a2238] text-white font-bold'
                : 'bg-[#DDE3EC] text-[#0F172A] font-bold'
            }`}
          >
            <span className="text-sm truncate flex-1 text-start">{cityName}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              {hasNeighs && (
                <div 
                  onClick={(e) => { e.stopPropagation(); setSelectedCityForNeighs(cityName); }}
                  className={`w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 cursor-pointer ${isSelected ? 'text-[#E57E25]' : 'text-[#64748B]'}`}
                  title={isArabic ? 'الأحياء' : 'Neighborhoods'}
                >
                  <span className="text-sm">›</span>
                </div>
              )}
              {isSelected ? (
                <TickCircle size={16} variant="Bold" color="#E57E25" className="shrink-0" />
              ) : (
                <Icon icon="noto:round-pushpin" width={14} height={14} className="shrink-0" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
