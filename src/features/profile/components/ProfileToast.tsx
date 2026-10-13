import React from 'react';
import { TickCircle, CloseCircle } from 'iconsax-react';

interface ProfileToastProps {
  readonly kind: 'success' | 'error';
  readonly message: string;
}

/**
 * Fixed-position toast for EditProfileScreen save results.
 * Renders a single pill at the same position for both success and error.
 */
export const ProfileToast: React.FC<ProfileToastProps> = ({ kind, message }) => {
  const Icon = kind === 'success' ? TickCircle : CloseCircle;
  const iconClass = kind === 'success' ? 'text-primary' : 'text-red-400';
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-ink text-surface px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg z-50 text-sm font-bold animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Icon size={16} variant="Linear" color="currentColor" className={iconClass} />
      <span>{message}</span>
    </div>
  );
};
