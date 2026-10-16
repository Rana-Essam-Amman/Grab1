import React from 'react';
import type { AuthProviderId } from '../domain/entities/AuthProvider';
import {
  GoogleIcon,
  FacebookIcon,
  AppleIcon,
  EmailIcon,
  BiometricsIcon,
} from '../components/ProviderLogos';

export interface ProviderButtonConfig {
  providerId: AuthProviderId;
  label: string;
  icon: React.ReactNode;
  brandColor: string;
  comingSoon: boolean;
}

export function getLoginProviderButtons(
  isArabic: boolean,
): ProviderButtonConfig[] {
  return [
    {
      providerId: 'google',
      label: isArabic ? 'تابع باستخدام Google' : 'Continue with Google',
      icon: React.createElement(GoogleIcon),
      brandColor: '#4285F4',
      comingSoon: false,
    },
    {
      providerId: 'facebook',
      label: isArabic ? 'تابع باستخدام Facebook' : 'Continue with Facebook',
      icon: React.createElement(FacebookIcon),
      brandColor: '#1877F2',
      comingSoon: true,
    },
    {
      providerId: 'apple',
      label: isArabic ? 'تابع باستخدام Apple' : 'Continue with Apple',
      icon: React.createElement(AppleIcon),
      brandColor: '#000000',
      comingSoon: true,
    },
    {
      providerId: 'email',
      label: isArabic ? 'تابع بالبريد الإلكتروني' : 'Continue with Email',
      icon: React.createElement(EmailIcon),
      brandColor: '#E58A2B',
      comingSoon: false,
    },
    {
      providerId: 'biometrics',
      label: isArabic ? 'تابع بالبصمة' : 'Continue with Biometrics',
      icon: React.createElement(BiometricsIcon),
      brandColor: '#10B981',
      comingSoon: true,
    },
  ];
}
