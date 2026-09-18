import React, { forwardRef, useEffect, useId, ReactNode } from 'react';
import { motion, AnimatePresence, type HTMLMotionProps } from 'motion/react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

export const sheetVariants = cva(
  'relative w-full max-w-[440px] bg-surface text-ink rounded-t-3xl border-t border-x border-border shadow-2xl flex flex-col overflow-hidden z-50',
  {
    variants: {
      height: {
        auto: 'max-h-[85vh]',
        half: 'h-[50vh] max-h-[85vh]',
        full: 'h-[90vh]',
      },
    },
    defaultVariants: {
      height: 'auto',
    },
  }
);

export interface SheetProps
  extends Omit<HTMLMotionProps<'div'>, 'title' | 'children'>,
    VariantProps<typeof sheetVariants> {
  open: boolean;
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
  children?: ReactNode;
}

export const Sheet = forwardRef<HTMLDivElement, SheetProps>(
  (
    {
      open,
      onClose,
      title,
      height = 'auto',
      showCloseButton = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const titleId = useId();

    useEffect(() => {
      if (!open) return;

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [open, onClose]);

    return (
      <AnimatePresence>
        {open && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
              aria-hidden="true"
            />

            {/* Slide-up Sheet Panel */}
            <motion.div
              ref={ref}
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className={cn(sheetVariants({ height, className }))}
              onClick={(e) => e.stopPropagation()}
              {...props}
            >
              {/* Drag Handle Bar */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Header */}
              {(title || showCloseButton) && (
                <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between shrink-0">
                  {title ? (
                    <h2
                      id={titleId}
                      className="text-base font-bold text-ink leading-tight"
                    >
                      {title}
                    </h2>
                  ) : (
                    <div />
                  )}
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close"
                      className="p-1.5 rounded-full text-ink-muted hover:text-ink hover:bg-background/60 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}

              {/* Sheet Body Content */}
              <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] overflow-y-auto flex-1">{children}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }
);

Sheet.displayName = 'Sheet';
