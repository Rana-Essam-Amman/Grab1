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
  const [error, setError] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);

  useEffect(() => {
    if (authStatus === 'unauthenticated' || !user) {
      navigateTo('login');
    }
  }, [authStatus, user, navigateTo]);

  const fetchPosts = useCallback(async (currentOffset: number) => {
    if (!user || fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(false);

    try {
      const { data, error: err } = await supabase.rpc('get_social_feed', {
        p_country_code: browseCountryCode,
        p_limit: PAGE_SIZE,
        p_offset: currentOffset,
      });

      if (err) throw err;

      if (data) {
        setPosts((prev) => (currentOffset === 0 ? data : [...prev, ...data]));
        setHasMore(data.length === PAGE_SIZE);
      }
    } catch (err) {
      console.error('Failed to load feed', err);
      setError(true);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [browseCountryCode, user]);

  useEffect(() => {
    setPosts([]);
    setOffset(0);
    setHasMore(true);
    setError(false);
    if (user) fetchPosts(0);
  }, [fetchPosts, user]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !error && !fetchingRef.current) {
          const nextOffset = offset + PAGE_SIZE;
          setOffset(nextOffset);
          fetchPosts(nextOffset);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, loading, offset, fetchPosts, error]);

  const handleRetry = () => {
    setError(false);
    setHasMore(true);
    fetchPosts(offset);
  };

  if (authStatus === 'initializing' || !user) {
    return <div className="min-h-screen bg-canvas flex items-center justify-center text-ink-muted">{isArabic ? 'جاري التحقق...' : 'Verifying...'}</div>;
  }

  return (
    <div className={`max-w-[440px] mx-auto w-full flex flex-col pt-0 pb-28 bg-canvas min-h-screen ${isArabic ? 'font-cairo' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <Header />
      <div className="px-4 pt-4">
        {posts.map((post) => <SocialPostCard key={post.id} post={post} />)}

        {error && (
          <div className="py-8 flex flex-col items-center gap-3">
            <p className="text-sm text-ink-muted">{isArabic ? 'تعذر تحميل الإعلانات' : 'Failed to load feed'}</p>
            <button onClick={handleRetry} className="px-5 py-2 bg-primary text-white rounded-full font-bold text-sm cursor-pointer">
              {isArabic ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        )}

        <div ref={observerTarget} className="py-8 flex justify-center text-xs text-ink-muted">
          {loading && !error && (isArabic ? 'جاري التحميل...' : 'Loading...')}
          {!hasMore && !error && posts.length > 0 && (isArabic ? 'وصلت لنهاية المجتمع' : 'You have reached the end')}
        </div>
      </div>
    </div>
  );
};
