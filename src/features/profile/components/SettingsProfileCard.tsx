import React from 'react';
import { User, Logout } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import type { User as UserType } from '@/features/auth/domain';

interface SettingsProfileCardProps {
  registered: boolean | undefined;
  user: { name?: string; phone?: string; firstName?: string; lastName?: string } | null | undefined;
  isArabic: boolean;
  handleLoginCta: () => void;
  handleLogout: () => void;
}

export const SettingsProfileCard: React.FC<SettingsProfileCardProps> = ({
  registered,
  user,
  isArabic,
  handleLoginCta,
  handleLogout,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-13 h-13 rounded-full bg-background border border-border overflow-hidden flex items-center justify-center">
          <User size={24} variant="Linear" color="#E57E25" />
        </div>
        <div>
          <div className="text-sm font-bold text-ink">
            {registered ? `${user?.firstName} ${user?.lastName}` : (isArabic ? 'زائر (غير مسجل)' : 'Guest User')}
          </div>
          <div className="text-xs text-ink-muted">
            {registered ? user?.phone : (isArabic ? 'سجل لتأكيد رقمك ونشر الإعلانات' : 'Register to verify your phone and post ads')}
          </div>
        </div>
      </div>
      {!registered ? (
        <Button
          variant="primary"
          size="sm"
          onClick={handleLoginCta}
          className="h-8 px-3 rounded-full text-xs font-bold"
        >
          {isArabic ? 'تسجيل' : 'Sign In'}
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleLogout}
          className="h-9 px-3.5 rounded-full text-xs font-bold border border-danger/30 text-danger hover:bg-danger/5 gap-1.5"
        >
          <Logout size={14} variant="Linear" color="#EF4444" />
          <span>{isArabic ? 'خروج' : 'Log out'}</span>
        </Button>
      )}
    </div>
  );
};
