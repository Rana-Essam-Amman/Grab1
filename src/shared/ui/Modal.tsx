import React, { forwardRef, useEffect, useId, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CloseCircle } from 'iconsax-react';
import { cn } from '../lib/cn';

export const modalVariants = cva(
  'relative w-full bg-white text-[#0F172A] rounded-2xl shadow-2xl border border-[#E2E8F0] flex flex-col overflow-hidden max-h-[90vh] z-50 transform transition-all duration-200 ease-out',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        full: 'max-w-[calc(100vw-2rem)] sm:max-w-xl h-[calc(100vh-4rem)]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalVariants> {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  footer?: ReactNode;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      description,
      size,
      footer,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const titleId = title ? `modal-title-${generatedId}` : undefined;
    const descId = description ? `modal-desc-${generatedId}` : undefined;

    useEffect(() => {
      if (!open) return;

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [open, onClose]);

    if (!open) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        aria-modal="true"
        role="dialog"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          data-testid="modal-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Container */}
        <div
          ref={ref}
          className={cn(modalVariants({ size, className }))}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 end-4 w-8 h-8 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary z-10"
          >
            <CloseCircle variant="Bold" size={18} color="currentColor" />
          </button>

          {/* Header */}
          {(title || description) && (
            <div className="p-5 pb-3 pe-12 border-b border-[#E2E8F0]">
              {title && (
                <h2
                  id={titleId}
                  className="text-base font-bold text-ink leading-tight"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id={descId}
                  className="text-xs text-ink-soft mt-1 leading-normal"
                >
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Content Body */}
          <div className="p-5 overflow-y-auto flex-1">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';
