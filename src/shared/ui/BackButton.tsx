import React from 'react';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import { Button } from './Button';
import { cn } from '../lib/cn';

export interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isArabic: boolean;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  isArabic,
  className,
  onClick,
  ...props
}) => {
  const Icon = isArabic ? ArrowRight : ArrowLeft;
  const label = isArabic ? 'رجوع' : 'Back';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label={label}
      className={cn('min-h-11 min-w-11', className)}
      {...props}
    >
      <Icon size={18} variant="Linear" aria-hidden="true" />
    </Button>
  );
};

BackButton.displayName = 'BackButton';
