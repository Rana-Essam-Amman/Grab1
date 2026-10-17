import React from 'react';
import { AuthProviderButton } from './AuthProviderButton';
import { LoginGatewayActions } from './LoginGatewayActions';
import { LoginTermsFooter } from './LoginTermsFooter';
import type { ProviderButtonConfig } from '../helpers/providerButtonConfig';

interface LoginGatewayContentProps {
  isArabic: boolean;
  providers: ProviderButtonConfig[];
  isLoading: boolean;
  error: string | null;
  toast: string | null;
  loadingProvider: 'google' | 'facebook' | null;
  onProviderTap: (id: string) => void;
  onOpenDemoPicker: () => void;
  onToggleGuestCountrySelect: () => void;
}

export const LoginGatewayContent: React.FC<LoginGatewayContentProps> = ({
  isArabic,
  providers,
  isLoading,
  error,
  toast,
  loadingProvider,
  onProviderTap,
  onOpenDemoPicker,
  onToggleGuestCountrySelect,
}) => (
  <div
    dir={isArabic ? 'rtl' : 'ltr'}
    className="flex w-full flex-1 flex-col items-center justify-center px-6 py-8 text-center"
  >
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
          provider={provider}
          isArabic={isArabic}
          onTap={onProviderTap}
        />
      ))}
      {isLoading && loadingProvider && (
        <p className="text-xs text-ink-muted">
          {isArabic
            ? (loadingProvider === 'google'
                ? 'جاري التحويل إلى Google...'
                : 'جاري التحويل إلى Facebook...')
            : (loadingProvider === 'google'
                ? 'Redirecting to Google...'
                : 'Redirecting to Facebook...')}
        </p>
      )}
      {error && (
        <p role="alert" className="break-words text-xs font-semibold text-danger">
          {error}
        </p>
      )}
      <LoginGatewayActions
        isArabic={isArabic}
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
  </div>
);
