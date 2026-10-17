import React, { useState, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { useDemoAuth } from '../hooks/useDemoAuth';
import { DemoCountryPicker } from '../components/DemoCountryPicker';
import { AuthTopBar } from '../components/AuthTopBar';
import { AuthToastBanner } from '../components/AuthToastBanner';
import { LoginScreenBody } from '../components/LoginScreenBody';

export interface LoginScreenProps {
  initialStep?: 'gateway' | 'login' | 'reg-step1' | 'reg-step2'; // Kept for backward compatibility
}

export const LoginScreen: React.FC<LoginScreenProps> = () => {
  const { isArabic, goBack, setLocale, handleSelectBrowseCountry: onSelectMarket } = useUI();
  const { loginDirectly } = useDemoAuth();
  
  const [guestCountrySelect, setGuestCountrySelect] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [demoCountryPickerOpen, setDemoCountryPickerOpen] = useState(false);

  const handleQuickDemoAuth = useCallback(async (code: string) => {
    setDemoCountryPickerOpen(false);
    await loginDirectly(code);
  }, [loginDirectly]);

  const handleBack = useCallback(() => {
    setToastMsg('');
    goBack();
  }, [goBack]);

  const handleClearToast = useCallback(() => setToastMsg(''), []);

  const handleSelectBrowseCountry = useCallback((code: any) => {
    setGuestCountrySelect(false);
    onSelectMarket(code);
  }, [onSelectMarket]);

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
        handleQuickDemoAuth={() => setDemoCountryPickerOpen(true)}
        handleSelectBrowseCountry={handleSelectBrowseCountry}
        handleGuestCountryClose={handleGuestCountryClose}
        handleGuestCountryOpen={handleGuestCountryOpen}
      />

      {demoCountryPickerOpen && (
        <DemoCountryPicker
          isOpen={demoCountryPickerOpen}
          onClose={() => setDemoCountryPickerOpen(false)}
          onSelect={(code) => handleQuickDemoAuth(code)}
          isArabic={isArabic}
        />
      )}
    </div>
  );
};
