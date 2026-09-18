import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

export const skeletonVariants = cva(
  'animate-pulse bg-background',
  {
    variants: {
      variant: {
        text: 'h-4 w-full rounded-md',
        circle: 'rounded-full shrink-0',
        rect: 'rounded-lg w-full',
      },
    },
    defaultVariants: {
      variant: 'text',
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, width, height, style, ...props }, ref) => {
    const inlineStyle: React.CSSProperties = {
      ...style,
      ...(width !== undefined ? { width } : {}),
      ...(height !== undefined ? { height } : {}),
    };

    return (
      <div
        ref={ref}
        style={inlineStyle}
        className={cn(skeletonVariants({ variant, className }))}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  gap?: 'sm' | 'md' | 'lg';
}

export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, lines = 3, gap = 'md', ...props }, ref) => {
    const gapClass = gap === 'sm' ? 'space-y-1.5' : gap === 'lg' ? 'space-y-3' : 'space-y-2';

    return (
      <div ref={ref} className={cn('w-full', gapClass, className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            className={index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}
          />
        ))}
      </div>
    );
  }
);

SkeletonText.displayName = 'SkeletonText';
