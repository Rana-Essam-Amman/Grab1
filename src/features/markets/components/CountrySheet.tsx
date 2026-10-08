import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import React, { useCallback } from 'react';
import { CloseCircle, TickCircle } from 'iconsax-react';
import { Drawer } from '@/shared/ui/Drawer';
import { MARKETS, ALL_MARKET_CODES } from '@/data/markets/config';
import { saveBrowseMarket } from '@/shared/lib/profilesService';
import type { MarketCode } from '@/data/markets/types';

const FLAG_SRC: Record<MarketCode, string> = {
  JO: '/flags/jo.jpg',
  SA: '/flags/sa.jpg',
  LB: '/flags/lb.jpg',
  PS: '/flags/ps.jpg',
  SY: '/flags/sy.jpg',
};

export const CountrySheet: React.FC = () => {
  const {
    isArabic,
    isCountrySheetOpen,
    setIsCountrySheetOpen,
    browseCountryCode,
    setBrowseMarketOverrideLocal,
  } = useUI();
  const { user, authStatus, updateUser } = useAuth();
  const isAuthenticated = authStatus === 'authenticated';

  const handleMarketSelect = useCallback(
    (market: MarketCode) => {
      const override = user?.countryCode === market ? null : market;
      setBrowseMarketOverrideLocal(market);
      if (isAuthenticated && user?.id) {
        updateUser({ browseMarket: override });
        void saveBrowseMarket(user.id, override).catch(() => {});
      }
      setIsCountrySheetOpen(false);
    },
    [setBrowseMarketOverrideLocal, setIsCountrySheetOpen, isAuthenticated, user, updateUser]
  );

  return (
    <Drawer
      open={isCountrySheetOpen}
      onOpenChange={setIsCountrySheetOpen}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="max-w-[440px] mx-auto"
    >
      <div className="flex flex-col gap-3 font-cairo" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="flex items-start justify-start">
          <button
            onClick={() => setIsCountrySheetOpen(false)}
            aria-label={isArabic ? 'إغلاق' : 'Close'}
            className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shadow-md active:scale-95 cursor-pointer"
          >
            <CloseCircle size={18} variant="Bold" color="#FFFFFF" />
          </button>
        </div>

        <div className="px-1">
          <h2 className="text-base font-bold text-ink">
            {isArabic ? 'اختر السوق' : 'Choose market'}
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            {isArabic ? 'تتصفح إعلانات السوق المختار فقط.' : 'You will browse the selected market only.'}
          </p>
        </div>

        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
          {ALL_MARKET_CODES.map((code) => {
            const market = MARKETS[code];
            const isCurrent = browseCountryCode === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleMarketSelect(code)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border transition-all active:scale-[0.99] cursor-pointer ${
                  isCurrent
                    ? 'bg-brand text-white border-brand'
                    : 'bg-surface text-ink border-border hover:border-accent/50'
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <img src={FLAG_SRC[code]} alt="" loading="lazy" decoding="async" className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <span className="flex flex-col items-start min-w-0">
                    <span className="text-sm font-bold truncate">
                      {isArabic ? market.nameAr : market.nameEn}
                    </span>
                    <span
                      className={`text-[10px] ${
                        isCurrent ? 'text-white/70' : 'text-ink-muted'
                      }`}
                    >
                      {isArabic ? market.nameEn : market.nameAr}
                    </span>
                  </span>
                </span>
                {isCurrent && (
                  <TickCircle
                    size={20}
                    variant="Bold"
                    color="currentColor"
                    className="text-accent shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Drawer>
  );
};
