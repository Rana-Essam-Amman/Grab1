import React from 'react';
import { Location, CloseCircle } from 'iconsax-react';

export interface MarketContextBannerProps {
  readonly isArabic: boolean;
  readonly awayCountryLabelAr: string;
  readonly awayCountryLabelEn: string;
  readonly onExplore: () => void;
  readonly onDismiss: () => void;
}

export const MarketContextBanner: React.FC<MarketContextBannerProps> = ({
  isArabic, awayCountryLabelAr, awayCountryLabelEn, onExplore, onDismiss,
}) => {
  const label = isArabic ? awayCountryLabelAr : awayCountryLabelEn;
  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="mx-4 mt-3 p-3 rounded-2xl bg-accent/10 border border-accent/30 flex items-start gap-2.5"
      role="status"
      aria-live="polite"
    >
      <Location size={18} variant="Bold" className="text-accent shrink-0 mt-0.5" />
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <p className="text-xs text-ink font-bold leading-relaxed">
          {isArabic
            ? `يبدو أنك في ${label}. تبغى تستعرض إعلانات ${label}؟`
            : `Looks like you're in ${label}. Want to browse ${label} listings?`}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExplore}
            className="px-3 py-1.5 rounded-xl bg-accent text-white text-[11px] font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            {isArabic ? `استعرض ${label}` : `Browse ${label}`}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="px-3 py-1.5 rounded-xl text-ink-muted text-[11px] font-bold hover:bg-canvas cursor-pointer"
          >
            {isArabic ? 'لاحقاً' : 'Later'}
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={isArabic ? 'إغلاق' : 'Dismiss'}
        className="text-ink-muted hover:text-ink cursor-pointer shrink-0"
      >
        <CloseCircle size={16} variant="Linear" />
      </button>
    </div>
  );
};
