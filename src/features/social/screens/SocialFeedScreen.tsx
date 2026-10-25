import React, { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { SocialPostCard } from '../components/SocialPostCard';
import { useUI } from '@/hooks/useUI';

const PAGE_SIZE = 10;

export const SocialFeedScreen: React.FC = () => {
  const { isArabic } = useUI();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (currentOffset: number) => {
    try {
      // For now, hardcoding 'JO' for testing. We will use real market later.
      const { data, error } = await supabase.rpc('get_social_feed', {
        p_country_code: 'JO',
        p_limit: PAGE_SIZE,
        p_offset: currentOffset
      });

      if (error) throw error;
      
      if (data) {
        setPosts(prev => currentOffset === 0 ? data : [...prev, ...data]);
        setHasMore(data.length === PAGE_SIZE);
      }
    } catch (err) {
      console.error('Failed to load feed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(0);
  }, [fetchPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          const nextOffset = offset + PAGE_SIZE;
          setOffset(nextOffset);
          fetchPosts(nextOffset);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, offset, fetchPosts]);

  return (
    <div className="min-h-screen bg-canvas" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border p-4 text-center">
        <h1 className="text-lg font-bold text-ink">{isArabic ? 'مجتمع FOX' : 'FOX Community'}</h1>
      </div>

      {/* Feed List */}
      <div className="max-w-lg mx-auto p-4">
        {posts.map(post => (
          <SocialPostCard key={post.id} post={post} />
        ))}
        
        {/* Loading & Observer Target */}
        <div ref={observerTarget} className="py-8 flex justify-center text-xs text-ink-muted">
          {loading && (isArabic ? 'جاري التحميل...' : 'Loading...')}
          {!hasMore && posts.length > 0 && (isArabic ? 'وصلت لنهاية المجتمع' : 'You have reached the end')}
          {!loading && posts.length === 0 && (isArabic ? 'لا توجد إعلانات بعد' : 'No posts yet')}
        </div>
      </div>
    </div>
  );
};
