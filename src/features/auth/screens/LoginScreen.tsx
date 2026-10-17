import React, { useState, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { AuthTopBar } from '../components/AuthTopBar';
import { AuthToastBanner } from '../components/AuthToastBanner';
import { LoginScreenBody } from '../components/LoginScreenBody';
import type { MarketCode } from '@/shared/lib/marketGate';

export interface LoginScreenProps {
  initialStep?: 'gateway' | 'login' | 'reg-step1' | 'reg-step2'; // Kept for backward compatibility
}

export const LoginScreen: React.FC<LoginScreenProps> = () => {
  const { isArabic, goBack, setLocale, setBrowseLocation, navigateTo, setBrowseMarketOverrideLocal } = useUI();
  const { loginDirectly } = useAuth();
  
  const [guestCountrySelect, setGuestCountrySelect] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

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
      loginDirectly('guest@fox.local', undefined, code, 'Guest');
      navigateTo('main');
    },
    [setBrowseLocation, setBrowseMarketOverrideLocal, loginDirectly, navigateTo],
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
