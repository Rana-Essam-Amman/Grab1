import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { CountrySelector } from './CountrySelector';
import { useLoginForm } from '../hooks/useLoginForm';
import { Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { LoginHeader } from './LoginHeader';

export interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
  onToast: (msg: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onSwitchToForgot,
  onToast,
}) => {
  const {
    selectedCountry,
    setSelectedCountry,
    phone,
    handlePhoneChange,
    password,
    handlePasswordChange,
    showPassword,
    handleToggleShowPassword,
    error,
    handleLoginSubmit,
    isArabic,
  } = useLoginForm({ onToast });

  return (
    <div className="flex flex-col gap-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <LoginHeader isArabic={isArabic} error={error} />

      <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
        <div>
          <CountrySelector
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
            isArabic={isArabic}
            size="md"
            label={isArabic ? 'الدولة *' : 'Country *'}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-ink mb-1.5 flex items-center gap-1.5">
            <Phone size={14} className="text-primary" />
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
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-ink flex items-center gap-1.5">
              <Lock size={14} className="text-primary" />
              {isArabic ? 'كلمة المرور *' : 'Password *'}
            </label>
            <button
              type="button"
              onClick={onSwitchToForgot}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              {isArabic ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
            </button>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={handleToggleShowPassword}
              className="absolute inset-y-0 end-0 px-3 flex items-center text-ink-muted hover:text-ink cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2 cursor-pointer"
        >
          {isArabic ? 'تسجيل الدخول' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-border">
        <p className="text-xs text-ink-muted">
          {isArabic ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-primary hover:underline cursor-pointer"
          >
            {isArabic ? 'إنشاء حساب جديد' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};
