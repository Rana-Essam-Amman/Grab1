import React from 'react';

export interface BrandMarkProps {
  readonly isArabic: boolean;
  readonly tone?: 'light' | 'dark';
}

export const BrandMark: React.FC<BrandMarkProps> = ({ isArabic, tone = 'light' }) => {
  const primary = tone === 'light' ? 'text-white' : 'text-ink';
  const secondary = tone === 'light' ? 'text-white/65' : 'text-ink-muted';
  return (
    <div
      className="flex flex-col items-center select-none shrink-0"
      aria-label={isArabic ? 'FOX ماركت بليس' : 'FOX Marketplace'}
    >
      <img
        src="/assets/icons/logo.png"
        alt=""
        className="w-10 h-10 object-contain"
      />
      <span className={`text-[13px] font-black ${primary} leading-none mt-0.5 tracking-wide`}>
        FOX
      </span>
      <span className={`text-[8px] font-bold ${secondary} leading-none tracking-[0.18em] mt-0.5`}>
        MARKETPLACE
      </span>
    </div>
  );
};
