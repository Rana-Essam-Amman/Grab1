// RULE-14-EXCEPTION: UI complexity
import React, { useRef, useState } from 'react';
import { Heart, MessageCircle, Share, Location } from 'iconsax-react';
import { formatPrice } from '@/shared/lib/formatPrice';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { toggleLike } from '../services/socialService';
import { CommentSheet } from './CommentSheet';
import { toast } from 'sonner';

interface PostProps { post: any; }

export const SocialPostCard: React.FC<PostProps> = ({ post }) => {
  const { isArabic } = useUI();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [liked, setLiked] = useState<boolean>(!!post.is_liked);
  const [likeCount, setLikeCount] = useState<number>(post.like_count || 0);
  const [liking, setLiking] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(post.comment_count || 0);
  const [showComments, setShowComments] = useState(false);

  const images: string[] = post.images_list || [];

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      const newIndex = Math.round(scrollPosition / width);
      if (newIndex !== activeIndex) setActiveIndex(newIndex);
    }
  };

  const handleLike = async () => {
    if (!user || !user.id) { toast.error(isArabic ? 'سجل دخول أولاً' : 'Please sign in first'); return; }
    if (liking) return;
    const previousLiked = liked;
    const previousCount = likeCount;
    
    setLiked(!previousLiked);
    setLikeCount(prev => previousLiked ? Math.max(0, prev - 1) : prev + 1);
    setLiking(true);

    try {
      const result = await toggleLike(post.id);
      if (!result) {
        setLiked(previousLiked);
        setLikeCount(previousCount);
        toast.error(isArabic ? 'فشل التفاعل' : 'Failed to like');
      } else {
        setLiked(result.liked);
        setLikeCount(result.like_count);
      }
    } catch (err) {
      setLiked(previousLiked);
      setLikeCount(previousCount);
      toast.error(isArabic ? 'فشل التفاعل' : 'Failed to like');
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/listing/${post.id}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: post.title, url }); } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success(isArabic ? 'تم نسخ الرابط' : 'Link copied');
    } catch {
      toast.error(isArabic ? 'فشل نسخ الرابط' : 'Failed to copy link');
    }
  };

  return (
    <div className="bg-surface border-b border-border sm:border sm:rounded-xl sm:mb-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 p-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
          {post.seller_avatar ? (
            <img src={post.seller_avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-primary font-bold text-base">{post.seller_name?.charAt(0)}</span>
          )}
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-semibold text-[15px] text-ink leading-tight">{post.seller_name}</span>
          <div className="flex items-center gap-1 text-[13px] text-ink-muted mt-0.5">
            <Location size="12" variant="Bold" />
            <span>{post.city}</span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString(isArabic ? 'ar-JO' : 'en-US')}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pb-3 text-[15px] text-ink">
        <h3 className="font-semibold mb-1">{post.title}</h3>
        {post.description && <p className="text-ink-soft leading-relaxed line-clamp-3">{post.description}</p>}
      </div>

      {/* Image Carousel */}
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

          {images.length > 1 && (
            <div className="absolute top-3 end-3 bg-ink/70 text-surface text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </div>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex ? 'bg-primary w-4' : 'bg-surface/60 w-1.5'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Tag */}
      <div className="px-3 py-2.5 flex justify-between items-center bg-surface">
        <span className="text-lg font-bold text-primary">
          {formatPrice(post.price, post.currency, isArabic)}
        </span>
      </div>

      {/* Summary Row (Facebook Style) */}
      <div className="px-3 py-2 flex items-center justify-between text-[13px] text-ink-muted">
        <div className="flex items-center gap-1">
          <div className="bg-primary rounded-full p-0.5 shrink-0 flex items-center justify-center">
            <Heart size="10" color="white" variant="Bold" />
          </div>
          <span>{likeCount}</span>
        </div>
        <div>
          <span>{commentCount} {isArabic ? 'تعليق' : 'Comments'}</span>
        </div>
      </div>

      {/* Action Buttons (Facebook Style) */}
      <div className="flex items-center justify-between px-2 py-2 border-t border-border">
        <button
          onClick={handleLike}
          disabled={liking}
          className={`flex items-center gap-2 flex-1 justify-center py-1.5 rounded-lg hover:bg-canvas transition cursor-pointer ${liked ? 'text-danger' : 'text-ink-muted'}`}
        >
          <Heart size="20" variant={liked ? 'Bold' : 'Linear'} color="currentColor" />
          <span className="text-[15px] font-semibold">{isArabic ? 'إعجاب' : 'Like'}</span>
        </button>
        <button
          onClick={() => setShowComments(true)}
          className="flex items-center gap-2 flex-1 justify-center py-1.5 rounded-lg hover:bg-canvas transition cursor-pointer text-ink-muted"
        >
          <MessageCircle size="20" variant="Linear" color="currentColor" />
          <span className="text-[15px] font-semibold">{isArabic ? 'تعليق' : 'Comment'}</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 flex-1 justify-center py-1.5 rounded-lg hover:bg-canvas transition cursor-pointer text-ink-muted"
        >
          <Share size="20" variant="Linear" color="currentColor" />
          <span className="text-[15px] font-semibold">{isArabic ? 'مشاركة' : 'Share'}</span>
        </button>
      </div>

      {showComments && (
        <CommentSheet
          listingId={post.id}
          onClose={() => setShowComments(false)}
          onCommentAdded={() => setCommentCount((c) => c + 1)}
        />
      )}
    </div>
  );
};
