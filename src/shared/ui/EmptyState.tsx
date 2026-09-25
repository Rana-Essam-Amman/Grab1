import React, { forwardRef, ReactNode } from 'react';
import { DirectInbox, GlobalSearch } from 'iconsax-react';
import { cn } from '../lib/cn';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center py-12 px-6 w-full',
          className
        )}
        {...props}
      >
        <div className="mb-4 text-ink-muted flex items-center justify-center">
          {icon ? icon : <DirectInbox variant="Linear" size={48} color="#94A3B8" />}
        </div>
        <h3 className="text-base font-bold text-ink leading-snug">
          {title}
        </h3>
        {description && (
          <p className="mt-1.5 text-sm text-ink-soft max-w-sm leading-normal">
            {description}
          </p>
        )}
        {action && <div className="mt-5 flex items-center justify-center">{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export interface EmptyStateNoResultsProps
  extends Omit<EmptyStateProps, 'title'> {
  title?: string;
}

export const EmptyStateNoResults = forwardRef<
  HTMLDivElement,
  EmptyStateNoResultsProps
>(
  (
    {
      title = 'لا توجد نتائج',
      description = 'جرب البحث بكلمات أخرى أو تعديل خيارات التصفية',
      icon,
      ...props
    },
    ref
  ) => {
    return (
      <EmptyState
        ref={ref}
        icon={icon || <GlobalSearch variant="Linear" size={48} color="#94A3B8" />}
        title={title}
        description={description}
        {...props}
      />
    );
  }
);

EmptyStateNoResults.displayName = 'EmptyStateNoResults';
