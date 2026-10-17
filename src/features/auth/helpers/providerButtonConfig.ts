import React from 'react';
import { GoogleIcon, FacebookIcon, AppleIcon, WhatsAppIcon } from '../components/ProviderLogos';

export interface ProviderButtonConfig {
  readonly providerId: string;
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly brandColor: string;
  readonly comingSoon?: boolean;
}

export function getLoginProviderButtons(isArabic: boolean): ProviderButtonConfig[] {
  return [
    {
      providerId: 'google',
      label: isArabic ? 'تابع باستخدام Google' : 'Continue with Google',
      icon: React.createElement(GoogleIcon),
      brandColor: '#EA4335',
      comingSoon: false,
    },
    {
      providerId: 'facebook',
      label: isArabic ? 'تابع باستخدام Facebook' : 'Continue with Facebook',
      icon: React.createElement(FacebookIcon),
      brandColor: '#1877F2',
      comingSoon: false,
    },
    {
      providerId: 'apple',
      label: isArabic ? 'تابع باستخدام Apple' : 'Continue with Apple',
      icon: React.createElement(AppleIcon),
      brandColor: '#000000',
      comingSoon: true,
    },
    {
      providerId: 'whatsapp',
      label: isArabic ? 'تابع باستخدام WhatsApp' : 'Continue with WhatsApp',
      icon: React.createElement(WhatsAppIcon),
      brandColor: '#25D366',
      comingSoon: true,
    },
  ];
}
