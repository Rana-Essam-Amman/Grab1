import React from 'react';
import { Heart, MessageCircle, Share2, MapPin } from 'iconsax-react';
import { formatPrice } from '@/shared/lib/formatPrice';
import { useUI } from '@/hooks/useUI';

interface PostProps {
  post: any;
}

export const SocialPostCard: React.FC<PostProps> = ({ post }) => {
  const { isArabic } = useUI();

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
            <MapPin size="12" variant="Bold" />
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

      {/* Image */}
      {post.cover_image && (
        <div className="w-full aspect-square bg-canvas relative overflow-hidden">
          <img src={post.cover_image} alt="listing" className="w-full h-full object-cover" loading="lazy" />
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
          <Share2 size="18" variant="Linear" />
          <span>{isArabic ? 'مشاركة' : 'Share'}</span>
        </button>
      </div>
    </div>
  );
};
