import React from 'react';
import { ShieldAlert } from 'lucide-react';

export interface ListingAntiFraudBannerProps {
  isArabic: boolean;
}

export const ListingAntiFraudBanner: React.FC<ListingAntiFraudBannerProps> = React.memo(({ isArabic }) => (
  <div className="m-3 p-3 bg-danger/10 border-2 border-danger/40 rounded-2xl flex items-center gap-3 text-danger shadow-xs">
    <ShieldAlert size={22} className="shrink-0 text-danger" />
    <div className="text-xs font-bold leading-tight">
      <div>{isArabic ? 'هذا الإعلان غير متاح في بلدك الحالي' : 'This listing is not available in your current country'}</div>
      <div className="text-[10px] opacity-80 mt-0.5 font-normal">
        {isArabic
          ? 'تم تقييد إمكانيات التواصل لأن هذا الإعلان يتبع لدولة أخرى.'
          : 'Contact CTAs disabled as listing belongs to a different country.'}
      </div>
    </div>
  </div>
));

ListingAntiFraudBanner.displayName = 'ListingAntiFraudBanner';
