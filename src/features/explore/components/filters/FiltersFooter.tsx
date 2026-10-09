import React from 'react';
import { Refresh, Share } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';

export interface FiltersFooterProps {
  readonly isArabic: boolean;
  readonly previewCount: number;
  readonly onReset: () => void;
  readonly onShare: () => void;
  readonly onApply: () => void;
}

export const FiltersFooter: React.FC<FiltersFooterProps> = ({
  isArabic, previewCount, onReset, onShare, onApply,
}) => (
  <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] p-3 bg-surface border-t border-border flex items-center gap-2.5 z-40 shadow-lg">
    <button
      type="button"
      data-testid="filters-reset"
      onClick={onReset}
      aria-label={isArabic ? 'تصفير' : 'Reset'}
      className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-ink hover:bg-canvas transition-colors shrink-0 cursor-pointer"
    >
      <Refresh size={18} variant="Linear" color="currentColor" />
    </button>
    <button
      type="button"
      data-testid="filters-share"
      onClick={onShare}
      aria-label={isArabic ? 'مشاركة الفلتر' : 'Share filters'}
      className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-ink hover:bg-canvas transition-colors shrink-0 cursor-pointer"
    >
      <Share size={18} variant="Linear" color="currentColor" />
    </button>
    <div data-testid="filters-apply-wrapper" className="flex-1">
      <Button data-testid="filters-apply" variant="primary" size="lg" fullWidth onClick={onApply}>
        {isArabic ? `عرض ${previewCount} نتيجة` : `Show ${previewCount} results`}
      </Button>
    </div>
  </div>
);
