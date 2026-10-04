import React from 'react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly title: string;
  readonly description?: string;
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  readonly destructive?: boolean;
  readonly isArabic?: boolean;
  readonly isProcessing?: boolean;
}

/**
 * Destructive-action confirmation. Wraps Modal.
 *
 * Layout:
 *   ┌────────────────────────────┐
 *   │ Title                      │
 *   │ Description (optional)     │
 *   │                            │
 *   │ [Cancel]      [Confirm]    │
 *   └────────────────────────────┘
 *
 * Note: Modal's own onClose fires on backdrop / ESC. Caller decides if 
 * that's acceptable.
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive = false,
  isArabic = false,
  isProcessing = false,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
    >
      <div className="flex flex-col gap-3 mt-2" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 h-12 rounded-xl border border-line bg-canvas text-ink font-bold text-sm disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`flex-1 h-12 rounded-xl text-white font-bold text-sm disabled:opacity-50 cursor-pointer ${
              destructive ? 'bg-danger hover:opacity-90' : 'bg-primary hover:opacity-90'
            }`}
          >
            {isProcessing
              ? (isArabic ? 'جارٍ...' : 'Working...')
              : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
