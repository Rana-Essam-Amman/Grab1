import React, { useEffect } from 'react';
import { InfoCircle } from 'iconsax-react';

interface AuthToastBannerProps {
  message: string | null;
  onDismiss: () => void;
}

export const AuthToastBanner: React.FC<AuthToastBannerProps> = ({ message, onDismiss }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="mx-4 mt-3 p-3.5 bg-warning/15 text-ink border border-warning/40 rounded-xl text-xs font-bold shadow-md flex items-center justify-between gap-2 z-50 animate-pulse">
      <div className="flex items-center gap-2">
        <InfoCircle size={16} variant="Linear" color="currentColor" className="shrink-0" />
        <span>{message}</span>
      </div>
      <button
        onClick={onDismiss}
        className="text-xs text-ink opacity-60 hover:opacity-100 font-bold px-1.5 py-0.5 rounded cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};
