import React, { forwardRef } from 'react';
import { Refresh } from 'iconsax-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

export const spinnerVariants = cva(
  'inline-flex items-center justify-center shrink-0',
  {
    variants: {
      variant: {
        primary: 'text-primary',
        white: 'text-white',
        muted: 'text-ink-muted',
      },
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const iconSizeMap = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, variant, size = 'md', label = 'Loading', ...props }, ref) => {
    const iconDimension = iconSizeMap[size || 'md'];

    return (
      <span
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(spinnerVariants({ variant, size, className }))}
        {...props}
      >
        <Refresh
          variant="Linear"
          size={iconDimension}
          color="currentColor"
          className="animate-spin text-current"
          aria-hidden="true"
        />
        <span className="sr-only">{label}</span>
      </span>
    );
  }
);

Spinner.displayName = 'Spinner';
