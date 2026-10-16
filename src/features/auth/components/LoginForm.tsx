import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useLoginForm } from '../hooks/useLoginForm';
import { Lock1, Sms, Eye, EyeSlash } from 'iconsax-react';

export interface LoginFormProps {
  onSwitchToRegister: () => void;
  onToast: (msg: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onToast }) => {
  const {
    email, handleEmailChange, password, handlePasswordChange,
    showPassword, handleToggleShowPassword, error, loading,
    handleLoginSubmit, isArabic,
  } = useLoginForm({ onToast });

  return (
    <div className="flex flex-col gap-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="text-center">
        <h2 className="text-xl font-bold text-ink">
          {isArabic ? 'تسجيل الدخول' : 'Welcome Back'}
        </h2>
        <p className="text-sm text-ink-muted mt-1">
          {isArabic ? 'أدخل بريدك الإلكتروني وكلمة المرور للمتابعة' : 'Enter your email and password to continue'}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-ink mb-1.5 flex items-center gap-1.5">
            <Sms size={14} variant="Linear" color="#E57E25" />
            {isArabic ? 'البريد الإلكتروني *' : 'Email *'}
          </label>
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder={isArabic ? 'البريد الإلكتروني' : 'Email'}
            dir="ltr"
            autoComplete="email"
            inputMode="email"
            className="text-start font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-ink mb-1.5 flex items-center gap-1.5">
            <Lock1 size={14} variant="Linear" color="#E57E25" />
            {isArabic ? 'كلمة المرور *' : 'Password *'}
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={handleToggleShowPassword}
              className="absolute inset-y-0 end-0 px-3 flex items-center text-ink-muted hover:text-ink cursor-pointer"
            >
              {showPassword ? <EyeSlash size={16} variant="Linear" color="#94A3B8" /> : <Eye size={16} variant="Linear" color="#94A3B8" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className="w-full mt-2 cursor-pointer"
        >
          {loading ? (isArabic ? 'جار تسجيل الدخول...' : 'Signing in...') : (isArabic ? 'تسجيل الدخول' : 'Sign In')}
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
