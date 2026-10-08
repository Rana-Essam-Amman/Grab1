import { useUI } from '@/hooks/useUI';
import React, { useState, useCallback } from 'react';
import { MarketCode } from '@/shared/lib/marketGate';
import {
  cleanAndVerifyPhone,
  getFlagEmoji,
  PhoneVerificationResult,
} from '../helpers/phoneValidation';
import { useDemoAuth } from '../hooks/useDemoAuth';
import { DemoCountryPicker } from '../components/DemoCountryPicker';
import { AuthTopBar } from '../components/AuthTopBar';
import { AuthToastBanner } from '../components/AuthToastBanner';
import { LoginScreenBody } from '../components/LoginScreenBody';

export { cleanAndVerifyPhone, getFlagEmoji };
export type { PhoneVerificationResult };

interface LoginScreenProps {
  initialStep?: 'gateway' | 'reg-step1' | 'login';
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ initialStep }) => {
  const { isArabic, setLocale, goBack, navigateTo, setActiveTab, setBrowseLocation } = useUI();

  // Unified authentication state machine
  const [step, setStep] = useState<'gateway' | 'login' | 'reg-step1' | 'reg-step2'>(() => {
    return initialStep || 'gateway';
  });
  const [guestCountrySelect, setGuestCountrySelect] = useState(false);

  // Status & feedback states
  const [toastMsg, setToastMsg] = useState('');
  const [secureToken, setSecureToken] = useState('');

  // Staged registration inputs
  const [stagedPhone, setStagedPhone] = useState('');
  const [stagedPassword, setStagedPassword] = useState('');
  const [stagedEmail, setStagedEmail] = useState('');
  const [stagedFirstName, setStagedFirstName] = useState('');
  const [stagedCountry, setStagedCountry] = useState<MarketCode>('JO');

  const {
    demoCountryPickerOpen,
    setDemoCountryPickerOpen,
    handleQuickDemoAuth,
  } = useDemoAuth();

  // Handle local state step navigation back button
  const handleBack = useCallback(() => {
    setToastMsg('');
    if (step === 'login' || step === 'reg-step1') {
      setStep('gateway');
    } else {
      goBack();
    }
  }, [step, goBack]);

  const handleStageCredentials = useCallback((phone: string, pass: string, email: string, firstName: string, country: MarketCode, token: string) => {
    setStagedPhone(phone);
    setStagedPassword(pass);
    setStagedEmail(email);
    setStagedFirstName(firstName);
    setStagedCountry(country);
    setSecureToken(token);
    setStep('reg-step2');
  }, []);

  const handleSwitchToLogin = useCallback(() => {
    setStep('login');
  }, []);

  const handleSwitchToRegister = useCallback(() => {
    setStep('reg-step1');
  }, []);



  const handleGuestCountryClose = useCallback(() => setGuestCountrySelect(false), []);
  const handleGuestCountryOpen = useCallback(() => setGuestCountrySelect(true), []);
  const handleClearToast = useCallback(() => setToastMsg(''), []);

  const handleSelectBrowseCountry = useCallback((code: string, cityEn: string, cityAr: string) => {
    setBrowseLocation(code as MarketCode, cityEn, cityAr);
    setGuestCountrySelect(false);
    setActiveTab('explore');
    navigateTo('main');
  }, [setBrowseLocation, setActiveTab, navigateTo]);

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <AuthTopBar step={step} onBack={handleBack} isArabic={isArabic} onToggleLanguage={() => setLocale(isArabic ? 'en' : 'ar')} />
      <AuthToastBanner message={toastMsg || null} onDismiss={handleClearToast} />
      
      <LoginScreenBody
        step={step}
        isArabic={isArabic}
        guestCountrySelect={guestCountrySelect}
        stagedPhone={stagedPhone}
        stagedPassword={stagedPassword}
        stagedEmail={stagedEmail}
        stagedFirstName={stagedFirstName}
        stagedCountry={stagedCountry}
        secureToken={secureToken}
        handleSwitchToLogin={handleSwitchToLogin}
        handleSwitchToRegister={handleSwitchToRegister}

        handleQuickDemoAuth={() => setDemoCountryPickerOpen(true)}
        handleSelectBrowseCountry={handleSelectBrowseCountry}
        handleGuestCountryClose={handleGuestCountryClose}
        handleGuestCountryOpen={handleGuestCountryOpen}
        setToastMsg={setToastMsg}
        handleStageCredentials={handleStageCredentials}
      />

      <DemoCountryPicker
        open={demoCountryPickerOpen}
        onClose={() => setDemoCountryPickerOpen(false)}
        onSelect={(code) => {
          setDemoCountryPickerOpen(false);
          handleQuickDemoAuth(code);
        }}
        isArabic={isArabic}
      />
    </div>
  );
};
