import React, { forwardRef, useId, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

export const inputVariants = cva(
  'w-full bg-surface text-ink placeholder:text-ink-muted border border-line rounded-xl transition-all focus:outline-none focus:ring-2 disabled:bg-background/50 disabled:text-ink-muted disabled:cursor-not-allowed text-start',
  {
    variants: {
      variant: {
        default: 'border-line focus:border-primary focus:ring-primary',
        error: 'border-danger text-danger focus:border-danger focus:ring-danger',
      },
      size: {
        sm: 'h-8 text-xs px-3',
        md: 'h-10 text-sm px-3.5',
        lg: 'h-12 text-base px-4',
      },
      hasLeftIcon: {
        true: 'ps-10',
        false: '',
      },
      hasRightIcon: {
        true: 'pe-10',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      hasLeftIcon: false,
      hasRightIcon: false,
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    Omit<VariantProps<typeof inputVariants>, 'hasLeftIcon' | 'hasRightIcon'> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant: explicitVariant,
      size,
      label,
      error,
      hint,
      icon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint && !error ? `${inputId}-hint` : undefined;
    const describedBy = errorId || hintId || undefined;

    const variant = error ? 'error' : explicitVariant || 'default';

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold text-ink leading-none cursor-pointer"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute start-3.5 flex items-center pointer-events-none text-ink-muted z-10">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={cn(
              inputVariants({
                variant,
                size,
                hasLeftIcon: Boolean(icon),
                hasRightIcon: Boolean(rightIcon),
                className,
              })
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute end-3.5 flex items-center text-ink-muted z-10">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} className="text-xs text-danger font-medium">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="text-xs text-ink-soft">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
