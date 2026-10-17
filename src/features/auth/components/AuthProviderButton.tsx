import React from 'react';
import type { ProviderButtonConfig } from '../helpers/providerButtonConfig';

interface AuthProviderButtonProps {
  provider: ProviderButtonConfig;
  isArabic: boolean;
  onTap: (id: string) => void;
}

export const AuthProviderButton: React.FC<AuthProviderButtonProps> = ({
  provider,
  isArabic,
  onTap,
}) => {
  const { providerId, label, icon, comingSoon } = provider;

  return (
    <button
      type="button"
      onClick={() => onTap(providerId)}
      aria-disabled={comingSoon ? 'true' : undefined}
      className={`relative flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-content-primary transition-colors hover:bg-canvas ${
        comingSoon ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      <span className="flex h-5 w-5 items-center justify-center">
        {icon}
      </span>
      <span>{label}</span>
      
      {comingSoon && (
        <span className="absolute right-3 text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
          {isArabic ? 'قريباً جداً' : 'Coming soon'}
        </span>
      )}
    </button>
  );
};
