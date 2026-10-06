import React from 'react';
import { Button } from '@/shared/ui/Button';
import { CountrySelector } from './CountrySelector';
import { useRegisterStep1 } from '../hooks/useRegisterStep1';
import { RegisterFormFields } from './RegisterFormFields';
import { MarketCode } from '@/shared/lib/marketGate';
import { useUI } from '@/hooks/useUI';

interface RegisterStep1FormProps {
  onSwitchToLogin: () => void;
  onStageCredentials: (phone: string, pass: string, email: string, first: string, country: MarketCode, token: string) => void;
  onToast?: (msg: string) => void;
}

export const RegisterStep1Form: React.FC<RegisterStep1FormProps> = ({
  onSwitchToLogin,
  onStageCredentials,
  onToast,
}) => {
  const { geoUnsupported } = useUI();
  const {
    isArabic, selectedCountry, firstName, phone, email, password, confirmPassword,
    showPassword, showConfirmPassword, error, handleCountryChange,
    handleFirstNameChange, handlePhoneChange, handleEmailChange, handlePasswordChange,
    handleConfirmPasswordChange, handleToggleShowPassword, handleToggleShowConfirmPassword,
    handleRegisterUnified,
  } = useRegisterStep1({ onStageCredentials, onToast });

  return (
    <>
      <div className="text-center mb-1">
        <h2 className="text-xl font-bold text-ink">
          {isArabic ? 'إنشاء حساب جديد' : 'Create Account'}
        </h2>
        <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
          {isArabic ? 'يرجى ملء الحقول أدناه لتسجيل حسابك وتفعيله' : 'Please fill in the fields below to register and activate your account'}
        </p>
      </div>

      <form onSubmit={handleRegisterUnified} className="flex flex-col gap-5">
        {geoUnsupported && (
          <div
            role="status"
            className="p-3 rounded-xl bg-accent/10 border border-accent/30 text-xs text-ink font-bold leading-relaxed"
          >
            {isArabic
              ? 'FOX يخدم حالياً 5 أسواق: الأردن، السعودية، لبنان، فلسطين، سوريا. اختر السوق الذي يهمك أدناه — سيكون "بيتك" للنشر والتواصل.'
              : 'FOX currently serves 5 markets: Jordan, Saudi Arabia, Lebanon, Palestine, Syria. Pick the one that matters to you below — it will be your "home" for posting and chatting.'}
          </div>
        )}
        <CountrySelector
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryChange}
          isArabic={isArabic}
          label={isArabic ? 'سوق الدولة الحالي *' : 'Market Country *'}
        />
        <RegisterFormFields
          isArabic={isArabic} firstName={firstName} phone={phone} email={email}
          password={password} confirmPassword={confirmPassword} showPassword={showPassword}
          showConfirmPassword={showConfirmPassword} error={error}
          onFirstNameChange={handleFirstNameChange} onPhoneChange={handlePhoneChange}
          onEmailChange={handleEmailChange} onPasswordChange={handlePasswordChange}
          onConfirmPasswordChange={handleConfirmPasswordChange}
          onToggleShowPassword={handleToggleShowPassword}
          onToggleShowConfirmPassword={handleToggleShowConfirmPassword}
        />
        <Button type="submit" variant="primary" size="lg" fullWidth className="mt-2">
          <span>{isArabic ? 'المتابعة' : 'Continue'}</span>
        </Button>
      </form>
      <Button
        type="button"
        variant="link"
        size="sm"
        onClick={onSwitchToLogin}
        className="text-xs text-primary font-bold mt-3 mx-auto"
      >
        {isArabic ? 'لديك حساب مسبقاً؟ سجل الدخول' : 'Already have an account? Sign in'}
      </Button>
    </>
  );
};
