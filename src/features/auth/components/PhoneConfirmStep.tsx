import React from 'react';

interface Props {
  readonly phonePreview: string;
  readonly error: string | null;
  readonly saving: boolean;
  readonly isArabic: boolean;
  readonly onBack: () => void;
  readonly onConfirm: () => void;
}

export const PhoneConfirmStep: React.FC<Props> = ({
  phonePreview,
  error,
  saving,
  isArabic,
  onBack,
  onConfirm,
}) => (
  <div className="flex flex-col gap-4">
    <div
      dir="ltr"
      className="w-full h-12 flex items-center justify-center rounded-xl border border-line bg-canvas text-ink text-base font-bold tracking-wider"
    >
      {phonePreview}
    </div>

    <ul className="flex flex-col gap-2 text-xs text-ink-soft leading-relaxed list-disc ps-5">
      <li>
        {isArabic
          ? 'لا يمكن تعديل الرقم إلا من خلال الإعدادات.'
          : 'The number cannot be edited except from Settings.'}
      </li>
      <li>
        {isArabic
          ? 'يتطلب التعديل تقديم طلب ومراجعة.'
          : 'Changing it requires submitting a request and review.'}
      </li>
      <li>
        {isArabic
          ? 'في حال الموافقة على التعديل، سيتم حذف جميع إعلاناتك نهائياً.'
          : 'If a change is approved, all your listings will be permanently deleted.'}
      </li>
    </ul>

    {error && <p className="text-xs font-bold text-danger">{error}</p>}

    <div className="flex gap-2">
      <button
        type="button"
        onClick={onBack}
        disabled={saving}
        className="flex-1 h-12 rounded-xl border border-line bg-canvas text-ink font-bold text-sm disabled:opacity-50 cursor-pointer"
      >
        {isArabic ? 'رجوع' : 'Back'}
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={saving}
        className="flex-1 h-12 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {saving
          ? (isArabic ? 'جاري الحفظ...' : 'Saving...')
          : (isArabic ? 'تأكيد وتثبيت' : 'Confirm and lock')}
      </button>
    </div>
  </div>
);
