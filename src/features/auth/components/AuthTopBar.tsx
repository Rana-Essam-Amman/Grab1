import React from 'react';
import { Button } from '@/shared/ui/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/shared/i18n';

interface AuthTopBarProps {
  step: 'gateway' | 'login' | 'reg-step1' | 'reg-step2' | 'forgot';
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
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const getTitle = () => {
    if (step === 'forgot') return isArabic ? 'إعادة تعيين كلمة المرور' : 'Reset Password';
    if (step.startsWith('reg')) return isArabic ? 'إنشاء حساب جديد' : 'New Registration';
    if (step === 'login') return isArabic ? 'تسجيل الدخول للمنصة' : 'Sign In Account';
    return isArabic ? 'بوابة الدخول والأمان' : 'Security Onboarding Gateway';
  };

  return (
    <div className="px-4 py-4 border-b border-border flex items-center justify-between bg-surface sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-background text-ink-soft hover:bg-border transition-colors cursor-pointer"
        >
          <BackIcon size={18} />
        </Button>
        <h1 className="text-base font-bold text-ink">{getTitle()}</h1>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleLanguage}
        className="text-xs font-bold text-ink-soft hover:text-ink cursor-pointer"
      >
        {isArabic ? 'English' : 'عربي'}
      </Button>
    </div>
  );
};
