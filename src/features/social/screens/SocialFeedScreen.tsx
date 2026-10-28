// RULE-14-EXCEPTION: Social Feed requires search, feed, and auth logic in one screen
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import { supabase } from '@/shared/lib/supabase';
import { SocialPostCard } from '../components/SocialPostCard';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/shared/components/Header';
import { SearchBar } from '@/features/explore/components/SearchBar';
import { useScrollDirection } from '@/shared/hooks/useScrollDirection';

const PAGE_SIZE = 10;

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export const SocialFeedScreen: React.FC = () => {
  const { isArabic, browseCountryCode, navigateTo } = useUI();
  const { user, authStatus } = useAuth();
  const isVisible = useScrollDirection();

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 600);

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (authStatus === 'unauthenticated' || !user) {
      navigateTo('login');
    }
  }, [authStatus, user, navigateTo]);

  const fetchPosts = useCallback(async (currentOffset: number) => {
    if (!user) return;

    if (currentOffset > 0 && fetchingRef.current) return;

    const myRequestId = ++requestIdRef.current;
    fetchingRef.current = true;
    setLoading(true);
    setError(false);

    try {
      const { data, error: err } = await supabase.rpc('get_social_feed', {
        p_country_code: browseCountryCode,
        p_limit: PAGE_SIZE,
        p_offset: currentOffset,
        p_search: debouncedSearch.trim(),
      });

      if (myRequestId !== requestIdRef.current) return;

      if (err) throw err;

      if (data) {
        setPosts((prev) => (currentOffset === 0 ? data : [...prev, ...data]));
        setHasMore(data.length === PAGE_SIZE);
      }
    } catch (err) {
      if (myRequestId !== requestIdRef.current) return;
      console.error('Failed to load feed', err);
      setError(true);
    } finally {
      if (myRequestId === requestIdRef.current) {
        setLoading(false);
        fetchingRef.current = false;
      }
    }
  }, [browseCountryCode, user, debouncedSearch]);

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
      { threshold: 1.0 },
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

      {/* Sticky Sub-header + Search Bar Wrapper */}
      <div className={`sticky z-40 flex flex-col transition-all duration-300 ${isVisible ? 'top-[64px]' : 'top-0'}`}>
        {/* Sub-header with Back button */}
        <div className="bg-surface border-b border-border px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={() => navigateTo('main')}
            className="flex items-center gap-1.5 text-ink font-semibold text-[15px] cursor-pointer hover:bg-canvas px-2 py-1 -ms-2 rounded-lg transition"
          >
            {isArabic ? <ArrowRight2 size="18" /> : <ArrowLeft2 size="18" />}
            <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
          </button>
          <h1 className="font-bold text-[16px] text-ink absolute left-1/2 -translate-x-1/2">
            {isArabic ? 'مجتمع FOX' : 'FOX Community'}
          </h1>
          <div className="w-8" />
        </div>

        {/* Search Bar */}
        <div className="bg-canvas pt-3 pb-2 px-4 border-b border-border/50">
          <SearchBar
            isArabic={isArabic}
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={() => {}}
            onFocusChange={() => {}}
          />
        </div>
      </div>

      <div className="px-3 pt-3">
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
          {!loading && posts.length === 0 && !error && (isArabic ? 'لا توجد نتائج بحث' : 'No results found')}
        </div>
      </div>
    </div>
  );
};
