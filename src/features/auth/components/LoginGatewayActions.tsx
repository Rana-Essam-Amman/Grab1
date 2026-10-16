import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Global } from 'iconsax-react';
import { useTranslation } from '@/shared/i18n';

interface LoginGatewayActionsProps {
  isArabic: boolean;
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onOpenDemoPicker: () => void;
  onToggleGuestCountrySelect: () => void;
}

export const LoginGatewayActions: React.FC<LoginGatewayActionsProps> = ({
  isArabic,
  onGoToLogin,
  onGoToRegister,
  onOpenDemoPicker,
  onToggleGuestCountrySelect,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="my-1 flex w-full items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs font-medium text-ink-muted">
          {isArabic ? 'أو' : 'or'}
        </span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <Button onClick={onGoToRegister} type="button" variant="primary" size="lg" fullWidth>
        {t('auth.createAccount')}
      </Button>

      <Button onClick={onGoToLogin} type="button" variant="secondary" size="lg" fullWidth>
        {t('auth.haveAccount')}
      </Button>

      <Button
        onClick={onToggleGuestCountrySelect}
        type="button"
        variant="secondary"
        size="lg"
        fullWidth
        className="bg-background text-ink-soft hover:bg-border"
      >
        <Global size={16} variant="Linear" color="currentColor" />
        <span>{t('auth.browseAsGuest')}</span>
      </Button>

      {(!import.meta.env.PROD ||
        import.meta.env.VITE_ALLOW_QUICK_DEMO === 'true') && (
        <Button
          onClick={onOpenDemoPicker}
          type="button"
          variant="link"
          size="sm"
          className="mt-1 text-xs font-bold text-primary"
        >
          {isArabic
            ? 'الدخول كحساب تجريبي سريع'
            : 'Bypass with Quick Demo Account'}
        </Button>
      )}
    </div>
  );
};
