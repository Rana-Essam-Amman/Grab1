// RULE-14-EXCEPTION: UI complexity
import React, { useRef, useState } from 'react';
import { Heart, MessageCircle, Share, Location } from 'iconsax-react';
import { formatPrice } from '@/shared/lib/formatPrice';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { toggleLike } from '../services/socialService';
import { CommentSheet } from './CommentSheet';
import { toast } from 'sonner';

interface PostProps {
  post: any;
}

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
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? Math.max(0, c - 1) : c + 1));
    setLiking(true);
    const result = await toggleLike(post.id);
    setLiking(false);
    if (!result) {
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : Math.max(0, c - 1)));
      toast.error(isArabic ? 'فشل التفاعل' : 'Failed to like');
    } else {
      setLiked(result.liked);
      setLikeCount(result.like_count);
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
    <div className="bg-surface border border-border rounded-xl mb-4 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 p-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          {post.seller_avatar ? <img src={post.seller_avatar} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-primary font-bold text-lg">{post.seller_name?.charAt(0)}</span>}
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-bold text-sm text-ink">{post.seller_name}</span>
          <div className="flex items-center gap-1 text-[11px] text-ink-muted">
            <Location size="12" variant="Bold" /><span>{post.city}</span><span>•</span><span>{new Date(post.created_at).toLocaleDateString(isArabic ? 'ar-JO' : 'en-US')}</span>
          </div>
        </div>
      </div>

      <div className="px-3 pb-2 text-sm text-ink">
        <h3 className="font-bold mb-1">{post.title}</h3>
        {post.description && <p className="text-ink-soft text-xs line-clamp-2">{post.description}</p>}
      </div>

      {images.length > 0 && (
        <div className="relative w-full aspect-square bg-canvas">
          <div ref={scrollRef} onScroll={handleScroll} className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {images.map((img, i) => (
              <div key={i} className="w-full h-full shrink-0 snap-center"><img src={img} alt={`listing-${i}`} className="w-full h-full object-cover" loading="lazy" /></div>
            ))}
          </div>
          {images.length > 1 && <div className="absolute top-2 right-2 bg-ink/60 text-surface text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">{activeIndex + 1} / {images.length}</div>}
          {images.length > 1 && <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">{images.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all ${i === activeIndex ? 'bg-primary w-3' : 'bg-surface/60 w-1.5'}`} />)}</div>}
        </div>
      )}

      <div className="px-3 py-2 border-b border-border flex justify-between items-center bg-surface">
        <span className="text-lg font-bold text-primary">{formatPrice(post.price, post.currency, isArabic)}</span>
      </div>

      <div className="flex items-center justify-around p-2 text-xs font-bold text-ink-muted bg-surface rounded-b-xl">
        <button onClick={handleLike} disabled={liking} className={`flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg hover:bg-canvas transition cursor-pointer ${liked ? 'text-danger' : ''}`}>
          <Heart size="18" variant={liked ? 'Bold' : 'Linear'} color="currentColor" /><span>{likeCount} {isArabic ? 'إعجاب' : 'Likes'}</span>
        </button>
        <button onClick={() => setShowComments(true)} className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg hover:bg-canvas transition cursor-pointer">
          <MessageCircle size="18" variant="Linear" /><span>{commentCount} {isArabic ? 'تعليق' : 'Comments'}</span>
        </button>
        <button onClick={handleShare} className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg hover:bg-canvas transition cursor-pointer">
          <Share size="18" variant="Linear" /><span>{isArabic ? 'مشاركة' : 'Share'}</span>
        </button>
      </div>

      {showComments && <CommentSheet listingId={post.id} onClose={() => setShowComments(false)} onCommentAdded={() => setCommentCount((c) => c + 1)} />}
    </div>
  );
};
