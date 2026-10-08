import React from 'react';
import { MarketCode } from '@/shared/lib/marketGate';
import { LoginGateway } from './LoginGateway';
import { LoginForm } from './LoginForm';
import { RegisterStep1Form } from './RegisterStep1Form';
import { RegisterStep2Form } from './RegisterStep2Form';

interface LoginScreenBodyProps {
  step: 'gateway' | 'login' | 'reg-step1' | 'reg-step2' | 'forgot';
  isArabic: boolean;
  guestCountrySelect: boolean;
  stagedPhone: string;
  stagedPassword: string;
  stagedEmail: string;
  stagedFirstName: string;
  stagedCountry: MarketCode;
  secureToken: string;
  handleSwitchToLogin: () => void;
  handleSwitchToRegister: () => void;
  handleSwitchToForgot: () => void;
  handleQuickDemoAuth: () => void;
  handleSelectBrowseCountry: (code: string, cityEn: string, cityAr: string) => void;
  handleGuestCountryClose: () => void;
  handleGuestCountryOpen: () => void;
  setToastMsg: (msg: string) => void;
  handleStageCredentials: (phone: string, pass: string, email: string, firstName: string, country: MarketCode, token: string) => void;
}

export const LoginScreenBody: React.FC<LoginScreenBodyProps> = ({
  step,
  isArabic,
  guestCountrySelect,
  stagedPhone,
  stagedPassword,
  stagedEmail,
  stagedFirstName,
  stagedCountry,
  secureToken,
  handleSwitchToLogin,
  handleSwitchToRegister,
  handleSwitchToForgot,
  handleQuickDemoAuth,
  handleSelectBrowseCountry,
  handleGuestCountryClose,
  handleGuestCountryOpen,
  setToastMsg,
  handleStageCredentials,
}) => {
  if (step === 'gateway') {
    return (
      <LoginGateway
        isArabic={isArabic}
        onGoToLogin={handleSwitchToLogin}
        onGoToRegister={handleSwitchToRegister}
        onOpenDemoPicker={handleQuickDemoAuth}
        onGuestCountrySelect={handleSelectBrowseCountry}
        guestCountrySelectOpen={guestCountrySelect}
        onToggleGuestCountrySelect={guestCountrySelect ? handleGuestCountryClose : handleGuestCountryOpen}
      />
    );
  }

  if (step === 'login') {
    return (
      <div className="p-6 flex flex-col gap-6 flex-1 max-w-sm mx-auto w-full justify-center animate-fadeIn">
        <LoginForm onSwitchToRegister={handleSwitchToRegister} onSwitchToForgot={handleSwitchToForgot} onToast={setToastMsg} />
      </div>
    );
  }

  if (step === 'reg-step1') {
    return (
      <div className="p-6 flex flex-col gap-6 flex-1 max-w-sm mx-auto w-full justify-center animate-fadeIn">
        <RegisterStep1Form onSwitchToLogin={handleSwitchToLogin} onStageCredentials={handleStageCredentials} onToast={setToastMsg} />
      </div>
    );
  }

  if (step === 'reg-step2') {
    return (
      <div className="p-5 flex flex-col gap-6 flex-1 text-center justify-center max-w-sm mx-auto w-full">
        <RegisterStep2Form
          stagedPhone={stagedPhone}
          stagedPassword={stagedPassword}
          stagedEmail={stagedEmail}
          stagedFirstName={stagedFirstName}
          stagedCountry={stagedCountry}
          secureToken={secureToken}
          onSuccess={() => setToastMsg('')}
          onSwitchToLogin={handleSwitchToLogin}
          onToast={setToastMsg}
        />
      </div>
    );
  }


  return null;
};
