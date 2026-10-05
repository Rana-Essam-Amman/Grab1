import React from 'react';
import { Warning2, Add } from 'iconsax-react';

export interface ExploreVoidedNoticeBannerProps {
  isArabic: boolean;
  voidedNotice: string;
  browseCountryCode?: string;
  onDismiss: () => void;
}

export const ExploreVoidedNoticeBanner: React.FC<ExploreVoidedNoticeBannerProps> = React.memo(({ isArabic, voidedNotice, browseCountryCode = '', onDismiss }) => (
  <div className="bg-warning/10 border border-warning/30 rounded-2xl p-3 flex items-center justify-between gap-2 shadow-2xs font-cairo animate-in fade-in">
    <div className="flex items-center gap-2">
      <Warning2 size={16} variant="Linear" color="currentColor" className="text-warning shrink-0" />
      <span className="text-xs font-bold text-ink">
        {isArabic
          ? `تم تجاهل الموقع "${voidedNotice}" لكونه خارج حدود دولة التصفح الحالية (${browseCountryCode}).`
          : `Location "${voidedNotice}" was ignored as it is outside the active tenant country (${browseCountryCode}).`}
      </span>
    </div>
    <button type="button" onClick={onDismiss} className="text-warning hover:text-ink cursor-pointer" aria-label="Dismiss">
      <Add size={14} variant="Linear" color="#EAB308" className="rotate-45" />
    </button>
  </div>
));

ExploreVoidedNoticeBanner.displayName = 'ExploreVoidedNoticeBanner';
