import React from 'react';
import { useUI } from '@/hooks/useUI';

interface LoginTermsFooterProps {
  isArabic: boolean;
}

export const LoginTermsFooter: React.FC<LoginTermsFooterProps> = ({
  isArabic,
}) => {
  const { navigateTo } = useUI();

  return (
    <p className="mt-6 max-w-sm text-center text-xs leading-6 text-ink-muted">
      {isArabic ? 'بالمتابعة، أنت توافق على ' : 'By continuing, you agree to our '}
      <button
        type="button"
        onClick={() => navigateTo('terms')}
        className="font-semibold text-brand underline cursor-pointer"
      >
        {isArabic ? 'شروط الاستخدام' : 'Terms of Service'}
      </button>
      {isArabic ? ' و' : ' and '}
      <button
        type="button"
        onClick={() => navigateTo('privacy')}
        className="font-semibold text-brand underline cursor-pointer"
      >
        {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
      </button>
      .
    </p>
  );
};
