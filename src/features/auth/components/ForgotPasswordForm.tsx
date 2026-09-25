import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { CountrySelector } from './CountrySelector';
import { ForgotPasswordHeader } from './ForgotPasswordHeader';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { Sms, Call, ArrowLeft, ArrowRight } from 'iconsax-react';

export interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
  onToast: (msg: string) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSwitchToLogin,
  onToast,
}) => {
  const {
    selectedCountry,
    setSelectedCountry,
    phone,
    handlePhoneChange,
    email,
    handleEmailChange,
    loading,
    error,
    successMsg,
    handleForgotPasswordReset,
    isArabic,
  } = useForgotPassword({ onToast });

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
    <div className="flex flex-col gap-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <ForgotPasswordHeader isArabic={isArabic} error={error} successMsg={successMsg} />

      <form onSubmit={handleForgotPasswordReset} className="flex flex-col gap-4">
        <div>
          <CountrySelector
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
            isArabic={isArabic}
            size="md"
            label={isArabic ? 'بلد الحساب المسجل *' : 'Registered Country *'}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-ink mb-1.5 flex items-center gap-1.5">
            <Call size={14} variant="Linear" color="#E57E25" />
            {isArabic ? 'رقم الهاتف *' : 'Phone Number *'}
          </label>
          <Input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="791234567"
            dir="ltr"
            className="text-start font-mono"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-ink mb-1.5 flex items-center gap-1.5">
            <Sms size={14} variant="Linear" color="#E57E25" />
            {isArabic ? 'البريد الإلكتروني المسجل *' : 'Registered Email *'}
          </label>
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="name@example.com"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className="w-full mt-2 cursor-pointer"
        >
          {loading
            ? (isArabic ? 'جاري الإرسال...' : 'Sending...')
            : (isArabic ? 'إرسال رابط الاستعادة' : 'Send Recovery Link')}
        </Button>
      </form>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
        >
          <BackIcon size={14} variant="Linear" color="#E57E25" />
          {isArabic ? 'العودة لتسجيل الدخول' : 'Back to Login'}
        </button>
      </div>
    </div>
  );
};
