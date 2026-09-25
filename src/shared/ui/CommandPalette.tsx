import { Command } from 'cmdk';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function CommandPalette({ open, onOpenChange, children }: CommandPaletteProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/50 flex items-start justify-center pt-24"
      onClick={() => onOpenChange(false)}
    >
      <Command
        className="w-full max-w-lg mx-4 rounded-2xl bg-surface border border-line shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </Command>
    </div>
  );
}

export { Command };
