import React, { forwardRef, useId } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

export const textareaVariants = cva(
  'w-full bg-surface text-ink placeholder:text-ink-muted border rounded-xl p-3 text-sm transition-all focus:outline-none focus:ring-2 disabled:bg-background/50 disabled:text-ink-muted disabled:cursor-not-allowed text-start min-h-[96px] resize-y',
  {
    variants: {
      variant: {
        default: 'border-border focus:border-primary focus:ring-primary',
        error: 'border-danger text-danger focus:border-danger focus:ring-danger',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant: explicitVariant,
      label,
      error,
      hint,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || `textarea-${generatedId}`;
    const errorId = error ? `${textareaId}-error` : undefined;
    const hintId = hint && !error ? `${textareaId}-hint` : undefined;
    const describedBy = errorId || hintId || undefined;

    const variant = error ? 'error' : explicitVariant || 'default';

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-bold text-ink leading-none cursor-pointer"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(textareaVariants({ variant, className }))}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
