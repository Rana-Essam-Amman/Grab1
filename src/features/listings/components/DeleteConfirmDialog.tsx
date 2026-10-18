import React from 'react';

interface Props {
  isOpen: boolean;
  isArabic: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmDialog: React.FC<Props> = ({ isOpen, isArabic, isDeleting, onCancel, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onCancel}>
      <div className="bg-surface rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl" dir={isArabic ? 'rtl' : 'ltr'} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-2 text-ink">
          {isArabic ? 'تأكيد الحذف' : 'Confirm Delete'}
        </h3>
        <p className="text-sm text-ink-muted mb-4">
          {isArabic ? 'هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع.' : 'Are you sure you want to delete this listing? This cannot be undone.'}
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl border border-line text-ink font-semibold disabled:opacity-50">
            {isArabic ? 'إلغاء' : 'Cancel'}
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl bg-danger text-white font-semibold disabled:opacity-50">
            {isDeleting ? (isArabic ? 'جارٍ الحذف...' : 'Deleting...') : (isArabic ? 'حذف' : 'Delete')}
          </button>
        </div>
      </div>
    </div>
  );
};
