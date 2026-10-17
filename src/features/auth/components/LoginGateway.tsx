import React, { useCallback } from 'react';
import { GuestCountrySelect } from './GuestCountrySelect';
import { LoginGatewayContent } from './LoginGatewayContent';
import { getLoginProviderButtons } from '../helpers/providerButtonConfig';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { useFacebookSignIn } from '../hooks/useFacebookSignIn';
import { useComingSoonToast } from '../hooks/useComingSoonToast';

interface LoginGatewayProps {
  isArabic: boolean;
  onOpenDemoPicker: () => void;
  onGuestCountrySelect: (code: string, cityEn: string, cityAr: string) => void;
  guestCountrySelectOpen: boolean;
  onToggleGuestCountrySelect: () => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({
  isArabic,
  onOpenDemoPicker,
  onGuestCountrySelect,
  guestCountrySelectOpen,
  onToggleGuestCountrySelect,
}) => {
  const { toast, showToast } = useComingSoonToast(isArabic);
  const google = useGoogleSignIn();
  const facebook = useFacebookSignIn();
  
  const isLoading = google.isLoading || facebook.isLoading;
  const error = google.error || facebook.error;
  const loadingProvider = google.isLoading ? 'google' : facebook.isLoading ? 'facebook' : null;
  const providers = getLoginProviderButtons(isArabic);

  const handleProviderTap = useCallback(
    (providerId: string) => {
      if (isLoading) return;

      if (providerId === 'google') {
        google.clearError();
        facebook.clearError();
        void google.signIn();
        return;
      }

      if (providerId === 'facebook') {
        google.clearError();
        facebook.clearError();
        void facebook.signIn();
        return;
      }

      showToast();
    },
    [isLoading, google, facebook, showToast]
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
      loadingProvider={loadingProvider}
      toast={toast}
      onProviderTap={handleProviderTap}
      onOpenDemoPicker={onOpenDemoPicker}
      onToggleGuestCountrySelect={onToggleGuestCountrySelect}
    />
  );
};
