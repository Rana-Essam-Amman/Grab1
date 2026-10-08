import React from 'react';

export interface BrandMarkProps {
  readonly isArabic: boolean;
}

/**
 * Vertical FOX brand stack for subpage headers.
 * Fox icon on top, FOX wordmark, MARKETPLACE tagline — all centered.
 * Airbnb/Booking pattern: compact corner brand on secondary screens.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({ isArabic }) => (
  <div
    className="flex flex-col items-center select-none shrink-0"
    aria-label={isArabic ? 'FOX ماركت بليس' : 'FOX Marketplace'}
  >
    <img
      src="/assets/icons/logo.png"
      alt=""
      className="w-[18px] h-[18px] object-contain"
    />
    <span className="text-[9px] font-black text-white leading-none mt-0.5 tracking-wide">
      FOX
    </span>
    <span className="text-[6px] font-bold text-white/65 leading-none tracking-[0.18em] mt-0.5">
      MARKETPLACE
    </span>
  </div>
);
