import React from 'react';

interface AuthProviderButtonProps {
  providerId: string;
  label: string;
  icon: React.ReactNode;
  isArabic: boolean;
  onTap: (id: string) => void;
  brandColor: string;
  comingSoon?: boolean;
}

export const AuthProviderButton: React.FC<AuthProviderButtonProps> = ({
  providerId,
  label,
  icon,
  isArabic,
  onTap,
  brandColor,
  comingSoon = false,
}) => (
  <button
    type="button"
    onClick={() => onTap(providerId)}
    style={{ '--provider-brand': brandColor } as React.CSSProperties}
    className="relative flex h-14 w-full items-center justify-center rounded-2xl border-2 border-border bg-surface px-12 text-ink shadow-xs transition-all duration-200 hover:border-[var(--provider-brand)] hover:bg-[var(--provider-brand)]/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
  >
    <span className="absolute start-4 top-1/2 flex -translate-y-1/2 items-center justify-center">
      {icon}
    </span>
    <span className="text-center text-[15px] font-bold">{label}</span>
    {comingSoon && (
      <span className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full bg-background px-1.5 py-0.5 text-[9px] font-semibold text-ink-muted">
        {isArabic ? 'قريباً' : 'Soon'}
      </span>
    )}
  </button>
);
