import React from 'react';
import { Location } from 'iconsax-react';

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
    <div className="flex flex-col gap-2 font-cairo">
      <span className="text-xs font-bold text-ink-muted px-1">{isArabic ? 'اختر المدينة لعرض الأحياء' : 'Select City to view Neighborhoods'}</span>
      <div className="grid grid-cols-2 gap-2 pt-1">
        {Object.keys(currentLocations).map((cityName) => {
          const isSelected = activeNeighborhood === cityName;
          const hasNeighs = (currentLocations[cityName] || []).length > 0;
          return (
            <div
              key={cityName}
              className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between group cursor-pointer ${
                isSelected 
                  ? 'bg-brand text-white border-brand' 
                  : 'bg-surface-sunken border-line text-ink hover:border-line-strong'
              }`}
            >
              <button
                type="button"
                onClick={() => handleCityTap(cityName)}
                className="flex items-center gap-1.5 flex-1 text-start cursor-pointer font-bold border-none bg-transparent"
              >
                <Location size={14} variant="Linear" className={isSelected ? 'text-accent shrink-0' : 'text-ink-muted shrink-0 group-hover:text-ink'} />
                <span className="line-clamp-1">{cityName}</span>
              </button>
              {hasNeighs && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelectedCityForNeighs(cityName); }}
                  className={`px-1.5 py-0.5 rounded cursor-pointer border-none bg-transparent ${isSelected ? 'text-white/85 hover:text-white' : 'text-ink-soft hover:text-ink'}`}
                  title={isArabic ? 'الأحياء' : 'Neighborhoods'}
                >
                  <span className="text-sm font-bold">›</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
