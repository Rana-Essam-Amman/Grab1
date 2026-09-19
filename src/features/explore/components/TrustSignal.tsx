import React from 'react';
import { Location } from 'iconsax-react';

interface TrustSignalProps {
  market: string;
  listingsCount: number;
  isArabic: boolean;
}

export const TrustSignal: React.FC<TrustSignalProps> = ({
  market,
  listingsCount,
  isArabic,
}) => {
  const countDisplay = listingsCount.toLocaleString();

  return (
    <div
      className="flex items-center justify-center gap-2 px-4 py-2 text-xs text-ink-soft"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <span className="flex items-center gap-1">
        <Location variant="Bold" size={12} color="#E57E25" />
        <span className="font-medium text-ink">{market}</span>
      </span>
      <span className="text-line-strong">·</span>
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
        <span>
          {isArabic
            ? `${countDisplay} إعلان نشط اليوم`
            : `${countDisplay} active listings`}
        </span>
      </span>
    </div>
  );
};
