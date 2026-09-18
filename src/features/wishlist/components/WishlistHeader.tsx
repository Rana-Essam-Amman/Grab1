import React from 'react';
import { ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface WishlistHeaderProps {
  isArabic: boolean;
  goBack: () => void;
  totalCount: number;
  title: string;
  clearAllText: string;
  onClearClick: () => void;
}

export const WishlistHeader: React.FC<WishlistHeaderProps> = ({
  isArabic,
  goBack,
  totalCount,
  title,
  clearAllText,
  onClearClick,
}) => {
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
    <div className="p-3 bg-surface/95 border-b border-border flex items-center justify-between sticky top-0 z-20 backdrop-blur-xs">
      <div className="flex items-center gap-2 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-background text-ink-soft hover:bg-border shrink-0 animate-none select-none"
        >
          <BackIcon size={18} />
        </Button>

        <div className="min-w-0">
          <h1 className="text-sm font-bold text-ink flex items-center gap-1.5">
            <span>{title}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-bold">
              {totalCount}
            </span>
          </h1>
          <p className="text-[10px] text-ink-muted truncate">
            {isArabic ? 'الإعلانات التي قمت بحفظها للمراجعة لاحقاً' : 'Listings you saved to track and review'}
          </p>
        </div>
      </div>

      {totalCount > 0 && (
        <button
          onClick={onClearClick}
          className="h-8 px-2.5 rounded-lg border border-border text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 size={13} />
          <span>{clearAllText}</span>
        </button>
      )}
    </div>
  );
};
