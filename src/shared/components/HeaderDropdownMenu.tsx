import React from 'react';
import { User, Global, Heart, Notification, MessageQuestion, Setting2 } from 'iconsax-react';
import { MARKETS } from '@/data/markets/config';
import type { MarketCode } from '@/data/markets/types';
import { useUI } from '@/hooks/useUI';

interface HeaderDropdownMenuProps {
  isArabic: boolean;
  browseCountry: { nameAr: string; nameEn: string; flagUrl: string; currencies: Array<{ code: string }> };
  displayCityAr: string;
  displayCityEn: string;
  handleMenuClose: () => void;
  handleProfileNav: () => void;
  handleSettingsNav: () => void;
  handleLanguageToggle: () => void;
  handleWishlistNav: () => void;
  wishlistLength: number;
  handleNotificationsNav: () => void;
  activeCurrency: string;
  handleCurrencySelect: (code: string) => void;
  setIsCountrySheetOpen: (open: boolean) => void;
}

export const HeaderDropdownMenu: React.FC<HeaderDropdownMenuProps> = ({
  isArabic,
  handleMenuClose,
  handleProfileNav,
  handleSettingsNav,
  handleLanguageToggle,
  handleWishlistNav,
  wishlistLength,
  handleNotificationsNav,
  setIsCountrySheetOpen,
}) => {
  const { browseCountryCode } = useUI();
  const market = MARKETS[browseCountryCode as MarketCode];

  return (
    <>
      {/* Backdrop covers entire screen to handle outside click closing */}
      <div
        className="fixed inset-0 z-[99] cursor-pointer"
        onClick={handleMenuClose}
      />

      {/* Dropdown panel */}
      <div className="absolute top-full start-0 w-72 mt-1 z-[100] bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden">
        <div className="divide-y divide-border bg-surface flex flex-col">
          <button
            type="button"
            onClick={() => { setIsCountrySheetOpen(true); handleMenuClose(); }}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-start hover:bg-canvas/40 active:bg-canvas/60"
          >
            <span className="text-sm font-bold text-ink flex items-center gap-2">
              <img
                src={`/flags/${browseCountryCode.toLowerCase()}.jpg`}
                alt=""
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>{isArabic ? market.nameAr : market.nameEn}</span>
            </span>
            <Global variant="Bold" size={22} color="#0EA5E9" className="shrink-0" />
          </button>

          <button
            onClick={() => { handleProfileNav(); handleMenuClose(); }}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-start hover:bg-canvas/40 active:bg-canvas/60"
          >
            <span className="text-sm font-bold text-ink">
              {isArabic ? 'الملف الشخصي' : 'My Profile'}
            </span>
            <User variant="Bold" size={22} color="#B85CF6" className="shrink-0" />
          </button>

          <button
            onClick={() => { handleSettingsNav(); handleMenuClose(); }}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-start hover:bg-canvas/40 active:bg-canvas/60"
          >
            <span className="text-sm font-bold text-ink">
              {isArabic ? 'إعدادات الحساب' : 'Account Settings'}
            </span>
            <Setting2 variant="Bold" size={22} color="#64748B" className="shrink-0" />
          </button>

          <button
            onClick={() => { handleLanguageToggle(); handleMenuClose(); }}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-start hover:bg-canvas/40 active:bg-canvas/60"
          >
            <span className="text-sm font-bold text-ink">
              {isArabic ? 'English' : 'العربية'}
            </span>
            <Global variant="Bold" size={22} color="#16A34A" className="shrink-0" />
          </button>

          <button
            onClick={() => { handleWishlistNav(); handleMenuClose(); }}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-start hover:bg-canvas/40 active:bg-canvas/60"
          >
            <span className="text-sm font-bold text-ink flex items-center gap-2">
              {isArabic ? 'المفضلة' : 'Favorites'}
              {wishlistLength > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-danger text-white text-[11px] font-bold">
                  {wishlistLength}
                </span>
              )}
            </span>
            <Heart variant="Bold" size={22} color="#EF4444" className="shrink-0" />
          </button>

          <button
            onClick={() => { handleNotificationsNav(); handleMenuClose(); }}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-start hover:bg-canvas/40 active:bg-canvas/60"
          >
            <span className="text-sm font-bold text-ink">
              {isArabic ? 'الإشعارات والتنبيهات' : 'Notifications & Alerts'}
            </span>
            <Notification variant="Bold" size={22} color="#F59E0B" className="shrink-0" />
          </button>

          <a
            href="mailto:Sufyanyounis83@gmail.com?subject=FOX%20Marketplace%20%E2%80%94%20Feedback"
            onClick={handleMenuClose}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-start hover:bg-canvas/40 active:scale-[0.99] transition-all bg-surface border-none cursor-pointer no-underline"
          >
            <span className="text-sm font-bold text-ink">
              {isArabic ? 'اقتراح أو تواصل' : 'Send Feedback'}
            </span>
            <MessageQuestion variant="Bold" size={22} color="#06B6D4" className="shrink-0" />
          </a>
        </div>
      </div>
    </>
  );
};
