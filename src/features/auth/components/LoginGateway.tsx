import React from 'react';
import { Button } from '@/shared/ui/Button';
import { ShieldCheck, Globe } from 'lucide-react';
import { GuestCountrySelect } from './GuestCountrySelect';
import { useTranslation } from '@/shared/i18n';

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
  isArabic,
  onGoToLogin,
  onGoToRegister,
  onOpenDemoPicker,
  onGuestCountrySelect,
  guestCountrySelectOpen,
  onToggleGuestCountrySelect,
}) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 flex flex-col justify-center items-center flex-1 text-center max-w-sm mx-auto w-full">
      {guestCountrySelectOpen ? (
        <GuestCountrySelect
          isArabic={isArabic}
          onSelectCountry={onGuestCountrySelect}
          onClose={onToggleGuestCountrySelect}
        />
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
            <ShieldCheck size={32} />
          </div>

          <h2 className="text-xl font-bold text-ink mb-2">
            {t('auth.loginTitle')}
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed max-w-[280px] mb-8">
            {isArabic
              ? 'مرحباً بك في منصة الصفقات الأكثر أماناً. يرجى اختيار نوع الحساب للمتابعة السلسة.'
              : 'Welcome to the premier trusted marketplace. Please select your account flow to proceed.'}
          </p>

          <div className="flex flex-col gap-3.5 w-full">
            <Button
              onClick={onGoToRegister}
              type="button"
              variant="primary"
              size="lg"
              fullWidth
            >
              {t('auth.createAccount')}
            </Button>

            <Button
              onClick={onGoToLogin}
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
            >
              {t('auth.haveAccount')}
            </Button>

            <Button
              onClick={onToggleGuestCountrySelect}
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              className="bg-background hover:bg-border text-ink-soft"
            >
              <Globe size={16} />
              <span>{t('auth.browseAsGuest')}</span>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-border w-full text-center">
            <Button
              onClick={onOpenDemoPicker}
              type="button"
              variant="link"
              size="sm"
              className="text-xs font-bold text-primary"
            >
              {isArabic ? 'الدخول كحساب تجريبي سريع' : 'Bypass with Quick Demo Account'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
