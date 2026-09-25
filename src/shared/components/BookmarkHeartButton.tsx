import { useListings } from '@/hooks/useListings';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { Heart } from 'iconsax-react';
import { motion } from 'motion/react';

interface BookmarkHeartButtonProps {
  listingId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const BookmarkHeartButton: React.FC<BookmarkHeartButtonProps> = ({
  listingId,
  className = '',
  size = 'md',
  showLabel = false,
}) => {
  const { isWishlisted, toggleWishlist } = useListings();
  const { isArabic, navigateTo } = useUI();
  const { authStatus } = useAuth();
  const isSaved = isWishlisted(listingId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (authStatus === 'unauthenticated') {
      navigateTo('login');
      return;
    }
    toggleWishlist(listingId);
  };

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  const buttonDimensions =
    size === 'sm'
      ? 'w-7.5 h-7.5'
      : size === 'lg'
      ? 'w-10 h-10'
      : 'w-8.5 h-8.5';

  return (
    <motion.button
      id={`wishlist-toggle-${listingId}`}
      type="button"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.88 }}
      onClick={handleClick}
      className={`relative flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
        isSaved
          ? 'bg-white shadow-md ring-1 ring-red-500/20'
          : 'bg-white/90 hover:bg-white shadow-xs'
      } ${buttonDimensions} ${className}`}
      aria-label={
        isSaved
          ? isArabic
            ? 'إزالة من المفضلة'
            : 'Remove from favorites'
          : isArabic
          ? 'حفظ في المفضلة'
          : 'Save to favorites'
      }
      title={
        isSaved
          ? isArabic
            ? 'إزالة من المفضلة'
            : 'Remove from favorites'
          : isArabic
          ? 'حفظ في المفضلة'
          : 'Save to favorites'
      }
    >
      <div className="flex items-center justify-center">
        <Heart
          variant={isSaved ? 'Bold' : 'Linear'}
          size={iconSize}
          color={isSaved ? '#EF4444' : '#64748B'}
        />
      </div>

      {showLabel && (
        <span className="text-xs font-semibold ml-1.5 whitespace-nowrap">
          {isSaved
            ? isArabic
              ? 'محفوظ'
              : 'Saved'
            : isArabic
            ? 'حفظ'
            : 'Save'}
        </span>
      )}
    </motion.button>
  );
};
