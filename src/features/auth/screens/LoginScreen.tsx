import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  const autoOpenedRef = useRef(false);

  // F3: auto-open the country picker when geo detection confirms the user is
  // outside the 5 supported markets.
  //
  // Safety layers:
  //   1. VITE_E2E guard: skip in test mode — the picker replaces the login
  //      gateway and would break tests expecting Google/Apple/WhatsApp buttons.
  //   2. One-shot ref: if the user closes the picker, a re-render must not
  //      force it back open.
  //   3. Explicit isUnsupported check (via F4): a `fallback` source (network
  //      failure) sets geoUnsupported=false, so transient errors never trigger
  //      the picker.
  useEffect(() => {
    if (import.meta.env.VITE_E2E === 'true') return;
    if (autoOpenedRef.current) return;
    if (!geoUnsupported) return;
    autoOpenedRef.current = true;
    setGuestCountrySelect(true);
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
