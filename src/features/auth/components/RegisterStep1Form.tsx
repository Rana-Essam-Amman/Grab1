import React from 'react';
import { Button } from '@/shared/ui/Button';
import { CountrySelector } from './CountrySelector';
import { useRegisterStep1 } from '../hooks/useRegisterStep1';
import { RegisterFormFields } from './RegisterFormFields';
import { MarketCode } from '@/shared/lib/marketGate';

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
  const {
    isArabic, selectedCountry, firstName, phone, email, password, confirmPassword,
    showPassword, showConfirmPassword, error, handleCountrySelectChange,
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
        <CountrySelector
          selectedCountry={selectedCountry}
          onCountryChange={(code) => handleCountrySelectChange({ target: { value: code } } as unknown as React.ChangeEvent<HTMLSelectElement>)}
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
