import React from 'react';

interface MissingFieldsNoticeProps {
  readonly isArabic: boolean;
  readonly fields: readonly string[];
  readonly className?: string;
}

export const MissingFieldsNotice: React.FC<MissingFieldsNoticeProps> = React.memo(
  ({ isArabic, fields, className = '' }) => {
    if (!fields || fields.length === 0) return null;
    return (
      <div className={`rounded-2xl bg-danger/5 border border-danger/20 px-4 py-3 ${className}`}>
        <p className="text-xs font-bold text-danger mb-1">
          {isArabic ? 'يرجى ملء الحقول المطلوبة:' : 'Required fields:'}
        </p>
        <p className="text-xs text-ink-soft">{fields.join(' · ')}</p>
      </div>
    );
  }
);

MissingFieldsNotice.displayName = 'MissingFieldsNotice';
