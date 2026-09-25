import React from 'react';
import { AuthProviderDef } from '../domain/entities/AuthProvider';
import { GoogleIcon, AppleIcon, WhatsAppIcon } from './ProviderLogos';

interface AuthProviderButtonProps {
  readonly provider: AuthProviderDef;
  readonly isArabic: boolean;
  readonly onTap: (id: string) => void;
}

const renderIcon = (id: string) => {
  switch (id) {
    case 'google':
      return <GoogleIcon />;
    case 'apple':
      return <AppleIcon />;
    case 'whatsapp':
      return <WhatsAppIcon />;
    default:
      return null;
  }
};

export const AuthProviderButton: React.FC<AuthProviderButtonProps> = ({
  provider,
  isArabic,
  onTap,
}) => {
  const label = isArabic ? provider.labelAr : provider.labelEn;

  return (
    <button
      type="button"
      onClick={() => onTap(provider.id)}
      className="w-full h-12 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#1a2238] active:scale-[0.99] transition flex items-center justify-center gap-2.5 text-[15px] font-medium text-[#0F172A] cursor-pointer"
    >
      {renderIcon(provider.id)}
      <span>{label}</span>
    </button>
  );
};
