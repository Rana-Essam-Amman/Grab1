import React from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Logout } from 'iconsax-react';

interface SignOutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SignOutModal: React.FC<SignOutModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const isArabic = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isArabic ? 'تسجيل الخروج' : 'Sign Out'}
    >
      <div className="flex flex-col items-center text-center gap-4 py-3" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Logout size={26} variant="Bold" color="#E57E25" />
        </div>

        <p className="text-sm font-bold text-ink leading-relaxed font-cairo">
          {isArabic
            ? 'هل أنت متأكد من تسجيل الخروج؟ ستتمكن من الدخول مرة أخرى في أي وقت.'
            : 'Are you sure you want to sign out? You can log back in anytime.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full justify-center order-2 sm:order-1 font-bold"
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="w-full justify-center order-1 sm:order-2 font-bold bg-primary hover:bg-primary-hover text-white"
          >
            {isArabic ? 'تسجيل الخروج' : 'Sign Out'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
