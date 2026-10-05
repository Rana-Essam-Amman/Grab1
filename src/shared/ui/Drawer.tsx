import { Drawer as VaulDrawer } from 'vaul';
import type { ReactNode } from 'react';

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title?: string;
  className?: string;
  dir?: 'rtl' | 'ltr';
}

export function Drawer({ open, onOpenChange, children, title, className = '', dir }: DrawerProps) {
  return (
    <VaulDrawer.Root open={open} onOpenChange={onOpenChange}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <VaulDrawer.Content
          className={`fixed bottom-0 left-0 right-0 z-[65] flex flex-col rounded-t-[24px] bg-surface border-t border-border max-h-[90vh] ${className}`}
          dir={dir}
        >
          <div className="mx-auto w-12 h-1.5 rounded-full bg-line-strong my-3 opacity-60" />
          {title && (
            <VaulDrawer.Title className="px-4 pb-3 text-lg font-bold text-ink">
              {title}
            </VaulDrawer.Title>
          )}
          <div className="px-4 pb-8 overflow-y-auto">{children}</div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
