import React from 'react';
import { Button } from '@/shared/ui/Button';
import { BackButton } from '@/shared/ui/BackButton';
import { useTranslation } from '@/shared/i18n';

interface AuthTopBarProps {
  step: 'gateway' | 'login' | 'reg-step1' | 'reg-step2';
  onBack: () => void;
  isArabic: boolean;
  onToggleLanguage: () => void;
}

export const AuthTopBar: React.FC<AuthTopBarProps> = ({
  step,
  onBack,
  isArabic,
  onToggleLanguage,
}) => {
  const { t } = useTranslation();

  const getTitle = () => {
    if (step.startsWith('reg')) return isArabic ? 'إنشاء حساب جديد' : 'New Registration';
    if (step === 'login') return isArabic ? 'تسجيل الدخول للمنصة' : 'Sign In Account';
    return isArabic ? 'بوابة الدخول والأمان' : 'Security Onboarding Gateway';
  };

  return (
    <div className="px-4 py-4 bg-brand border-b border-white/10 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <BackButton
          isArabic={isArabic}
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-surface/15 hover:bg-surface/25 flex items-center justify-center p-0 cursor-pointer text-white"
        />
        <h1 className="text-base font-bold text-white">{getTitle()}</h1>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleLanguage}
        className="text-xs font-bold text-white/80 hover:text-white cursor-pointer"
      >
        {isArabic ? 'English' : 'عربي'}
      </Button>
    </div>
  );
};
