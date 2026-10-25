import React, { useRef, useState } from 'react';
import { Heart, MessageCircle, Share, Location } from 'iconsax-react';
import { formatPrice } from '@/shared/lib/formatPrice';
import { useUI } from '@/hooks/useUI';

interface PostProps {
  post: any;
}

export const SocialPostCard: React.FC<PostProps> = ({ post }) => {
  const { isArabic } = useUI();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const images: string[] = post.images_list || [];

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      const newIndex = Math.round(scrollPosition / width);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl mb-4 shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          {post.seller_avatar ? (
            <img src={post.seller_avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-primary font-bold text-lg">{post.seller_name?.charAt(0)}</span>
          )}
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-bold text-sm text-ink">{post.seller_name}</span>
          <div className="flex items-center gap-1 text-[11px] text-ink-muted">
            <Location size="12" variant="Bold" />
            <span>{post.city}</span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString(isArabic ? 'ar-JO' : 'en-US')}</span>
          </div>
        </div>
      </div>

      {/* Content (Title & Description) */}
      <div className="px-3 pb-2 text-sm text-ink">
        <h3 className="font-bold mb-1">{post.title}</h3>
        {post.description && <p className="text-ink-soft text-xs line-clamp-2">{post.description}</p>}
      </div>

      {/* Image Carousel (Facebook Style) */}
      {images.length > 0 && (
        <div className="relative w-full aspect-square bg-canvas">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {images.map((img, i) => (
              <div key={i} className="w-full h-full shrink-0 snap-center">
                <img src={img} alt={`listing-${i}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          
          {/* Image Counter (e.g., 1/3) */}
          {images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </div>
          )}

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex ? 'bg-white w-3' : 'bg-white/50 w-1.5'
                  }`} 
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Tag */}
      <div className="px-3 py-2 border-b border-border flex justify-between items-center bg-surface">
        <span className="text-lg font-bold text-primary">
          {formatPrice(post.price, post.currency, isArabic)}
        </span>
      </div>

      {/* Actions (Like, Comment, Share) */}
      <div className="flex items-center justify-around p-2 text-xs font-bold text-ink-muted bg-surface rounded-b-xl">
        <button className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg hover:bg-canvas transition cursor-pointer">
          <Heart size="18" variant={post.is_liked ? "Bold" : "Linear"} color={post.is_liked ? "#ef4444" : "currentColor"} />
          <span>{post.like_count || 0} {isArabic ? 'إعجاب' : 'Likes'}</span>
        </button>
        <button className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg hover:bg-canvas transition cursor-pointer">
          <MessageCircle size="18" variant="Linear" />
          <span>{post.comment_count || 0} {isArabic ? 'تعليق' : 'Comments'}</span>
        </button>
        <button className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg hover:bg-canvas transition cursor-pointer">
          <Share size="18" variant="Linear" />
          <span>{isArabic ? 'مشاركة' : 'Share'}</span>
        </button>
      </div>
    </div>
  );
};
