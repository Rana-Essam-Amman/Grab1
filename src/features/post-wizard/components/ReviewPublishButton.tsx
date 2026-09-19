import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Send2 } from 'iconsax-react';

interface ReviewPublishButtonProps {
  isArabic: boolean;
  hasMissingParams: boolean;
  isPublishing?: boolean;
  onClick: () => void;
}

export const ReviewPublishButton: React.FC<ReviewPublishButtonProps> = ({
  isArabic,
  hasMissingParams,
  isPublishing = false,
  onClick,
}) => {
  return (
    <Button
      variant="primary"
      fullWidth
      size="lg"
      onClick={onClick}
      disabled={hasMissingParams || isPublishing}
      className="mt-4"
    >
      <Send2 size={16} variant="Linear" color="#FFFFFF" />
      <span>
        {isPublishing
          ? (isArabic ? 'جاري النشر...' : 'Publishing...')
          : hasMissingParams
          ? (isArabic ? 'استكمل البيانات' : 'Complete fields')
          : (isArabic ? 'نشر الإعلان الآن' : 'Publish Now')}
      </span>
    </Button>
  );
};
