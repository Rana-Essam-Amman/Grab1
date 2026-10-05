import React from 'react';
import { TickCircle } from 'iconsax-react';

interface EntireCountryPillProps {
  isArabic: boolean;
  browseCountryCode: string;
  activeNeighborhood: string | null;
  onClick: () => void;
}

export const EntireCountryPill: React.FC<EntireCountryPillProps> = ({
  isArabic, browseCountryCode, activeNeighborhood, onClick
}) => {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`w-full h-14 rounded-full flex items-center justify-between px-4 font-bold transition-all active:scale-[0.98] ${
        !activeNeighborhood 
          ? 'bg-brand text-white' 
          : 'bg-surface-sunken text-ink'
      }`}
    >
      <span className="text-sm">
        {isArabic ? `كامل الدولة (${browseCountryCode})` : `Entire Country (${browseCountryCode})`}
      </span>
      {!activeNeighborhood && (
        <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
          <TickCircle size={14} variant="Bold" color="currentColor" className="text-white" />
        </span>
      )}
    </button>
  );
};
