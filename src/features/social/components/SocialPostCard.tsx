// RULE-14-EXCEPTION: UI complexity
import React, { useState, useCallback, useRef, useLayoutEffect } from 'react';
import { Heart, MessageCircle, Share, Location } from 'iconsax-react';
import { stripEmojis } from '@/shared/lib/stripEmojis';
import { formatPrice } from '@/shared/lib/formatPrice';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { toggleLike } from '../services/socialService';
import { CommentSheet } from './CommentSheet';
import { ImageLightbox } from './ImageLightbox';
import { toast } from 'sonner';
import type { SocialPost } from '../types';

interface PostProps { post: SocialPost; }

export const SocialPostCard: React.FC<PostProps> = React.memo(({ post }) => {
  const { isArabic } = useUI();
  const { user } = useAuth();
  const [liked, setLiked] = useState<boolean>(!!post.is_liked);
  const [likeCount, setLikeCount] = useState<number>(post.like_count || 0);
  const [liking, setLiking] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(post.comment_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const images: string[] = post.images_list || [];
  const description = stripEmojis(post.description || '');
  const cleanTitle = stripEmojis(post.title || '');

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    if (!isTextExpanded) {
      setHasOverflow(el.scrollHeight > el.clientHeight + 5);
    }
  }, [description, isTextExpanded]);

  const handleCloseComments = useCallback(() => setShowComments(false), []);
  const handleCloseLightbox = useCallback(() => setShowLightbox(false), []);
  const handleCommentAdded = useCallback(() => setCommentCount((c) => c + 1), []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
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

  const renderMedia = () => {
    if (images.length === 0) return null;
    if (images.length === 1) {
      return (
        <div className="w-full relative aspect-square bg-canvas cursor-pointer" onClick={() => openLightbox(0)}>
          <img src={images[0]} alt="listing" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        </div>
      );
    }
    if (images.length === 2) {
      return (
        <div className="w-full aspect-[2/1] bg-canvas grid grid-cols-2 gap-[2px] cursor-pointer">
          <div className="relative w-full h-full" onClick={() => openLightbox(0)}>
            <img src={images[0]} alt="listing-0" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="relative w-full h-full" onClick={() => openLightbox(1)}>
            <img src={images[1]} alt="listing-1" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      );
    }
    if (images.length === 3) {
      return (
        <div className="w-full aspect-square bg-canvas grid grid-cols-2 grid-rows-2 gap-[2px] cursor-pointer">
          <div className="relative w-full h-full row-span-2" onClick={() => openLightbox(0)}>
            <img src={images[0]} alt="listing-0" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="relative w-full h-full" onClick={() => openLightbox(1)}>
            <img src={images[1]} alt="listing-1" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="relative w-full h-full" onClick={() => openLightbox(2)}>
            <img src={images[2]} alt="listing-2" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      );
    }
    return (
      <div className="w-full aspect-square bg-canvas grid grid-cols-2 grid-rows-2 gap-[2px] cursor-pointer">
        {images.slice(0, 4).map((img, i) => (
          <div key={i} className="relative w-full h-full" onClick={() => openLightbox(i)}>
            <img src={img} alt={`listing-${i}`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            {i === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <span className="text-white font-bold text-2xl">+{images.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-surface border border-border rounded-xl mb-3 shadow-sm flex flex-col overflow-hidden">
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

      <div className="px-3 pb-3 text-[15px] text-ink">
        {/* Title in a distinct box */}
        <div className="bg-canvas p-2.5 rounded-lg mb-2">
          <h3
            className="font-bold leading-[1.3333]"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {cleanTitle}
          </h3>
        </div>

        {description && (
          <div className="px-0.5">
            <div
              ref={textRef}
              className="text-ink leading-[1.3333]"
              style={{
                whiteSpace: 'pre-wrap',
                ...(!isTextExpanded ? {
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                } : {})
              }}
            >
              {description}
            </div>
            {hasOverflow && (
              <button
                onClick={() => setIsTextExpanded(!isTextExpanded)}
                className="text-ink-muted font-semibold text-[14px] mt-1 hover:underline cursor-pointer"
              >
                {isTextExpanded ? (isArabic ? 'عرض أقل' : 'See Less') : (isArabic ? 'عرض المزيد' : 'See More')}
              </button>
            )}
          </div>
        )}
      </div>

      {renderMedia()}

      {/* Price & Summary Area */}
      <div className="px-3 py-2.5 flex justify-between items-center bg-canvas/30 border-t border-border">
        <span className="text-xl font-bold text-danger">
          {formatPrice(post.price, post.currency, isArabic)}
        </span>
        <div className="flex items-center gap-3 text-[13px] text-ink-muted">
          <div className="flex items-center gap-1">
            <Heart size="14" variant={liked ? 'Bold' : 'Linear'} color={liked ? 'currentColor' : 'currentColor'} className={liked ? 'text-danger' : ''} />
            <span>{likeCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size="14" variant="Linear" />
            <span>{commentCount}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-2 py-1 border-t border-border bg-surface">
        <button onClick={handleLike} disabled={liking} className={`flex items-center justify-center gap-2 flex-1 min-h-[44px] rounded-lg hover:bg-canvas transition cursor-pointer ${liked ? 'text-danger' : 'text-ink-muted'}`}>
          <Heart size="20" variant={liked ? 'Bold' : 'Linear'} color="currentColor" />
          <span className="text-[15px] font-semibold">{isArabic ? 'إعجاب' : 'Like'}</span>
        </button>
        <button onClick={() => setShowComments(true)} className="flex items-center justify-center gap-2 flex-1 min-h-[44px] rounded-lg hover:bg-canvas transition cursor-pointer text-ink-muted">
          <MessageCircle size="20" variant="Linear" color="currentColor" />
          <span className="text-[15px] font-semibold">{isArabic ? 'تعليق' : 'Comment'}</span>
        </button>
        <button onClick={handleShare} className="flex items-center justify-center gap-2 flex-1 min-h-[44px] rounded-lg hover:bg-canvas transition cursor-pointer text-ink-muted">
          <Share size="20" variant="Linear" color="currentColor" />
          <span className="text-[15px] font-semibold">{isArabic ? 'مشاركة' : 'Share'}</span>
        </button>
      </div>

      {showComments && <CommentSheet listingId={post.id} onClose={handleCloseComments} onCommentAdded={handleCommentAdded} />}
      {showLightbox && <ImageLightbox images={images} initialIndex={lightboxIndex} onClose={handleCloseLightbox} />}
    </div>
  );
});

SocialPostCard.displayName = 'SocialPostCard';
