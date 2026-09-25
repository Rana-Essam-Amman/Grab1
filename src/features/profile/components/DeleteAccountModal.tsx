import React from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Warning2 } from 'iconsax-react';

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const isArabic = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isArabic ? 'حذف الحساب نهائياً' : 'Delete Account Permanently'}
    >
      <div className="flex flex-col items-center text-center gap-4 py-3" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center text-danger shrink-0 animate-pulse">
          <Warning2 size={48} variant="Bold" color="#EF4444" />
        </div>
        
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-ink leading-relaxed font-cairo">
            {isArabic
              ? 'سيتم حذف حسابك وجميع إعلاناتك ومحادثاتك ومفضلتك نهائياً. هذا الإجراء لا يمكن التراجع عنه.'
              : 'Your account, listings, chats, and wishlist will be permanently deleted. This action cannot be undone.'}
          </p>
          <p className="text-xs text-ink-muted leading-relaxed font-cairo">
            {isArabic
              ? 'يمكنك إنشاء حساب جديد في أي وقت.'
              : 'You can create a new account at any time.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full justify-center order-2 sm:order-1 font-bold"
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            className="w-full justify-center order-1 sm:order-2 font-bold"
          >
            {isArabic ? 'نعم، احذف حسابي' : 'Yes, Delete My Account'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
