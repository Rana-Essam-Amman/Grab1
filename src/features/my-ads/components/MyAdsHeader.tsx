import React from 'react';
import { Add, ArrowLeft, ArrowRight } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';

interface MyAdsHeaderProps {
  readonly isArabic: boolean;
  readonly onBack: () => void;
  readonly onNewAd: () => void;
}

export const MyAdsHeader: React.FC<MyAdsHeaderProps> = ({ isArabic, onBack, onNewAd }) => {
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label={isArabic ? 'رجوع' : 'Back'}
          className="mt-0.5 w-9 h-9 rounded-full bg-canvas border border-line flex items-center justify-center hover:bg-surface transition-colors shrink-0"
        >
          <BackIcon size={18} variant="Linear" className="text-ink" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-ink">{isArabic ? 'إعلاناتي والمفضلة' : 'My Ads & Favorites'}</h1>
          <p className="text-xs text-ink-muted">{isArabic ? 'إدارة إعلاناتك المنشورة وإعلاناتك المفضلة' : 'Manage your active listings and favorite ads'}</p>
        </div>
      </div>
      <Button variant="primary" size="md" onClick={onNewAd} className="rounded-full flex items-center gap-1 text-xs font-bold shadow-xs transition-colors">
        <Add size={16} variant="Linear" color="#FFFFFF" />
        <span>{isArabic ? 'إعلان جديد' : 'New Ad'}</span>
      </Button>
    </div>
  );
};
