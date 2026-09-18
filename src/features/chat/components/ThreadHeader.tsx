import React from 'react';
import { Phone, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface ThreadHeaderProps {
  isArabic: boolean;
  goBack: () => void;
  handleViewListing: () => void;
  imageUrl: string;
  title: string;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  dialNumber?: string;
}

export const ThreadHeader: React.FC<ThreadHeaderProps> = ({
  isArabic,
  goBack,
  handleViewListing,
  imageUrl,
  title,
  handleImageError,
  dialNumber,
}) => {
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
    <div className="p-3 bg-surface border-b border-border flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2.5 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-background text-ink-soft hover:bg-border shrink-0 animate-none select-none"
        >
          <BackIcon size={18} />
        </Button>
        <div
          onClick={handleViewListing}
          className="flex items-center gap-2 cursor-pointer min-w-0"
        >
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-background border border-border shrink-0">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-ink truncate">{title}</div>
            <div className="text-[10px] text-primary font-semibold hover:underline">
              {isArabic ? 'عرض تفاصيل الإعلان' : 'View listing'}
            </div>
          </div>
        </div>
      </div>
      {dialNumber && (
        <a
          href={`tel:${dialNumber}`}
          className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-ink hover:bg-border shrink-0 ms-2"
          title={isArabic ? 'اتصال بالمعلن' : 'Call seller'}
        >
          <Phone size={16} />
        </a>
      )}
    </div>
  );
};
