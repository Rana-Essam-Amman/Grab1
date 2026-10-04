import React from 'react';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';

interface MessageDeleteConfirmDialogProps {
  readonly open: boolean;
  readonly isDeleting: boolean;
  readonly isArabic: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

export const MessageDeleteConfirmDialog: React.FC<MessageDeleteConfirmDialogProps> = ({
  open,
  isDeleting,
  isArabic,
  onClose,
  onConfirm,
}) => (
  <ConfirmDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    isArabic={isArabic}
    isProcessing={isDeleting}
    destructive
    title={isArabic ? 'حذف الرسالة؟' : 'Delete message?'}
    description={
      isArabic
        ? 'سيتم حذف الرسالة من محادثتك ومن محادثة الطرف الآخر.'
        : 'The message will be removed for both you and the other party.'
    }
    confirmLabel={isArabic ? 'حذف' : 'Delete'}
    cancelLabel={isArabic ? 'إلغاء' : 'Cancel'}
  />
);
