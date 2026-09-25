import React, { forwardRef, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

export const chipVariants = cva(
  'inline-flex items-center justify-center font-bold rounded-full transition-all select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed leading-none shrink-0',
  {
    variants: {
      selected: {
        true: 'bg-primary text-white border-transparent shadow-xs',
        false:
          'bg-surface text-ink-soft border border-border hover:border-primary/50 hover:text-ink active:scale-[0.98]',
      },
      size: {
        sm: 'h-7 px-3 text-xs gap-1.5',
        md: 'h-9 px-4 text-sm gap-2',
      },
    },
    defaultVariants: {
      selected: false,
      size: 'md',
    },
  }
);

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>,
    VariantProps<typeof chipVariants> {
  icon?: ReactNode;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      selected = false,
      size,
      icon,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-pressed={Boolean(selected)}
        className={cn(chipVariants({ selected, size, className }))}
        {...props}
      >
        {icon && <span className="shrink-0 flex items-center">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }
);

Chip.displayName = 'Chip';
