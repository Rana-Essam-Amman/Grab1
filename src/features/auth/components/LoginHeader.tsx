import React from 'react';

export interface LoginHeaderProps {
  isArabic: boolean;
  error: string | null;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ isArabic, error }) => {
  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold text-ink">
          {isArabic ? 'تسجيل الدخول' : 'Welcome Back'}
        </h2>
        <p className="text-sm text-ink-muted mt-1">
          {isArabic ? 'أدخل رقم هاتفك وكلمة المرور للتابعة' : 'Enter your phone and password to continue'}
        </p>
      </div>
      
      {error && (
        <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-semibold">
          {error}
        </div>
      )}
    </>
  );
};
