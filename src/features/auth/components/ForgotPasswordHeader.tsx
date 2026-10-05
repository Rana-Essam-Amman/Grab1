import React from 'react';
import { TickCircle } from 'iconsax-react';

export interface ForgotPasswordHeaderProps {
  isArabic: boolean;
  error?: string | null;
  successMsg?: string | null;
}

export const ForgotPasswordHeader: React.FC<ForgotPasswordHeaderProps> = ({
  isArabic,
  error,
  successMsg,
}) => {
  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold text-ink">
          {isArabic ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
        </h2>
        <p className="text-sm text-ink-muted mt-1">
          {isArabic
            ? 'أدخل رقم الهاتف والبريد الإلكتروني المسجل لاستعادة الحساب'
            : 'Enter your registered phone and email to recover your account'}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-semibold">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-success/10 border border-success/30 text-success text-xs font-semibold flex items-center gap-2">
          <TickCircle size={16} variant="Bold" color="currentColor" className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </>
  );
};
