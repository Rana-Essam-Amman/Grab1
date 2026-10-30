import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Global } from 'iconsax-react';
import { countries } from '@/data/countries';
import type { MarketCode } from '@/shared/lib/marketGate';

interface GuestCountrySelectProps {
  isArabic: boolean;
  onSelectCountry: (code: MarketCode) => void;
  onClose: () => void;
}

export const GuestCountrySelect: React.FC<GuestCountrySelectProps> = ({
  isArabic,
  onSelectCountry,
  onClose,
}) => {
  return (
    <div className="w-full">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 mx-auto">
        <Global size={32} variant="Bold" color="#E57E25" />
      </div>
      <h2 className="text-xl font-bold text-ink mb-2">
        {isArabic ? 'اختر الدولة للتصفح كزائر' : 'Select Country to Browse'}
      </h2>
      <p className="text-xs text-ink-muted leading-relaxed max-w-[280px] mb-6 mx-auto">
        {isArabic
          ? 'لتصفح الإعلانات والصفقات الخاصة ببلدك، يرجى تحديد السوق المحلي أولاً.'
          : 'To browse deals tailored to your area, please select your local marketplace first.'}
      </p>

      <div className="flex flex-col gap-3 w-full">
        {countries.map((c) => {
          return (
            <button
              key={c.code}
              onClick={() => onSelectCountry(c.code)}
              type="button"
              className="w-full h-12 bg-surface border border-border hover:border-primary hover:bg-surface text-ink text-sm font-bold rounded-xl flex items-center justify-between px-4 cursor-pointer transition-all active:scale-98"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {c.code === 'JO' ? '🇯🇴' : c.code === 'LB' ? '🇱🇧' : c.code === 'PS' ? '🇵🇸' : c.code === 'SY' ? '🇸🇾' : c.code === 'KW' ? '🇰🇼' : '🇸🇦'}
                </span>
                <span className="text-sm">{isArabic ? c.nameAr : c.nameEn}</span>
              </div>
              <span className="text-xs font-semibold text-primary">
                {isArabic ? 'دخول كزائر ←' : 'Browse Guest →'}
              </span>
            </button>
          );
        })}

        <Button
          onClick={onClose}
          type="button"
          variant="link"
          size="sm"
          className="mt-4 text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
        >
          {isArabic ? 'العودة للخلف' : 'Go Back'}
        </Button>
      </div>
    </div>
  );
};
