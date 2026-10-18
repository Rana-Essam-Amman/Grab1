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
      className={`relative flex w-full items-center justify-center rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        comingSoon ? 'cursor-not-allowed bg-surface/50' : ''
      }`}
    >
      <span className="absolute start-4 flex h-5 w-5 items-center justify-center">
        {icon}
      </span>
      <span className="w-full text-center px-10">{label}</span>

      {comingSoon && (
        <span className="absolute end-3 text-[10px] font-bold text-white bg-white/10 px-2 py-0.5 rounded-full">
          {isArabic ? 'قريباً جداً' : 'Coming soon'}
        </span>
      )}
    </button>
  );
};
