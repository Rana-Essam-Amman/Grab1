import React, { forwardRef, useState, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

export const avatarVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center font-bold select-none overflow-hidden bg-background text-ink-soft border border-border/60',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-[10px]',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-14 w-14 text-base',
        xl: 'h-20 w-20 text-xl',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
    },
  }
);

export const avatarStatusVariants = cva(
  'absolute bottom-0 end-0 block rounded-full ring-2 ring-surface',
  {
    variants: {
      size: {
        xs: 'h-1.5 w-1.5',
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3.5 w-3.5',
        xl: 'h-4 w-4',
      },
      status: {
        online: 'bg-success',
        offline: 'bg-ink-muted',
      },
    },
    defaultVariants: {
      size: 'md',
      status: 'offline',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  status?: 'online' | 'offline';
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt = '',
      fallback,
      size = 'md',
      shape = 'circle',
      status,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
      setImageError(false);
    }, [src]);

    const hasImage = Boolean(src) && !imageError;

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, shape, className }))}
        {...props}
      >
        {hasImage ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="uppercase font-semibold tracking-wider">
            {fallback || alt?.slice(0, 2) || '?'}
          </span>
        )}

        {status && (
          <span
            role="status"
            className={cn(avatarStatusVariants({ size, status }))}
            aria-label={status}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
