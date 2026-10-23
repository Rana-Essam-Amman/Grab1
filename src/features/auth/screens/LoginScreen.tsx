import React, { useState, useCallback, useEffect } from 'react';
import { useUI } from '@/hooks/useUI';
import { AuthTopBar } from '../components/AuthTopBar';
import { AuthToastBanner } from '../components/AuthToastBanner';
import { LoginScreenBody } from '../components/LoginScreenBody';
import type { MarketCode } from '@/shared/lib/marketGate';

export interface LoginScreenProps {
  initialStep?: 'gateway' | 'login' | 'reg-step1' | 'reg-step2'; // Kept for backward compatibility
}

export const LoginScreen: React.FC<LoginScreenProps> = () => {
  const {
    isArabic,
    goBack,
    setLocale,
    setBrowseLocation,
    navigateTo,
    setBrowseMarketOverrideLocal,
    geoUnsupported,
  } = useUI();

  const [guestCountrySelect, setGuestCountrySelect] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // F3 fix: open the country picker when geo detection says the user is
  // outside the 5 supported markets. This runs once when geoUnsupported
  // transitions to true (async detection resolves after first render).
  // If the user closes the picker without choosing, we don't force it back —
  // RLS on the backend still prevents posting outside their market.
  useEffect(() => {
    if (geoUnsupported) {
      setGuestCountrySelect(true);
    }
  }, [geoUnsupported]);

  const handleBack = useCallback(() => {
    setToastMsg('');
    goBack();
  }, [goBack]);

  const handleClearToast = useCallback(() => setToastMsg(''), []);

  const handleSelectBrowseCountry = useCallback(
    (code: MarketCode) => {
      setGuestCountrySelect(false);
      setBrowseMarketOverrideLocal(code);
      setBrowseLocation(code, '', '');
      navigateTo('main');
    },
    [setBrowseLocation, setBrowseMarketOverrideLocal, navigateTo],
  );

  const handleGuestCountryOpen = useCallback(() => {
    setGuestCountrySelect(true);
  }, []);

  const handleGuestCountryClose = useCallback(() => {
    setGuestCountrySelect(false);
  }, []);

  return (
    <div className="flex flex-col h-full bg-canvas">
      <AuthTopBar
        step="gateway"
        onBack={handleBack}
        isArabic={isArabic}
        onToggleLanguage={() => setLocale(isArabic ? 'en' : 'ar')}
      />

      <AuthToastBanner message={toastMsg} onDismiss={handleClearToast} />

      <LoginScreenBody
        isArabic={isArabic}
        guestCountrySelect={guestCountrySelect}
        handleSelectBrowseCountry={handleSelectBrowseCountry}
        handleGuestCountryClose={handleGuestCountryClose}
        handleGuestCountryOpen={handleGuestCountryOpen}
      />
    </div>
  );
};
