import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/shared/i18n';
import { GuestCountrySelect } from './GuestCountrySelect';
import { AuthProviderButton } from './AuthProviderButton';
import { LoginGatewayActions } from './LoginGatewayActions';
import { LoginTermsFooter } from './LoginTermsFooter';
import { getLoginProviderButtons } from '../helpers/providerButtonConfig';
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
  isArabic,
  onGoToLogin,
  onGoToRegister,
  onOpenDemoPicker,
  onGuestCountrySelect,
  guestCountrySelectOpen,
  onToggleGuestCountrySelect,
}) => {
  const { t } = useTranslation();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isLoading, error, signIn } = useGoogleSignIn();
  const providers = getLoginProviderButtons(isArabic);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const handleProviderTap = useCallback(
    (providerId: string) => {
      if (providerId === 'google') {
        void signIn();
        return;
      }
      if (providerId === 'email') {
        onGoToLogin();
        return;
      }
      setToast(
        isArabic
          ? 'هذه الميزة ستكون متاحة قريباً'
          : 'This feature is coming soon',
      );
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2200);
    },
    [isArabic, onGoToLogin, signIn],
  );

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="flex w-full flex-1 flex-col items-center justify-center px-6 py-8 text-center"
    >
      {guestCountrySelectOpen ? (
        <GuestCountrySelect
          isArabic={isArabic}
          onSelectCountry={onGuestCountrySelect}
          onClose={onToggleGuestCountrySelect}
        />
      ) : (
        <>
          <img
            src="/assets/icons/logo.png"
            alt="FOX Marketplace"
            className="mb-4 h-20 w-20 object-contain"
          />

          <h1 className="mb-2 text-2xl font-bold text-ink">
            {isArabic ? 'مرحباً بك في FOX' : 'Welcome to FOX'}
          </h1>

          <p className="mb-6 max-w-sm text-sm leading-relaxed text-ink-muted">
            {isArabic
              ? 'سوقك المحلي للعثور على الصفقات المناسبة لك'
              : 'Your local marketplace for finding the right deals'}
          </p>

          <div className="flex w-full max-w-sm flex-col gap-3">
            {providers.map((provider) => (
              <AuthProviderButton
                key={provider.providerId}
                providerId={provider.providerId}
                label={provider.label}
                icon={provider.icon}
                isArabic={isArabic}
                onTap={handleProviderTap}
                brandColor={provider.brandColor}
                comingSoon={provider.comingSoon}
              />
            ))}

            {isLoading && (
              <p className="text-xs text-ink-muted">
                {isArabic ? 'جاري التحويل إلى Google...' : 'Redirecting to Google...'}
              </p>
            )}

            {error && (
              <p role="alert" className="break-words text-xs font-semibold text-danger">
                {error}
              </p>
            )}

            <LoginGatewayActions
              isArabic={isArabic}
              onGoToLogin={onGoToLogin}
              onGoToRegister={onGoToRegister}
              onOpenDemoPicker={onOpenDemoPicker}
              onToggleGuestCountrySelect={onToggleGuestCountrySelect}
            />

            <LoginTermsFooter isArabic={isArabic} />
          </div>

          {toast && (
            <div
              role="status"
              className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-brand px-4 py-2.5 text-xs text-white shadow-lg"
            >
              {toast}
            </div>
          )}
        </>
      )}
    </div>
  );
};
