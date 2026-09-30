import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { useListings } from '@/hooks/useListings';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { locationsWithOther as locations, locationsArWithOther as locationsAr } from '@/data/locations';
import { Button } from '@/shared/ui/Button';
import { Avatar } from '@/shared/ui/Avatar';
import { HeaderDropdownMenu } from './HeaderDropdownMenu';
import { HambergerMenu } from 'iconsax-react';

const DEFAULT_CAPITALS: Record<string, { en: string; ar: string; cityEn?: string; cityAr?: string }> = {
  JO: { en: 'Amman', ar: 'عمّان', cityEn: 'Amman', cityAr: 'عمّان' },
  LB: { en: 'Beirut', ar: 'بيروت', cityEn: 'Beirut', cityAr: 'بيروت' },
  PS: { en: 'Jerusalem', ar: 'القدس', cityEn: 'Jerusalem', cityAr: 'القدس' },
  SY: { en: 'Damascus', ar: 'دمشق', cityEn: 'Damascus', cityAr: 'دمشق' },
  SA: { en: 'Riyadh', ar: 'الرياض', cityEn: 'Riyadh', cityAr: 'الرياض' },
};

export const Header: React.FC = () => {
  const { isArabic, setLocale, browseCountry, browseCityEn, browseCityAr, activeCurrency, setActiveCurrency, setBrowseLocation, navigateTo, setIsCountrySheetOpen } = useUI();
  const { user, authStatus } = useAuth();
  const { wishlist } = useListings();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const countryCode = (browseCountry?.code || 'JO') as 'JO' | 'LB' | 'PS' | 'SY' | 'SA';
  const defaultCap = DEFAULT_CAPITALS[countryCode] || DEFAULT_CAPITALS.JO;

  const handleMenuToggle = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const handleMenuClose = useCallback(() => setIsMenuOpen(false), []);
  const handleLogoClick = useCallback(() => navigateTo('main'), [navigateTo]);
  const handleProfileClick = useCallback(() => {
    navigateTo('settings');
    setIsMenuOpen(false);
  }, [navigateTo]);
  const handleProfileNav = useCallback(() => {
    navigateTo('profile');
    setIsMenuOpen(false);
  }, [navigateTo]);
  const handleLanguageToggle = useCallback(() => {
    setLocale(isArabic ? 'en' : 'ar');
    setIsMenuOpen(false);
  }, [setLocale, isArabic]);
  const handleWishlistNav = useCallback(() => {
    navigateTo('wishlist');
    setIsMenuOpen(false);
  }, [navigateTo]);
  const handleNotificationsNav = useCallback(() => {
    if (authStatus === 'unauthenticated' || !user) {
      navigateTo('login');
    } else {
      navigateTo('notifications');
    }
    setIsMenuOpen(false);
  }, [authStatus, user, navigateTo]);
  const handleCurrencySelect = useCallback(
    (code: string) => {
      setActiveCurrency(code);
      setIsMenuOpen(false);
    },
    [setActiveCurrency]
  );

  const isValidCity = useMemo(() => {
    const validAr = Object.keys(locationsAr[countryCode] || {});
    const validEn = Object.keys(locations[countryCode] || {});
    return (
      validAr.some((c) => c.toLowerCase() === browseCityAr.toLowerCase()) ||
      validEn.some((c) => c.toLowerCase() === browseCityEn.toLowerCase())
    );
  }, [countryCode, browseCityAr, browseCityEn]);

  useEffect(() => {
    if (!isValidCity) {
      setBrowseLocation(countryCode, defaultCap.en, defaultCap.ar);
    }
  }, [isValidCity, countryCode, defaultCap.en, defaultCap.ar, setBrowseLocation]);

  const displayCityAr = isValidCity ? browseCityAr : defaultCap.ar;
  const displayCityEn = isValidCity ? browseCityEn : defaultCap.en;

  return (
    <header className="px-4 pt-5 pb-4 bg-brand border-b border-white/20 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMenuToggle}
          className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 flex items-center justify-center p-0"
          title={isArabic ? 'القائمة' : 'Menu'}
          aria-label={isArabic ? 'القائمة' : 'Menu'}
        >
          <HambergerMenu size={20} variant="Linear" color="#FFFFFF" />
        </Button>

        <div
          className="cursor-pointer select-none"
          onClick={handleLogoClick}
        >
          <div className="flex items-center justify-center gap-6 m-0 p-0">
            <img
              src="/assets/icons/logo.png"
              alt="FOX Marketplace"
              className="w-16 h-16 object-cover rounded-full shrink-0"
            />
            <div className="flex flex-col justify-center items-center m-0 p-0">
              <h1 className="text-[30px] font-black text-white font-cairo tracking-[-1px] leading-[0.95] m-0">FOX</h1>
              <span className="text-[10px] font-semibold text-white tracking-[2px] uppercase leading-none mt-1 m-0 block">Marketplace</span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleProfileClick}
          className="w-9 h-9 rounded-full border border-white/20 overflow-hidden shadow-xs hover:ring-2 hover:ring-white/30 transition-all flex items-center justify-center bg-white/10 p-0"
          title={isArabic ? 'الإعدادات والحساب' : 'Settings & Account'}
          data-testid="header-profile-btn"
        >
          <Avatar
            src={user?.avatar || user?.avatarUrl || '/assets/avatars/guest.jpg'}
            fallback={user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
            size="sm"
            className="w-full h-full border-none ring-2 ring-white/30"
          />
        </Button>
      </div>

      {isMenuOpen && (
        <HeaderDropdownMenu
          isArabic={isArabic}
          browseCountry={browseCountry}
          displayCityAr={displayCityAr}
          displayCityEn={displayCityEn}
          handleMenuClose={handleMenuClose}
          handleProfileNav={handleProfileNav}
          handleLanguageToggle={handleLanguageToggle}
          handleWishlistNav={handleWishlistNav}
          wishlistLength={wishlist.length}
          handleNotificationsNav={handleNotificationsNav}
          activeCurrency={activeCurrency}
          handleCurrencySelect={handleCurrencySelect}
          setIsCountrySheetOpen={setIsCountrySheetOpen}
        />
      )}
    </header>
  );
};
