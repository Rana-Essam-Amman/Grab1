import React, { useCallback } from 'react';
import { GuestCountrySelect } from './GuestCountrySelect';
import { LoginGatewayContent } from './LoginGatewayContent';
import { getLoginProviderButtons } from '../helpers/providerButtonConfig';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { useComingSoonToast } from '../hooks/useComingSoonToast';
import type { MarketCode } from '@/shared/lib/marketGate';

interface LoginGatewayProps {
  isArabic: boolean;
  onGuestCountrySelect: (code: MarketCode) => void;
  guestCountrySelectOpen: boolean;
  onToggleGuestCountrySelect: () => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({
  isArabic,
  onGuestCountrySelect,
  guestCountrySelectOpen,
  onToggleGuestCountrySelect,
}) => {
  const { toast, showToast } = useComingSoonToast(isArabic);
  const google = useGoogleSignIn();

  const isLoading = google.isLoading;
  const error = google.error;
  const loadingProvider = google.isLoading ? 'google' : null;
  const providers = getLoginProviderButtons(isArabic);

  const handleProviderTap = useCallback(
    (providerId: string) => {
      if (isLoading) return;

      if (providerId === 'google') {
        google.clearError();
        void google.signIn();
        return;
      }

      showToast();
    },
    [isLoading, google, showToast]
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
      onToggleGuestCountrySelect={onToggleGuestCountrySelect}
    />
  );
};
