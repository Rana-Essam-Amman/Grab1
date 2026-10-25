import React, { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { SocialPostCard } from '../components/SocialPostCard';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/shared/components/Header';

const PAGE_SIZE = 10;

export const SocialFeedScreen: React.FC = () => {
  const { isArabic, browseCountryCode, navigateTo } = useUI();
  const { user, authStatus } = useAuth();
  
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authStatus === 'unauthenticated' || !user) {
      navigateTo('login');
    }
  }, [authStatus, user, navigateTo]);

  const fetchPosts = useCallback(async (currentOffset: number) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.rpc('get_social_feed', {
        p_country_code: browseCountryCode,
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
  }, [browseCountryCode, user]);

  useEffect(() => {
    if (user) fetchPosts(0);
  }, [fetchPosts, user]);

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

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, loading, offset, fetchPosts]);

  if (authStatus === 'initializing' || !user) {
    return <div className="min-h-screen bg-canvas flex items-center justify-center text-ink-muted">{isArabic ? 'جاري التحقق...' : 'Verifying...'}</div>;
  }

  return (
    <div className={`max-w-[440px] mx-auto w-full flex flex-col pt-0 pb-28 bg-canvas min-h-screen ${isArabic ? 'font-cairo' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <Header />
      <div className="px-4 pt-4">
        {posts.map(post => <SocialPostCard key={post.id} post={post} />)}
        <div ref={observerTarget} className="py-8 flex justify-center text-xs text-ink-muted">
          {loading && (isArabic ? 'جاري التحميل...' : 'Loading...')}
          {!hasMore && posts.length > 0 && (isArabic ? 'وصلت لنهاية المجتمع' : 'You have reached the end')}
        </div>
      </div>
    </div>
  );
};
