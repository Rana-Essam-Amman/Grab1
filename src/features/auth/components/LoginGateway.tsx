import React, { useState, useCallback } from 'react';
import { Button } from '@/shared/ui/Button';
import { ShieldTick, Global } from 'iconsax-react';
import { GuestCountrySelect } from './GuestCountrySelect';
import { useTranslation } from '@/shared/i18n';
import { useAuthProviders } from '../hooks/useAuthProviders';
import { AuthProviderButton } from './AuthProviderButton';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';

interface LoginGatewayProps {
  isArabic: boolean;
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onOpenDemoPicker: () => void;
  onGuestCountrySelect: (code: string, cityEn: string, cityAr: string) => void;
  guestCountrySelectOpen: boolean;
  onToggleGuestCountrySelect: () => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({
  isArabic, onGoToLogin, onGoToRegister, onOpenDemoPicker,
  onGuestCountrySelect, guestCountrySelectOpen, onToggleGuestCountrySelect,
}) => {
  const { t } = useTranslation();
  const { providers } = useAuthProviders();
  const [toast, setToast] = useState<string | null>(null);
  const { isLoading: isGoogleLoading, error: googleError, signIn: signInGoogle } = useGoogleSignIn();

  const social = providers.filter((p) => p.id === 'google' || p.id === 'apple' || p.id === 'whatsapp');

  const handleProviderTap = useCallback((providerId: string) => {
    if (providerId === 'google') {
      void signInGoogle();
      return;
    }
    setToast(isArabic ? 'قيد التجهيز — استخدم البريد مؤقتاً' : 'Coming soon — use email for now');
    setTimeout(() => setToast(null), 2200);
  }, [isArabic, signInGoogle]);

  return (
    <div className="p-6 flex flex-col justify-center items-center flex-1 text-center max-w-sm mx-auto w-full">
      {guestCountrySelectOpen ? (
        <GuestCountrySelect isArabic={isArabic} onSelectCountry={onGuestCountrySelect} onClose={onToggleGuestCountrySelect} />
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
            <ShieldTick size={32} variant="Bold" color="currentColor" />
          </div>
          <h2 className="text-xl font-bold text-ink mb-2">{t('auth.loginTitle')}</h2>
          <p className="text-xs text-ink-muted leading-relaxed max-w-[280px] mb-8">
            {isArabic
              ? 'مرحباً بك في منصة الصفقات الأكثر أماناً. يرجى اختيار نوع الحساب للمتابعة السلسة.'
              : 'Welcome to the premier trusted marketplace. Please select your account flow to proceed.'}
          </p>
          <div className="flex flex-col gap-3.5 w-full">
            {social.map((p) => (
              <AuthProviderButton
                key={p.id}
                provider={p}
                isArabic={isArabic}
                onTap={() => handleProviderTap(p.id)}
              />
            ))}

            {isGoogleLoading && (
              <p className="text-xs text-ink-muted mt-1">
                {isArabic ? 'جاري التحويل إلى Google...' : 'Redirecting to Google...'}
              </p>
            )}
            {googleError && (
              <p className="text-xs text-danger font-semibold mt-1 break-words">
                {googleError}
              </p>
            )}
            <div className="flex items-center gap-3 my-2 w-full">
              <div className="flex-1 h-px bg-line" />
              <span className="text-xs text-ink-muted font-medium">{isArabic ? 'أو' : 'or'}</span>
              <div className="flex-1 h-px bg-line" />
            </div>
            <Button onClick={onGoToRegister} type="button" variant="primary" size="lg" fullWidth>
              {t('auth.createAccount')}
            </Button>
            <Button onClick={onGoToLogin} type="button" variant="secondary" size="lg" fullWidth>
              {t('auth.haveAccount')}
            </Button>
            <Button onClick={onToggleGuestCountrySelect} type="button" variant="secondary" size="lg" fullWidth className="bg-background hover:bg-border text-ink-soft">
              <Global size={16} variant="Linear" color="currentColor" />
              <span>{t('auth.browseAsGuest')}</span>
            </Button>
            {(!import.meta.env.PROD || import.meta.env.VITE_ALLOW_QUICK_DEMO === 'true') && (
              <Button onClick={onOpenDemoPicker} type="button" variant="link" size="sm" className="text-xs font-bold text-primary mt-2">
                {isArabic ? 'الدخول كحساب تجريبي سريع' : 'Bypass with Quick Demo Account'}
              </Button>
            )}
          </div>
          {toast && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-brand text-white text-xs rounded-xl px-4 py-2.5 shadow-lg z-50 animate-fadeIn">
              {toast}
            </div>
          )}
        </>
      )}
    </div>
  );
};
