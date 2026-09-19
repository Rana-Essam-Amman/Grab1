import React from 'react';
import { User, Global, Heart, Notification } from 'iconsax-react';

interface HeaderDropdownMenuProps {
  isArabic: boolean;
  browseCountry: { nameAr: string; nameEn: string; flagUrl: string; currencies: Array<{ code: string }> };
  displayCityAr: string;
  displayCityEn: string;
  handleMenuClose: () => void;
  handleProfileNav: () => void;
  handleLanguageToggle: () => void;
  handleWishlistNav: () => void;
  wishlistLength: number;
  handleNotificationsNav: () => void;
  activeCurrency: string;
  handleCurrencySelect: (code: string) => void;
}

export const HeaderDropdownMenu: React.FC<HeaderDropdownMenuProps> = ({
  isArabic, handleMenuClose, handleProfileNav, handleLanguageToggle,
  handleWishlistNav, wishlistLength, handleNotificationsNav,
}) => {
  return (
    <>
      {/* Backdrop covers entire screen to handle outside click closing */}
      <div
        className="fixed inset-0 bg-black/20 z-[99] cursor-pointer"
        onClick={handleMenuClose}
      />

      {/* Dropdown panel */}
      <div
        className={`absolute top-full ${isArabic ? 'right-4' : 'left-4'} w-64 mt-2 z-[100] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden font-cairo`}
      >
        <div className="p-1.5 flex flex-col gap-1 bg-white">
          <button
            onClick={() => {
              handleProfileNav();
              handleMenuClose();
            }}
            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-900 transition-colors cursor-pointer text-start border-none bg-transparent"
          >
            <span className="font-medium text-sm text-gray-900">
              {isArabic ? 'الملف الشخصي' : 'My Profile'}
            </span>
            <User variant="Bold" size={20} color="#64748B" className="shrink-0" />
          </button>

          <button
            onClick={() => {
              handleLanguageToggle();
              handleMenuClose();
            }}
            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-900 transition-colors cursor-pointer text-start border-none bg-transparent"
          >
            <span className="font-medium text-sm text-gray-900">
              {isArabic ? 'English' : 'العربية'}
            </span>
            <Global variant="Bold" size={20} color="#64748B" className="shrink-0" />
          </button>

          <button
            onClick={() => {
              handleWishlistNav();
              handleMenuClose();
            }}
            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-900 transition-colors cursor-pointer text-start border-none bg-transparent"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm text-gray-900">
                {isArabic ? 'المفضلة' : 'Favorites'}
              </span>
              {wishlistLength > 0 && (
                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  {wishlistLength}
                </span>
              )}
            </div>
            <Heart variant="Bold" size={20} color="#EF4444" className="shrink-0" />
          </button>

          <button
            onClick={() => {
              handleNotificationsNav();
              handleMenuClose();
            }}
            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-900 transition-colors cursor-pointer text-start border-none bg-transparent"
          >
            <span className="font-medium text-sm text-gray-900">
              {isArabic ? 'الإشعارات والتنبيهات' : 'Notifications'}
            </span>
            <Notification variant="Bold" size={20} color="#64748B" className="shrink-0" />
          </button>
        </div>
      </div>
    </>
  );
};
