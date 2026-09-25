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
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <TickCircle size={16} variant="Bold" color="#059669" className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </>
  );
};
