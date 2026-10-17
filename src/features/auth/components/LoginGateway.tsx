import React, { useCallback, useState, useRef, useEffect } from 'react';
import { GuestCountrySelect } from './GuestCountrySelect';
import { LoginGatewayContent } from './LoginGatewayContent';
import { getLoginProviderButtons } from '../helpers/providerButtonConfig';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { useFacebookSignIn } from '../hooks/useFacebookSignIn';

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
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    isLoading: isGoogleLoading,
    error: googleError,
    signIn: signInWithGoogle,
  } = useGoogleSignIn();
  const {
    isLoading: isFacebookLoading,
    error: facebookError,
    signIn: signInWithFacebook,
  } = useFacebookSignIn();
  const isLoading = isGoogleLoading || isFacebookLoading;
  const error = facebookError || googleError;
  const providers = getLoginProviderButtons(isArabic);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const handleProviderTap = useCallback(
    (providerId: string) => {
      if (providerId === 'google') {
        void signInWithGoogle();
        return;
      }
      if (providerId === 'facebook') {
        void signInWithFacebook();
        return;
      }
      if (providerId === 'email') {
        onGoToLogin();
        return;
      }
      setToast(isArabic ? 'هذه الميزة ستكون متاحة قريباً' : 'This feature is coming soon');
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2200);
    },
    [isArabic, onGoToLogin, signInWithFacebook, signInWithGoogle],
  );

  if (guestCountrySelectOpen) {
    return (
      <GuestCountrySelect
        isArabic={isArabic}
        onSelectCountry={onGuestCountrySelect}
        onClose={onToggleGuestCountrySelect}
      />
    );
  }

  return (
    <LoginGatewayContent
      isArabic={isArabic}
      providers={providers}
      isLoading={isLoading}
      error={error}
      toast={toast}
      onProviderTap={handleProviderTap}
      onGoToLogin={onGoToLogin}
      onGoToRegister={onGoToRegister}
      onOpenDemoPicker={onOpenDemoPicker}
      onToggleGuestCountrySelect={onToggleGuestCountrySelect}
    />
  );
};
